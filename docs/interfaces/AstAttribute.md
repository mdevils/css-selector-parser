[css-selector-parser](../README.md) / AstAttribute

# Interface: AstAttribute

## Table of contents

### Properties

- [caseSensitivityModifier](AstAttribute.md#casesensitivitymodifier)
- [name](AstAttribute.md#name)
- [namespace](AstAttribute.md#namespace)
- [operator](AstAttribute.md#operator)
- [type](AstAttribute.md#type)
- [value](AstAttribute.md#value)

## Properties

### caseSensitivityModifier

• `Optional` **caseSensitivityModifier**: `string`

#### Defined in

[src/ast.ts:75](https://github.com/mdevils/css-selector-parser/blob/f7b90ac/src/ast.ts#L75)

___

### name

• **name**: `string`

#### Defined in

[src/ast.ts:71](https://github.com/mdevils/css-selector-parser/blob/f7b90ac/src/ast.ts#L71)

___

### namespace

• `Optional` **namespace**: [`AstNamespace`](../README.md#astnamespace)

#### Defined in

[src/ast.ts:72](https://github.com/mdevils/css-selector-parser/blob/f7b90ac/src/ast.ts#L72)

___

### operator

• `Optional` **operator**: `string`

#### Defined in

[src/ast.ts:73](https://github.com/mdevils/css-selector-parser/blob/f7b90ac/src/ast.ts#L73)

___

### type

• **type**: ``"Attribute"``

#### Defined in

[src/ast.ts:70](https://github.com/mdevils/css-selector-parser/blob/f7b90ac/src/ast.ts#L70)

___

### value

• `Optional` **value**: [`AstSubstitution`](AstSubstitution.md) \| [`AstString`](AstString.md)

#### Defined in

[src/ast.ts:74](https://github.com/mdevils/css-selector-parser/blob/f7b90ac/src/ast.ts#L74)
