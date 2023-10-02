[css-selector-parser](../../README.md) / [Exports](../modules.md) / SyntaxDefinition

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

• `Optional` **attributes**: ``false`` \| { `caseSensitivityModifiers?`: `string`[] ; `operators?`: `string`[] ; `unknownCaseSensitivityModifiers?`: ``"accept"`` \| ``"reject"``  }

CSS Attribute Selector.

**`Example`**

```ts
[href="#"]
```

**`See`**

https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors/Attribute_selectors

___

### baseSyntax

• `Optional` **baseSyntax**: [`CssLevel`](../modules.md#csslevel)

When specified, syntax will be based on the specified predefined CSS standard.
If not specified, syntax will be defined from scratch.

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

___

### namespace

• `Optional` **namespace**: `boolean` \| { `wildcard?`: `boolean`  }

CSS3 Namespaces.

**`Example`**

```ts
ns|div
```

**`See`**

https://www.w3.org/TR/css3-namespace/

___

### pseudoClasses

• `Optional` **pseudoClasses**: ``false`` \| { `definitions?`: { `Formula`: `undefined` \| `string`[] ; `FormulaOfSelector`: `undefined` \| `string`[] ; `NoArgument`: `undefined` \| `string`[] ; `Selector`: `undefined` \| `string`[] ; `String`: `undefined` \| `string`[]  } ; `unknown?`: ``"accept"`` \| ``"reject"``  }

CSS Pseudo-classes.

**`Example`**

```ts
:nth-child(2n+1)
```

**`See`**

https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors/Pseudo-classes_and_pseudo-elements

___

### pseudoElements

• `Optional` **pseudoElements**: ``false`` \| { `definitions?`: `string`[] \| { `NoArgument`: `undefined` \| `string`[] ; `Selector`: `undefined` \| `string`[] ; `String`: `undefined` \| `string`[]  } ; `notation?`: ``"both"`` \| ``"singleColon"`` \| ``"doubleColon"`` ; `unknown?`: ``"accept"`` \| ``"reject"``  }

CSS Pseudo-elements.

**`Example`**

```ts
::before
```

**`See`**

https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors/Pseudo-classes_and_pseudo-elements

___

### tag

• `Optional` **tag**: `boolean` \| { `wildcard?`: `boolean`  }

CSS Tag (type).

**`Example`**

```ts
div
```

**`See`**

https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors/Type_Class_and_ID_Selectors
