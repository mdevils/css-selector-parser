[css-selector-parser](../README.md) / PseudoElementsSyntaxDefinition

# Interface: PseudoElementsSyntaxDefinition

CSS Pseudo Elements Syntax Definition options.

## Table of contents

### Properties

- [definitions](PseudoElementsSyntaxDefinition.md#definitions)
- [notation](PseudoElementsSyntaxDefinition.md#notation)
- [unknown](PseudoElementsSyntaxDefinition.md#unknown)

## Properties

### definitions

• `Optional` **definitions**: `string`[]

List of predefined pseudo-elements.

**`Example`**

```ts
['before', 'after']
```

___

### notation

• `Optional` **notation**: ``"both"`` \| ``"singleColon"`` \| ``"doubleColon"``

In the past pseudo selements were defined starting with a single colon.
Later this notation changed to double colon.

___

### unknown

• `Optional` **unknown**: `UnknownInputBehavior`

How to handle unknown pseudo-elements.
`accept` - still parse.
`reject` - throw an error.
