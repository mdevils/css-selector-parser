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

___

### AstNamespace

Ƭ **AstNamespace**: [`AstNamespaceName`](interfaces/AstNamespaceName.md) \| [`AstWildcardNamespace`](interfaces/AstWildcardNamespace.md) \| [`AstNoNamespace`](interfaces/AstNoNamespace.md)

___

### AstPseudoClassArgument

Ƭ **AstPseudoClassArgument**: [`AstSubstitution`](interfaces/AstSubstitution.md) \| [`AstSelector`](interfaces/AstSelector.md) \| [`AstString`](interfaces/AstString.md) \| [`AstFormula`](interfaces/AstFormula.md) \| [`AstFormulaOfSelector`](interfaces/AstFormulaOfSelector.md)

Any pseudo-class argument type.

___

### AstTag

Ƭ **AstTag**: [`AstTagName`](interfaces/AstTagName.md) \| [`AstWildcardTag`](interfaces/AstWildcardTag.md)

___

### CssLevel

Ƭ **CssLevel**: ``"css1"`` \| ``"css2"`` \| ``"css3"`` \| ``"selectors-3"`` \| ``"selectors-4"`` \| ``"latest"`` \| ``"progressive"``

___

### PseudoClassDefinitions

Ƭ **PseudoClassDefinitions**: { [K in PseudoClassType]?: string[] }

___

### PseudoClassType

Ƭ **PseudoClassType**: ``"NoArgument"`` \| [`AstPseudoClassArgument`](README.md#astpseudoclassargument)[``"type"``]

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

## Functions

### createParser

▸ **createParser**(`options?`): `Parse`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `ParseOptions` |

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
