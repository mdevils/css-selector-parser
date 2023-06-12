[css-selector-parser](../README.md) / AstString

# Interface: AstString

String value. Can be used as attribute value of pseudo-class string value.
For instance `:lang(en)` -> `{type: 'AstPseudoClass'..., argument: {type: 'String', value: 'en'}}`.

## Table of contents

### Properties

- [type](AstString.md#type)
- [value](AstString.md#value)

## Properties

### type

• **type**: ``"String"``

#### Defined in

[src/ast.ts:89](https://github.com/mdevils/css-selector-parser/blob/f7b90ac/src/ast.ts#L89)

___

### value

• **value**: `string`

#### Defined in

[src/ast.ts:90](https://github.com/mdevils/css-selector-parser/blob/f7b90ac/src/ast.ts#L90)
