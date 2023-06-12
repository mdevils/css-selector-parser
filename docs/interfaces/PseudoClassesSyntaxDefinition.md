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

___

### unknown

• `Optional` **unknown**: `UnknownInputBehavior`

How to handle unknown pseudo-classes.
`accept` - still parse.
`reject` - throw an error.
