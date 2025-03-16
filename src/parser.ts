import {
    AstAttribute,
    AstPseudoClass,
    AstPseudoClassArgument,
    AstPseudoElement,
    AstPseudoElementArgument,
    AstRule,
    AstSelector,
    AstTagName,
    AstWildcardTag
} from './ast.js';
import {
    createMulticharIndex,
    createRegularIndex,
    emptyMulticharIndex,
    emptyRegularIndex,
    MulticharIndex
} from './indexes.js';
import {
    calculatePseudoSignatures,
    defaultPseudoSignature,
    emptyPseudoSignatures,
    PseudoSignature
} from './pseudo-signatures.js';
import {
    CssLevel,
    cssSyntaxDefinitions,
    extendSyntaxDefinition,
    getXmlOptions,
    SyntaxDefinition,
    CssModule,
    cssModules,
    pseudoLocationIndex
} from './syntax-definitions.js';
import {digitsChars, isHex, isIdent, isIdentStart, maxHexLength, quoteChars, whitespaceChars} from './utils.js';

/**
 * This error is thrown when parser encounters problems in CSS string.
 * On top of the usual error, it has `position` property to indicate where in the input string the error happened.
 */
export interface ParserError extends Error {
    message: string;
    name: 'ParserError';
    position: number;
}

const errorPrefix = `css-selector-parser parse error: `;

/**
 * Parses CSS selector string and returns CSS selector AST.
 * @throws {ParserError}
 */
export type Parser = (input: string) => AstSelector;

/**
 * Creates a parse function to be used later to parse CSS selectors.
 */
export function createParser(
    options: {
        /**
         * CSS Syntax options to be used for parsing.
         * Can either be one of the predefined CSS levels ({@link CssLevel}) or a more detailed syntax definition ({@link SyntaxDefinition}).
         * Default: `"latest"`
         */
        syntax?: CssLevel | SyntaxDefinition;
        /**
         * Flag to enable substitutes.
         * This is not part of CSS syntax, but rather a useful feature to pass variables into CSS selectors.
         * Default: `false`
         * @example "[attr=$variable]"
         */
        substitutes?: boolean;
        /**
         * CSS selector parser in modern browsers is very forgiving. For instance, it works fine with unclosed attribute
         * selectors: `"[attr=value"`.
         * Set to `false` in order to mimic browser behaviour.
         * Default: `true`
         */
        strict?: boolean;
        /**
         * Additional CSS modules to include in the syntax definition.
         * These are specific CSS modules that add new selectors or modify existing ones.
         * @example ['css-position-3', 'css-scoping-1']
         */
        modules?: CssModule[];
    } = {}
): Parser {
    const {syntax = 'latest', substitutes, strict = true, modules} = options;
    let syntaxDefinition: SyntaxDefinition = typeof syntax === 'object' ? syntax : cssSyntaxDefinitions[syntax];

    if (syntaxDefinition.baseSyntax) {
        syntaxDefinition = extendSyntaxDefinition(cssSyntaxDefinitions[syntaxDefinition.baseSyntax], syntaxDefinition);
    }

    // Apply modules from syntax definition
    if (syntaxDefinition.modules && syntaxDefinition.modules.length > 0) {
        for (const module of syntaxDefinition.modules) {
            const moduleSyntax = cssModules[module];
            if (moduleSyntax) {
                syntaxDefinition = extendSyntaxDefinition(moduleSyntax, syntaxDefinition);
            }
        }
    }

    // Apply additional modules if specified from options
    if (modules && modules.length > 0) {
        for (const module of modules) {
            const moduleSyntax = cssModules[module];
            if (moduleSyntax) {
                syntaxDefinition = extendSyntaxDefinition(moduleSyntax, syntaxDefinition);
            }
        }
    }

    const [tagNameEnabled, tagNameWildcardEnabled] = syntaxDefinition.tag
        ? [true, Boolean(getXmlOptions(syntaxDefinition.tag).wildcard)]
        : [false, false];
    const idEnabled = Boolean(syntaxDefinition.ids);
    const classNamesEnabled = Boolean(syntaxDefinition.classNames);
    const namespaceEnabled = Boolean(syntaxDefinition.namespace);
    const namespaceWildcardEnabled =
        syntaxDefinition.namespace &&
        (syntaxDefinition.namespace === true || syntaxDefinition.namespace.wildcard === true);
    if (namespaceEnabled && !tagNameEnabled) {
        throw new Error(`${errorPrefix}Namespaces cannot be enabled while tags are disabled.`);
    }
    const substitutesEnabled = Boolean(substitutes);

    const combinatorsIndex = syntaxDefinition.combinators
        ? createMulticharIndex(syntaxDefinition.combinators)
        : emptyMulticharIndex;

    const [
        attributesEnabled,
        attributesOperatorsIndex,
        attributesCaseSensitivityModifiers,
        attributesAcceptUnknownCaseSensitivityModifiers
    ] = syntaxDefinition.attributes
        ? [
              true,
              syntaxDefinition.attributes.operators
                  ? createMulticharIndex(syntaxDefinition.attributes.operators)
                  : emptyMulticharIndex,
              syntaxDefinition.attributes.caseSensitivityModifiers
                  ? createRegularIndex(syntaxDefinition.attributes.caseSensitivityModifiers)
                  : emptyRegularIndex,
              syntaxDefinition.attributes.unknownCaseSensitivityModifiers === 'accept'
          ]
        : [false, emptyMulticharIndex, emptyRegularIndex, false];

    const attributesCaseSensitivityModifiersEnabled =
        attributesAcceptUnknownCaseSensitivityModifiers || Object.keys(attributesCaseSensitivityModifiers).length > 0;

    const [pseudoClassesEnabled, pseudoClassesDefinitions, pseudoClassesAcceptUnknown] = syntaxDefinition.pseudoClasses
        ? [
              true,
              syntaxDefinition.pseudoClasses.definitions
                  ? calculatePseudoSignatures(syntaxDefinition.pseudoClasses.definitions)
                  : emptyPseudoSignatures,
              syntaxDefinition.pseudoClasses.unknown === 'accept'
          ]
        : [false, emptyPseudoSignatures, false];

    const [
        pseudoElementsEnabled,
        pseudoElementsSingleColonNotationEnabled,
        pseudoElementsDoubleColonNotationEnabled,
        pseudoElementsDefinitions,
        pseudoElementsAcceptUnknown
    ] = syntaxDefinition.pseudoElements
        ? [
              true,
              syntaxDefinition.pseudoElements.notation === 'singleColon' ||
                  syntaxDefinition.pseudoElements.notation === 'both',
              !syntaxDefinition.pseudoElements.notation ||
                  syntaxDefinition.pseudoElements.notation === 'doubleColon' ||
                  syntaxDefinition.pseudoElements.notation === 'both',
              syntaxDefinition.pseudoElements.definitions
                  ? calculatePseudoSignatures(
                        Array.isArray(syntaxDefinition.pseudoElements.definitions)
                            ? {NoArgument: syntaxDefinition.pseudoElements.definitions}
                            : syntaxDefinition.pseudoElements.definitions
                    )
                  : emptyPseudoSignatures,
              syntaxDefinition.pseudoElements.unknown === 'accept'
          ]
        : [false, false, false, emptyPseudoSignatures, false];

    let str = '';
    let l = str.length;
    let pos = 0;
    let chr = '';

    const is = (comparison: string) => chr === comparison;
    const isTagStart = () => is('*') || isIdentStart(chr);
    const rewind = (newPos: number) => {
        pos = newPos;
        chr = str.charAt(pos);
    };
    const next = () => {
        pos++;
        chr = str.charAt(pos);
    };
    const readAndNext = () => {
        const current = chr;
        pos++;
        chr = str.charAt(pos);
        return current;
    };
    /** @throws ParserError */
    function fail(errorMessage: string): never {
        const position = Math.min(l - 1, pos);
        const error = new Error(`${errorPrefix}${errorMessage} Pos: ${position}.`) as ParserError;
        error.position = position;
        error.name = 'ParserError';
        throw error;
    }
    function assert(condition: unknown, errorMessage: string): asserts condition {
        if (!condition) {
            return fail(errorMessage);
        }
    }
    const assertNonEof = () => {
        assert(pos < l, 'Unexpected end of input.');
    };
    const isEof = () => pos >= l;
    const pass = (character: string) => {
        assert(pos < l, `Expected "${character}" but end of input reached.`);
        assert(chr === character, `Expected "${character}" but "${chr}" found.`);
        pos++;
        chr = str.charAt(pos);
    };

    function matchMulticharIndex(index: MulticharIndex) {
        const match = matchMulticharIndexPos(index, pos);
        if (match) {
            pos += match.length;
            chr = str.charAt(pos);
            return match;
        }
    }

    function matchMulticharIndexPos(index: MulticharIndex, subPos: number): string | undefined {
        const char = str.charAt(subPos);
        const charIndex = index[char];
        if (charIndex) {
            const subMatch = matchMulticharIndexPos(charIndex.chars, subPos + 1);
            if (subMatch) {
                return subMatch;
            }
            if (charIndex.self) {
                return charIndex.self;
            }
        }
    }

    /**
     * @see https://www.w3.org/TR/css-syntax/#hex-digit-diagram
     */
    function parseHex() {
        let hex = readAndNext();
        let count = 1;
        while (isHex(chr) && count < maxHexLength) {
            hex += readAndNext();
            count++;
        }
        skipSingleWhitespace();
        return String.fromCharCode(parseInt(hex, 16));
    }

    /**
     * @see https://www.w3.org/TR/css-syntax/#string-token-diagram
     */
    function parseString(quote: string): string {
        let result = '';
        pass(quote);
        while (pos < l) {
            if (is(quote)) {
                next();
                return result;
            } else if (is('\\')) {
                next();
                if (is(quote)) {
                    result += quote;
                    next();
                } else if (chr === '\n' || chr === '\f') {
                    next();
                } else if (chr === '\r') {
                    next();
                    if (is('\n')) {
                        next();
                    }
                } else if (isHex(chr)) {
                    result += parseHex();
                } else {
                    result += chr;
                    next();
                }
            } else {
                result += chr;
                next();
            }
        }
        return result;
    }

    /**
     * @see https://www.w3.org/TR/css-syntax/#ident-token-diagram
     */
    function parseIdentifier(): string | null {
        if (!isIdentStart(chr)) {
            return null;
        }
        let result = '';
        while (is('-')) {
            result += chr;
            next();
        }
        if (result === '-' && !isIdent(chr) && !is('\\')) {
            fail('Identifiers cannot consist of a single hyphen.');
        }
        if (strict && result.length >= 2) {
            // Checking this only for strict mode since browsers work fine with these identifiers.
            fail('Identifiers cannot start with two hyphens with strict mode on.');
        }
        if (digitsChars[chr]) {
            fail('Identifiers cannot start with hyphens followed by digits.');
        }
        while (pos < l) {
            if (isIdent(chr)) {
                result += readAndNext();
            } else if (is('\\')) {
                next();
                assertNonEof();
                if (isHex(chr)) {
                    result += parseHex();
                } else {
                    result += readAndNext();
                }
            } else {
                break;
            }
        }
        return result;
    }

    function parsePseudoClassString(): string {
        let result = '';
        while (pos < l) {
            if (is(')')) {
                break;
            } else if (is('\\')) {
                next();
                if (isEof() && !strict) {
                    return (result + '\\').trim();
                }
                assertNonEof();
                if (isHex(chr)) {
                    result += parseHex();
                } else {
                    result += readAndNext();
                }
            } else {
                result += readAndNext();
            }
        }
        return result.trim();
    }

    function skipSingleWhitespace() {
        if (chr === ' ' || chr === '\t' || chr === '\f' || chr === '\n') {
            next();
            return;
        }
        if (chr === '\r') {
            next();
        }
        if (chr === '\n') {
            next();
        }
    }

    function skipWhitespace() {
        while (whitespaceChars[chr]) {
            next();
        }
    }

    function parseSelector(relative = false): AstSelector {
        skipWhitespace();
        const rules: AstRule[] = [parseRule(relative)];
        while (is(',')) {
            next();
            skipWhitespace();
            rules.push(parseRule(relative));
        }
        return {
            type: 'Selector',
            rules
        };
    }

    function parseAttribute() {
        pass('[');
        skipWhitespace();
        let attr: AstAttribute;
        if (is('|')) {
            assert(namespaceEnabled, 'Namespaces are not enabled.');
            next();
            const name = parseIdentifier();
            assert(name, 'Expected attribute name.');
            attr = {
                type: 'Attribute',
                name: name,
                namespace: {type: 'NoNamespace'}
            };
        } else if (is('*')) {
            assert(namespaceEnabled, 'Namespaces are not enabled.');
            assert(namespaceWildcardEnabled, 'Wildcard namespace is not enabled.');
            next();
            pass('|');
            const name = parseIdentifier();
            assert(name, 'Expected attribute name.');
            attr = {
                type: 'Attribute',
                name,
                namespace: {type: 'WildcardNamespace'}
            };
        } else {
            const identifier = parseIdentifier();
            assert(identifier, 'Expected attribute name.');
            attr = {
                type: 'Attribute',
                name: identifier
            };
            if (is('|')) {
                const savedPos = pos;
                next();
                if (isIdentStart(chr)) {
                    assert(namespaceEnabled, 'Namespaces are not enabled.');
                    const name = parseIdentifier();
                    assert(name, 'Expected attribute name.');
                    attr = {
                        type: 'Attribute',
                        name,
                        namespace: {type: 'NamespaceName', name: identifier}
                    };
                } else {
                    rewind(savedPos);
                }
            }
        }
        assert(attr.name, 'Expected attribute name.');
        skipWhitespace();
        if (isEof() && !strict) {
            return attr;
        }
        if (is(']')) {
            next();
        } else {
            attr.operator = matchMulticharIndex(attributesOperatorsIndex);
            assert(attr.operator, 'Expected a valid attribute selector operator.');
            skipWhitespace();
            assertNonEof();
            if (quoteChars[chr]) {
                attr.value = {
                    type: 'String',
                    value: parseString(chr)
                };
            } else if (substitutesEnabled && is('$')) {
                next();
                const name = parseIdentifier();
                assert(name, 'Expected substitute name.');
                attr.value = {
                    type: 'Substitution',
                    name
                };
            } else {
                const value = parseIdentifier();
                assert(value, 'Expected attribute value.');
                attr.value = {
                    type: 'String',
                    value
                };
            }
            skipWhitespace();
            if (isEof() && !strict) {
                return attr;
            }
            if (!is(']')) {
                const caseSensitivityModifier = parseIdentifier();
                assert(caseSensitivityModifier, 'Expected end of attribute selector.');
                attr.caseSensitivityModifier = caseSensitivityModifier;
                assert(
                    attributesCaseSensitivityModifiersEnabled,
                    'Attribute case sensitivity modifiers are not enabled.'
                );
                assert(
                    attributesAcceptUnknownCaseSensitivityModifiers ||
                        attributesCaseSensitivityModifiers[attr.caseSensitivityModifier],
                    'Unknown attribute case sensitivity modifier.'
                );
                skipWhitespace();
                if (isEof() && !strict) {
                    return attr;
                }
            }
            pass(']');
        }
        return attr;
    }

    function parseNumber() {
        let result = '';
        while (digitsChars[chr]) {
            result += readAndNext();
        }
        assert(result !== '', 'Formula parse error.');
        return parseInt(result);
    }

    const isNumberStart = () => is('-') || is('+') || digitsChars[chr];

    function parseFormula(): [number, number] {
        if (is('e') || is('o')) {
            const ident = parseIdentifier();
            if (ident === 'even') {
                skipWhitespace();
                return [2, 0];
            }
            if (ident === 'odd') {
                skipWhitespace();
                return [2, 1];
            }
        }

        let firstNumber: null | number = null;
        let firstNumberMultiplier = 1;
        if (is('-')) {
            next();
            firstNumberMultiplier = -1;
        }
        if (isNumberStart()) {
            if (is('+')) {
                next();
            }
            firstNumber = parseNumber();
            if (!is('\\') && !is('n')) {
                return [0, firstNumber * firstNumberMultiplier];
            }
        }
        if (firstNumber === null) {
            firstNumber = 1;
        }
        firstNumber *= firstNumberMultiplier;
        let identifier;
        if (is('\\')) {
            next();
            if (isHex(chr)) {
                identifier = parseHex();
            } else {
                identifier = readAndNext();
            }
        } else {
            identifier = readAndNext();
        }
        assert(identifier === 'n', 'Formula parse error: expected "n".');
        skipWhitespace();
        if (is('+') || is('-')) {
            const sign = is('+') ? 1 : -1;
            next();
            skipWhitespace();
            return [firstNumber, sign * parseNumber()];
        } else {
            return [firstNumber, 0];
        }
    }

    function parsePseudoArgument(
        pseudoName: string,
        type: 'pseudo-class' | 'pseudo-element',
        signature: PseudoSignature
    ): AstPseudoClassArgument | AstPseudoElementArgument | undefined {
        let argument: AstPseudoClassArgument | AstPseudoElementArgument | undefined;

        if (is('(')) {
            next();
            skipWhitespace();
            if (substitutesEnabled && is('$')) {
                next();
                const name = parseIdentifier();
                assert(name, 'Expected substitute name.');
                argument = {
                    type: 'Substitution',
                    name
                };
            } else if (signature.type === 'String') {
                argument = {
                    type: 'String',
                    value: parsePseudoClassString()
                };
                assert(argument.value, `Expected ${type} argument value.`);
            } else if (signature.type === 'Selector') {
                argument = parseSelector(true);
            } else if (signature.type === 'Formula') {
                const [a, b] = parseFormula();
                argument = {
                    type: 'Formula',
                    a,
                    b
                };
                if (signature.ofSelector) {
                    skipWhitespace();
                    if (is('o') || is('\\')) {
                        const ident = parseIdentifier();
                        assert(ident === 'of', 'Formula of selector parse error.');
                        skipWhitespace();
                        argument = {
                            type: 'FormulaOfSelector',
                            a,
                            b,
                            selector: parseRule()
                        };
                    }
                }
            } else {
                return fail(`Invalid ${type} signature.`);
            }
            skipWhitespace();
            if (isEof() && !strict) {
                return argument;
            }
            pass(')');
        } else {
            assert(signature.optional, `Argument is required for ${type} "${pseudoName}".`);
        }
        return argument;
    }

    function parseTagName(): AstTagName | AstWildcardTag {
        if (is('*')) {
            assert(tagNameWildcardEnabled, 'Wildcard tag name is not enabled.');
            next();
            return {type: 'WildcardTag'};
        } else if (isIdentStart(chr)) {
            assert(tagNameEnabled, 'Tag names are not enabled.');
            const name = parseIdentifier();
            assert(name, 'Expected tag name.');
            return {
                type: 'TagName',
                name
            };
        } else {
            return fail('Expected tag name.');
        }
    }

    function parseTagNameWithNamespace(): AstTagName | AstWildcardTag {
        if (is('*')) {
            const savedPos = pos;
            next();
            if (!is('|')) {
                rewind(savedPos);
                return parseTagName();
            }
            next();
            if (!isTagStart()) {
                rewind(savedPos);
                return parseTagName();
            }
            assert(namespaceEnabled, 'Namespaces are not enabled.');
            assert(namespaceWildcardEnabled, 'Wildcard namespace is not enabled.');
            const tagName = parseTagName();
            tagName.namespace = {type: 'WildcardNamespace'};
            return tagName;
        } else if (is('|')) {
            assert(namespaceEnabled, 'Namespaces are not enabled.');
            next();
            const tagName = parseTagName();
            tagName.namespace = {type: 'NoNamespace'};
            return tagName;
        } else if (isIdentStart(chr)) {
            const identifier = parseIdentifier();
            assert(identifier, 'Expected tag name.');
            if (!is('|')) {
                assert(tagNameEnabled, 'Tag names are not enabled.');
                return {
                    type: 'TagName',
                    name: identifier
                };
            }
            const savedPos = pos;
            next();
            if (!isTagStart()) {
                rewind(savedPos);
                return {
                    type: 'TagName',
                    name: identifier
                };
            }
            assert(namespaceEnabled, 'Namespaces are not enabled.');
            const tagName = parseTagName();
            tagName.namespace = {type: 'NamespaceName', name: identifier};
            return tagName;
        } else {
            return fail('Expected tag name.');
        }
    }

    function parseRule(relative = false): AstRule {
        const rule: AstRule = {type: 'Rule', items: []};
        if (relative) {
            const combinator = matchMulticharIndex(combinatorsIndex);
            if (combinator) {
                rule.combinator = combinator;
                skipWhitespace();
            }
        }
        while (pos < l) {
            if (isTagStart()) {
                assert(rule.items.length === 0, 'Unexpected tag/namespace start.');
                rule.items.push(parseTagNameWithNamespace());
            } else if (is('|')) {
                const savedPos = pos;
                next();
                if (isTagStart()) {
                    assert(rule.items.length === 0, 'Unexpected tag/namespace start.');
                    rewind(savedPos);
                    rule.items.push(parseTagNameWithNamespace());
                } else {
                    rewind(savedPos);
                    break;
                }
            } else if (is('.')) {
                assert(classNamesEnabled, 'Class names are not enabled.');
                next();
                const className = parseIdentifier();
                assert(className, 'Expected class name.');
                rule.items.push({type: 'ClassName', name: className});
            } else if (is('#')) {
                assert(idEnabled, 'IDs are not enabled.');
                next();
                const idName = parseIdentifier();
                assert(idName, 'Expected ID name.');
                rule.items.push({type: 'Id', name: idName});
            } else if (is('[')) {
                assert(attributesEnabled, 'Attributes are not enabled.');
                rule.items.push(parseAttribute());
            } else if (is(':')) {
                let isDoubleColon = false;
                let isPseudoElement = false;
                next();

                if (is(':')) {
                    assert(pseudoElementsEnabled, 'Pseudo elements are not enabled.');
                    assert(
                        pseudoElementsDoubleColonNotationEnabled,
                        'Pseudo elements double colon notation is not enabled.'
                    );
                    isDoubleColon = true;
                    next();
                }
                const pseudoName = parseIdentifier();

                assert(isDoubleColon || pseudoName, 'Expected pseudo-class name.');
                assert(!isDoubleColon || pseudoName, 'Expected pseudo-element name.');
                assert(pseudoName, 'Expected pseudo-class name.');
                if (
                    !isDoubleColon ||
                    pseudoElementsAcceptUnknown ||
                    Object.prototype.hasOwnProperty.call(pseudoElementsDefinitions, pseudoName)
                ) {
                    // All good
                } else {
                    // Generate a helpful error message with location information
                    const locations = pseudoLocationIndex.pseudoElements[pseudoName];
                    let errorMessage = `Unknown pseudo-element "${pseudoName}"`;
                    
                    if (locations && locations.length > 0) {
                        errorMessage += `. It is defined in: ${locations.join(', ')}`;
                    }
                    
                    fail(errorMessage + '.');
                }

                isPseudoElement =
                    pseudoElementsEnabled &&
                    (isDoubleColon ||
                        (!isDoubleColon &&
                            pseudoElementsSingleColonNotationEnabled &&
                            Object.prototype.hasOwnProperty.call(pseudoElementsDefinitions, pseudoName)));

                if (isPseudoElement) {
                    const signature =
                        pseudoElementsDefinitions[pseudoName] ??
                        (pseudoElementsAcceptUnknown && defaultPseudoSignature);

                    const pseudoElement: AstPseudoElement = {
                        type: 'PseudoElement',
                        name: pseudoName
                    };
                    const argument = parsePseudoArgument(pseudoName, 'pseudo-element', signature);
                    if (argument) {
                        assert(
                            argument.type !== 'Formula' && argument.type !== 'FormulaOfSelector',
                            'Pseudo-elements cannot have formula argument.'
                        );
                        pseudoElement.argument = argument;
                    }
                    rule.items.push(pseudoElement);
                } else {
                    assert(pseudoClassesEnabled, 'Pseudo-classes are not enabled.');
                    const signature =
                        pseudoClassesDefinitions[pseudoName] ?? (pseudoClassesAcceptUnknown && defaultPseudoSignature);
                    if (signature) {
                        // All good
                    } else {
                        // Generate a helpful error message with location information
                        const locations = pseudoLocationIndex.pseudoClasses[pseudoName];
                        let errorMessage = `Unknown pseudo-class: "${pseudoName}"`;
                        
                        if (locations && locations.length > 0) {
                            errorMessage += `. It is defined in: ${locations.join(', ')}`;
                        }
                        
                        fail(errorMessage + '.');
                    }

                    const argument = parsePseudoArgument(pseudoName, 'pseudo-class', signature);
                    const pseudoClass: AstPseudoClass = {
                        type: 'PseudoClass',
                        name: pseudoName
                    };
                    if (argument) {
                        pseudoClass.argument = argument;
                    }
                    rule.items.push(pseudoClass);
                }
            } else {
                break;
            }
        }
        if (rule.items.length === 0) {
            if (isEof()) {
                return fail('Expected rule but end of input reached.');
            } else {
                return fail(`Expected rule but "${chr}" found.`);
            }
        }
        skipWhitespace();
        if (!isEof() && !is(',') && !is(')')) {
            const combinator = matchMulticharIndex(combinatorsIndex);
            skipWhitespace();
            rule.nestedRule = parseRule();
            rule.nestedRule.combinator = combinator;
        }
        return rule as AstRule;
    }

    return (input: string) => {
        // noinspection SuspiciousTypeOfGuard
        if (typeof input !== 'string') {
            throw new Error(`${errorPrefix}Expected string input.`);
        }
        str = input;
        l = str.length;
        pos = 0;
        chr = str.charAt(0);
        return parseSelector();
    };
}
