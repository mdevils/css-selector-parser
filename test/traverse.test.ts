import {createParser, traverse, ast} from './import.js';

describe('traverse', () => {
    const parse = createParser();

    describe('basic traversal', () => {
        it('should visit all nodes in simple selector', () => {
            const selector = parse('div.foo');
            const visited: string[] = [];

            traverse(selector, (node) => {
                visited.push(node.type);
            });

            expect(visited).toEqual(['Selector', 'Rule', 'TagName', 'ClassName']);
        });

        it('should visit all nodes in complex selector', () => {
            const selector = parse('div#id.foo[href]:hover::before');
            const visited: string[] = [];

            traverse(selector, (node) => {
                visited.push(node.type);
            });

            expect(visited).toEqual([
                'Selector',
                'Rule',
                'TagName',
                'Id',
                'ClassName',
                'Attribute',
                'PseudoClass',
                'PseudoElement'
            ]);
        });

        it('should visit all nodes with nested rules', () => {
            const selector = parse('div > span + a');
            const visited: string[] = [];

            traverse(selector, (node) => {
                visited.push(node.type);
            });

            expect(visited).toEqual(['Selector', 'Rule', 'TagName', 'Rule', 'TagName', 'Rule', 'TagName']);
        });

        it('should visit all nodes with multiple rules', () => {
            const selector = parse('div, span');
            const visited: string[] = [];

            traverse(selector, (node) => {
                visited.push(node.type);
            });

            expect(visited).toEqual(['Selector', 'Rule', 'TagName', 'Rule', 'TagName']);
        });
    });

    describe('enter/exit hooks', () => {
        it('should call enter and exit in correct order', () => {
            const selector = parse('div.foo');
            const events: string[] = [];

            traverse(selector, {
                enter(node) {
                    events.push(`enter:${node.type}`);
                },
                exit(node) {
                    events.push(`exit:${node.type}`);
                }
            });

            expect(events).toEqual([
                'enter:Selector',
                'enter:Rule',
                'enter:TagName',
                'exit:TagName',
                'enter:ClassName',
                'exit:ClassName',
                'exit:Rule',
                'exit:Selector'
            ]);
        });

        it('should work with only enter hook', () => {
            const selector = parse('div');
            const visited: string[] = [];

            traverse(selector, {
                enter(node) {
                    visited.push(node.type);
                }
            });

            expect(visited).toEqual(['Selector', 'Rule', 'TagName']);
        });

        it('should work with only exit hook', () => {
            const selector = parse('div');
            const visited: string[] = [];

            traverse(selector, {
                exit(node) {
                    visited.push(node.type);
                }
            });

            expect(visited).toEqual(['TagName', 'Rule', 'Selector']);
        });
    });

    describe('context information', () => {
        it('should provide parent information', () => {
            const selector = parse('div.foo');
            const parents: Array<string | undefined> = [];

            traverse(selector, (node, context) => {
                parents.push(context.parent?.type);
            });

            expect(parents).toEqual([undefined, 'Selector', 'Rule', 'Rule']);
        });

        it('should provide parents array', () => {
            const selector = parse('div.foo');
            let deepestParents: string[] = [];

            traverse(selector, (node, context) => {
                if (node.type === 'ClassName') {
                    deepestParents = context.parents.map((p) => p.type);
                }
            });

            expect(deepestParents).toEqual(['Selector', 'Rule']);
        });

        it('should provide key information', () => {
            const selector = parse('div.foo > span');
            const keys: Array<string | undefined> = [];

            traverse(selector, (node, context) => {
                keys.push(context.key);
            });

            expect(keys).toEqual([
                undefined, // Selector (root)
                'rules', // Rule
                'items', // TagName
                'items', // ClassName
                'nestedRule', // Rule
                'items' // TagName
            ]);
        });

        it('should provide index information for array items', () => {
            const selector = parse('div.foo.bar');
            const indices: Array<number | undefined> = [];

            traverse(selector, (node, context) => {
                indices.push(context.index);
            });

            expect(indices).toEqual([
                undefined, // Selector
                0, // Rule (first in rules array)
                0, // TagName (first in items)
                1, // ClassName foo (second in items)
                2 // ClassName bar (third in items)
            ]);
        });
    });

    describe('skipping children', () => {
        it('should skip children when visitor returns false', () => {
            const selector = parse('div.foo > span.bar');
            const visited: string[] = [];

            traverse(selector, (node) => {
                visited.push(node.type);
                if (node.type === 'Rule') {
                    return false; // Skip children of Rule nodes (including items and nestedRule)
                }
            });

            expect(visited).toEqual(['Selector', 'Rule']);
        });

        it('should skip children with enter hook returning false', () => {
            const selector = parse('div.foo > span.bar');
            const visited: string[] = [];

            traverse(selector, {
                enter(node) {
                    visited.push(`enter:${node.type}`);
                    if (node.type === 'Rule') {
                        return false;
                    }
                },
                exit(node) {
                    visited.push(`exit:${node.type}`);
                }
            });

            expect(visited).toEqual(['enter:Selector', 'enter:Rule', 'exit:Rule', 'exit:Selector']);
        });
    });

    describe('pseudo-class arguments', () => {
        it('should traverse selector arguments', () => {
            const selector = parse('.container:has(div.inner)');
            const visited: string[] = [];

            traverse(selector, (node) => {
                visited.push(node.type);
            });

            expect(visited).toEqual([
                'Selector',
                'Rule',
                'ClassName',
                'PseudoClass',
                'Selector',
                'Rule',
                'TagName',
                'ClassName'
            ]);
        });

        it('should traverse string arguments', () => {
            const selector = parse(':lang(en)');
            const visited: string[] = [];

            traverse(selector, (node) => {
                visited.push(node.type);
            });

            expect(visited).toEqual(['Selector', 'Rule', 'PseudoClass', 'String']);
        });

        it('should traverse formula arguments', () => {
            const selector = parse(':nth-child(2n+1)');
            const visited: string[] = [];

            traverse(selector, (node) => {
                visited.push(node.type);
            });

            expect(visited).toEqual(['Selector', 'Rule', 'PseudoClass', 'Formula']);
        });

        it('should traverse formula-of-selector arguments', () => {
            const selector = parse(':nth-child(2n+1 of div.foo)');
            const visited: string[] = [];

            traverse(selector, (node) => {
                visited.push(node.type);
            });

            expect(visited).toEqual([
                'Selector',
                'Rule',
                'PseudoClass',
                'FormulaOfSelector',
                'Rule',
                'TagName',
                'ClassName'
            ]);
        });
    });

    describe('pseudo-element arguments', () => {
        it('should traverse pseudo-element selector arguments', () => {
            const selector = parse('::slotted(div)');
            const visited: string[] = [];

            traverse(selector, (node) => {
                visited.push(node.type);
            });

            expect(visited).toEqual(['Selector', 'Rule', 'PseudoElement', 'Selector', 'Rule', 'TagName']);
        });

        it('should traverse pseudo-element string arguments', () => {
            const selector = parse('::part(foo)');
            const visited: string[] = [];

            traverse(selector, (node) => {
                visited.push(node.type);
            });

            expect(visited).toEqual(['Selector', 'Rule', 'PseudoElement', 'String']);
        });
    });

    describe('namespaces', () => {
        it('should traverse tag namespaces', () => {
            const selector = parse('ns|div');
            const visited: string[] = [];

            traverse(selector, (node) => {
                visited.push(node.type);
            });

            expect(visited).toEqual(['Selector', 'Rule', 'TagName', 'NamespaceName']);
        });

        it('should traverse wildcard tag namespaces', () => {
            const selector = parse('ns|*');
            const visited: string[] = [];

            traverse(selector, (node) => {
                visited.push(node.type);
            });

            expect(visited).toEqual(['Selector', 'Rule', 'WildcardTag', 'NamespaceName']);
        });

        it('should traverse attribute namespaces', () => {
            const selector = parse('[ns|attr]');
            const visited: string[] = [];

            traverse(selector, (node) => {
                visited.push(node.type);
            });

            expect(visited).toEqual(['Selector', 'Rule', 'Attribute', 'NamespaceName']);
        });
    });

    describe('attribute values', () => {
        it('should traverse string attribute values', () => {
            const selector = parse('[href="test"]');
            const visited: string[] = [];

            traverse(selector, (node) => {
                visited.push(node.type);
            });

            expect(visited).toEqual(['Selector', 'Rule', 'Attribute', 'String']);
        });

        it('should traverse substitution attribute values', () => {
            const selector = ast.selector({
                rules: [
                    ast.rule({
                        items: [
                            ast.attribute({
                                name: 'href',
                                operator: '=',
                                value: ast.substitution({name: 'url'})
                            })
                        ]
                    })
                ]
            });
            const visited: string[] = [];

            traverse(selector, (node) => {
                visited.push(node.type);
            });

            expect(visited).toEqual(['Selector', 'Rule', 'Attribute', 'Substitution']);
        });
    });

    describe('practical use cases', () => {
        it('should collect all class names', () => {
            const selector = parse('div.foo.bar > span.baz, a.qux');
            const classNames: string[] = [];

            traverse(selector, (node) => {
                if (node.type === 'ClassName') {
                    classNames.push(node.name);
                }
            });

            expect(classNames).toEqual(['foo', 'bar', 'baz', 'qux']);
        });

        it('should collect all IDs', () => {
            const selector = parse('div#foo > span#bar, a#baz');
            const ids: string[] = [];

            traverse(selector, (node) => {
                if (node.type === 'Id') {
                    ids.push(node.name);
                }
            });

            expect(ids).toEqual(['foo', 'bar', 'baz']);
        });

        it('should count specific node types', () => {
            const selector = parse('div.foo > span.bar.baz + a.qux');
            const counts: Record<string, number> = {};

            traverse(selector, (node) => {
                counts[node.type] = (counts[node.type] || 0) + 1;
            });

            expect(counts).toMatchObject({
                Selector: 1,
                Rule: 3,
                TagName: 3,
                ClassName: 4
            });
        });

        it('should find deeply nested selectors', () => {
            const selector = parse(':not(:has(div:not(span)))');
            let deepestLevel = 0;

            traverse(selector, (node, context) => {
                deepestLevel = Math.max(deepestLevel, context.parents.length);
            });

            expect(deepestLevel).toBeGreaterThan(5);
        });

        it('should validate selector structure', () => {
            const selector = parse('div.foo::before');
            const pseudoElements: string[] = [];

            traverse(selector, (node) => {
                if (node.type === 'PseudoElement') {
                    pseudoElements.push(node.name);
                }
            });

            expect(pseudoElements).toEqual(['before']);
        });
    });

    describe('edge cases', () => {
        it('should handle empty selector rules', () => {
            const selector = ast.selector({rules: []});
            const visited: string[] = [];

            traverse(selector, (node) => {
                visited.push(node.type);
            });

            expect(visited).toEqual(['Selector']);
        });

        it('should handle rule with no items', () => {
            const selector = ast.selector({
                rules: [ast.rule({items: []})]
            });
            const visited: string[] = [];

            traverse(selector, (node) => {
                visited.push(node.type);
            });

            expect(visited).toEqual(['Selector', 'Rule']);
        });

        it('should handle nesting selector', () => {
            const selector = ast.selector({
                rules: [
                    ast.rule({
                        items: [ast.nestingSelector(), ast.className({name: 'foo'})]
                    })
                ]
            });
            const visited: string[] = [];

            traverse(selector, (node) => {
                visited.push(node.type);
            });

            expect(visited).toEqual(['Selector', 'Rule', 'NestingSelector', 'ClassName']);
        });
    });
});
