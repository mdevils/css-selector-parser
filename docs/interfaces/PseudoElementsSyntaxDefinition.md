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

#### Defined in

[src/syntax-definitions.ts:46](https://github.com/mdevils/css-selector-parser/blob/f7b90ac/src/syntax-definitions.ts#L46)

___

### notation

• `Optional` **notation**: ``"both"`` \| ``"singleColon"`` \| ``"doubleColon"``

In the past pseudo selements were defined starting with a single colon.
Later this notation changed to double colon.

#### Defined in

[src/syntax-definitions.ts:41](https://github.com/mdevils/css-selector-parser/blob/f7b90ac/src/syntax-definitions.ts#L41)

___

### unknown

• `Optional` **unknown**: `UnknownInputBehavior`

How to handle unknown pseudo-elements.
`accept` - still parse.
`reject` - throw an error.

#### Defined in

[src/syntax-definitions.ts:36](https://github.com/mdevils/css-selector-parser/blob/f7b90ac/src/syntax-definitions.ts#L36)
