import {AstAttribute, AstPseudoClass, AstRule, AstSelector, AstTagName, AstWildcardTag} from './ast';
import {
    createMulticharIndex,
    createRegularIndex,
    emptyMulticharIndex,
    emptyRegularIndex,
    MulticharIndex
} from './indexes';
import {
    calculatePseudoClassSignatures,
    defaultPseudoClassSignature,
    emptyPseudoClassSignatures
} from './pseudo-class-signatures';
import {
    CssLevel,
    cssSyntaxDefinitions,
    extendSyntaxDefinition,
    getXmlOptions,
    SyntaxDefinition
} from './syntax-definitions';
import {digitsChars, isHex, isIdent, isIdentStart, quoteChars, stringEscapeChars, whitespaceChars} from './utils';

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
    } = {}
): Parser {
    const {syntax = 'latest', substitutes, strict = true} = options;
    // noinspection SuspiciousTypeOfGuard
    let syntaxDefinition: SyntaxDefinition = typeof syntax === 'string' ? cssSyntaxDefinitions[syntax] : syntax;

    if (syntaxDefinition.baseSyntax) {
        syntaxDefinition = extendSyntaxDefinition(cssSyntaxDefinitions[syntaxDefinition.baseSyntax], syntaxDefinition);
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

    const [pseudoClassesEnabled, paeudoClassesDefinitions, pseudoClassesAcceptUnknown] = syntaxDefinition.pseudoClasses
        ? [
              true,
              syntaxDefinition.pseudoClasses.definitions
                  ? calculatePseudoClassSignatures(syntaxDefinition.pseudoClasses.definitions)
                  : emptyPseudoClassSignatures,
              syntaxDefinition.pseudoClasses.unknown === 'accept'
          ]
        : [false, emptyPseudoClassSignatures, false];

    const [
        pseudoElementsEnabled,
        pseudoElementsSingleColonNotationEnabled,
        pseudoElementsDoubleColonNotationEnabled,
        pseudoElementsIndex,
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
                  ? createRegularIndex(syntaxDefinition.pseudoElements.definitions)
                  : emptyRegularIndex,
              syntaxDefinition.pseudoElements.unknown === 'accept'
          ]
        : [false, false, false, emptyRegularIndex, false];

    let str = '';
    let l = str.length;
    let pos = 0;
    let chr = '';

    const is = (comparison: string) => chr === comparison;
    const isTagStart = () => is('*') || isIdentStart(chr) || is('\\');
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

    function parseHex() {
        let hex = readAndNext();
        while (isHex(chr)) {
            hex += readAndNext();
        }
        if (is(' ')) {
            next();
        }
        return String.fromCharCode(parseInt(hex, 16));
    }

    function parseString(quote: string): string {
        let result = '';
        pass(quote);
        while (pos < l) {
            if (is(quote)) {
                next();
                return result;
            } else if (is('\\')) {
                next();
                let esc;
                if (is(quote)) {
                    result += quote;
                } else if ((esc = stringEscapeChars[chr]) !== undefined) {
                    result += esc;
                } else if (isHex(chr)) {
                    result += parseHex();
                    continue;
                } else {
                    result += chr;
                }
            } else {
                result += chr;
            }
            next();
        }
        return result;
    }

    function parseIdentifier(): string {
        let result = '';
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
                return result;
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
            attr = {
                type: 'Attribute',
                name: parseIdentifier(),
                namespace: {type: 'NoNamespace'}
            };
        } else if (is('*')) {
            assert(namespaceEnabled, 'Namespaces are not enabled.');
            assert(namespaceWildcardEnabled, 'Wildcard namespace is not enabled.');
            next();
            pass('|');
            attr = {
                type: 'Attribute',
                name: parseIdentifier(),
                namespace: {type: 'WildcardNamespace'}
            };
        } else {
            const identifier = parseIdentifier();
            attr = {
                type: 'Attribute',
                name: identifier
            };
            if (is('|')) {
                const savedPos = pos;
                next();
                if (isIdentStart(chr) || is('\\')) {
                    assert(namespaceEnabled, 'Namespaces are not enabled.');
                    attr = {
                        type: 'Attribute',
                        name: parseIdentifier(),
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
                attr.value = {
                    type: 'Substitution',
                    name: parseIdentifier()
                };
                assert(attr.value.name, 'Expected substitute name.');
            } else {
                attr.value = {
                    type: 'String',
                    value: parseIdentifier()
                };
                assert(attr.value.value, 'Expected attribute value.');
            }
            skipWhitespace();
            if (isEof() && !strict) {
                return attr;
            }
            if (!is(']')) {
                attr.caseSensitivityModifier = parseIdentifier();
                assert(attr.caseSensitivityModifier, 'Expected end of attribute selector.');
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

    function parsePseudoClass(pseudoName: string) {
        const pseudo: AstPseudoClass = {
            type: 'PseudoClass',
            name: pseudoName
        };

        let pseudoDefinition = paeudoClassesDefinitions[pseudoName];
        if (!pseudoDefinition && pseudoClassesAcceptUnknown) {
            pseudoDefinition = defaultPseudoClassSignature;
        }
        assert(pseudoDefinition, `Unknown pseudo-class: "${pseudoName}".`);
        pseudoDefinition = pseudoDefinition!;

        if (is('(')) {
            next();
            skipWhitespace();
            if (substitutesEnabled && is('$')) {
                next();
                pseudo.argument = {
                    type: 'Substitution',
                    name: parseIdentifier()
                };
                assert(pseudo.argument.name, 'Expected substitute name.');
            } else if (pseudoDefinition.type === 'String') {
                pseudo.argument = {
                    type: 'String',
                    value: parsePseudoClassString()
                };
                assert(pseudo.argument.value, 'Expected pseudo-class argument value.');
            } else if (pseudoDefinition.type === 'Selector') {
                pseudo.argument = parseSelector(true);
            } else if (pseudoDefinition.type === 'Formula') {
                const [a, b] = parseFormula();
                pseudo.argument = {
                    type: 'Formula',
                    a,
                    b
                };
                if (pseudoDefinition.ofSelector) {
                    skipWhitespace();
                    if (is('o') || is('\\')) {
                        const ident = parseIdentifier();
                        assert(ident === 'of', 'Formula of selector parse error.');
                        skipWhitespace();
                        pseudo.argument = {
                            type: 'FormulaOfSelector',
                            a,
                            b,
                            selector: parseRule()
                        };
                    }
                }
            } else {
                return fail('Invalid pseudo-class signature.');
            }
            skipWhitespace();
            if (isEof() && !strict) {
                return pseudo;
            }
            pass(')');
        } else {
            assert(pseudoDefinition.optional, `Argument is required for pseudo-class "${pseudoName}".`);
        }
        return pseudo;
    }

    function parseTagName(): AstTagName | AstWildcardTag {
        if (is('*')) {
            assert(tagNameWildcardEnabled, 'Wildcard tag name is not enabled.');
            next();
            return {type: 'WildcardTag'};
        } else if (isIdentStart(chr) || is('\\')) {
            assert(tagNameEnabled, 'Tag names are not enabled.');
            return {
                type: 'TagName',
                name: parseIdentifier()
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
        } else if (isIdentStart(chr) || is('\\')) {
            const identifier = parseIdentifier();
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
        const rule: Partial<AstRule> = {};
        let isRuleStart = true;
        if (relative) {
            const combinator = matchMulticharIndex(combinatorsIndex);
            if (combinator) {
                rule.combinator = combinator;
                skipWhitespace();
            }
        }
        while (pos < l) {
            if (isTagStart()) {
                assert(isRuleStart, 'Unexpected tag/namespace start.');
                rule.tag = parseTagNameWithNamespace();
            } else if (is('|')) {
                const savedPos = pos;
                next();
                if (isTagStart()) {
                    assert(isRuleStart, 'Unexpected tag/namespace start.');
                    rewind(savedPos);
                    rule.tag = parseTagNameWithNamespace();
                } else {
                    rewind(savedPos);
                    break;
                }
            } else if (is('.')) {
                assert(classNamesEnabled, 'Class names are not enabled.');
                next();
                const className = parseIdentifier();
                assert(className, 'Expected class name.');
                (rule.classNames = rule.classNames || []).push(className);
            } else if (is('#')) {
                assert(idEnabled, 'IDs are not enabled.');
                next();
                const idName = parseIdentifier();
                assert(idName, 'Expected ID name.');
                (rule.ids = rule.ids || []).push(idName);
            } else if (is('[')) {
                assert(attributesEnabled, 'Attributes are not enabled.');
                (rule.attributes = rule.attributes || []).push(parseAttribute());
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
                assert(
                    !isDoubleColon || pseudoElementsAcceptUnknown || pseudoElementsIndex[pseudoName],
                    `Unknown pseudo-element "${pseudoName}".`
                );

                isPseudoElement =
                    pseudoElementsEnabled &&
                    (isDoubleColon ||
                        (!isDoubleColon &&
                            pseudoElementsSingleColonNotationEnabled &&
                            pseudoElementsIndex[pseudoName]));

                if (isPseudoElement) {
                    rule.pseudoElement = pseudoName;

                    if (!whitespaceChars[chr] && !is(',') && !is(')') && !isEof()) {
                        return fail('Pseudo-element should be the last component of a CSS selector rule.');
                    }
                } else {
                    assert(pseudoClassesEnabled, 'Pseudo classes are not enabled.');
                    (rule.pseudoClasses = rule.pseudoClasses || []).push(parsePseudoClass(pseudoName));
                }
            } else {
                break;
            }
            isRuleStart = false;
        }
        if (isRuleStart) {
            if (isEof()) {
                return fail('Expected rule but end of input reached.');
            } else {
                return fail(`Expected rule but "${chr}" found.`);
            }
        }
        rule.type = 'Rule';
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
