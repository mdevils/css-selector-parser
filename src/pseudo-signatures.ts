import {PseudoClassType} from './syntax-definitions.js';

export type PseudoSignature = {optional: boolean} & (
    | {
          type: 'Formula';
          ofSelector?: boolean;
      }
    | {
          type: 'String';
      }
    | {
          type: 'Selector';
      }
    | {
          type: 'NoArgument';
      }
);

export type PseudoSignatures = Record<string, PseudoSignature>;

export const emptyPseudoSignatures = {} as PseudoSignatures;
export const defaultPseudoSignature: PseudoSignature = {
    type: 'String',
    optional: true
};

type PseudoArgumentType = PseudoClassType;

function calculatePseudoSignature<T extends PseudoArgumentType>(types: T[]) {
    const result: PseudoSignature = {
        type: 'NoArgument',
        optional: false
    };

    function setResultType(type: PseudoSignature['type']) {
        if (result.type && result.type !== type && result.type !== 'NoArgument') {
            throw new Error(`Conflicting pseudo-class argument type: "${result.type}" vs "${type}".`);
        }
        result.type = type;
    }

    for (const type of types) {
        if (type === 'NoArgument') {
            result.optional = true;
        }
        if (type === 'Formula') {
            setResultType('Formula');
        }
        if (type === 'FormulaOfSelector') {
            setResultType('Formula');
            (result as {ofSelector?: boolean}).ofSelector = true;
        }
        if (type === 'String') {
            setResultType('String');
        }
        if (type === 'Selector') {
            setResultType('Selector');
        }
    }
    return result as PseudoSignature;
}

export type CategoriesIndex<T1 extends string, T2 extends string> = {[K in T1]?: T2[]};

export function inverseCategories<T1 extends string, T2 extends string>(obj: CategoriesIndex<T1, T2>) {
    const result = {} as CategoriesIndex<T2, T1>;
    for (const category of Object.keys(obj) as T1[]) {
        const items = obj[category];
        if (items) {
            for (const item of items as T2[]) {
                ((result[item] || (result[item] = [])) as T1[]).push(category);
            }
        }
    }
    return result;
}

export function calculatePseudoSignatures<T extends PseudoArgumentType>(definitions: {[K in T]?: string[]}) {
    const pseudoClassesToArgumentTypes = inverseCategories(definitions);
    const result: PseudoSignatures = {};

    for (const pseudoClass of Object.keys(pseudoClassesToArgumentTypes)) {
        const argumentTypes = pseudoClassesToArgumentTypes[pseudoClass];
        if (argumentTypes) {
            result[pseudoClass] = calculatePseudoSignature(argumentTypes);
        }
    }

    return result;
}
