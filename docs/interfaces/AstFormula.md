[css-selector-parser](../../README.md) / [Exports](../modules.md) / AstFormula

# Interface: AstFormula

Pseudo-class formula value. `a` is multiplier of `n` and `b` us added on top. Formula: `an + b`.
For instance `:nth-child(2n + 1)` -> `{type: 'AstPseudoClass'..., argument: {type: 'Formula', a: 2, b: 1}}`.
Generated by [ast.formula](AstFactory.md#formula).

**`See`**

https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-child#functional_notation

## Table of contents

### Properties

- [a](AstFormula.md#a)
- [b](AstFormula.md#b)
- [type](AstFormula.md#type)

## Properties

### a

• **a**: `number`

Multiplier of `n`.

___

### b

• **b**: `number`

Constant added to `a*n`.

___

### type

• **type**: ``"Formula"``
