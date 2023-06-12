css-selector-parser

# css-selector-parser

## Table of contents

### Interfaces

- [AstAttribute](interfaces/AstAttribute.md)
- [AstFactory](interfaces/AstFactory.md)
- [AstFormula](interfaces/AstFormula.md)
- [AstFormulaOfSelector](interfaces/AstFormulaOfSelector.md)
- [AstNamespaceName](interfaces/AstNamespaceName.md)
- [AstNoNamespace](interfaces/AstNoNamespace.md)
- [AstPseudoClass](interfaces/AstPseudoClass.md)
- [AstRule](interfaces/AstRule.md)
- [AstSelector](interfaces/AstSelector.md)
- [AstString](interfaces/AstString.md)
- [AstSubstitution](interfaces/AstSubstitution.md)
- [AstTagName](interfaces/AstTagName.md)
- [AstWildcardNamespace](interfaces/AstWildcardNamespace.md)
- [AstWildcardTag](interfaces/AstWildcardTag.md)
- [ParseError](interfaces/ParseError.md)
- [SyntaxDefinition](interfaces/SyntaxDefinition.md)

### Type Aliases

- [AstEntity](README.md#astentity)
- [AstNamespace](README.md#astnamespace)
- [AstPseudoClassArgument](README.md#astpseudoclassargument)
- [AstTag](README.md#asttag)
- [CssLevel](README.md#csslevel)
- [PseudoClassType](README.md#pseudoclasstype)

### Variables

- [ast](README.md#ast)

### Functions

- [createParser](README.md#createparser)
- [render](README.md#render)

## Type Aliases

### AstEntity

Ƭ **AstEntity**: [`AstSelector`](interfaces/AstSelector.md) \| [`AstRule`](interfaces/AstRule.md) \| [`AstTag`](README.md#asttag) \| [`AstNamespace`](README.md#astnamespace) \| [`AstPseudoClassArgument`](README.md#astpseudoclassargument) \| [`AstPseudoClass`](interfaces/AstPseudoClass.md) \| [`AstAttribute`](interfaces/AstAttribute.md)

One of CSS AST entity types.

___

### AstNamespace

Ƭ **AstNamespace**: [`AstNamespaceName`](interfaces/AstNamespaceName.md) \| [`AstWildcardNamespace`](interfaces/AstWildcardNamespace.md) \| [`AstNoNamespace`](interfaces/AstNoNamespace.md)

One of the namespace types. Part of CSS Qualified Names.

**`See`**

https://drafts.csswg.org/css-namespaces-3/#css-qnames

___

### AstPseudoClassArgument

Ƭ **AstPseudoClassArgument**: [`AstSubstitution`](interfaces/AstSubstitution.md) \| [`AstSelector`](interfaces/AstSelector.md) \| [`AstString`](interfaces/AstString.md) \| [`AstFormula`](interfaces/AstFormula.md) \| [`AstFormulaOfSelector`](interfaces/AstFormulaOfSelector.md)

One of pseudo-class argument types.

___

### AstTag

Ƭ **AstTag**: [`AstTagName`](interfaces/AstTagName.md) \| [`AstWildcardTag`](interfaces/AstWildcardTag.md)

One of the tag types. Part of CSS Qualified Names.

**`See`**

 - https://developer.mozilla.org/en-US/docs/Web/CSS/Type_selectors
 - https://drafts.csswg.org/css-namespaces-3/#css-qnames

___

### CssLevel

Ƭ **CssLevel**: ``"css1"`` \| ``"css2"`` \| ``"css3"`` \| ``"selectors-3"`` \| ``"selectors-4"`` \| ``"latest"`` \| ``"progressive"``

___

### PseudoClassType

Ƭ **PseudoClassType**: ``"NoArgument"`` \| [`AstPseudoClassArgument`](README.md#astpseudoclassargument)[``"type"``]

## Variables

### ast

• `Const` **ast**: [`AstFactory`](interfaces/AstFactory.md)

AST structure generators and matchers.
For instance, `ast.selector({rules: [...]})` creates AstSelector and `ast.isSelector(...)` checks if
AstSelector was specified.

**`Example`**

```ts
// Represents CSS selector: ns|div#user-34.user.user-active[role=button]:lang(en) > *
const selector = ast.selector({
    rules: [
        ast.rule({
            tag: ast.tagName({name: 'div', namespace: ast.namespaceName({name: 'ns'})}),
            ids: ['user-34'],
            classNames: ['user', 'user-active'],
            attributes: [
                ast.attribute({
                    name: 'role',
                    operator: '=',
                    value: ast.string({value: 'button'})
                })
            ],
            pseudoClasses: [
                ast.pseudoClass({
                    name: 'lang',
                    argument: ast.string({value: 'eng'})
                })
            ],
            pseudoElement: 'before',
            nestedRule: {
                rule: ast.rule({tag: ast.wildcardTag()}),
                combinator: '>'
            }
        })
    ]
});
```

## Functions

### createParser

▸ **createParser**(`options?`): `Parse`

Creates a parse function to be used later to parse CSS selectors.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `CreateParserOptions` |

#### Returns

`Parse`

___

### render

▸ **render**(`entity`): `string`

Renders CSS Selector AST back to a string.

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | [`AstSelector`](interfaces/AstSelector.md) \| [`AstRule`](interfaces/AstRule.md) |

#### Returns

`string`
