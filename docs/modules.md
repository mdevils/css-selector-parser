[css-selector-parser](../README.md) / Exports

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
- [ParserError](interfaces/ParserError.md)
- [SyntaxDefinition](interfaces/SyntaxDefinition.md)

### Type Aliases

- [AstEntity](modules.md#astentity)
- [CssLevel](modules.md#csslevel)
- [Parser](modules.md#parser)

### Variables

- [ast](modules.md#ast)

### Functions

- [createParser](modules.md#createparser)
- [render](modules.md#render)

## Type Aliases

### AstEntity

Ƭ **AstEntity**: [`AstSelector`](interfaces/AstSelector.md) \| [`AstRule`](interfaces/AstRule.md) \| [`AstTagName`](interfaces/AstTagName.md) \| [`AstWildcardTag`](interfaces/AstWildcardTag.md) \| [`AstNamespaceName`](interfaces/AstNamespaceName.md) \| [`AstWildcardNamespace`](interfaces/AstWildcardNamespace.md) \| [`AstNoNamespace`](interfaces/AstNoNamespace.md) \| [`AstSubstitution`](interfaces/AstSubstitution.md) \| [`AstString`](interfaces/AstString.md) \| [`AstFormula`](interfaces/AstFormula.md) \| [`AstFormulaOfSelector`](interfaces/AstFormulaOfSelector.md) \| [`AstPseudoClass`](interfaces/AstPseudoClass.md) \| [`AstAttribute`](interfaces/AstAttribute.md)

One of CSS AST entity types.

___

### CssLevel

Ƭ **CssLevel**: ``"css1"`` \| ``"css2"`` \| ``"css3"`` \| ``"selectors-3"`` \| ``"selectors-4"`` \| ``"latest"`` \| ``"progressive"``

___

### Parser

Ƭ **Parser**: (`input`: `string`) => [`AstSelector`](interfaces/AstSelector.md)

#### Type declaration

▸ (`input`): [`AstSelector`](interfaces/AstSelector.md)

Parses CSS selector string and returns CSS selector AST.

**`Throws`**

##### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `string` |

##### Returns

[`AstSelector`](interfaces/AstSelector.md)

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
console.log(ast.isSelector(selector)); // prints true
console.log(ast.isRule(selector)); // prints false
```

## Functions

### createParser

▸ **createParser**(`options?`): [`Parser`](modules.md#parser)

Creates a parse function to be used later to parse CSS selectors.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | - |
| `options.strict?` | `boolean` | CSS selector parser in modern browsers is very forgiving. For instance, it works fine with unclosed attribute selectors: `"[attr=value"`. Set to `false` in order to mimic browser behaviour. Default: `true` |
| `options.substitutes?` | `boolean` | Flag to enable substitutes. This is not part of CSS syntax, but rather a useful feature to pass variables into CSS selectors. Default: `false` **`Example`** ```ts "[attr=$variable]" ``` |
| `options.syntax?` | [`CssLevel`](modules.md#csslevel) \| [`SyntaxDefinition`](interfaces/SyntaxDefinition.md) | CSS Syntax options to be used for parsing. Can either be one of the predefined CSS levels ([CssLevel](modules.md#csslevel)) or a more detailed syntax definition ([SyntaxDefinition](interfaces/SyntaxDefinition.md)). Default: `"latest"` |

#### Returns

[`Parser`](modules.md#parser)

___

### render

▸ **render**(`entity`): `string`

Renders CSS Selector AST back to a string.

**`Example`**

```ts
import {ast, render} from 'css-selector-parser';

const selector = ast.selector({
    rules: [
        ast.rule({
            tag: ast.tagName({name: 'a'}),
            ids: ['user-23'],
            classNames: ['user'],
            pseudoClasses: [ast.pseudoClass({name: 'visited'})]
        })
    ]
});

console.log(render(selector)); // a#user-23.user:visited
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | [`AstSelector`](interfaces/AstSelector.md) \| [`AstRule`](interfaces/AstRule.md) |

#### Returns

`string`
