import {createParser, ast} from './import.js';

describe('CSS Modules', () => {
    describe('css-position-1', () => {
        it('should parse position-1 pseudo-classes when module is enabled', () => {
            const parse = createParser({
                modules: ['css-position-1']
            });

            expect(parse(':static')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [ast.pseudoClass({name: 'static'})]
                        })
                    ]
                })
            );

            expect(parse(':relative')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [ast.pseudoClass({name: 'relative'})]
                        })
                    ]
                })
            );

            expect(parse(':absolute')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [ast.pseudoClass({name: 'absolute'})]
                        })
                    ]
                })
            );

            // Should reject fixed as it's not in position-1
            const strictParse = createParser({
                modules: ['css-position-1'],
                syntax: {
                    pseudoClasses: {
                        unknown: 'reject'
                    }
                }
            });

            expect(() => strictParse(':fixed')).toThrow('Unknown pseudo-class: "fixed".');
        });
    });

    describe('css-position-2', () => {
        it('should parse position-2 pseudo-classes when module is enabled', () => {
            const parse = createParser({
                modules: ['css-position-2']
            });

            // Position-2 adds fixed
            expect(parse(':fixed')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [ast.pseudoClass({name: 'fixed'})]
                        })
                    ]
                })
            );

            // Should reject sticky as it's not in position-2
            const strictParse = createParser({
                modules: ['css-position-2'],
                syntax: {
                    pseudoClasses: {
                        unknown: 'reject'
                    }
                }
            });

            expect(() => strictParse(':sticky')).toThrow('Unknown pseudo-class: "sticky".');
        });
    });

    describe('css-position-3', () => {
        it('should parse position pseudo-classes when module is enabled', () => {
            const parse = createParser({
                modules: ['css-position-3']
            });

            expect(parse(':sticky')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [ast.pseudoClass({name: 'sticky'})]
                        })
                    ]
                })
            );

            expect(parse(':fixed')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [ast.pseudoClass({name: 'fixed'})]
                        })
                    ]
                })
            );

            expect(parse(':absolute')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [ast.pseudoClass({name: 'absolute'})]
                        })
                    ]
                })
            );
        });

        it('should reject position pseudo-classes when module is not enabled', () => {
            const parse = createParser({
                syntax: {
                    pseudoClasses: {
                        unknown: 'reject'
                    }
                }
            });

            expect(() => parse(':sticky')).toThrow('Unknown pseudo-class: "sticky".');
            expect(() => parse(':fixed')).toThrow('Unknown pseudo-class: "fixed".');
            expect(() => parse(':absolute')).toThrow('Unknown pseudo-class: "absolute".');
        });
    });

    describe('css-position-4', () => {
        it('should parse position-4 specific pseudo-classes', () => {
            const parse = createParser({
                modules: ['css-position-4']
            });

            expect(parse(':initial')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [ast.pseudoClass({name: 'initial'})]
                        })
                    ]
                })
            );
        });
    });

    describe('css-scoping-1', () => {
        it('should parse host and host-context pseudo-classes', () => {
            const parse = createParser({
                modules: ['css-scoping-1']
            });

            expect(parse(':host')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [ast.pseudoClass({name: 'host'})]
                        })
                    ]
                })
            );

            expect(parse(':host(.special)')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [
                                ast.pseudoClass({
                                    name: 'host',
                                    argument: ast.selector({
                                        rules: [
                                            ast.rule({
                                                items: [ast.className({name: 'special'})]
                                            })
                                        ]
                                    })
                                })
                            ]
                        })
                    ]
                })
            );

            expect(parse(':host-context(body.dark-theme)')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [
                                ast.pseudoClass({
                                    name: 'host-context',
                                    argument: ast.selector({
                                        rules: [
                                            ast.rule({
                                                items: [
                                                    ast.tagName({name: 'body'}),
                                                    ast.className({name: 'dark-theme'})
                                                ]
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

        it('should parse ::slotted pseudo-element', () => {
            const parse = createParser({
                modules: ['css-scoping-1']
            });

            expect(parse('::slotted(span)')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [
                                ast.pseudoElement({
                                    name: 'slotted',
                                    argument: ast.selector({
                                        rules: [
                                            ast.rule({
                                                items: [ast.tagName({name: 'span'})]
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

        it('should reject scoping selectors when feature is not enabled', () => {
            const parse = createParser({
                syntax: {
                    pseudoClasses: {
                        unknown: 'reject'
                    },
                    pseudoElements: {
                        unknown: 'reject'
                    }
                }
            });

            expect(() => parse(':host')).toThrow('Unknown pseudo-class: "host".');
            expect(() => parse(':host-context(body)')).toThrow('Unknown pseudo-class: "host-context".');
            expect(() => parse('::slotted(span)')).toThrow('Unknown pseudo-element "slotted".');
        });
    });

    describe('css-pseudo-4', () => {
        it('should parse pseudo-4 pseudo-classes', () => {
            const parse = createParser({
                modules: ['css-pseudo-4']
            });

            // Simple pseudo-classes
            expect(parse(':focus-visible')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [ast.pseudoClass({name: 'focus-visible'})]
                        })
                    ]
                })
            );

            expect(parse(':blank')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [ast.pseudoClass({name: 'blank'})]
                        })
                    ]
                })
            );

            // Functional pseudo-classes
            expect(parse(':has(> img)')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [
                                ast.pseudoClass({
                                    name: 'has',
                                    argument: ast.selector({
                                        rules: [
                                            ast.rule({
                                                items: [ast.tagName({name: 'img'})],
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

            expect(parse(':is(h1, h2, h3)')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [
                                ast.pseudoClass({
                                    name: 'is',
                                    argument: ast.selector({
                                        rules: [
                                            ast.rule({
                                                items: [ast.tagName({name: 'h1'})]
                                            }),
                                            ast.rule({
                                                items: [ast.tagName({name: 'h2'})]
                                            }),
                                            ast.rule({
                                                items: [ast.tagName({name: 'h3'})]
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

        it('should parse pseudo-4 pseudo-elements', () => {
            const parse = createParser({
                modules: ['css-pseudo-4']
            });

            // Simple pseudo-elements
            expect(parse('::marker')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [ast.pseudoElement({name: 'marker'})]
                        })
                    ]
                })
            );

            expect(parse('::selection')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [ast.pseudoElement({name: 'selection'})]
                        })
                    ]
                })
            );

            expect(parse('::target-text')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [ast.pseudoElement({name: 'target-text'})]
                        })
                    ]
                })
            );

            // String argument pseudo-elements
            expect(parse('::highlight(example)')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [
                                ast.pseudoElement({
                                    name: 'highlight',
                                    argument: ast.string({value: 'example'})
                                })
                            ]
                        })
                    ]
                })
            );

            // Selector argument pseudo-elements
            expect(parse('::part(button)')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [
                                ast.pseudoElement({
                                    name: 'part',
                                    argument: ast.selector({
                                        rules: [
                                            ast.rule({
                                                items: [ast.tagName({name: 'button'})]
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

        it('should reject pseudo-4 selectors when module is not enabled', () => {
            const parse = createParser({
                syntax: {
                    pseudoClasses: {
                        unknown: 'reject'
                    },
                    pseudoElements: {
                        unknown: 'reject'
                    }
                }
            });

            expect(() => parse(':focus-visible')).toThrow('Unknown pseudo-class: "focus-visible".');
            expect(() => parse(':has(> img)')).toThrow('Unknown pseudo-class: "has".');
            expect(() => parse('::marker')).toThrow('Unknown pseudo-element "marker".');
            expect(() => parse('::highlight(example)')).toThrow('Unknown pseudo-element "highlight".');
        });
    });

    describe('css-shadow-parts-1', () => {
        it('should parse ::part pseudo-element', () => {
            const parse = createParser({
                modules: ['css-shadow-parts-1']
            });

            expect(parse('::part(button)')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [
                                ast.pseudoElement({
                                    name: 'part',
                                    argument: ast.selector({
                                        rules: [
                                            ast.rule({
                                                items: [ast.tagName({name: 'button'})]
                                            })
                                        ]
                                    })
                                })
                            ]
                        })
                    ]
                })
            );

            expect(parse('::part(button-primary)')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [
                                ast.pseudoElement({
                                    name: 'part',
                                    argument: ast.selector({
                                        rules: [
                                            ast.rule({
                                                items: [ast.tagName({name: 'button-primary'})]
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

        it('should reject ::part when module is not enabled', () => {
            const parse = createParser({
                syntax: {
                    pseudoElements: {
                        unknown: 'reject'
                    }
                }
            });

            expect(() => parse('::part(button)')).toThrow('Unknown pseudo-element "part".');
        });
    });

    describe('Multiple modules', () => {
        it('should support multiple modules at once', () => {
            const parse = createParser({
                modules: ['css-position-3', 'css-scoping-1']
            });

            // Position pseudo-class
            expect(parse(':sticky')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [ast.pseudoClass({name: 'sticky'})]
                        })
                    ]
                })
            );

            // Scoping pseudo-class
            expect(parse(':host')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [ast.pseudoClass({name: 'host'})]
                        })
                    ]
                })
            );

            // Scoping pseudo-element
            expect(parse('::slotted(span)')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [
                                ast.pseudoElement({
                                    name: 'slotted',
                                    argument: ast.selector({
                                        rules: [
                                            ast.rule({
                                                items: [ast.tagName({name: 'span'})]
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

        it('should support combining css-position and css-pseudo modules', () => {
            const parse = createParser({
                modules: ['css-position-3', 'css-pseudo-4']
            });

            // Position pseudo-class
            expect(parse(':sticky')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [ast.pseudoClass({name: 'sticky'})]
                        })
                    ]
                })
            );

            // Pseudo-4 pseudo-element
            expect(parse('::marker')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [ast.pseudoElement({name: 'marker'})]
                        })
                    ]
                })
            );

            // Complex selector using both modules
            expect(parse('div:sticky:has(> img::marker)')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [
                                ast.tagName({name: 'div'}),
                                ast.pseudoClass({name: 'sticky'}),
                                ast.pseudoClass({
                                    name: 'has',
                                    argument: ast.selector({
                                        rules: [
                                            ast.rule({
                                                items: [
                                                    ast.tagName({name: 'img'}),
                                                    ast.pseudoElement({name: 'marker'})
                                                ],
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
    });

    describe('Syntax definition with modules', () => {
        it('should support modules defined in syntax definition', () => {
            const parse = createParser({
                syntax: {
                    baseSyntax: 'selectors-3',
                    pseudoClasses: {
                        unknown: 'reject'
                    },
                    pseudoElements: {
                        unknown: 'reject'
                    },
                    modules: ['css-position-4', 'css-shadow-parts-1']
                }
            });

            // Should parse position-4 pseudo-classes
            expect(parse(':initial')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [ast.pseudoClass({name: 'initial'})]
                        })
                    ]
                })
            );

            // Should parse shadow-parts-1 pseudo-elements
            expect(parse('::part(button)')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [
                                ast.pseudoElement({
                                    name: 'part',
                                    argument: ast.selector({
                                        rules: [
                                            ast.rule({
                                                items: [ast.tagName({name: 'button'})]
                                            })
                                        ]
                                    })
                                })
                            ]
                        })
                    ]
                })
            );

            // Should reject pseudo-classes not in the modules
            expect(() => parse(':focus-visible')).toThrow('Unknown pseudo-class: "focus-visible".');
        });

        it('should support latest syntax with all latest modules', () => {
            const parse = createParser({
                syntax: 'latest'
            });

            // Should parse position-4 pseudo-classes
            expect(parse(':initial')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [ast.pseudoClass({name: 'initial'})]
                        })
                    ]
                })
            );

            // Should parse shadow-parts-1 pseudo-elements
            expect(parse('::part(button)')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [
                                ast.pseudoElement({
                                    name: 'part',
                                    argument: ast.selector({
                                        rules: [
                                            ast.rule({
                                                items: [ast.tagName({name: 'button'})]
                                            })
                                        ]
                                    })
                                })
                            ]
                        })
                    ]
                })
            );

            // Should parse pseudo-4 pseudo-elements
            expect(parse('::marker')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [ast.pseudoElement({name: 'marker'})]
                        })
                    ]
                })
            );

            // Should parse scoping-1 pseudo-classes
            expect(parse(':host')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [ast.pseudoClass({name: 'host'})]
                        })
                    ]
                })
            );
        });
    });
});
