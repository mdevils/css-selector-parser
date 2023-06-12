[css-selector-parser](../README.md) / SyntaxDefinition

# Interface: SyntaxDefinition

CSS Selector Syntax Definition can be used to define custom CSS selector parsing rules.

## Table of contents

### Properties

- [attributes](SyntaxDefinition.md#attributes)
- [baseSyntax](SyntaxDefinition.md#basesyntax)
- [classNames](SyntaxDefinition.md#classnames)
- [combinators](SyntaxDefinition.md#combinators)
- [ids](SyntaxDefinition.md#ids)
- [namespace](SyntaxDefinition.md#namespace)
- [pseudoClasses](SyntaxDefinition.md#pseudoclasses)
- [pseudoElements](SyntaxDefinition.md#pseudoelements)
- [tag](SyntaxDefinition.md#tag)

## Properties

### attributes

• `Optional` **attributes**: ``false`` \| { `caseSensitivityModifiers?`: `string`[] ; `operators?`: `string`[] ; `unknownCaseSensitivityModifiers?`: `UnknownInputBehavior`  }

CSS Attribute Selector.

**`Example`**

```ts
[href="#"]
```

**`See`**

https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors/Attribute_selectors

#### Defined in

[src/syntax-definitions.ts:103](https://github.com/mdevils/css-selector-parser/blob/f7b90ac/src/syntax-definitions.ts#L103)

___

### baseSyntax

• `Optional` **baseSyntax**: [`CssLevel`](../README.md#csslevel)

When specified, syntax will be based on the specified predefined CSS standard.
If not specified, syntax will be defined from scratch.

#### Defined in

[src/syntax-definitions.ts:67](https://github.com/mdevils/css-selector-parser/blob/f7b90ac/src/syntax-definitions.ts#L67)

___

### classNames

• `Optional` **classNames**: `boolean`

CSS Class Names

**`Example`**

```ts
.element.highlighted
```

**`See`**

https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors/Type_Class_and_ID_Selectors

#### Defined in

[src/syntax-definitions.ts:91](https://github.com/mdevils/css-selector-parser/blob/f7b90ac/src/syntax-definitions.ts#L91)

___

### combinators

• `Optional` **combinators**: `string`[]

CSS selector rule nesting combinators.

**`Example`**

```ts
div.class > span
```

**`See`**

https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors/Combinators

#### Defined in

[src/syntax-definitions.ts:97](https://github.com/mdevils/css-selector-parser/blob/f7b90ac/src/syntax-definitions.ts#L97)

___

### ids

• `Optional` **ids**: `boolean`

CSS IDs (yes, there can be multiple).

**`Example`**

```ts
#root#root
```

**`See`**

https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors/Type_Class_and_ID_Selectors

#### Defined in

[src/syntax-definitions.ts:85](https://github.com/mdevils/css-selector-parser/blob/f7b90ac/src/syntax-definitions.ts#L85)

___

### namespace

• `Optional` **namespace**: `boolean` \| `SyntaxDefinitionXmlOptions`

CSS3 Namespaces.

**`Example`**

```ts
ns|div
```

**`See`**

https://www.w3.org/TR/css3-namespace/

#### Defined in

[src/syntax-definitions.ts:79](https://github.com/mdevils/css-selector-parser/blob/f7b90ac/src/syntax-definitions.ts#L79)

___

### pseudoClasses

• `Optional` **pseudoClasses**: ``false`` \| [`PseudoClassesSyntaxDefinition`](PseudoClassesSyntaxDefinition.md)

CSS Pseudo-classes.

**`Example`**

```ts
:nth-child(2n+1)
```

**`See`**

https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors/Pseudo-classes_and_pseudo-elements

#### Defined in

[src/syntax-definitions.ts:136](https://github.com/mdevils/css-selector-parser/blob/f7b90ac/src/syntax-definitions.ts#L136)

___

### pseudoElements

• `Optional` **pseudoElements**: ``false`` \| [`PseudoElementsSyntaxDefinition`](PseudoElementsSyntaxDefinition.md)

CSS Pseudo-elements.

**`Example`**

```ts
::before
```

**`See`**

https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors/Pseudo-classes_and_pseudo-elements

#### Defined in

[src/syntax-definitions.ts:130](https://github.com/mdevils/css-selector-parser/blob/f7b90ac/src/syntax-definitions.ts#L130)

___

### tag

• `Optional` **tag**: `boolean` \| `SyntaxDefinitionXmlOptions`

CSS Tag (type).

**`Example`**

```ts
div
```

**`See`**

https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors/Type_Class_and_ID_Selectors

#### Defined in

[src/syntax-definitions.ts:73](https://github.com/mdevils/css-selector-parser/blob/f7b90ac/src/syntax-definitions.ts#L73)
