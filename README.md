css-selector-parser
===================

* Fast and low memory CSS selector parser.
* Parses CSS selector into object-model (AST).
* Compliant with all historical and modern CSS specs.
* Covered with tests.
* Documented.
* Supported CSS selector standards:
  * `css1`: https://www.w3.org/TR/CSS1/
  * `css2`: https://www.w3.org/TR/CSS2/
  * `css3`/`selectors-3`: https://www.w3.org/TR/selectors-3/
  * `selectors-4`: https://www.w3.org/TR/selectors-4/
  * `latest`: refers to `selectors-4`
  * `progressive`: `latest` + accepts unknown psudo-classes, psudo-elements and attribute case sensitivity modifiers

Installation
------------

```
npm install css-selector-parser
```

Usage
-----

### Parsing

```javascript
import {createParser} from 'css-selector-parser';

const parse = createParser();
const selector = parse('a[href^="/"], .container:has(nav) > a[href]:nth-child(2)');

console.log(selector);
```

Produces:

```javascript
({
  type: 'Selector',
  rules: [
    {
      tag: { type: 'TagName', name: 'a' },
      attributes: [
        {
          type: 'Attribute',
          name: 'href',
          operator: '^=',
          value: { type: 'String', value: '/' }
        }
      ],
      type: 'Rule'
    },
    {
      classNames: [ 'container' ],
      pseudoClasses: [
        {
          type: 'PseudoClass',
          name: 'has',
          argument: {
            type: 'Selector',
            rules: [ { tag: { type: 'TagName', name: 'nav' }, type: 'Rule' } ]
          }
        }
      ],
      type: 'Rule',
      nestedRule: {
        combinator: '>',
        rule: {
          tag: { type: 'TagName', name: 'a' },
          attributes: [ { type: 'Attribute', name: 'href' } ],
          pseudoClasses: [
            {
              type: 'PseudoClass',
              name: 'nth-child',
              argument: { type: 'Formula', a: 0, b: 2 }
            }
          ],
          type: 'Rule'
        }
      }
    }
  ]
})
```

### Constructing AST and rendering

```javascript
import {ast, render} from 'css-selector-parser';

const selector = ast.selector({
    rules: [
        ast.rule({
            tag: ast.tagName({name: 'a'}),
            attributes: [
                ast.attribute({name: 'href', operator: '^=', value: ast.string({value: '/'})})
            ]
        }),
        ast.rule({
            classNames: ['container'],
            pseudoClasses: [
                ast.pseudoClass({
                    name: 'has',
                    argument: ast.selector({
                        rules: [
                            ast.rule({tag: ast.tagName({name: 'nav'})})
                        ]
                    })
                })
            ],
            nestedRule: {
                combinator: '>',
                rule: ast.rule({
                    tag: ast.tagName({name: 'a'}),
                    attributes: [ast.attribute({name: 'href'})],
                    pseudoClasses: [
                        ast.pseudoClass({
                            name: 'nth-child',
                            argument: ast.formula({a: 0, b: 2})
                        })
                    ],
                    pseudoElement: 'before'
                })
            }
        })
    ]
});

console.log(render(selector)); // a[href^="/"], .container:has(nav) > a[href]:nth-child(2)::before
```

API
---

* [Full API Documentation](docs/modules.md)
* [Parsing CSS selectors](docs/modules.md#createParser)
* [Constructing CSS AST](docs/modules.md#ast)
* [Rendering CSS AST](docs/modules.md#render)

LICENSE
-------

MIT

Security contact information
----------------------------

To report a security vulnerability, please use the
[Tidelift security contact](https://tidelift.com/security). Tidelift will
coordinate the fix and disclosure.

`css-selector-parser` for enterprise
------------------------------

Available as part of the Tidelift Subscription

The maintainers of `css-selector-parser` and thousands of other packages are working with
Tidelift to deliver commercial support and maintenance for the open source
dependencies you use to build your applications. Save time, reduce risk, and
improve code health, while paying the maintainers of the exact dependencies you
use.
[Learn more.](https://tidelift.com/subscription/pkg/npm-css-selector-parser?utm_source=npm-css-selector-parser&utm_medium=referral&utm_campaign=enterprise)
