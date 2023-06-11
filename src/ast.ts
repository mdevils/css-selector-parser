export interface AstSelector {
    type: 'Selector';
    rules: AstRule[];
}

export interface AstRule {
    type: 'Rule';
    tag?: AstTag;
    classNames?: string[];
    ids?: string[];
    pseudoElement?: string;
    pseudoClasses?: AstPseudoClass[];
    attributes?: AstAttribute[];
    nestedRule?: {
        combinator?: string;
        rule: AstRule;
    };
}

export interface AstTagName {
    type: 'TagName';
    name: string;
    /** Namespace according to https://www.w3.org/TR/css3-namespace/ */
    namespace?: AstNamespace;
}
export interface AstWildcardTag {
    type: 'WildcardTag';
    namespace?: AstNamespace;
}
export type AstTag = AstTagName | AstWildcardTag;

export interface AstNamespaceName {
    type: 'NamespaceName';
    name: string;
}
export interface AstWildcardNamespace {
    type: 'WildcardNamespace';
}
export interface AstNoNamespace {
    type: 'NoNamespace';
}
export type AstNamespace = AstNamespaceName | AstWildcardNamespace | AstNoNamespace;

export interface AstAttribute {
    type: 'Attribute';
    name: string;
    namespace?: AstNamespace;
    operator?: string;
    value?: AstString | AstSubstitution;
    caseSensitivityModifier?: string;
}

export interface AstPseudoClass {
    type: 'PseudoClass';
    name: string;
    argument?: AstPseudoClassArgument;
}

export interface AstString {
    type: 'String';
    value: string;
}

export interface AstFormula {
    type: 'Formula';
    a: number;
    b: number;
}

export interface AstFormulaOfSelector {
    type: 'FormulaOfSelector';
    a: number;
    b: number;
    selector: AstRule;
}

export interface AstSubstitution {
    type: 'Substitution';
    name: string;
}

export type AstPseudoClassArgument = AstSubstitution | AstSelector | AstString | AstFormula | AstFormulaOfSelector;

export type AstEntity =
    | AstSelector
    | AstRule
    | AstTag
    | AstNamespace
    | AstPseudoClassArgument
    | AstPseudoClass
    | AstAttribute;

function astMethods<EN extends AstEntity>(type: EN['type']) {
    type GenInput = Omit<EN, 'type'>;
    return <GN extends string, CN extends string>(generatorName: GN, checkerName: CN) =>
        ({
            [generatorName]: (props: GenInput) => ({
                type,
                ...props
            }),
            [checkerName]: (entity: unknown): entity is EN =>
                typeof entity === 'object' && entity !== null && (entity as AstEntity).type === type
        } as {[K in GN]: {} extends GenInput ? (props?: GenInput) => EN : (props: GenInput) => EN} &
            {
                [K in CN]: (entity: unknown) => entity is EN;
            });
}

export const ast = {
    ...astMethods<AstSelector>('Selector')('selector', 'isSelector'),
    ...astMethods<AstRule>('Rule')('rule', 'isRule'),
    ...astMethods<AstTagName>('TagName')('tagName', 'isTagName'),
    ...astMethods<AstWildcardTag>('WildcardTag')('wildcardTag', 'isWildcardTag'),
    ...astMethods<AstNamespaceName>('NamespaceName')('namespaceName', 'isNamespaceName'),
    ...astMethods<AstWildcardNamespace>('WildcardNamespace')('wildcardNamespace', 'isWildcardNamespace'),
    ...astMethods<AstNoNamespace>('NoNamespace')('noNamespace', 'isNoNamespace'),
    ...astMethods<AstAttribute>('Attribute')('attribute', 'isAttribute'),
    ...astMethods<AstPseudoClass>('PseudoClass')('pseudoClass', 'isPseudoClass'),
    ...astMethods<AstString>('String')('string', 'isString'),
    ...astMethods<AstFormula>('Formula')('formula', 'isFormula'),
    ...astMethods<AstFormulaOfSelector>('FormulaOfSelector')('formulaOfSelector', 'isFormulaOfSelector'),
    ...astMethods<AstSubstitution>('Substitution')('substitution', 'isSubstitution')
};
