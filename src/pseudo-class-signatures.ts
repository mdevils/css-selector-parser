import {PseudoClassType} from './syntax-definitions';

export type PseudoClassSignature = {optional: boolean} & (
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
);

export type PseudoClassSignatures = Record<string, PseudoClassSignature>;

export const emptyPseudoClassSignatures = {} as PseudoClassSignatures;
export const defaultPseudoClassSignature: PseudoClassSignature = {
    type: 'String',
    optional: true
};

function calculatePseudoClassSignature(types: PseudoClassType[]) {
    const result: Partial<PseudoClassSignature> = {
        optional: false
    };

    function setResultType(type: PseudoClassSignature['type']) {
        if (result.type && result.type !== type) {
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
    return result as PseudoClassSignature;
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

export function calculatePseudoClassSignatures(definitions: {[K in PseudoClassType]?: string[]}) {
    const pseudoClassesToArgumentTypes = inverseCategories(definitions);
    const result: PseudoClassSignatures = {};

    for (const pseudoClass of Object.keys(pseudoClassesToArgumentTypes)) {
        const argumentTypes = pseudoClassesToArgumentTypes[pseudoClass];
        if (argumentTypes) {
            result[pseudoClass] = calculatePseudoClassSignature(argumentTypes);
        }
    }

    return result;
}
