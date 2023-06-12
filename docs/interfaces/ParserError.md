[css-selector-parser](../../README.md) / [Exports](../modules.md) / ParserError

# Interface: ParserError

This error is thrown when parser encounters problems in CSS string.
On top of the usual error, it has `position` property to indicate where in the input string the error happened.

## Hierarchy

- `Error`

  ↳ **`ParserError`**

## Table of contents

### Properties

- [message](ParserError.md#message)
- [name](ParserError.md#name)
- [position](ParserError.md#position)

## Properties

### message

• **message**: `string`

#### Overrides

Error.message

___

### name

• **name**: ``"ParserError"``

#### Overrides

Error.name

___

### position

• **position**: `number`
