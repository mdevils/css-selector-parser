[css-selector-parser](../README.md) / AstFactory

# Interface: AstFactory

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

## Hierarchy

- `AstFactoryBase`

  ↳ **`AstFactory`**

## Table of contents

### Properties

- [attribute](AstFactory.md#attribute)
- [formula](AstFactory.md#formula)
- [formulaOfSelector](AstFactory.md#formulaofselector)
- [isAttribute](AstFactory.md#isattribute)
- [isFormula](AstFactory.md#isformula)
- [isFormulaOfSelector](AstFactory.md#isformulaofselector)
- [isNamespaceName](AstFactory.md#isnamespacename)
- [isNoNamespace](AstFactory.md#isnonamespace)
- [isPseudoClass](AstFactory.md#ispseudoclass)
- [isRule](AstFactory.md#isrule)
- [isSelector](AstFactory.md#isselector)
- [isString](AstFactory.md#isstring)
- [isSubstitution](AstFactory.md#issubstitution)
- [isTagName](AstFactory.md#istagname)
- [isWildcardNamespace](AstFactory.md#iswildcardnamespace)
- [isWildcardTag](AstFactory.md#iswildcardtag)
- [namespaceName](AstFactory.md#namespacename)
- [noNamespace](AstFactory.md#nonamespace)
- [pseudoClass](AstFactory.md#pseudoclass)
- [rule](AstFactory.md#rule)
- [selector](AstFactory.md#selector)
- [string](AstFactory.md#string)
- [substitution](AstFactory.md#substitution)
- [tagName](AstFactory.md#tagname)
- [wildcardNamespace](AstFactory.md#wildcardnamespace)
- [wildcardTag](AstFactory.md#wildcardtag)

## Properties

### attribute

• **attribute**: (`props`: { `caseSensitivityModifier?`: `string` ; `name`: `string` ; `namespace?`: [`AstNamespace`](../README.md#astnamespace) ; `operator?`: `string` ; `value?`: [`AstSubstitution`](AstSubstitution.md) \| [`AstString`](AstString.md)  }) => [`AstAttribute`](AstAttribute.md)

#### Type declaration

▸ (`props`): [`AstAttribute`](AstAttribute.md)

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `props` | `Object` | - |
| `props.caseSensitivityModifier?` | `string` | Comparison case sensitivity modifier (i.e. `"i"` in case if `"[role='button' i]"`). |
| `props.name` | `string` | Attribute name (i.e. `"href"` in case if `"[href]"`). |
| `props.namespace?` | [`AstNamespace`](../README.md#astnamespace) | Namespace according to https://drafts.csswg.org/selectors/#attrnmsp. |
| `props.operator?` | `string` | Comparison operator (i.e. `"\|="` in case if `"[role\|=button]"`). |
| `props.value?` | [`AstSubstitution`](AstSubstitution.md) \| [`AstString`](AstString.md) | Comparison value (i.e. `"button"` in case if `"[role=button]"`). |

##### Returns

[`AstAttribute`](AstAttribute.md)

#### Inherited from

AstFactoryBase.attribute

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

#### Inherited from

AstFactoryBase.formula

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

#### Inherited from

AstFactoryBase.formulaOfSelector

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

#### Inherited from

AstFactoryBase.isAttribute

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

#### Inherited from

AstFactoryBase.isFormula

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

#### Inherited from

AstFactoryBase.isFormulaOfSelector

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

#### Inherited from

AstFactoryBase.isNamespaceName

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

#### Inherited from

AstFactoryBase.isNoNamespace

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

#### Inherited from

AstFactoryBase.isPseudoClass

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

#### Inherited from

AstFactoryBase.isRule

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

#### Inherited from

AstFactoryBase.isSelector

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

#### Inherited from

AstFactoryBase.isString

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

#### Inherited from

AstFactoryBase.isSubstitution

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

#### Inherited from

AstFactoryBase.isTagName

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

#### Inherited from

AstFactoryBase.isWildcardNamespace

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

#### Inherited from

AstFactoryBase.isWildcardTag

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

#### Inherited from

AstFactoryBase.namespaceName

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

#### Inherited from

AstFactoryBase.noNamespace

___

### pseudoClass

• **pseudoClass**: (`props`: { `argument?`: [`AstPseudoClassArgument`](../README.md#astpseudoclassargument) ; `name`: `string`  }) => [`AstPseudoClass`](AstPseudoClass.md)

#### Type declaration

▸ (`props`): [`AstPseudoClass`](AstPseudoClass.md)

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `props` | `Object` | - |
| `props.argument?` | [`AstPseudoClassArgument`](../README.md#astpseudoclassargument) | Pseudo-class value (i.e. `"en"` in case of `":lang(en)"`). |
| `props.name` | `string` | Pseudo-class name (i.e. `"hover"` in case of `":hover"`). |

##### Returns

[`AstPseudoClass`](AstPseudoClass.md)

#### Inherited from

AstFactoryBase.pseudoClass

___

### rule

• **rule**: (`props?`: { `attributes?`: [`AstAttribute`](AstAttribute.md)[] ; `classNames?`: `string`[] ; `ids?`: `string`[] ; `nestedRule?`: { `combinator?`: `string` ; `rule`: [`AstRule`](AstRule.md)  } ; `pseudoClasses?`: [`AstPseudoClass`](AstPseudoClass.md)[] ; `pseudoElement?`: `string` ; `tag?`: [`AstTag`](../README.md#asttag)  }) => [`AstRule`](AstRule.md)

#### Type declaration

▸ (`props?`): [`AstRule`](AstRule.md)

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `props?` | `Object` | - |
| `props.attributes?` | [`AstAttribute`](AstAttribute.md)[] | List of attributes (i.e. `"[href][role=button]"` -> `[{name: 'href'}, {name: 'role', operator: '=', value: {type: 'String', value: 'button'}}]`) |
| `props.classNames?` | `string`[] | List of CSS classes (i.e. `".c1.c2"` -> `['c1', 'c2']`) |
| `props.ids?` | `string`[] | List of IDs (i.e. `"#root"` -> `['root']`). |
| `props.nestedRule?` | `Object` | Nested rule and combinator if specified (i.e. `"div > span"`). |
| `props.nestedRule.combinator?` | `string` | Nested rule combinator (i.e. `">"` in case of `"div > span"`). |
| `props.nestedRule.rule` | [`AstRule`](AstRule.md) | Nested rule definition. |
| `props.pseudoClasses?` | [`AstPseudoClass`](AstPseudoClass.md)[] | Pseudo-classes (i.e. `":link"` -> `[{name: 'link'}]`). |
| `props.pseudoElement?` | `string` | Pseudo-element (i.e. `"::before"` -> `'before'`). |
| `props.tag?` | [`AstTag`](../README.md#asttag) | Tag definition. Can be either TagName (i.e. `"div"`) or WildcardTag (`"*"`) if defined. |

##### Returns

[`AstRule`](AstRule.md)

#### Inherited from

AstFactoryBase.rule

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

#### Inherited from

AstFactoryBase.selector

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

#### Inherited from

AstFactoryBase.string

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

#### Inherited from

AstFactoryBase.substitution

___

### tagName

• **tagName**: (`props`: { `name`: `string` ; `namespace?`: [`AstNamespace`](../README.md#astnamespace)  }) => [`AstTagName`](AstTagName.md)

#### Type declaration

▸ (`props`): [`AstTagName`](AstTagName.md)

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `props` | `Object` | - |
| `props.name` | `string` | Tag name, i.e. `"div"`. |
| `props.namespace?` | [`AstNamespace`](../README.md#astnamespace) | Namespace according to https://www.w3.org/TR/css3-namespace/. |

##### Returns

[`AstTagName`](AstTagName.md)

#### Inherited from

AstFactoryBase.tagName

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

#### Inherited from

AstFactoryBase.wildcardNamespace

___

### wildcardTag

• **wildcardTag**: (`props?`: { `namespace?`: [`AstNamespace`](../README.md#astnamespace)  }) => [`AstWildcardTag`](AstWildcardTag.md)

#### Type declaration

▸ (`props?`): [`AstWildcardTag`](AstWildcardTag.md)

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `props?` | `Object` | - |
| `props.namespace?` | [`AstNamespace`](../README.md#astnamespace) | Namespace according to https://www.w3.org/TR/css3-namespace/. |

##### Returns

[`AstWildcardTag`](AstWildcardTag.md)

#### Inherited from

AstFactoryBase.wildcardTag
