[css-selector-parser](../../README.md) / [Exports](../modules.md) / AstSelector

# Interface: AstSelector

CSS Selector AST root.
Contains list of CSS rules (separated by a comma in the input CSS selector string).
Generated by [ast.selector](AstFactory.md#selector).

## Table of contents

### Properties

- [rules](AstSelector.md#rules)
- [type](AstSelector.md#type)

## Properties

### rules

• **rules**: [`AstRule`](AstRule.md)[]

List of CSS rules. Every rule contains conditions. Selector is considered matched once at least one rule matches.

___

### type

• **type**: ``"Selector"``
