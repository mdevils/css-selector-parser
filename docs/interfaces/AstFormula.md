[css-selector-parser](../README.md) / AstFormula

# Interface: AstFormula

Pseudo-class formula value. `a` is multiplier of `n` and `b` us added on top. Formula: `an + b`.
For instance `:nth-child(2n + 1)` -> `{type: 'AstPseudoClass'..., argument: {type: 'Formula', a: 2, b: 1}}`.

## Table of contents

### Properties

- [a](AstFormula.md#a)
- [b](AstFormula.md#b)
- [type](AstFormula.md#type)

## Properties

### a

• **a**: `number`

Multiplier of `n`.

#### Defined in

[src/ast.ts:100](https://github.com/mdevils/css-selector-parser/blob/f7b90ac/src/ast.ts#L100)

___

### b

• **b**: `number`

Constant added to `a*n`.

#### Defined in

[src/ast.ts:102](https://github.com/mdevils/css-selector-parser/blob/f7b90ac/src/ast.ts#L102)

___

### type

• **type**: ``"Formula"``

#### Defined in

[src/ast.ts:98](https://github.com/mdevils/css-selector-parser/blob/f7b90ac/src/ast.ts#L98)
