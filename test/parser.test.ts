import {createParser, ast} from './import.js';

describe('parse()', () => {
    const parse = createParser({
        syntax: 'progressive'
    });

    describe('Tag Names', () => {
        it('should parse a tag name', () => {
            expect(parse('div')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            tag: ast.tagName({name: 'div'})
                        })
                    ]
                })
            );
        });
        it('should parse a wildcard tag name', () => {
            expect(parse('*')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            tag: ast.wildcardTag()
                        })
                    ]
                })
            );
        });
        it('should parse an escaped star', () => {
            expect(parse('\\*')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            tag: ast.tagName({name: '*'})
                        })
                    ]
                })
            );
        });
        it('should properly parse an escaped tag name', () => {
            expect(parse('d\\ i\\ v')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            tag: ast.tagName({name: 'd i v'})
                        })
                    ]
                })
            );
        });
        it('should not be parsed after an attribute', () => {
            expect(() => parse('[href="#"]a')).toThrow('Unexpected tag/namespace start.');
        });
        it('should not be parsed after a pseudo-class', () => {
            expect(() => parse(':nth-child(2n)a')).toThrow('Unexpected tag/namespace start.');
        });
        it('should throw if not enabled', () => {
            expect(() => createParser({syntax: {}})('div')).toThrow('Tag names are not enabled.');
        });
        it('should throw if wildcard not enabled', () => {
            expect(() => createParser({syntax: {}})('*')).toThrow('Wildcard tag name is not enabled.');
        });
    });

    describe('Namespaces', () => {
        it('should parse a namespace name', () => {
            expect(parse('ns|div')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            tag: ast.tagName({name: 'div', namespace: ast.namespaceName({name: 'ns'})})
                        })
                    ]
                })
            );
        });
        it('should parse no namespace', () => {
            expect(parse('|div')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            tag: ast.tagName({name: 'div', namespace: ast.noNamespace()})
                        })
                    ]
                })
            );
        });
        it('should parse wildcard namespace', () => {
            expect(parse('*|div')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            tag: ast.tagName({name: 'div', namespace: ast.wildcardNamespace()})
                        })
                    ]
                })
            );
        });
        it('should parse a wildcard namespace with a wildcard tag name', () => {
            expect(parse('*|*')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            tag: ast.wildcardTag({namespace: ast.wildcardNamespace()})
                        })
                    ]
                })
            );
        });
        it('should parse an escaped star', () => {
            expect(parse('\\*|*')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            tag: ast.wildcardTag({namespace: ast.namespaceName({name: '*'})})
                        })
                    ]
                })
            );
        });
        it('should parse an escaped pipe', () => {
            expect(parse('\\|div')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            tag: ast.tagName({name: '|div'})
                        })
                    ]
                })
            );
        });
        it('should parse two escaped stars', () => {
            expect(parse('\\*|\\*')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            tag: ast.tagName({name: '*', namespace: ast.namespaceName({name: '*'})})
                        })
                    ]
                })
            );
        });
        it('should properly parse an escaped namespace name', () => {
            expect(parse('n\\ a\\ m|d\\ i\\ v')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            tag: ast.tagName({name: 'd i v', namespace: ast.namespaceName({name: 'n a m'})})
                        })
                    ]
                })
            );
        });
        it('should not be parsed after an attribute', () => {
            expect(() => parse('[href="#"]a|b')).toThrow('Unexpected tag/namespace start.');
        });
        it('should not be parsed after a pseudo-class', () => {
            expect(() => parse(':nth-child(2n)a|b')).toThrow('Unexpected tag/namespace start.');
        });
        it('should throw if not enabled', () => {
            expect(() => createParser({syntax: {tag: true}})('ns|div')).toThrow('Namespaces are not enabled.');
            expect(() => createParser({syntax: {tag: true}})('|div')).toThrow('Namespaces are not enabled.');
        });
        it('should throw if wildcard not enabled', () => {
            expect(() => createParser({syntax: {namespace: {wildcard: false}, tag: true}})('*|div')).toThrow(
                'Wildcard namespace is not enabled.'
            );
        });
        it('should throw if namespaces are enabled while tags are disabled', () => {
            expect(() => createParser({syntax: {namespace: true}})).toThrow(
                'Namespaces cannot be enabled while tags are disabled.'
            );
        });
    });

    describe('Class Names', () => {
        it('should parse a single class name', () => {
            expect(parse('.class')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            classNames: ['class']
                        })
                    ]
                })
            );
        });
        it('should parse multiple class names', () => {
            expect(parse('.class1.class2')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            classNames: ['class1', 'class2']
                        })
                    ]
                })
            );
        });
        it('should properly parse class names', () => {
            expect(parse('.cla\\ ss\\.name')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            classNames: ['cla ss.name']
                        })
                    ]
                })
            );
        });
        it('should parse after tag names', () => {
            expect(parse('div.class')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            tag: ast.tagName({name: 'div'}),
                            classNames: ['class']
                        })
                    ]
                })
            );
        });
        it('should parse after IDs', () => {
            expect(parse('#id.class')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            ids: ['id'],
                            classNames: ['class']
                        })
                    ]
                })
            );
        });
        it('should parse after an attribute', () => {
            expect(parse('[href].class')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            attributes: [ast.attribute({name: 'href'})],
                            classNames: ['class']
                        })
                    ]
                })
            );
        });
        it('should parse after a pseudo-class', () => {
            expect(parse(':link.class')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            pseudoClasses: [ast.pseudoClass({name: 'link'})],
                            classNames: ['class']
                        })
                    ]
                })
            );
        });
        it('should fail on empty class name', () => {
            expect(() => parse('.')).toThrow('Expected class name.');
        });
        it('should fail after pseudo-element', () => {
            expect(() => parse('::before.class')).toThrow(
                'Pseudo-element should be the last component of a CSS selector rule.'
            );
        });
        it('should fail if not enabled', () => {
            expect(() => createParser({syntax: {}})('.class')).toThrow('Class names are not enabled.');
        });
    });
    describe('IDs', () => {
        it('should parse a single ID', () => {
            expect(parse('#id')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            ids: ['id']
                        })
                    ]
                })
            );
        });
        it('should parse multiple IDs', () => {
            expect(parse('#id1#id2')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            ids: ['id1', 'id2']
                        })
                    ]
                })
            );
        });
        it('should properly parse IDs', () => {
            expect(parse('#id\\ name\\#\\ with\\ escapes')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            ids: ['id name# with escapes']
                        })
                    ]
                })
            );
        });
        it('should parse after a tag name', () => {
            expect(parse('div#id')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            tag: ast.tagName({name: 'div'}),
                            ids: ['id']
                        })
                    ]
                })
            );
        });
        it('should parse after a class name', () => {
            expect(parse('.class#id')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            ids: ['id'],
                            classNames: ['class']
                        })
                    ]
                })
            );
        });
        it('should parse mix of classes and ids', () => {
            expect(parse('.class1#id1.class2#id2')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            ids: ['id1', 'id2'],
                            classNames: ['class1', 'class2']
                        })
                    ]
                })
            );
        });
        it('should parse after an attribute', () => {
            expect(parse('[href]#id')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            attributes: [ast.attribute({name: 'href'})],
                            ids: ['id']
                        })
                    ]
                })
            );
        });
        it('should parse after a pseudo-class', () => {
            expect(parse(':link#id')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            pseudoClasses: [ast.pseudoClass({name: 'link'})],
                            ids: ['id']
                        })
                    ]
                })
            );
        });
        it('should fail on empty ID name', () => {
            expect(() => parse('#')).toThrow('Expected ID name.');
        });
        it('should fail after pseudo-element', () => {
            expect(() => parse('::before#id')).toThrow(
                'Pseudo-element should be the last component of a CSS selector rule.'
            );
        });
        it('should fail if not enabled', () => {
            expect(() => createParser({syntax: {}})('#id')).toThrow('IDs are not enabled.');
        });
    });
    describe('Attributes', () => {
        it('should parse a attribute', () => {
            expect(parse('[attr]')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            attributes: [ast.attribute({name: 'attr'})]
                        })
                    ]
                })
            );
        });
        it('should parse a attribute with comparison', () => {
            expect(parse('[attr=val]')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            attributes: [
                                ast.attribute({name: 'attr', operator: '=', value: ast.string({value: 'val'})})
                            ]
                        })
                    ]
                })
            );
        });
        it('should parse a attribute with multibyte comparison', () => {
            expect(parse('[attr|=val]')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            attributes: [
                                ast.attribute({name: 'attr', operator: '|=', value: ast.string({value: 'val'})})
                            ]
                        })
                    ]
                })
            );
        });
        it('should parse multiple attributes', () => {
            expect(parse('[attr1][attr2]')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            attributes: [ast.attribute({name: 'attr1'}), ast.attribute({name: 'attr2'})]
                        })
                    ]
                })
            );
        });
        it('should properly parse attribute names', () => {
            expect(parse('[attr\\ \\.name]')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            attributes: [ast.attribute({name: 'attr .name'})]
                        })
                    ]
                })
            );
        });
        it('should properly parse attribute values', () => {
            expect(parse('[attr=val\\ \\ue]')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            attributes: [
                                ast.attribute({
                                    name: 'attr',
                                    operator: '=',
                                    value: ast.string({
                                        value: 'val ue'
                                    })
                                })
                            ]
                        })
                    ]
                })
            );
        });
        it('should properly parse case sensitivity modifiers', () => {
            expect(parse('[attr=value \\i]')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            attributes: [
                                ast.attribute({
                                    name: 'attr',
                                    operator: '=',
                                    value: ast.string({
                                        value: 'value'
                                    }),
                                    caseSensitivityModifier: 'i'
                                })
                            ]
                        })
                    ]
                })
            );
        });
        it('should properly handle whitespace', () => {
            expect(parse('[ attr = value i ]')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            attributes: [
                                ast.attribute({
                                    name: 'attr',
                                    operator: '=',
                                    value: ast.string({
                                        value: 'value'
                                    }),
                                    caseSensitivityModifier: 'i'
                                })
                            ]
                        })
                    ]
                })
            );
        });
        it('should properly parse double quotes', () => {
            expect(parse('[ attr = "val\\"\\ue\\20" i ]')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            attributes: [
                                ast.attribute({
                                    name: 'attr',
                                    operator: '=',
                                    value: ast.string({
                                        value: 'val"ue '
                                    }),
                                    caseSensitivityModifier: 'i'
                                })
                            ]
                        })
                    ]
                })
            );
        });
        it('should properly parse single quotes', () => {
            expect(parse("[ attr = 'val\\'\\ue\\20' i ]")).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            attributes: [
                                ast.attribute({
                                    name: 'attr',
                                    operator: '=',
                                    value: ast.string({
                                        value: "val'ue "
                                    }),
                                    caseSensitivityModifier: 'i'
                                })
                            ]
                        })
                    ]
                })
            );
        });
        it('should fail if attribute name is empty', () => {
            expect(() => parse('[=1]')).toThrow('Expected attribute name.');
        });
        it('should fail if substitutions are not enabled', () => {
            expect(() => parse('[attr=$value]')).toThrow('Expected attribute value.');
        });
        it('should parse a substitution argument', () => {
            expect(
                createParser({
                    syntax: 'progressive',
                    substitutes: true
                })('[attr=$value]')
            ).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            attributes: [
                                ast.attribute({
                                    name: 'attr',
                                    operator: '=',
                                    value: ast.substitution({name: 'value'})
                                })
                            ]
                        })
                    ]
                })
            );
        });
        it('should parse a substitution argument with case sensitivity modifier', () => {
            expect(
                createParser({
                    syntax: 'progressive',
                    substitutes: true
                })('[attr=$value i]')
            ).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            attributes: [
                                ast.attribute({
                                    name: 'attr',
                                    operator: '=',
                                    value: ast.substitution({name: 'value'}),
                                    caseSensitivityModifier: 'i'
                                })
                            ]
                        })
                    ]
                })
            );
        });
        it('should parse after tag names', () => {
            expect(parse('div[attr]')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            tag: ast.tagName({name: 'div'}),
                            attributes: [ast.attribute({name: 'attr'})]
                        })
                    ]
                })
            );
        });
        it('should parse after IDs', () => {
            expect(parse('#id[attr]')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            ids: ['id'],
                            attributes: [ast.attribute({name: 'attr'})]
                        })
                    ]
                })
            );
        });
        it('should parse after classes', () => {
            expect(parse('.class[attr]')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            classNames: ['class'],
                            attributes: [ast.attribute({name: 'attr'})]
                        })
                    ]
                })
            );
        });
        it('should parse after a pseudo-class', () => {
            expect(parse(':link[attr]')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            pseudoClasses: [ast.pseudoClass({name: 'link'})],
                            attributes: [ast.attribute({name: 'attr'})]
                        })
                    ]
                })
            );
        });
        it('should parse a named namespace', () => {
            expect(parse('[ns|href]')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            attributes: [
                                ast.attribute({
                                    name: 'href',
                                    namespace: ast.namespaceName({name: 'ns'})
                                })
                            ]
                        })
                    ]
                })
            );
            expect(parse('[ns|href=value]')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            attributes: [
                                ast.attribute({
                                    name: 'href',
                                    operator: '=',
                                    value: ast.string({value: 'value'}),
                                    namespace: ast.namespaceName({name: 'ns'})
                                })
                            ]
                        })
                    ]
                })
            );
            expect(parse('[ns|href|=value]')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            attributes: [
                                ast.attribute({
                                    name: 'href',
                                    operator: '|=',
                                    value: ast.string({value: 'value'}),
                                    namespace: ast.namespaceName({name: 'ns'})
                                })
                            ]
                        })
                    ]
                })
            );
        });
        it('should parse a wildcard namespace', () => {
            expect(parse('[*|href]')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            attributes: [
                                ast.attribute({
                                    name: 'href',
                                    namespace: ast.wildcardNamespace()
                                })
                            ]
                        })
                    ]
                })
            );
            expect(parse('[*|href=value]')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            attributes: [
                                ast.attribute({
                                    name: 'href',
                                    operator: '=',
                                    value: ast.string({value: 'value'}),
                                    namespace: ast.wildcardNamespace()
                                })
                            ]
                        })
                    ]
                })
            );
            expect(parse('[*|href|=value]')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            attributes: [
                                ast.attribute({
                                    name: 'href',
                                    operator: '|=',
                                    value: ast.string({value: 'value'}),
                                    namespace: ast.wildcardNamespace()
                                })
                            ]
                        })
                    ]
                })
            );
        });
        it('should parse a no-namespace', () => {
            expect(parse('[|href]')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            attributes: [
                                ast.attribute({
                                    name: 'href',
                                    namespace: ast.noNamespace()
                                })
                            ]
                        })
                    ]
                })
            );
            expect(parse('[|href=value]')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            attributes: [
                                ast.attribute({
                                    name: 'href',
                                    operator: '=',
                                    value: ast.string({value: 'value'}),
                                    namespace: ast.noNamespace()
                                })
                            ]
                        })
                    ]
                })
            );
            expect(parse('[|href|=value]')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            attributes: [
                                ast.attribute({
                                    name: 'href',
                                    operator: '|=',
                                    value: ast.string({value: 'value'}),
                                    namespace: ast.noNamespace()
                                })
                            ]
                        })
                    ]
                })
            );
        });
        it('should fail on empty substitute name', () => {
            expect(() =>
                createParser({
                    syntax: 'progressive',
                    substitutes: true
                })('[attr=$]')
            ).toThrow('Expected substitute name.');
        });
        it('should fail if not enabled', () => {
            expect(() =>
                createParser({
                    syntax: {
                        baseSyntax: 'progressive',
                        attributes: false
                    }
                })('[attr]')
            ).toThrow('Attributes are not enabled.');
        });
        it('should fail if comparison operators are not defined', () => {
            expect(() =>
                createParser({
                    syntax: {
                        attributes: {
                            operators: []
                        }
                    }
                })('[attr=1]')
            ).toThrow('Expected a valid attribute selector operator.');
        });
        it('should fail if case sensitivity modifiers are not defined', () => {
            expect(() =>
                createParser({
                    syntax: {
                        attributes: {
                            operators: ['=']
                        }
                    }
                })('[attr=1 i]')
            ).toThrow('Attribute case sensitivity modifiers are not enabled.');
        });
        it('should fail if case sensitivity modifiers is specified without a comparison operator', () => {
            expect(() =>
                createParser({
                    syntax: {
                        attributes: {
                            unknownCaseSensitivityModifiers: 'accept'
                        }
                    }
                })('[attr i]')
            ).toThrow('Expected a valid attribute selector operator.');
        });
        it('should not fail if case unknown sensitivity modifiers are accepted', () => {
            expect(
                createParser({
                    syntax: {
                        attributes: {
                            operators: ['='],
                            unknownCaseSensitivityModifiers: 'accept'
                        }
                    }
                })('[attr=1 i]')
            ).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            attributes: [
                                ast.attribute({
                                    name: 'attr',
                                    operator: '=',
                                    value: ast.string({value: '1'}),
                                    caseSensitivityModifier: 'i'
                                })
                            ]
                        })
                    ]
                })
            );
        });
        it('should fail after pseudo-element', () => {
            expect(() => parse('::before[attr]')).toThrow(
                'Pseudo-element should be the last component of a CSS selector rule.'
            );
        });
    });
    describe('Pseudo Classes', () => {
        it('should parse a pseudo-class', () => {
            expect(parse(':link')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            pseudoClasses: [ast.pseudoClass({name: 'link'})]
                        })
                    ]
                })
            );
        });
        it('should parse multiple pseudo classes', () => {
            expect(parse(':link:visited')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            pseudoClasses: [ast.pseudoClass({name: 'link'}), ast.pseudoClass({name: 'visited'})]
                        })
                    ]
                })
            );
        });
        it('should properly parse pseudo classes', () => {
            expect(parse(':\\l\\69\\n\\6b')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            pseudoClasses: [ast.pseudoClass({name: 'link'})]
                        })
                    ]
                })
            );
        });
        it('should properly parse with 0n', () => {
            const sameFormulas = [
                ':nth-child(0n+5)',
                ':nth-child( 0n + 5 )',
                ':nth-child( 0n+5 )',
                ':nth-child(5)',
                ':nth-child( 5 )',
                ':nth-child( +5 )'
            ];
            for (const formula of sameFormulas) {
                expect(parse(formula)).toEqual(
                    ast.selector({
                        rules: [
                            ast.rule({
                                pseudoClasses: [
                                    ast.pseudoClass({
                                        name: 'nth-child',
                                        argument: ast.formula({a: 0, b: 5})
                                    })
                                ]
                            })
                        ]
                    })
                );
            }
        });
        it('should properly parse with 0n and negative B', () => {
            const sameFormulas = [
                ':nth-child(0n-5)',
                ':nth-child( 0n - 5 )',
                ':nth-child( 0n-5 )',
                ':nth-child(-5)',
                ':nth-child( -5 )',
                ':nth-child( -5 )'
            ];
            for (const formula of sameFormulas) {
                expect(parse(formula)).toEqual(
                    ast.selector({
                        rules: [
                            ast.rule({
                                pseudoClasses: [
                                    ast.pseudoClass({
                                        name: 'nth-child',
                                        argument: ast.formula({a: 0, b: -5})
                                    })
                                ]
                            })
                        ]
                    })
                );
            }
        });
        it('should properly parse with 0 B', () => {
            const sameFormulas = [
                ':nth-child(3n+0)',
                ':nth-child( 3\\n + 0 )',
                ':nth-child( 3\\6e+0 )',
                ':nth-child(3n)',
                ':nth-child( 3n )',
                ':nth-child( +3n )'
            ];
            for (const formula of sameFormulas) {
                expect(parse(formula)).toEqual(
                    ast.selector({
                        rules: [
                            ast.rule({
                                pseudoClasses: [
                                    ast.pseudoClass({
                                        name: 'nth-child',
                                        argument: ast.formula({a: 3, b: 0})
                                    })
                                ]
                            })
                        ]
                    })
                );
            }
        });
        it('should properly parse even', () => {
            const sameFormulas = [':nth-child(even)', ':nth-child( even )', ':nth-child( 2n )'];
            for (const formula of sameFormulas) {
                expect(parse(formula)).toEqual(
                    ast.selector({
                        rules: [
                            ast.rule({
                                pseudoClasses: [
                                    ast.pseudoClass({
                                        name: 'nth-child',
                                        argument: ast.formula({a: 2, b: 0})
                                    })
                                ]
                            })
                        ]
                    })
                );
            }
        });
        it('should properly parse odd', () => {
            const sameFormulas = [':nth-child( 2n + 1 )', ':nth-child( odd )', ':nth-child( odd )'];
            for (const formula of sameFormulas) {
                expect(parse(formula)).toEqual(
                    ast.selector({
                        rules: [
                            ast.rule({
                                pseudoClasses: [
                                    ast.pseudoClass({
                                        name: 'nth-child',
                                        argument: ast.formula({a: 2, b: 1})
                                    })
                                ]
                            })
                        ]
                    })
                );
            }
        });
        it('should properly handle whitespace', () => {
            expect(parse(':lang( en )')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            pseudoClasses: [
                                ast.pseudoClass({
                                    name: 'lang',
                                    argument: ast.string({
                                        value: 'en'
                                    })
                                })
                            ]
                        })
                    ]
                })
            );
        });
        it('should parse after tag names', () => {
            expect(parse('div:link')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            tag: ast.tagName({name: 'div'}),
                            pseudoClasses: [ast.pseudoClass({name: 'link'})]
                        })
                    ]
                })
            );
        });
        it('should parse after IDs', () => {
            expect(parse('#id:link')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            ids: ['id'],
                            pseudoClasses: [ast.pseudoClass({name: 'link'})]
                        })
                    ]
                })
            );
        });
        it('should parse after classes', () => {
            expect(parse('.class:link')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            classNames: ['class'],
                            pseudoClasses: [ast.pseudoClass({name: 'link'})]
                        })
                    ]
                })
            );
        });
        it('should parse nested selectors', () => {
            expect(parse(':not(:lang(en), div)')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            pseudoClasses: [
                                ast.pseudoClass({
                                    name: 'not',
                                    argument: ast.selector({
                                        rules: [
                                            ast.rule({
                                                pseudoClasses: [
                                                    ast.pseudoClass({
                                                        name: 'lang',
                                                        argument: ast.string({value: 'en'})
                                                    })
                                                ]
                                            }),
                                            ast.rule({
                                                tag: ast.tagName({name: 'div'})
                                            })
                                        ]
                                    })
                                })
                            ]
                        })
                    ]
                })
            );
        });
        it('should require a nested selector', () => {
            expect(() => parse(':not')).toThrow('Argument is required for pseudo-class "not".');
        });
        it('should properly handle optional values in pseudo-classes', () => {
            expect(parse(':current, :current(div)')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            pseudoClasses: [ast.pseudoClass({name: 'current'})]
                        }),
                        ast.rule({
                            pseudoClasses: [
                                ast.pseudoClass({
                                    name: 'current',
                                    argument: ast.selector({
                                        rules: [ast.rule({tag: ast.tagName({name: 'div'})})]
                                    })
                                })
                            ]
                        })
                    ]
                })
            );
        });
        it('should parse after a pseudo-class', () => {
            expect(parse(':link:hover')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            pseudoClasses: [ast.pseudoClass({name: 'link'}), ast.pseudoClass({name: 'hover'})]
                        })
                    ]
                })
            );
        });
        it('should parse a substitution argument', () => {
            expect(
                createParser({
                    syntax: 'progressive',
                    substitutes: true
                })(':nth-child($formula)')
            ).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            pseudoClasses: [
                                ast.pseudoClass({name: 'nth-child', argument: ast.substitution({name: 'formula'})})
                            ]
                        })
                    ]
                })
            );
        });
        it('should parse a relative nested selector', () => {
            expect(parse(':has(>div)')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            pseudoClasses: [
                                ast.pseudoClass({
                                    name: 'has',
                                    argument: ast.selector({
                                        rules: [
                                            ast.rule({
                                                tag: ast.tagName({name: 'div'}),
                                                combinator: '>'
                                            })
                                        ]
                                    })
                                })
                            ]
                        })
                    ]
                })
            );
        });
        it('should fail on empty substitute name', () => {
            expect(() =>
                createParser({
                    syntax: 'progressive',
                    substitutes: true
                })(':nth-child($)')
            ).toThrow('Expected substitute name.');
        });
        it('should fail if name is empty', () => {
            expect(() => parse(':')).toThrow('Expected pseudo-class name.');
        });
        it('should fail if argument was not specified', () => {
            expect(() => parse(':lang')).toThrow('Argument is required for pseudo-class "lang".');
        });
        it('should fail if required argument is empty', () => {
            expect(() => parse(':lang()')).toThrow('Expected pseudo-class argument value.');
        });
        it('should fail if unknown', () => {
            expect(() => createParser({syntax: {pseudoClasses: {}}})(':lang')).toThrow('Unknown pseudo-class: "lang".');
            expect(() => createParser({syntax: {pseudoClasses: {unknown: 'reject'}}})(':lang')).toThrow(
                'Unknown pseudo-class: "lang".'
            );
        });
        it('should parse unknown when enabled', () => {
            expect(createParser({syntax: {pseudoClasses: {unknown: 'accept'}}})(':lang')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            pseudoClasses: [
                                ast.pseudoClass({
                                    name: 'lang'
                                })
                            ]
                        })
                    ]
                })
            );
        });
        it('should parse unknown with string value when enabled', () => {
            expect(createParser({syntax: {pseudoClasses: {unknown: 'accept'}}})(':lang(en)')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            pseudoClasses: [
                                ast.pseudoClass({
                                    name: 'lang',
                                    argument: ast.string({value: 'en'})
                                })
                            ]
                        })
                    ]
                })
            );
        });
        it('should fail after pseudo-element', () => {
            expect(() => parse('::before:link')).toThrow(
                'Pseudo-element should be the last component of a CSS selector rule.'
            );
        });
        it('should fail if not enabled', () => {
            expect(() => createParser({syntax: {}})(':lang')).toThrow('Pseudo classes are not enabled.');
        });
    });
    describe('Pseudo Elements', () => {
        it('should parse a pseudo-class', () => {
            expect(parse('::before')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            pseudoElement: 'before'
                        })
                    ]
                })
            );
        });
        it('should parse a pseudo-class starting with a single colon', () => {
            expect(parse(':before')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            pseudoElement: 'before'
                        })
                    ]
                })
            );
        });
        it('should properly parse pseudo elements', () => {
            expect(parse('::\\62 e\\66o\\72 e')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            pseudoElement: 'before'
                        })
                    ]
                })
            );
        });
        it('should parse after tag names', () => {
            expect(parse('div::before')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            tag: ast.tagName({name: 'div'}),
                            pseudoElement: 'before'
                        })
                    ]
                })
            );
        });
        it('should parse after IDs', () => {
            expect(parse('#id::before')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            ids: ['id'],
                            pseudoElement: 'before'
                        })
                    ]
                })
            );
        });
        it('should parse after an attribute', () => {
            expect(parse('[attr]::before')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            attributes: [ast.attribute({name: 'attr'})],
                            pseudoElement: 'before'
                        })
                    ]
                })
            );
        });
        it('should parse unknown when enabled', () => {
            expect(createParser({syntax: {pseudoElements: {unknown: 'accept'}}})('::before')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            pseudoElement: 'before'
                        })
                    ]
                })
            );
        });
        it('should fail on empty pseudo-element name', () => {
            expect(() => parse('::')).toThrow('Expected pseudo-element name.');
        });
        it('should fail on unknown pseudo elements', () => {
            expect(() => createParser({syntax: {pseudoElements: {}}})('::before')).toThrow(
                'Unknown pseudo-element "before".'
            );
            expect(() => createParser({syntax: {pseudoElements: {unknown: 'reject'}}})('::before')).toThrow(
                'Unknown pseudo-element "before".'
            );
        });
        it('should fail after pseudo-element', () => {
            expect(() => parse('::before::before')).toThrow(
                'Pseudo-element should be the last component of a CSS selector rule.'
            );
        });
        it('should fail if not enabled', () => {
            expect(() => createParser({syntax: {}})('::before')).toThrow('Pseudo elements are not enabled.');
        });
    });
    describe('Multiple rules', () => {
        it('should parse multiple rules', () => {
            expect(parse('div,.class')).toEqual(
                ast.selector({
                    rules: [ast.rule({tag: ast.tagName({name: 'div'})}), ast.rule({classNames: ['class']})]
                })
            );
        });
        it('should properly handle whitespace', () => {
            expect(parse('  div  ,  .class  ')).toEqual(
                ast.selector({
                    rules: [ast.rule({tag: ast.tagName({name: 'div'})}), ast.rule({classNames: ['class']})]
                })
            );
        });
        it('should fail if a rule is missing', () => {
            expect(() => parse('div, .class,')).toThrow('Expected rule but end of input reached.');
        });
        it('should fail if a rule starts incorrectly', () => {
            expect(() => parse('div, .class, $')).toThrow('Expected rule but "$" found.');
        });
    });
    describe('Nested rules', () => {
        it('should parse nested rules', () => {
            expect(parse('div .class')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            tag: ast.tagName({name: 'div'}),
                            nestedRule: ast.rule({classNames: ['class']})
                        })
                    ]
                })
            );
        });
        it('should parse nested rules with a combinator', () => {
            expect(parse('div>.class')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            tag: ast.tagName({name: 'div'}),
                            nestedRule: ast.rule({classNames: ['class'], combinator: '>'})
                        })
                    ]
                })
            );
        });
        it('should properly parse nested rules with whitespaces', () => {
            expect(parse('   div   >   .class   ')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            tag: ast.tagName({name: 'div'}),
                            nestedRule: ast.rule({classNames: ['class'], combinator: '>'})
                        })
                    ]
                })
            );
        });
        it('should parse nested rules with a multichar combinator', () => {
            expect(parse('div||.class')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            tag: ast.tagName({name: 'div'}),
                            nestedRule: ast.rule({classNames: ['class'], combinator: '||'})
                        })
                    ]
                })
            );
        });
        it('should parse nested rules with a multichar combinator with whitespaces', () => {
            expect(parse('   div   ||   .class   ')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            tag: ast.tagName({name: 'div'}),
                            nestedRule: ast.rule({classNames: ['class'], combinator: '||'})
                        })
                    ]
                })
            );
        });
        it('should fail if no combinators were defined', () => {
            expect(() => createParser({syntax: {tag: true}})('div>span')).toThrow('Expected rule but ">" found.');
        });
    });
});
