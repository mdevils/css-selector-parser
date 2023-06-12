css-selector-parser

# css-selector-parser

## Table of contents

### Interfaces

- [AstAttribute](interfaces/AstAttribute.md)
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
- [PseudoClassesSyntaxDefinition](interfaces/PseudoClassesSyntaxDefinition.md)
- [PseudoElementsSyntaxDefinition](interfaces/PseudoElementsSyntaxDefinition.md)
- [SyntaxDefinition](interfaces/SyntaxDefinition.md)

### Type Aliases

- [AstEntity](README.md#astentity)
- [AstNamespace](README.md#astnamespace)
- [AstPseudoClassArgument](README.md#astpseudoclassargument)
- [AstTag](README.md#asttag)
- [CssLevel](README.md#csslevel)
- [PseudoClassDefinitions](README.md#pseudoclassdefinitions)
- [PseudoClassType](README.md#pseudoclasstype)

### Variables

- [ast](README.md#ast)

### Functions

- [createParser](README.md#createparser)
- [render](README.md#render)

## Type Aliases

### AstEntity

Ƭ **AstEntity**: [`AstSelector`](interfaces/AstSelector.md) \| [`AstRule`](interfaces/AstRule.md) \| [`AstTag`](README.md#asttag) \| [`AstNamespace`](README.md#astnamespace) \| [`AstPseudoClassArgument`](README.md#astpseudoclassargument) \| [`AstPseudoClass`](interfaces/AstPseudoClass.md) \| [`AstAttribute`](interfaces/AstAttribute.md)

Any CSS element.

#### Defined in

[src/ast.ts:122](https://github.com/mdevils/css-selector-parser/blob/f7b90ac/src/ast.ts#L122)

___

### AstNamespace

Ƭ **AstNamespace**: [`AstNamespaceName`](interfaces/AstNamespaceName.md) \| [`AstWildcardNamespace`](interfaces/AstWildcardNamespace.md) \| [`AstNoNamespace`](interfaces/AstNoNamespace.md)

#### Defined in

[src/ast.ts:67](https://github.com/mdevils/css-selector-parser/blob/f7b90ac/src/ast.ts#L67)

___

### AstPseudoClassArgument

Ƭ **AstPseudoClassArgument**: [`AstSubstitution`](interfaces/AstSubstitution.md) \| [`AstSelector`](interfaces/AstSelector.md) \| [`AstString`](interfaces/AstString.md) \| [`AstFormula`](interfaces/AstFormula.md) \| [`AstFormulaOfSelector`](interfaces/AstFormulaOfSelector.md)

Any pseudo-class argument type.

#### Defined in

[src/ast.ts:119](https://github.com/mdevils/css-selector-parser/blob/f7b90ac/src/ast.ts#L119)

___

### AstTag

Ƭ **AstTag**: [`AstTagName`](interfaces/AstTagName.md) \| [`AstWildcardTag`](interfaces/AstWildcardTag.md)

#### Defined in

[src/ast.ts:55](https://github.com/mdevils/css-selector-parser/blob/f7b90ac/src/ast.ts#L55)

___

### CssLevel

Ƭ **CssLevel**: ``"css1"`` \| ``"css2"`` \| ``"css3"`` \| ``"selectors-3"`` \| ``"selectors-4"`` \| ``"latest"`` \| ``"progressive"``

#### Defined in

[src/syntax-definitions.ts:4](https://github.com/mdevils/css-selector-parser/blob/f7b90ac/src/syntax-definitions.ts#L4)

___

### PseudoClassDefinitions

Ƭ **PseudoClassDefinitions**: { [K in PseudoClassType]?: string[] }

#### Defined in

[src/syntax-definitions.ts:8](https://github.com/mdevils/css-selector-parser/blob/f7b90ac/src/syntax-definitions.ts#L8)

___

### PseudoClassType

Ƭ **PseudoClassType**: ``"NoArgument"`` \| [`AstPseudoClassArgument`](README.md#astpseudoclassargument)[``"type"``]

#### Defined in

[src/syntax-definitions.ts:3](https://github.com/mdevils/css-selector-parser/blob/f7b90ac/src/syntax-definitions.ts#L3)

## Variables

### ast

• `Const` **ast**: `Object`

AST structure generators and matchers.
For instance, `ast.selector({rules: [...]})` creates AstSelector and `ast.isSelector(...)` checks if
AstSelector was specified.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `attribute` | (`props`: `Omit`<[`AstAttribute`](interfaces/AstAttribute.md), ``"type"``\>) => [`AstAttribute`](interfaces/AstAttribute.md) |
| `formula` | (`props`: `Omit`<[`AstFormula`](interfaces/AstFormula.md), ``"type"``\>) => [`AstFormula`](interfaces/AstFormula.md) |
| `formulaOfSelector` | (`props`: `Omit`<[`AstFormulaOfSelector`](interfaces/AstFormulaOfSelector.md), ``"type"``\>) => [`AstFormulaOfSelector`](interfaces/AstFormulaOfSelector.md) |
| `isAttribute` | (`entity`: `unknown`) => entity is AstAttribute |
| `isFormula` | (`entity`: `unknown`) => entity is AstFormula |
| `isFormulaOfSelector` | (`entity`: `unknown`) => entity is AstFormulaOfSelector |
| `isNamespaceName` | (`entity`: `unknown`) => entity is AstNamespaceName |
| `isNoNamespace` | (`entity`: `unknown`) => entity is AstNoNamespace |
| `isPseudoClass` | (`entity`: `unknown`) => entity is AstPseudoClass |
| `isRule` | (`entity`: `unknown`) => entity is AstRule |
| `isSelector` | (`entity`: `unknown`) => entity is AstSelector |
| `isString` | (`entity`: `unknown`) => entity is AstString |
| `isSubstitution` | (`entity`: `unknown`) => entity is AstSubstitution |
| `isTagName` | (`entity`: `unknown`) => entity is AstTagName |
| `isWildcardNamespace` | (`entity`: `unknown`) => entity is AstWildcardNamespace |
| `isWildcardTag` | (`entity`: `unknown`) => entity is AstWildcardTag |
| `namespaceName` | (`props`: `Omit`<[`AstNamespaceName`](interfaces/AstNamespaceName.md), ``"type"``\>) => [`AstNamespaceName`](interfaces/AstNamespaceName.md) |
| `noNamespace` | (`props?`: `Omit`<[`AstNoNamespace`](interfaces/AstNoNamespace.md), ``"type"``\>) => [`AstNoNamespace`](interfaces/AstNoNamespace.md) |
| `pseudoClass` | (`props`: `Omit`<[`AstPseudoClass`](interfaces/AstPseudoClass.md), ``"type"``\>) => [`AstPseudoClass`](interfaces/AstPseudoClass.md) |
| `rule` | (`props?`: `Omit`<[`AstRule`](interfaces/AstRule.md), ``"type"``\>) => [`AstRule`](interfaces/AstRule.md) |
| `selector` | (`props`: `Omit`<[`AstSelector`](interfaces/AstSelector.md), ``"type"``\>) => [`AstSelector`](interfaces/AstSelector.md) |
| `string` | (`props`: `Omit`<[`AstString`](interfaces/AstString.md), ``"type"``\>) => [`AstString`](interfaces/AstString.md) |
| `substitution` | (`props`: `Omit`<[`AstSubstitution`](interfaces/AstSubstitution.md), ``"type"``\>) => [`AstSubstitution`](interfaces/AstSubstitution.md) |
| `tagName` | (`props`: `Omit`<[`AstTagName`](interfaces/AstTagName.md), ``"type"``\>) => [`AstTagName`](interfaces/AstTagName.md) |
| `wildcardNamespace` | (`props?`: `Omit`<[`AstWildcardNamespace`](interfaces/AstWildcardNamespace.md), ``"type"``\>) => [`AstWildcardNamespace`](interfaces/AstWildcardNamespace.md) |
| `wildcardTag` | (`props?`: `Omit`<[`AstWildcardTag`](interfaces/AstWildcardTag.md), ``"type"``\>) => [`AstWildcardTag`](interfaces/AstWildcardTag.md) |

#### Defined in

[src/ast.ts:152](https://github.com/mdevils/css-selector-parser/blob/f7b90ac/src/ast.ts#L152)

## Functions

### createParser

▸ **createParser**(`«destructured»?`): `Parse`

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `ParseOptions` |

#### Returns

`Parse`

#### Defined in

[src/parse.ts:41](https://github.com/mdevils/css-selector-parser/blob/f7b90ac/src/parse.ts#L41)

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

#### Defined in

[src/render.ts:34](https://github.com/mdevils/css-selector-parser/blob/f7b90ac/src/render.ts#L34)
