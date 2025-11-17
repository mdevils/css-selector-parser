[css-selector-parser](../../README.md) / [Exports](../modules.md) / AstFactory

# Interface: AstFactory

AST structure generators and matchers.
For instance, `ast.selector({rules: [...]})` creates AstSelector and `ast.isSelector(...)` checks if
AstSelector was specified.

**`Example`**

```ts
// Represents CSS selector: ns|div#user-34.user.user-active[role="button"]:lang(en)::before > *
const selector = ast.selector({
    rules: [
        ast.rule({
            items: [
                ast.tagName({name: 'div', namespace: ast.namespaceName({name: 'ns'})}),
                ast.id({name: 'user-34'}),
                ast.className({name: 'user'}),
                ast.className({name: 'user-active'}),
                ast.attribute({
                    name: 'role',
                    operator: '=',
                    value: ast.string({value: 'button'})
                }),
                ast.pseudoClass({
                    name: 'lang',
                    argument: ast.string({value: 'en'})
                }),
                ast.pseudoElement({name: 'before'})
            ],
            nestedRule: ast.rule({combinator: '>', items: [ast.wildcardTag()]})
        })
    ]
});
console.log(ast.isSelector(selector)); // prints true
console.log(ast.isRule(selector)); // prints false
```

## Table of contents

### Properties

- [attribute](AstFactory.md#attribute)
- [className](AstFactory.md#classname)
- [formula](AstFactory.md#formula)
- [formulaOfSelector](AstFactory.md#formulaofselector)
- [id](AstFactory.md#id)
- [isAttribute](AstFactory.md#isattribute)
- [isClassName](AstFactory.md#isclassname)
- [isFormula](AstFactory.md#isformula)
- [isFormulaOfSelector](AstFactory.md#isformulaofselector)
- [isId](AstFactory.md#isid)
- [isNamespaceName](AstFactory.md#isnamespacename)
- [isNestingSelector](AstFactory.md#isnestingselector)
- [isNoNamespace](AstFactory.md#isnonamespace)
- [isPseudoClass](AstFactory.md#ispseudoclass)
- [isPseudoElement](AstFactory.md#ispseudoelement)
- [isRule](AstFactory.md#isrule)
- [isSelector](AstFactory.md#isselector)
- [isString](AstFactory.md#isstring)
- [isSubstitution](AstFactory.md#issubstitution)
- [isTagName](AstFactory.md#istagname)
- [isWildcardNamespace](AstFactory.md#iswildcardnamespace)
- [isWildcardTag](AstFactory.md#iswildcardtag)
- [namespaceName](AstFactory.md#namespacename)
- [nestingSelector](AstFactory.md#nestingselector)
- [noNamespace](AstFactory.md#nonamespace)
- [pseudoClass](AstFactory.md#pseudoclass)
- [pseudoElement](AstFactory.md#pseudoelement)
- [rule](AstFactory.md#rule)
- [selector](AstFactory.md#selector)
- [string](AstFactory.md#string)
- [substitution](AstFactory.md#substitution)
- [tagName](AstFactory.md#tagname)
- [wildcardNamespace](AstFactory.md#wildcardnamespace)
- [wildcardTag](AstFactory.md#wildcardtag)

## Properties

### attribute

• **attribute**: (`props`: { `caseSensitivityModifier?`: `string` ; `name`: `string` ; `namespace?`: [`AstNamespaceName`](AstNamespaceName.md) \| [`AstWildcardNamespace`](AstWildcardNamespace.md) \| [`AstNoNamespace`](AstNoNamespace.md) ; `operator?`: `string` ; `value?`: [`AstSubstitution`](AstSubstitution.md) \| [`AstString`](AstString.md)  }) => [`AstAttribute`](AstAttribute.md)

#### Type declaration

▸ (`props`): [`AstAttribute`](AstAttribute.md)

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `props` | `Object` | - |
| `props.caseSensitivityModifier?` | `string` | Comparison case sensitivity modifier (i.e. `"i"` in case if `"[role='button' i]"`). |
| `props.name` | `string` | Attribute name (i.e. `"href"` in case if `"[href]"`). |
| `props.namespace?` | [`AstNamespaceName`](AstNamespaceName.md) \| [`AstWildcardNamespace`](AstWildcardNamespace.md) \| [`AstNoNamespace`](AstNoNamespace.md) | Namespace according to https://drafts.csswg.org/selectors/#attrnmsp. |
| `props.operator?` | `string` | Comparison operator (i.e. `"\|="` in case if `"[role\|=button]"`). |
| `props.value?` | [`AstSubstitution`](AstSubstitution.md) \| [`AstString`](AstString.md) | Comparison value (i.e. `"button"` in case if `"[role=button]"`). |

##### Returns

[`AstAttribute`](AstAttribute.md)


___

### className

• **className**: (`props`: { `name`: `string`  }) => [`AstClassName`](AstClassName.md)

#### Type declaration

▸ (`props`): [`AstClassName`](AstClassName.md)

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `props` | `Object` | - |
| `props.name` | `string` | ID name. I.e. `.user` -> `"user"`. |

##### Returns

[`AstClassName`](AstClassName.md)


___

### formula

• **formula**: (`props`: { `a`: `number` ; `b`: `number`  }) => [`AstFormula`](AstFormula.md)

#### Type declaration

▸ (`props`): [`AstFormula`](AstFormula.md)

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `props` | `Object` | - |
| `props.a` | `number` | Multiplier of `n`. |
| `props.b` | `number` | Constant added to `a*n`. |

##### Returns

[`AstFormula`](AstFormula.md)


___

### formulaOfSelector

• **formulaOfSelector**: (`props`: { `a`: `number` ; `b`: `number` ; `selector`: [`AstRule`](AstRule.md)  }) => [`AstFormulaOfSelector`](AstFormulaOfSelector.md)

#### Type declaration

▸ (`props`): [`AstFormulaOfSelector`](AstFormulaOfSelector.md)

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `props` | `Object` | - |
| `props.a` | `number` | Multiplier of `n`. |
| `props.b` | `number` | Constant added to `a*n`. |
| `props.selector` | [`AstRule`](AstRule.md) | Selector that goes after formula (i.e. `"div -> span"` in case of `":nth-child(2n + 1 of div > span)"` |

##### Returns

[`AstFormulaOfSelector`](AstFormulaOfSelector.md)


___

### id

• **id**: (`props`: { `name`: `string`  }) => [`AstId`](AstId.md)

#### Type declaration

▸ (`props`): [`AstId`](AstId.md)

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `props` | `Object` | - |
| `props.name` | `string` | ID name. I.e. `#root` -> `"root"`. |

##### Returns

[`AstId`](AstId.md)


___

### isAttribute

• **isAttribute**: (`entity`: `unknown`) => entity is AstAttribute

#### Type declaration

▸ (`entity`): entity is AstAttribute

##### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `unknown` |

##### Returns

entity is AstAttribute


___

### isClassName

• **isClassName**: (`entity`: `unknown`) => entity is AstClassName

#### Type declaration

▸ (`entity`): entity is AstClassName

##### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `unknown` |

##### Returns

entity is AstClassName


___

### isFormula

• **isFormula**: (`entity`: `unknown`) => entity is AstFormula

#### Type declaration

▸ (`entity`): entity is AstFormula

##### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `unknown` |

##### Returns

entity is AstFormula


___

### isFormulaOfSelector

• **isFormulaOfSelector**: (`entity`: `unknown`) => entity is AstFormulaOfSelector

#### Type declaration

▸ (`entity`): entity is AstFormulaOfSelector

##### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `unknown` |

##### Returns

entity is AstFormulaOfSelector


___

### isId

• **isId**: (`entity`: `unknown`) => entity is AstId

#### Type declaration

▸ (`entity`): entity is AstId

##### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `unknown` |

##### Returns

entity is AstId


___

### isNamespaceName

• **isNamespaceName**: (`entity`: `unknown`) => entity is AstNamespaceName

#### Type declaration

▸ (`entity`): entity is AstNamespaceName

##### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `unknown` |

##### Returns

entity is AstNamespaceName


___

### isNestingSelector

• **isNestingSelector**: (`entity`: `unknown`) => entity is AstNestingSelector

#### Type declaration

▸ (`entity`): entity is AstNestingSelector

##### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `unknown` |

##### Returns

entity is AstNestingSelector


___

### isNoNamespace

• **isNoNamespace**: (`entity`: `unknown`) => entity is AstNoNamespace

#### Type declaration

▸ (`entity`): entity is AstNoNamespace

##### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `unknown` |

##### Returns

entity is AstNoNamespace


___

### isPseudoClass

• **isPseudoClass**: (`entity`: `unknown`) => entity is AstPseudoClass

#### Type declaration

▸ (`entity`): entity is AstPseudoClass

##### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `unknown` |

##### Returns

entity is AstPseudoClass


___

### isPseudoElement

• **isPseudoElement**: (`entity`: `unknown`) => entity is AstPseudoElement

#### Type declaration

▸ (`entity`): entity is AstPseudoElement

##### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `unknown` |

##### Returns

entity is AstPseudoElement


___

### isRule

• **isRule**: (`entity`: `unknown`) => entity is AstRule

#### Type declaration

▸ (`entity`): entity is AstRule

##### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `unknown` |

##### Returns

entity is AstRule


___

### isSelector

• **isSelector**: (`entity`: `unknown`) => entity is AstSelector

#### Type declaration

▸ (`entity`): entity is AstSelector

##### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `unknown` |

##### Returns

entity is AstSelector


___

### isString

• **isString**: (`entity`: `unknown`) => entity is AstString

#### Type declaration

▸ (`entity`): entity is AstString

##### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `unknown` |

##### Returns

entity is AstString


___

### isSubstitution

• **isSubstitution**: (`entity`: `unknown`) => entity is AstSubstitution

#### Type declaration

▸ (`entity`): entity is AstSubstitution

##### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `unknown` |

##### Returns

entity is AstSubstitution


___

### isTagName

• **isTagName**: (`entity`: `unknown`) => entity is AstTagName

#### Type declaration

▸ (`entity`): entity is AstTagName

##### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `unknown` |

##### Returns

entity is AstTagName


___

### isWildcardNamespace

• **isWildcardNamespace**: (`entity`: `unknown`) => entity is AstWildcardNamespace

#### Type declaration

▸ (`entity`): entity is AstWildcardNamespace

##### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `unknown` |

##### Returns

entity is AstWildcardNamespace


___

### isWildcardTag

• **isWildcardTag**: (`entity`: `unknown`) => entity is AstWildcardTag

#### Type declaration

▸ (`entity`): entity is AstWildcardTag

##### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `unknown` |

##### Returns

entity is AstWildcardTag


___

### namespaceName

• **namespaceName**: (`props`: { `name`: `string`  }) => [`AstNamespaceName`](AstNamespaceName.md)

#### Type declaration

▸ (`props`): [`AstNamespaceName`](AstNamespaceName.md)

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `props` | `Object` | - |
| `props.name` | `string` | Namespace name (i.e. `"ns"` in case of `"ns\|div"`). " |

##### Returns

[`AstNamespaceName`](AstNamespaceName.md)


___

### nestingSelector

• **nestingSelector**: (`props?`: {}) => [`AstNestingSelector`](AstNestingSelector.md)

#### Type declaration

▸ (`props?`): [`AstNestingSelector`](AstNestingSelector.md)

##### Parameters

| Name | Type |
| :------ | :------ |
| `props?` | `Object` |

##### Returns

[`AstNestingSelector`](AstNestingSelector.md)


___

### noNamespace

• **noNamespace**: (`props?`: {}) => [`AstNoNamespace`](AstNoNamespace.md)

#### Type declaration

▸ (`props?`): [`AstNoNamespace`](AstNoNamespace.md)

##### Parameters

| Name | Type |
| :------ | :------ |
| `props?` | `Object` |

##### Returns

[`AstNoNamespace`](AstNoNamespace.md)


___

### pseudoClass

• **pseudoClass**: (`props`: { `argument?`: [`AstSelector`](AstSelector.md) \| [`AstSubstitution`](AstSubstitution.md) \| [`AstString`](AstString.md) \| [`AstFormula`](AstFormula.md) \| [`AstFormulaOfSelector`](AstFormulaOfSelector.md) ; `name`: `string`  }) => [`AstPseudoClass`](AstPseudoClass.md)

#### Type declaration

▸ (`props`): [`AstPseudoClass`](AstPseudoClass.md)

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `props` | `Object` | - |
| `props.argument?` | [`AstSelector`](AstSelector.md) \| [`AstSubstitution`](AstSubstitution.md) \| [`AstString`](AstString.md) \| [`AstFormula`](AstFormula.md) \| [`AstFormulaOfSelector`](AstFormulaOfSelector.md) | Pseudo-class value (i.e. `"en"` in case of `":lang(en)"`). |
| `props.name` | `string` | Pseudo-class name (i.e. `"hover"` in case of `":hover"`). |

##### Returns

[`AstPseudoClass`](AstPseudoClass.md)


___

### pseudoElement

• **pseudoElement**: (`props`: { `argument?`: [`AstSelector`](AstSelector.md) \| [`AstSubstitution`](AstSubstitution.md) \| [`AstString`](AstString.md) ; `name`: `string`  }) => [`AstPseudoElement`](AstPseudoElement.md)

#### Type declaration

▸ (`props`): [`AstPseudoElement`](AstPseudoElement.md)

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `props` | `Object` | - |
| `props.argument?` | [`AstSelector`](AstSelector.md) \| [`AstSubstitution`](AstSubstitution.md) \| [`AstString`](AstString.md) | Pseudo-element value (i.e. `"foo"` in case of `"::part(foo)"`). |
| `props.name` | `string` | Pseudo-element name (i.e. `"before"` in case of `"::before"`). |

##### Returns

[`AstPseudoElement`](AstPseudoElement.md)


___

### rule

• **rule**: (`props`: { `combinator?`: `string` ; `items`: ([`AstTagName`](AstTagName.md) \| [`AstWildcardTag`](AstWildcardTag.md) \| [`AstId`](AstId.md) \| [`AstClassName`](AstClassName.md) \| [`AstNestingSelector`](AstNestingSelector.md) \| [`AstPseudoClass`](AstPseudoClass.md) \| [`AstAttribute`](AstAttribute.md) \| [`AstPseudoElement`](AstPseudoElement.md))[] ; `nestedRule?`: [`AstRule`](AstRule.md)  }) => [`AstRule`](AstRule.md)

#### Type declaration

▸ (`props`): [`AstRule`](AstRule.md)

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `props` | `Object` | - |
| `props.combinator?` | `string` | Rule combinator which was used to nest this rule (i.e. `">"` in case of `"div > span"` if the current rule is `"span"`). |
| `props.items` | ([`AstTagName`](AstTagName.md) \| [`AstWildcardTag`](AstWildcardTag.md) \| [`AstId`](AstId.md) \| [`AstClassName`](AstClassName.md) \| [`AstNestingSelector`](AstNestingSelector.md) \| [`AstPseudoClass`](AstPseudoClass.md) \| [`AstAttribute`](AstAttribute.md) \| [`AstPseudoElement`](AstPseudoElement.md))[] | Items of a CSS rule. Can be tag, ids, class names, pseudo-classes and pseudo-elements. |
| `props.nestedRule?` | [`AstRule`](AstRule.md) | Nested rule if specified (i.e. `"div > span"`). |

##### Returns

[`AstRule`](AstRule.md)


___

### selector

• **selector**: (`props`: { `rules`: [`AstRule`](AstRule.md)[]  }) => [`AstSelector`](AstSelector.md)

#### Type declaration

▸ (`props`): [`AstSelector`](AstSelector.md)

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `props` | `Object` | - |
| `props.rules` | [`AstRule`](AstRule.md)[] | List of CSS rules. Every rule contains conditions. Selector is considered matched once at least one rule matches. |

##### Returns

[`AstSelector`](AstSelector.md)


___

### string

• **string**: (`props`: { `value`: `string`  }) => [`AstString`](AstString.md)

#### Type declaration

▸ (`props`): [`AstString`](AstString.md)

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `props` | `Object` | - |
| `props.value` | `string` | The actual string value. |

##### Returns

[`AstString`](AstString.md)


___

### substitution

• **substitution**: (`props`: { `name`: `string`  }) => [`AstSubstitution`](AstSubstitution.md)

#### Type declaration

▸ (`props`): [`AstSubstitution`](AstSubstitution.md)

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `props` | `Object` | - |
| `props.name` | `string` | Substitution name (i.e. "var" in case of `"[role=$var]"` or `":lang($var)"`). |

##### Returns

[`AstSubstitution`](AstSubstitution.md)


___

### tagName

• **tagName**: (`props`: { `name`: `string` ; `namespace?`: [`AstNamespaceName`](AstNamespaceName.md) \| [`AstWildcardNamespace`](AstWildcardNamespace.md) \| [`AstNoNamespace`](AstNoNamespace.md)  }) => [`AstTagName`](AstTagName.md)

#### Type declaration

▸ (`props`): [`AstTagName`](AstTagName.md)

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `props` | `Object` | - |
| `props.name` | `string` | Tag name, i.e. `"div"`. |
| `props.namespace?` | [`AstNamespaceName`](AstNamespaceName.md) \| [`AstWildcardNamespace`](AstWildcardNamespace.md) \| [`AstNoNamespace`](AstNoNamespace.md) | Namespace according to https://www.w3.org/TR/css3-namespace/. |

##### Returns

[`AstTagName`](AstTagName.md)


___

### wildcardNamespace

• **wildcardNamespace**: (`props?`: {}) => [`AstWildcardNamespace`](AstWildcardNamespace.md)

#### Type declaration

▸ (`props?`): [`AstWildcardNamespace`](AstWildcardNamespace.md)

##### Parameters

| Name | Type |
| :------ | :------ |
| `props?` | `Object` |

##### Returns

[`AstWildcardNamespace`](AstWildcardNamespace.md)


___

### wildcardTag

• **wildcardTag**: (`props?`: { `namespace?`: [`AstNamespaceName`](AstNamespaceName.md) \| [`AstWildcardNamespace`](AstWildcardNamespace.md) \| [`AstNoNamespace`](AstNoNamespace.md)  }) => [`AstWildcardTag`](AstWildcardTag.md)

#### Type declaration

▸ (`props?`): [`AstWildcardTag`](AstWildcardTag.md)

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `props?` | `Object` | - |
| `props.namespace?` | [`AstNamespaceName`](AstNamespaceName.md) \| [`AstWildcardNamespace`](AstWildcardNamespace.md) \| [`AstNoNamespace`](AstNoNamespace.md) | Namespace according to https://www.w3.org/TR/css3-namespace/. |

##### Returns

[`AstWildcardTag`](AstWildcardTag.md)

