export type PseudoClassType = 'noArgument' | 'number' | 'string' | 'selector' | 'formula' | 'formulaOfSelector';
export type CssLevel = 'css1' | 'css2' | 'css3' | 'selectors-3' | 'selectors-4' | 'progressive';

type UnknownInputBehavior = 'accept' | 'reject';

export interface PseudoClassesSyntaxDefinition {
    unknown?: UnknownInputBehavior;
    definitions?: {[K in PseudoClassType]?: false | string[]};
}

export interface PseudoElementsSyntaxDefinition {
    unknown?: UnknownInputBehavior;
    notation?: 'singleColon' | 'doubleColon' | 'both';
    definitions?: string[];
}

export interface SyntaxDefinition {
    star?: boolean;
    tagName?: boolean;
    id?: boolean;
    classNames?: boolean;
    namespace?: boolean;
    combinators?: false | string[];
    attributes?:
        | false
        | {
              unknownEqualityModifiers?: UnknownInputBehavior;
              unknownCaseSensitivityModifiers?: UnknownInputBehavior;
              equalityModifiers?: false | string[];
              caseSensitivityModifiers?: false | string[];
          };
    pseudoElements?: false | PseudoElementsSyntaxDefinition;
    pseudoClasses?: false | PseudoClassesSyntaxDefinition;
}

function extendSyntaxDefinition(base: SyntaxDefinition, extension: SyntaxDefinition): SyntaxDefinition {
    const result = {...base};
    if ('tagName' in extension) {
        result.tagName = extension.tagName;
    }
    if ('star' in extension) {
        result.star = extension.star;
    }
    if ('id' in extension) {
        result.id = extension.id;
    }
    if ('classNames' in extension) {
        result.classNames = extension.classNames;
    }
    if ('namespace' in extension) {
        result.namespace = extension.namespace;
    }
    if ('combinators' in extension) {
        if (extension.combinators) {
            result.combinators = result.combinators
                ? result.combinators.concat(extension.combinators)
                : extension.combinators;
        } else {
            result.combinators = false;
        }
    }
    if ('attributes' in extension) {
        if (extension.attributes) {
            result.attributes = {...extension.attributes};
            if (extension.attributes.unknownEqualityModifiers) {
                result.attributes.unknownEqualityModifiers = extension.attributes.unknownEqualityModifiers;
            }
            if (extension.attributes.unknownCaseSensitivityModifiers) {
                result.attributes.unknownCaseSensitivityModifiers =
                    extension.attributes.unknownCaseSensitivityModifiers;
            }
            if (extension.attributes.equalityModifiers) {
                result.attributes.equalityModifiers = result.attributes.equalityModifiers
                    ? result.attributes.equalityModifiers.concat(extension.attributes.equalityModifiers)
                    : extension.attributes.equalityModifiers;
            }
            if (extension.attributes.caseSensitivityModifiers) {
                result.attributes.caseSensitivityModifiers = result.attributes.caseSensitivityModifiers
                    ? result.attributes.caseSensitivityModifiers.concat(extension.attributes.caseSensitivityModifiers)
                    : extension.attributes.caseSensitivityModifiers;
            }
        } else {
            result.attributes = false;
        }
    }
    if ('pseudoElements' in extension) {
        if (extension.pseudoElements) {
            result.pseudoElements = {...base.pseudoElements};
            if (extension.pseudoElements.unknown) {
                result.pseudoElements.unknown = extension.pseudoElements.unknown;
            }
            if (extension.pseudoElements.notation) {
                result.pseudoElements.notation = extension.pseudoElements.notation;
            }
            if (extension.pseudoElements.definitions) {
                result.pseudoElements.definitions = result.pseudoElements.definitions
                    ? result.pseudoElements.definitions.concat(extension.pseudoElements.definitions)
                    : extension.pseudoElements.definitions;
            }
        } else {
            result.pseudoElements = false;
        }
    }
    if ('pseudoClasses' in extension) {
        if (extension.pseudoClasses) {
            result.pseudoClasses = {...base.pseudoClasses};
            if (extension.pseudoClasses) {
                result.pseudoClasses = {...result.pseudoClasses};
                if (extension.pseudoClasses.unknown) {
                    result.pseudoClasses.unknown = extension.pseudoClasses.unknown;
                }
                const newDefinitions = extension.pseudoClasses.definitions;
                if (newDefinitions) {
                    const existingDefinitions = (result.pseudoClasses.definitions = {
                        ...result.pseudoClasses.definitions
                    });
                    for (const key of Object.keys(newDefinitions) as PseudoClassType[]) {
                        const newDefinitionForNotation = newDefinitions[key];
                        const existingDefinitionForNotation = existingDefinitions[key];
                        if (newDefinitionForNotation) {
                            existingDefinitions[key] = existingDefinitionForNotation
                                ? existingDefinitionForNotation.concat(newDefinitionForNotation)
                                : newDefinitionForNotation;
                        } else {
                            existingDefinitions[key] = false;
                        }
                    }
                }
            } else {
                result.pseudoClasses = false;
            }
        }
    }
    return result;
}

const css1SyntaxDefinition: SyntaxDefinition = {
    tagName: true,
    star: false,
    id: true,
    classNames: true,
    attributes: false,
    combinators: [],
    pseudoElements: {
        unknown: 'reject',
        notation: 'singleColon',
        definitions: ['first-letter', 'first-line']
    },
    pseudoClasses: {
        unknown: 'reject',
        definitions: {
            noArgument: ['link', 'visited', 'active']
        }
    }
};

const css2SyntaxDefinition = extendSyntaxDefinition(css1SyntaxDefinition, {
    star: true,
    combinators: ['>', '+'],
    attributes: {
        unknownEqualityModifiers: 'reject',
        unknownCaseSensitivityModifiers: 'reject',
        equalityModifiers: ['~', '|']
    },
    pseudoElements: {
        definitions: ['before', 'after']
    },
    pseudoClasses: {
        unknown: 'reject',
        definitions: {
            noArgument: ['hover', 'focus', 'first-child'],
            string: ['lang']
        }
    }
});

const selectors3SyntaxDefinition = extendSyntaxDefinition(css2SyntaxDefinition, {
    combinators: ['~'],
    attributes: {
        equalityModifiers: ['^', '$', '*']
    },
    pseudoElements: {
        notation: 'both'
    },
    pseudoClasses: {
        definitions: {
            noArgument: [
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
                'checked'
            ],
            formula: ['nth-child', 'nth-last-child', 'nth-of-type', 'nth-last-of-type']
        }
    }
});

const selectors4SyntaxDefinition = extendSyntaxDefinition(selectors3SyntaxDefinition, {
    attributes: {
        caseSensitivityModifiers: ['i', 'I', 's', 'S']
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
        unknownCaseSensitivityModifiers: 'accept',
        unknownEqualityModifiers: 'accept'
    }
});

const cssSyntaxDefinitions: Record<CssLevel, SyntaxDefinition> = {
    css1: css1SyntaxDefinition,
    css2: css2SyntaxDefinition,
    css3: selectors3SyntaxDefinition,
    'selectors-3': selectors3SyntaxDefinition,
    'selectors-4': selectors4SyntaxDefinition,
    progressive: progressiveSyntaxDefinition
};

interface ParseOptions {
    syntax?: CssLevel | SyntaxDefinition;
    substitutes?: boolean;
}

export function parse(input: string, options: ParseOptions) {}
