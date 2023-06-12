[css-selector-parser](../README.md) / AstSelector

# Interface: AstSelector

CSS Selector AST root.
Contains list of CSS rules (separated by a comma in the input CSS selector string).

## Table of contents

### Properties

- [rules](AstSelector.md#rules)
- [type](AstSelector.md#type)

## Properties

### rules

• **rules**: [`AstRule`](AstRule.md)[]

List of CSS rules. Every rule contains conditions. Selector is considered matched once at least one rule matches.

#### Defined in

[src/ast.ts:10](https://github.com/mdevils/css-selector-parser/blob/f7b90ac/src/ast.ts#L10)

___

### type

• **type**: ``"Selector"``

#### Defined in

[src/ast.ts:6](https://github.com/mdevils/css-selector-parser/blob/f7b90ac/src/ast.ts#L6)
