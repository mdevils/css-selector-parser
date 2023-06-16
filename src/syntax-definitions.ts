import {AstPseudoClassArgument} from './ast';

export type PseudoClassType = 'NoArgument' | AstPseudoClassArgument['type'];
export type CssLevel = 'css1' | 'css2' | 'css3' | 'selectors-3' | 'selectors-4' | 'latest' | 'progressive';

/**
 * CSS Selector Syntax Definition can be used to define custom CSS selector parsing rules.
 */
export interface SyntaxDefinition {
    /**
     * When specified, syntax will be based on the specified predefined CSS standard.
     * If not specified, syntax will be defined from scratch.
     */
    baseSyntax?: CssLevel;
    /**
     * CSS Tag (type).
     * @example div
     * @see https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors/Type_Class_and_ID_Selectors
     */
    tag?:
        | {
              /**
               * Allows using wildcard (*).
               */
              wildcard?: boolean;
          }
        | boolean;
    /**
     * CSS3 Namespaces.
     * @example ns|div
     * @see https://www.w3.org/TR/css3-namespace/
     */
    namespace?:
        | {
              /**
               * Allows using wildcard (*).
               */
              wildcard?: boolean;
          }
        | boolean;
    /**
     * CSS IDs (yes, there can be multiple).
     * @example #root#root
     * @see https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors/Type_Class_and_ID_Selectors
     */
    ids?: boolean;
    /**
     * CSS Class Names
     * @example .element.highlighted
     * @see https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors/Type_Class_and_ID_Selectors
     */
    classNames?: boolean;
    /**
     * CSS selector rule nesting combinators.
     * @example div.class > span
     * @see https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors/Combinators
     */
    combinators?: string[];
    /**
     * CSS Attribute Selector.
     * @example [href="#"]
     * @see https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors/Attribute_selectors
     */
    attributes?:
        | {
              /**
               * Attribute comparison operator list.
               * @example ['=', '~=', '|=', '^=', '$=', '*=']
               * @see https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors#syntax
               */
              operators?: string[];
              /**
               * How to handle unknown case sensitivity modifiers.
               * `accept` - still parse.
               * `reject` - throw an error.
               */
              unknownCaseSensitivityModifiers?: 'accept' | 'reject';
              /**
               * List of pre-defined case sensitivity modifiers.
               * @example ['i', 'I', 's', 'S']
               * @see https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors#syntax
               */
              caseSensitivityModifiers?: string[];
          }
        | false;
    /**
     * CSS Pseudo-elements.
     * @example ::before
     * @see https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors/Pseudo-classes_and_pseudo-elements
     */
    pseudoElements?:
        | {
              /**
               * How to handle unknown pseudo-elements.
               * `accept` - still parse.
               * `reject` - throw an error.
               */
              unknown?: 'accept' | 'reject';
              /**
               * In the past pseudo selements were defined starting with a single colon.
               * Later this notation changed to double colon.
               */
              notation?: 'singleColon' | 'doubleColon' | 'both';
              /**
               * List of predefined pseudo-elements.
               * @example ['before', 'after']
               */
              definitions?: string[];
          }
        | false;
    /**
     * CSS Pseudo-classes.
     * @example :nth-child(2n+1)
     * @see https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors/Pseudo-classes_and_pseudo-elements
     */
    pseudoClasses?:
        | {
              /**
               * How to handle unknown pseudo-classes.
               * `accept` - still parse.
               * `reject` - throw an error.
               */
              unknown?: 'accept' | 'reject';
              /**
               * Predefined pseudo-classes.
               * @example {NoArgument: ['first-child'], Formula: ['nth-child'], String: ['dir'], Selector: ['not']}
               */
              definitions?: {[K in PseudoClassType]?: string[]};
          }
        | false;
}

interface SyntaxDefinitionXmlOptions {
    wildcard?: boolean;
}

const emptyXmlOptions: SyntaxDefinitionXmlOptions = {};
const defaultXmlOptions: SyntaxDefinitionXmlOptions = {wildcard: true};

export function getXmlOptions(param: SyntaxDefinitionXmlOptions | boolean | undefined): SyntaxDefinitionXmlOptions {
    if (param) {
        if (typeof param === 'boolean') {
            return defaultXmlOptions;
        } else {
            return param;
        }
    } else {
        return emptyXmlOptions;
    }
}

export function extendSyntaxDefinition(base: SyntaxDefinition, extension: SyntaxDefinition): SyntaxDefinition {
    const result = {...base};
    if ('tag' in extension) {
        if (extension.tag) {
            result.tag = {...getXmlOptions(base.tag)};
            const extensionOptions = getXmlOptions(extension.tag);
            if ('wildcard' in extensionOptions) {
                result.tag.wildcard = extensionOptions.wildcard;
            }
        } else {
            result.tag = undefined;
        }
    }
    if ('ids' in extension) {
        result.ids = extension.ids;
    }
    if ('classNames' in extension) {
        result.classNames = extension.classNames;
    }
    if ('namespace' in extension) {
        if (extension.namespace) {
            result.namespace = {...getXmlOptions(base.namespace)};
            const extensionOptions = getXmlOptions(extension.namespace);
            if ('wildcard' in extensionOptions) {
                result.namespace.wildcard = extensionOptions.wildcard;
            }
        } else {
            result.namespace = undefined;
        }
    }
    if ('combinators' in extension) {
        if (extension.combinators) {
            result.combinators = result.combinators
                ? result.combinators.concat(extension.combinators)
                : extension.combinators;
        } else {
            result.combinators = undefined;
        }
    }
    if ('attributes' in extension) {
        if (extension.attributes) {
            result.attributes = {...base.attributes};
            if ('unknownCaseSensitivityModifiers' in extension.attributes) {
                result.attributes.unknownCaseSensitivityModifiers =
                    extension.attributes.unknownCaseSensitivityModifiers;
            }
            if ('operators' in extension.attributes) {
                result.attributes.operators = extension.attributes.operators
                    ? result.attributes.operators
                        ? result.attributes.operators.concat(extension.attributes.operators)
                        : extension.attributes.operators
                    : undefined;
            }
            if ('caseSensitivityModifiers' in extension.attributes) {
                result.attributes.caseSensitivityModifiers = extension.attributes.caseSensitivityModifiers
                    ? result.attributes.caseSensitivityModifiers
                        ? result.attributes.caseSensitivityModifiers.concat(
                              extension.attributes.caseSensitivityModifiers
                          )
                        : extension.attributes.caseSensitivityModifiers
                    : undefined;
            }
        } else {
            result.attributes = undefined;
        }
    }
    if ('pseudoElements' in extension) {
        if (extension.pseudoElements) {
            result.pseudoElements = {...base.pseudoElements};
            if ('unknown' in extension.pseudoElements) {
                result.pseudoElements.unknown = extension.pseudoElements.unknown;
            }
            if ('notation' in extension.pseudoElements) {
                result.pseudoElements.notation = extension.pseudoElements.notation;
            }
            if ('definitions' in extension.pseudoElements) {
                result.pseudoElements.definitions = extension.pseudoElements.definitions
                    ? result.pseudoElements.definitions
                        ? result.pseudoElements.definitions.concat(extension.pseudoElements.definitions)
                        : extension.pseudoElements.definitions
                    : undefined;
            }
        } else {
            result.pseudoElements = undefined;
        }
    }
    if ('pseudoClasses' in extension) {
        if (extension.pseudoClasses) {
            result.pseudoClasses = {...base.pseudoClasses};
            if ('unknown' in extension.pseudoClasses) {
                result.pseudoClasses.unknown = extension.pseudoClasses.unknown;
            }
            if ('definitions' in extension.pseudoClasses) {
                const newDefinitions = extension.pseudoClasses.definitions;
                if (newDefinitions) {
                    result.pseudoClasses.definitions = {
                        ...result.pseudoClasses.definitions
                    };
                    const existingDefinitions = result.pseudoClasses.definitions;
                    for (const key of Object.keys(newDefinitions) as PseudoClassType[]) {
                        const newDefinitionForNotation = newDefinitions[key];
                        const existingDefinitionForNotation = existingDefinitions[key];
                        if (newDefinitionForNotation) {
                            existingDefinitions[key] = existingDefinitionForNotation
                                ? existingDefinitionForNotation.concat(newDefinitionForNotation)
                                : newDefinitionForNotation;
                        } else {
                            existingDefinitions[key] = undefined;
                        }
                    }
                } else {
                    result.pseudoClasses.definitions = undefined;
                }
            }
        } else {
            result.pseudoClasses = undefined;
        }
    }
    return result;
}

const css1SyntaxDefinition: SyntaxDefinition = {
    tag: {},
    ids: true,
    classNames: true,
    combinators: [],
    pseudoElements: {
        unknown: 'reject',
        notation: 'singleColon',
        definitions: ['first-letter', 'first-line']
    },
    pseudoClasses: {
        unknown: 'reject',
        definitions: {
            NoArgument: ['link', 'visited', 'active']
        }
    }
};

const css2SyntaxDefinition = extendSyntaxDefinition(css1SyntaxDefinition, {
    tag: {wildcard: true},
    combinators: ['>', '+'],
    attributes: {
        unknownCaseSensitivityModifiers: 'reject',
        operators: ['=', '~=', '|=']
    },
    pseudoElements: {
        definitions: ['before', 'after']
    },
    pseudoClasses: {
        unknown: 'reject',
        definitions: {
            NoArgument: ['hover', 'focus', 'first-child'],
            String: ['lang']
        }
    }
});

const selectors3SyntaxDefinition = extendSyntaxDefinition(css2SyntaxDefinition, {
    namespace: {
        wildcard: true
    },
    combinators: ['~'],
    attributes: {
        operators: ['^=', '$=', '*=']
    },
    pseudoElements: {
        notation: 'both',
        definitions: ['selection']
    },
    pseudoClasses: {
        definitions: {
            NoArgument: [
                'root',
                'last-child',
                'first-of-type',
                'last-of-type',
                'only-child',
                'only-of-type',
                'empty',
                'target',
                'enabled',
                'disabled',
                'checked',
                'indeterminate'
            ],
            Formula: ['nth-child', 'nth-last-child', 'nth-of-type', 'nth-last-of-type'],
            Selector: ['not']
        }
    }
});

const selectors4SyntaxDefinition = extendSyntaxDefinition(selectors3SyntaxDefinition, {
    combinators: ['||'],
    attributes: {
        caseSensitivityModifiers: ['i', 'I', 's', 'S']
    },
    pseudoClasses: {
        definitions: {
            NoArgument: [
                'any-link',
                'local-link',
                'target-within',
                'scope',
                'current',
                'past',
                'future',
                'focus-within',
                'focus-visible',
                'read-write',
                'read-only',
                'placeholder-shown',
                'default',
                'valid',
                'invalid',
                'in-range',
                'out-of-range',
                'required',
                'optional',
                'blank',
                'user-invalid'
            ],
            Formula: ['nth-col', 'nth-last-col'],
            String: ['dir'],
            FormulaOfSelector: ['nth-child', 'nth-last-child'],
            Selector: ['current', 'is', 'where', 'has']
        }
    }
});

const progressiveSyntaxDefinition = extendSyntaxDefinition(selectors4SyntaxDefinition, {
    pseudoElements: {
        unknown: 'accept'
    },
    pseudoClasses: {
        unknown: 'accept'
    },
    attributes: {
        unknownCaseSensitivityModifiers: 'accept'
    }
});

export const cssSyntaxDefinitions: Record<CssLevel, SyntaxDefinition> = {
    css1: css1SyntaxDefinition,
    css2: css2SyntaxDefinition,
    css3: selectors3SyntaxDefinition,
    'selectors-3': selectors3SyntaxDefinition,
    'selectors-4': selectors4SyntaxDefinition,
    latest: selectors4SyntaxDefinition,
    progressive: progressiveSyntaxDefinition
};
