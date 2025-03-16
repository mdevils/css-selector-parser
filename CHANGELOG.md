# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [3.1.1](https://github.com/mdevils/css-selector-parser/compare/v3.1.0...v3.1.1) (2025-03-16)

## [3.1.0](https://github.com/mdevils/css-selector-parser/compare/v3.0.5...v3.1.0) (2025-03-16)


### Features

* Add "css-pseudo-4" CSS Module with new pseudo-classes and pseudo-elements ([16c1bb1](https://github.com/mdevils/css-selector-parser/commit/16c1bb1b54a2ae5f31e44b7acbb109739efae2ac))
* Add "modules" property to SyntaxDefinition and include latest CSS modules ([cd56683](https://github.com/mdevils/css-selector-parser/commit/cd566833006c50cb506249e1ac3ebea8b6783a97))
* Add comprehensive tests for CSS features option ([74137f0](https://github.com/mdevils/css-selector-parser/commit/74137f0900111a973c696772d3aee91f93b164a2))
* Add CSS modules tests for position, scoping, and multiple module support ([4cd3ecd](https://github.com/mdevils/css-selector-parser/commit/4cd3ecd34e85942bcebddff47987933bf952fe11))
* Add css-position-1 and css-position-2 modules with tests ([59b1161](https://github.com/mdevils/css-selector-parser/commit/59b11612a92a3c926b8e48a2df0afea42aaa2d77))
* Add location information to pseudo-class and pseudo-element error messages ([bafafe9](https://github.com/mdevils/css-selector-parser/commit/bafafe916a19371afe8ddd061fd3d6d24eac7c5e))
* Add Selectors Level 4 experimental features and syntax definitions ([9cda2ca](https://github.com/mdevils/css-selector-parser/commit/9cda2ca7cc188a27eea99391b34cfde91badeca8))
* Add support for CSS feature modules in parser configuration ([42ba90e](https://github.com/mdevils/css-selector-parser/commit/42ba90e8f13067ff776349137070562f41cbbcfd))
* Add support for CSS Shadow Parts module with ::part() pseudo-element ([6dbe132](https://github.com/mdevils/css-selector-parser/commit/6dbe1320cc4c06e038188b7a18497bac6ecc48a7))
* in case of undefined pseudos, show in which css level / module it is defined ([894053a](https://github.com/mdevils/css-selector-parser/commit/894053aedd40b7feea67778956f261572b0544c5))
* latest should include all latest modules ([6d7a116](https://github.com/mdevils/css-selector-parser/commit/6d7a116d8153796b6426cf6e948581aaed03e86a))


### Bug Fixes

* imports ([1422594](https://github.com/mdevils/css-selector-parser/commit/14225949d3aff66f8ba872de662d2da34265fb90))

### [3.0.5](https://github.com/mdevils/css-selector-parser/compare/v3.0.4...v3.0.5) (2024-03-02)


### Bug Fixes

* single hyphen is not a valid identifier, throwing an exception, closes [#38](https://github.com/mdevils/css-selector-parser/issues/38) ([2520a49](https://github.com/mdevils/css-selector-parser/commit/2520a494ec81f02c42b28b9ba92c4a2ab33b6fbc))

### [3.0.4](https://github.com/mdevils/css-selector-parser/compare/v3.0.3...v3.0.4) (2023-12-15)


### Bug Fixes

* align identifier and string parsing and rendering with CSS standards, closes [#36](https://github.com/mdevils/css-selector-parser/issues/36), closes [#37](https://github.com/mdevils/css-selector-parser/issues/37) ([ac0dbc0](https://github.com/mdevils/css-selector-parser/commit/ac0dbc000eff84519841adeadb31404253e5b372))

### [3.0.3](https://github.com/mdevils/css-selector-parser/compare/v3.0.2...v3.0.3) (2023-12-08)


### Bug Fixes

* align identifier parsing with CSS standards and browser behaviour ([6087705](https://github.com/mdevils/css-selector-parser/commit/6087705a2e50fa8ce7d27b408d26fdfdc355df3a))

### [3.0.2](https://github.com/mdevils/css-selector-parser/compare/v3.0.1...v3.0.2) (2023-11-21)


### Bug Fixes

* identifier parsing for ids, classes, pseudo-classes and pseudo-elements ([d222dfd](https://github.com/mdevils/css-selector-parser/commit/d222dfdf8b37502edef6d9c5a73a15c93452f7f3))

### [3.0.1](https://github.com/mdevils/css-selector-parser/compare/v3.0.0...v3.0.1) (2023-11-20)


### Bug Fixes

* build target for mjs ([bd13208](https://github.com/mdevils/css-selector-parser/commit/bd1320893e8c3e2e59724a3b2d0e9d97681c78b7))

## [3.0.0](https://github.com/mdevils/css-selector-parser/compare/v2.3.2...v3.0.0) (2023-09-26)


### ⚠ BREAKING CHANGES

* API is backwards incompatible.

#### Migrating from 2.x to 3.x

1. `Rule.tag` was moved to `Rule.items`.

   Example selector: `div`.
    * Before: `{type: 'Rule', tagName: {type: 'TagName', name: 'div'}}`
    * After: `{type: 'Rule', items: [{type: 'TagName', name: 'div'}]}`

2. `Rule.classNames` was converted to an AST entity and moved to `Rule.items`.

   Example selector: `.user.hidden`
   * Before: `{type: 'Rule', classNames: ['user', 'hidden']}`
   * After: `{type: 'Rule', items: [{type: 'ClassName', name: 'user'}, {type: 'ClassName', name: 'hidden'}]}`

3. `Rule.ids` was converted to an AST entity and moved to `Rule.items`.

   Example selector: `#root#user-1`
    * Before: `{type: 'Rule', ids: ['root', 'user-1']}`
    * After: `{type: 'Rule', items: [{type: 'Id', name: 'root'}, {type: 'Id', name: 'user-1'}]}`

4. `Rule.attributes` was moved to `Rule.items`.

   Example selector: `[href^=/][role]`
    * Before: `{type: 'Rule', attributes: [{type: 'Attribute', name: 'href', operator: '^=', value: {type: 'String', value: '/'}}, {type: 'Attribute', name: 'role'}]}` 
    * After: `{type: 'Rule', items: [{type: 'Attribute', name: 'href', operator: '^=', value: {type: 'String', value: '/'}}, {type: 'Attribute', name: 'role'}]}`

5. `Rule.pseudoClasses` was moved to `Rule.items`.

   Example selector: `:hover:lang(en)`
    * Before: `{type: 'Rule', pseudoClasses: [{type: 'PseudoClass', name: 'hover'}, {type: 'PseudoClass', name: 'lang', value: {type: 'String', value: 'en'}}]}` 
    * After: `{type: 'Rule', items: [{type: 'PseudoClass', name: 'hover'}, {type: 'PseudoClass', name: 'lang', value: {type: 'String', value: 'en'}}]}`

6. `Rule.pseudoElement` was converted to an AST entity and moved to `Rule.items`.

   Example selector: `::before`
    * Before: `{type: 'Rule', pseudoElement: 'before'}`
    * After: `{type: 'Rule', items: [{type: 'PseudoElement', name: 'before'}]}`

#### New AST methods

* `ast.id` and `ast.isId` to create and test ast nodes with type `Id`.
* `ast.className` and `ast.isClassName` to create and test ast nodes with type `ClassName`.
* `ast.pseudoElement` and `ast.isPseudoElement` to create and test ast nodes with type `PseudoElement`.

#### New Syntax Definition configuration

* `pseudoElements.definitions` was updated to accept signatures in otder to support specifying pseudo-elements with
  an argument.
  Example: `createParser({syntax: {pseudoElements: {definitions: {NoArgument: ['before'], String: ['highlight'], Selector: ['slotted']}}}})`.

#### Migrating from 1.x to 3.x

#### `CssSelectorParser` -> `createParser`

In 1.x versions there was `CssSelectorParser` class which had to be contructed and then configured.
In 3.x versions there is `createParser()` function which returns a `parse()` function. All the configutation is passed
to `createParser()` params.

Before:

```javascript
var CssSelectorParser = require('css-selector-parser').CssSelectorParser,
parser = new CssSelectorParser();
parser.registerSelectorPseudos('has');
parser.registerNumericPseudos('nth-child');
parser.registerNestingOperators('>', '+', '~');
parser.registerAttrEqualityMods('^', '$', '*', '~');

const selector = parser.parse('a[href^=/], .container:has(nav) > a[href]:lt($var):nth-child(5)');
```

After:

```javascript
import {createParser} from 'css-selector-parser';

const parse = createParser({
    syntax: {
        pseudoClasses: {
            // In 1.x any pseudo-classes were accepted.
            // in 2.x parser only accepts known psuedo-classes unless `unknown: accept` was specified. 
            unknown: 'accept',
            definitions: {
                // This is a replacement for registerSelectorPseudos().
                Selector: ['has'],
                // This is a replacement for registerNumericPseudos().
                Formula: ['nth-child']
            }
        },
        // This is a replacement for registerNestingOperators().
        combinators: ['>', '+', '~'],
        attributes: {
            // This a replacement for registerAttrEqualityMods().
            // Note that equals sign ("=") is included into the operator definitions.
            operators: ['^=', '$=', '*=', '~=']
        }
    },
    // This is a replacement for enableSubstitutes()
    substitutes: true
});

const selector = parse('a[href^=/], .container:has(nav) > a[href]:lt($var):nth-child(5)');
```

* [All syntax definition options.](docs/interfaces/SyntaxDefinition.md)
* [All the psudo-class definition options.](docs/interfaces/SyntaxDefinition.md#pseudoclasses)
* [All the attribute definition options.](docs/interfaces/SyntaxDefinition.md#attributes)

#### Predefined CSS syntax definitions

You no longer need to make an extensive configuration of `css-selector-parser` in order to make it understand
the necessary CSS standards. You can now just define CSS/CSS selectors version directly:

```javascript
import {createParser} from 'css-selector-parser';

const parse = createParser({syntax: 'css3'});

const selector = parse('a[href^=/], .container:has(nav) > a[href]:nth-child(2n + 1)::before');
```

Here are the pre-defined CSS standards for your disposal:

* `css1`: https://www.w3.org/TR/CSS1/
* `css2`: https://www.w3.org/TR/CSS2/
* `css3`/`selectors-3`: https://www.w3.org/TR/selectors-3/
* `selectors-4`: https://www.w3.org/TR/selectors-4/
* `latest`: refers to `selectors-4`
* `progressive`: `latest` + accepts unknown psudo-classes, psudo-elements and attribute case sensitivity modifiers

#### Make sure you use proper `strict` value

CSS selector parser in modern browsers is very forgiving. For instance, it works fine with unclosed attribute
selectors: `"[attr=value"`. If you would like to mimic this behavior from browsers, set `strict` to `false`, i.e.:

```javascript
import {createParser} from 'css-selector-parser';

const parse = createParser({syntax: 'css3', strict: false});

const selector = parse(':lang(en'); // doesn't crash
```

#### Render is now a separate export

`render()` method used to be a method of `CssSelectorParser` class. Now it can be imported directly and used.

Example:

```javascript
import {createParser, render} from 'css-selector-parser';

const parse = createParser({syntax: 'progressive'});

const selector = parse('div#user-123.user:lang(en)::before');

console.log(render(selector)); // div#user-123.user:lang(en)::before
```

#### AST changes

AST had a lot of changes.

#### Selector

[New type info.](docs/interfaces/AstSelector.md)

1. Type changed: `selector` -> `Selector`.
2. Prop changed: `selectors` -> `rules`, also `selectors` contained `ruleSet[]`, which in turn has `rule` field,
   and new `rules` contains `Rule[]` directly.

Before: `{type: 'selector', selectors: [ {type: 'ruleSet', rule: {<RULE 1 DATA>}}, {type: 'ruleSet', rule: {<RULE 2 DATA>}} ]}`.

After: `{type: 'Selector', rules: [ {<RULE 1 DATA>}, {<RULE 2 DATA>} ]}`.

#### Rule

[New type info.](docs/interfaces/AstRule.md)

1. Type changed: `rule` -> `Rule`.
2. Prop changed: `id: string` -> `items: [{type: 'Id', name: '<ID>'}, ...]`. According to the CSS spec one rule may have
   more than 1 `id`, so `#root#root` is a valid selector.
3. Prop renamed: `nestingOperator` -> `combinator`. A proper name according to CSS spec was chosen.
4. Prop renamed: `rule` -> `nestedRule`. A proper name to indicate nesting was chosen.
5. Prop changed: `tagName: string` -> `items: [TagName | WildcardTag, ...]`. Using explicit distinction between
   TagName (i.e. `div`) and WildcardTag (`*`), because tag name can also be `*` if escaped properly (`\*`).
6. Prop changed: `attrs` -> `items: [<ATTRIBUTE>, ...]`. Attribute type was changed, see below.
7. Prop changed: `pseudos` -> `items: [<PSEUDO CLASS>, ...]`. There are pseudo-elements and pseudo-classes, now they are
   separated properly (there is a separate `pseudoElement` type). Pseudo class type was changed, see below.

Before:

```javascript
({
    type: 'rule',
    tagName: 'div',
    id: 'user-123',
    classNames: ['user'],
    attrs: [
        {name: 'role', operator: '$=', valueType: 'string', value: 'button'}
    ],
    pseudos: [
        {name: 'lang', valueType: 'string', value: 'en'}
    ],
    nestingOperator: '>'
})
```

After:

```javascript
({
    type: 'Rule',
    items: [
       {type: 'TagName', name: 'div'},
       {type: 'Id', name: 'user-123'},
       {type: 'ClassName', name: 'user'},
       {type: 'Attribute', name: 'role', operator: '$=', value: {type: 'String', value: 'button'}},
       {type: 'PseudoClass', name: 'lang', value: {type: 'String', value: 'en'}}
    ],
    combinator: '>'
})
```

#### Attribute

[New type info.](docs/interfaces/AstAttribute.md)

1. Type introduced: `Attribute`.
2. Prop `value` and `valueType` were combined to a single prop `value` with a field `type`.

[All possible value types.](docs/interfaces/AstAttribute.md#value)


##### Example 1

Before: `{name: 'role'}`.

After: `{type: 'Attribute', name: 'role'}`.

##### Example 2

Before: `{name: 'role', operator: '$=', valueType: 'string', value: 'button'}`.

After: `{type: 'Attribute', name: 'role', operator: '$=', value: {type: 'String', value: 'button'}}`.

##### Example 3

Before: `{name: 'role', operator: '=', valueType: 'substitute', value: 'var'}`.

After: `{type: 'Attribute', name: 'role', operator: '=', value: {type: 'Substitute', name: 'var'}}`.

#### Pseudo Classes

[New type info.](docs/interfaces/AstPseudoClass.md)

1. Type introduced: `PseudoClass`.
2. Prop `value` and `valueType` were combined to a single prop `argument` with a field `type`.

[All possible argument types.](docs/interfaces/AstPseudoClass.md#argument)

##### Example 1

Before: `{name: 'visited'}`.

After: `{type: 'PseudoClass', name: 'visited'}`.

##### Example 2

Before: `{name: 'lang', valueType: 'string', value: 'en'}`.

After: `{type: 'PseudoClass', name: 'lang', argument: {type: 'String', value: 'en'}}`.

##### Example 3

Before: `{name: 'lang', valueType: 'substitute', value: 'var'}`.

After: `{type: 'PseudoClass', name: 'lang', argument: {type: 'Substitute', name: 'var'}}`.

##### Example 4

Before: `{name: 'has', valueType: 'selector', value: {type: 'selector', selectors: [{type: 'ruleSet', rule: {type: 'rule', tagName: 'div'}}]}}`.

After: `{type: 'PseudoClass', name: 'has', argument: {type: 'Selector', rules: [{type: 'Rule', tag: {type: 'TagName', name: 'div'}}]}}`.

#### Pseudo Elements

[New type info.](docs/interfaces/AstPseudoElement.md)

1. Type introduced: `PseudoElement`.

[All possible argument types.](docs/interfaces/AstPseudoElement.md#argument)

### Features

* upgrade API in order to reflect upcoming complexity in CSS selectors ([cece4df](https://github.com/mdevils/css-selector-parser/commit/cece4dff647b19c6211dd6c9defbd7887eca62b5))

### [2.3.2](https://github.com/mdevils/css-selector-parser/compare/v2.3.1...v2.3.2) (2023-06-25)


### Bug Fixes

* fix foruma parsing with negative A, closes [#28](https://github.com/mdevils/css-selector-parser/issues/28) ([824312f](https://github.com/mdevils/css-selector-parser/commit/824312fc65a677a78699814ad222af3298afd772))
* include js file extension into the mjs build, closes [#22](https://github.com/mdevils/css-selector-parser/issues/22) ([f50b350](https://github.com/mdevils/css-selector-parser/commit/f50b350bd28db0085d4fc05a3f74475c812b05c3))
* rendering nested selectors with combinators, closes [#27](https://github.com/mdevils/css-selector-parser/issues/27) ([40fb434](https://github.com/mdevils/css-selector-parser/commit/40fb4345f3d720bf27e6d8a7809ee51e282bc512))

### [2.3.1](https://github.com/mdevils/css-selector-parser/compare/v2.3.0...v2.3.1) (2023-06-24)


### Bug Fixes

* fix file inclusion ([925b13a](https://github.com/mdevils/css-selector-parser/commit/925b13ad9bf26fcc9620df0678102c40a64fbb78))

## [2.3.0](https://github.com/mdevils/css-selector-parser/compare/v2.2.3...v2.3.0) (2023-06-24)


### Features

* publish hybrid package: CommonJS and ESM modules ([16fd8a1](https://github.com/mdevils/css-selector-parser/commit/16fd8a1b1b4b8bc2107ccba5b36b05ea1384b8c2))

## 2.2.1-2.2.3

* Update published docs.

## 2.2.0

* Full refactoring.
* Switch to typescript.
* Pre-defined CSS syntaxes were included.
* The whole AST was documented.

### Migrating from 1.x

#### `CssSelectorParser` -> `createParser`

In 1.x versions there was `CssSelectorParser` class which had to be contructed and then configured.
In 2.x versions there is `createParser()` function which returns a `parse()` function. All the configutation is passed
to `createParser()` params.

Before:

```javascript
var CssSelectorParser = require('css-selector-parser').CssSelectorParser,
parser = new CssSelectorParser();
parser.registerSelectorPseudos('has');
parser.registerNumericPseudos('nth-child');
parser.registerNestingOperators('>', '+', '~');
parser.registerAttrEqualityMods('^', '$', '*', '~');

const selector = parser.parse('a[href^=/], .container:has(nav) > a[href]:lt($var):nth-child(5)');
```

After:

```javascript
import {createParser} from 'css-selector-parser';

const parse = createParser({
    syntax: {
        pseudoClasses: {
            // In 1.x any pseudo-classes were accepted.
            // in 2.x parser only accepts known psuedo-classes unless `unknown: accept` was specified. 
            unknown: 'accept',
            definitions: {
                // This is a replacement for registerSelectorPseudos().
                Selector: ['has'],
                // This is a replacement for registerNumericPseudos().
                Formula: ['nth-child']
            }
        },
        // This is a replacement for registerNestingOperators().
        combinators: ['>', '+', '~'],
        attributes: {
            // This a replacement for registerAttrEqualityMods().
            // Note that equals sign ("=") is included into the operator definitions.
            operators: ['^=', '$=', '*=', '~=']
        }
    },
    // This is a replacement for enableSubstitutes()
    substitutes: true
});

const selector = parse('a[href^=/], .container:has(nav) > a[href]:lt($var):nth-child(5)');
```

* [All syntax definition options.](docs/interfaces/SyntaxDefinition.md)
* [All the psudo-class definition options.](docs/interfaces/SyntaxDefinition.md#pseudoclasses)
* [All the attribute definition options.](docs/interfaces/SyntaxDefinition.md#attributes)

#### Predefined CSS syntax definitions

You no longer need to make an extensive configuration of `css-selector-parser` in order to make it understand
the necessary CSS standards. You can now just define CSS/CSS selectors version directly:

```javascript
import {createParser} from 'css-selector-parser';

const parse = createParser({syntax: 'css3'});

const selector = parse('a[href^=/], .container:has(nav) > a[href]:nth-child(2n + 1)::before');
```

Here are the pre-defined CSS standards for your disposal:

* `css1`: https://www.w3.org/TR/CSS1/
* `css2`: https://www.w3.org/TR/CSS2/
* `css3`/`selectors-3`: https://www.w3.org/TR/selectors-3/
* `selectors-4`: https://www.w3.org/TR/selectors-4/
* `latest`: refers to `selectors-4`
* `progressive`: `latest` + accepts unknown psudo-classes, psudo-elements and attribute case sensitivity modifiers

#### Make sure you use proper `strict` value

CSS selector parser in modern browsers is very forgiving. For instance, it works fine with unclosed attribute
selectors: `"[attr=value"`. If you would like to mimic this behavior from browsers, set `strict` to `false`, i.e.:

```javascript
import {createParser} from 'css-selector-parser';

const parse = createParser({syntax: 'css3', strict: false});

const selector = parse(':lang(en'); // doesn't crash
```

#### Render is now a separate export

`render()` method used to be a method of `CssSelectorParser` class. Now it can be imported directly and used.

Example:

```javascript
import {createParser, render} from 'css-selector-parser';

const parse = createParser({syntax: 'progressive'});

const selector = parse('div#user-123.user:lang(en)');

console.log(render(selector)); // div#user-123.user:lang(en)
```

#### AST changes

AST had a lot of changes.

#### Selector

[New type info.](docs/interfaces/AstSelector.md)

1. Type changed: `selector` -> `Selector`.
2. Prop changed: `selectors` -> `rules`, also `selectors` contained `ruleSet[]`, which in turn has `rule` field,
   and new `rules` contains `Rule[]` directly.

Before: `{type: 'selector', selectors: [ {type: 'ruleSet', rule: {<RULE 1 DATA>}}, {type: 'ruleSet', rule: {<RULE 2 DATA>}} ]}`.

After: `{type: 'Selector', rules: [ {<RULE 1 DATA>}, {<RULE 2 DATA>} ]}`.

#### Rule

[New type info.](docs/interfaces/AstRule.md)

1. Type changed: `rule` -> `Rule`.
2. Prop changed: `id: string` -> `ids: string[]`. According to the CSS spec one rule may have more than 1 `id`,
   so `#root#root` is a valid selector.
3. Prop renamed: `nestingOperator` -> `combinator`. A proper name according to CSS spec was chosen.
4. Prop renamed: `rule` -> `nestedRule`. A proper name to indicate nesting was chosen.
5. Prop changed: `tagName: string` -> `tag: TagName | WildcardTag`. Using explicit distinction between
   TagName (i.e. `div`) and WildcardTag (`*`), because tag name can also be `*` if escaped properly (`\*`).
6. Prop changed: `attrs` -> `attributes`. Attribute type was changed, see below.
7. Prop changed: `pseudos` -> `pseudoClasses`. There are pseudo-elements and pseudo-classes, now they are separated
   properly (there is a separate `pseudoElement` property). Pseudo class type was changed, see below.

Before:

```javascript
({
    type: 'rule',
    tagName: 'div',
    id: 'user-123',
    classNames: ['user'],
    attrs: [
        {name: 'role', operator: '$=', valueType: 'string', value: 'button'}
    ],
    pseudos: [
        {name: 'lang', valueType: 'string', value: 'en'}
    ],
    nestingOperator: '>'
})
```

After:

```javascript
({
    type: 'Rule',
    tag: {type: 'TagName', name: 'div'},
    ids: ['user-123'],
    classNames: ['user'],
    attributes: [
        {type: 'Attribute', name: 'role', operator: '$=', value: {type: 'String', value: 'button'}}
    ],
    pseudoClasses: [
        {type: 'PseudoClass', name: 'lang', value: {type: 'String', value: 'en'}}
    ],
    combinator: '>'
})
```

#### Attribute

[New type info.](docs/interfaces/AstAttribute.md)

1. Type introduced: `Attribute`. 
2. Prop `value` and `valueType` were combined to a single prop `value` with a field `type`.

[All possible value types.](docs/interfaces/AstAttribute.md#value)


##### Example 1

Before: `{name: 'role'}`.

After: `{type: 'Attribute', name: 'role'}`.

##### Example 2

Before: `{name: 'role', operator: '$=', valueType: 'string', value: 'button'}`.

After: `{type: 'Attribute', name: 'role', operator: '$=', value: {type: 'String', value: 'button'}}`.

##### Example 3

Before: `{name: 'role', operator: '=', valueType: 'substitute', value: 'var'}`.

After: `{type: 'Attribute', name: 'role', operator: '=', value: {type: 'Substitute', name: 'var'}}`.

#### Pseudo Classes

[New type info.](docs/interfaces/AstPseudoClass.md)

1. Type introduced: `PseudoClass`.
2. Prop `value` and `valueType` were combined to a single prop `argument` with a field `type`.

[All possible argument types.](docs/interfaces/AstPseudoClass.md#argument)

##### Example 1

Before: `{name: 'visited'}`.

After: `{type: 'PseudoClass', name: 'visited'}`.

##### Example 2

Before: `{name: 'lang', valueType: 'string', value: 'en'}`.

After: `{type: 'PseudoClass', name: 'lang', argument: {type: 'String', value: 'en'}}`.

##### Example 3

Before: `{name: 'lang', valueType: 'substitute', value: 'var'}`.

After: `{type: 'PseudoClass', name: 'lang', argument: {type: 'Substitute', name: 'var'}}`.

##### Example 4

Before: `{name: 'has', valueType: 'selector', value: {type: 'selector', selectors: [{type: 'ruleSet', rule: {type: 'rule', tagName: 'div'}}]}}`.

After: `{type: 'PseudoClass', name: 'has', argument: {type: 'Selector', rules: [{type: 'Rule', tag: {type: 'TagName', name: 'div'}}]}}`.
