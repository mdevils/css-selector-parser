[css-selector-parser](../README.md) / ParseError

# Interface: ParseError

This error is thrown when parser encounters problems in CSS string.
On top of the usual error, it has `position` property to indicate where in the input string the error happened.

## Hierarchy

- `Error`

  ↳ **`ParseError`**

## Table of contents

### Properties

- [message](ParseError.md#message)
- [name](ParseError.md#name)
- [position](ParseError.md#position)
- [stack](ParseError.md#stack)

## Properties

### message

• **message**: `string`

#### Inherited from

Error.message

___

### name

• **name**: `string`

#### Inherited from

Error.name

___

### position

• **position**: `number`

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack
