import {AstPseudoClassArgument, AstPseudoElementArgument} from './ast.js';

export type PseudoClassType = Exclude<'NoArgument' | AstPseudoClassArgument['type'], 'Substitution'>;
export type PseudoElementType = Exclude<'NoArgument' | AstPseudoElementArgument['type'], 'Substitution'>;
export type CssLevel = 'css1' | 'css2' | 'css3' | 'selectors-3' | 'selectors-4' | 'latest' | 'progressive';

/**
 * CSS Feature module name.
 * @example 'css-position-3'
 * @example 'css-scoping-1'
 */
export type CssFeature = string;

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
               * List of predefined pseudo-elements. If string array is specified, the pseudo-elements are assumed to be
               * NoArgument.
               * @example ['before', 'after']
               * @example {NoArgument: ['before', 'after'], String: ['highlight'], Selector: ['slotted']}
               */
              definitions?: string[] | {[K in PseudoElementType]?: string[]};
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

type MergeMethod<T> = (base: T, extension: T) => T;

function withMigration<T extends MT, MT>(migration: (value: T) => MT, merge: MergeMethod<MT>): MergeMethod<T> {
    return (base: T, extension: T): T => merge(migration(base), migration(extension)) as T;
}

function withNoNegative<T>(merge: MergeMethod<T | false | undefined>): MergeMethod<T> {
    return (base: T | undefined | false, extension: T | undefined | false): T => {
        const result = merge(base, extension);
        if (!result) {
            throw new Error(`Syntax definition cannot be null or undefined.`);
        }
        return result;
    };
}

function withPositive<T>(positive: T, merge: MergeMethod<T>): MergeMethod<T | true> {
    return (base: T | true, extension: T | true): T => {
        if (extension === true) {
            return positive;
        }
        return merge(base === true ? positive : base, extension);
    };
}

function mergeSection<T>(values: {[K in keyof T]-?: MergeMethod<T[K]>}): MergeMethod<T | undefined | false> {
    return (base: T | undefined | false, extension: T | undefined | false) => {
        if (!extension || !base) {
            return extension;
        }
        if (typeof extension !== 'object' || extension === null) {
            throw new Error(`Unexpected syntax definition extension type: ${extension}.`);
        }
        const result = {...base};
        for (const [key, value] of Object.entries(extension) as [keyof T, T[keyof T]][]) {
            const mergeSchema = values[key];
            result[key] = mergeSchema(base[key], value) as never;
        }
        return result;
    };
}

function replaceValueIfSpecified<T>(base: T, extension: T): T {
    if (extension !== undefined) {
        return extension;
    }
    return base;
}

function concatArray<T>(base: T[] | undefined, extension: T[] | undefined): T[] | undefined {
    if (!extension) {
        return base;
    }
    if (!base) {
        return extension;
    }
    return base.concat(extension);
}

function mergeDefinitions<T>(
    base?: {[K in keyof T]?: string[]},
    extension?: {[K in keyof T]?: string[]}
): {[K in keyof T]?: string[]} | undefined {
    if (!extension) {
        return base;
    }
    if (!base) {
        return extension;
    }
    const result = {...base};
    for (const [key, value] of Object.entries(extension) as [keyof T, string[]][]) {
        if (!value) {
            delete result[key];
            continue;
        }
        const baseValue = base[key];
        if (!baseValue) {
            result[key] = value;
            continue;
        }
        result[key] = baseValue.concat(value);
    }
    return result;
}

export const extendSyntaxDefinition: MergeMethod<SyntaxDefinition> = withNoNegative(
    mergeSection<SyntaxDefinition>({
        baseSyntax: replaceValueIfSpecified,
        tag: withPositive(
            defaultXmlOptions,
            mergeSection({
                wildcard: replaceValueIfSpecified
            })
        ),
        ids: replaceValueIfSpecified,
        classNames: replaceValueIfSpecified,
        namespace: withPositive(
            defaultXmlOptions,
            mergeSection({
                wildcard: replaceValueIfSpecified
            })
        ),
        combinators: concatArray,
        attributes: mergeSection({
            operators: concatArray,
            caseSensitivityModifiers: concatArray,
            unknownCaseSensitivityModifiers: replaceValueIfSpecified
        }),
        pseudoClasses: mergeSection({
            unknown: replaceValueIfSpecified,
            definitions: mergeDefinitions
        }),
        pseudoElements: mergeSection({
            unknown: replaceValueIfSpecified,
            notation: replaceValueIfSpecified,
            definitions: withMigration(
                (definitions) => (Array.isArray(definitions) ? {NoArgument: definitions} : definitions),
                mergeDefinitions
            )
        })
    })
);

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
        notation: 'both'
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

/**
 * CSS Feature modules with their syntax definitions.
 * These can be used to extend the parser with specific CSS features.
 * 
 * @example
 * // Using the css-position-3 feature
 * createParser({ features: ['css-position-3'] })
 */
export const cssFeatures: Record<string, SyntaxDefinition> = {
    'css-position-3': {
        pseudoClasses: {
            definitions: {
                NoArgument: ['sticky', 'fixed', 'absolute', 'relative', 'static']
            }
        }
    },
    'css-position-4': {
        pseudoClasses: {
            definitions: {
                NoArgument: ['sticky', 'fixed', 'absolute', 'relative', 'static', 'initial']
            }
        }
    },
    'css-scoping-1': {
        pseudoClasses: {
            definitions: {
                NoArgument: ['host', 'host-context'],
                Selector: ['host', 'host-context']
            }
        },
        pseudoElements: {
            definitions: ['slotted']
        }
    }
};
