[css-selector-parser](../README.md) / PseudoClassesSyntaxDefinition

# Interface: PseudoClassesSyntaxDefinition

CSS Pseudo Classes Syntax Definition options.

## Table of contents

### Properties

- [definitions](PseudoClassesSyntaxDefinition.md#definitions)
- [unknown](PseudoClassesSyntaxDefinition.md#unknown)

## Properties

### definitions

• `Optional` **definitions**: [`PseudoClassDefinitions`](../README.md#pseudoclassdefinitions)

Predefined pseudo-classes.

**`Example`**

```ts
{NoArgument: ['first-child'], Formula: ['nth-child'], String: ['dir'], Selector: ['not']}
```

#### Defined in

[src/syntax-definitions.ts:24](https://github.com/mdevils/css-selector-parser/blob/f7b90ac/src/syntax-definitions.ts#L24)

___

### unknown

• `Optional` **unknown**: `UnknownInputBehavior`

How to handle unknown pseudo-classes.
`accept` - still parse.
`reject` - throw an error.

#### Defined in

[src/syntax-definitions.ts:19](https://github.com/mdevils/css-selector-parser/blob/f7b90ac/src/syntax-definitions.ts#L19)
