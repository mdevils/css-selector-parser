# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.3.0](https://github.com/mdevils/css-selector-parser/compare/v2.2.3...v2.3.0) (2023-06-24)


### Features

* publish hybrid package: CommonJS and ESM modules ([16fd8a1](https://github.com/mdevils/css-selector-parser/commit/16fd8a1b1b4b8bc2107ccba5b36b05ea1384b8c2))

### 2.2.1-2.2.3

* Update published docs.

### 2.2.0

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
