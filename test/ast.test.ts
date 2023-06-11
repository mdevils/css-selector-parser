import {ast, AstEntity} from '../src/ast';

const lcFirst = (s: string) => s[0].toLowerCase() + s.slice(1);

const entities: Record<AstEntity['type'], true> = {
    Selector: true,
    Rule: true,
    TagName: true,
    WildcardTag: true,
    NamespaceName: true,
    WildcardNamespace: true,
    NoNamespace: true,
    Attribute: true,
    PseudoClass: true,
    String: true,
    Formula: true,
    FormulaOfSelector: true,
    Substitution: true
};

describe('ast', () => {
    for (const entity of Object.keys(entities) as (keyof typeof entities)[]) {
        describe(entity, () => {
            const factoryName = lcFirst(entity);
            const checkerName = `is${entity}`;
            it(`should have factory "${factoryName}"`, () => {
                expect(ast).toHaveProperty(factoryName);
            });
            it(`should have checker "${checkerName}"`, () => {
                expect(ast).toHaveProperty(checkerName);
            });
        });
    }
});