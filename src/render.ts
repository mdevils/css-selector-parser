import {AstNamespaceName, AstNoNamespace, AstRule, AstSelector, AstSubstitution, AstWildcardNamespace} from './ast';
import {escapeIdentifier, escapePseudoClassString, escapeStr} from './utils';

function renderNamespace(namespace: AstNamespaceName | AstWildcardNamespace | AstNoNamespace) {
    if (namespace.type === 'WildcardNamespace') {
        return '*|';
    } else if (namespace.type === 'NamespaceName') {
        return `${escapeIdentifier(namespace.name)}|`;
    } else if (namespace.type === 'NoNamespace') {
        return '|';
    }
    throw new Error(`Unknown namespace type: ${(namespace as {type: string}).type}.`);
}

function renderSubstitution(sub: AstSubstitution) {
    return `$${escapeIdentifier(sub.name)}`;
}

function renderFormula(a: number, b: number) {
    if (a) {
        let result = `${a === 1 ? '' : a === -1 ? '-' : a}n`;
        if (b) {
            result += `${b > 0 ? '+' : ''}${b}`;
        }
        return result;
    } else {
        return String(b);
    }
}

/**
 * Renders CSS Selector AST back to a string.
 *
 * @example
 *
 * import {ast, render} from 'css-selector-parser';
 *
 * const selector = ast.selector({
 *     rules: [
 *         ast.rule({
 *             tag: ast.tagName({name: 'a'}),
 *             ids: ['user-23'],
 *             classNames: ['user'],
 *             pseudoClasses: [ast.pseudoClass({name: 'visited'})]
 *         })
 *     ]
 * });
 *
 * console.log(render(selector)); // a#user-23.user:visited
 */
export function render(entity: AstSelector | AstRule): string {
    if (entity.type === 'Selector') {
        return entity.rules.map(render).join(', ');
    }
    if (entity.type === 'Rule') {
        let result = '';
        const {tag, ids, classNames, attributes, pseudoClasses, pseudoElement, combinator, nestedRule} = entity;
        if (combinator) {
            result += `${combinator} `;
        }
        if (tag) {
            const namespace = tag.namespace;
            if (namespace) {
                result += renderNamespace(namespace);
            }
            if (tag.type === 'TagName') {
                result += escapeIdentifier(tag.name);
            } else if (tag.type === 'WildcardTag') {
                result += '*';
            } else {
                throw new Error(`Unknown tagName type: ${(tag as {type: string}).type}.`);
            }
        }
        if (ids) {
            for (const id of ids) {
                result += `#${escapeIdentifier(id)}`;
            }
        }
        if (classNames) {
            for (const className of classNames) {
                result += `.${escapeIdentifier(className)}`;
            }
        }
        if (attributes) {
            for (const {name, namespace, operator, value, caseSensitivityModifier} of attributes) {
                result += '[';
                if (namespace) {
                    result += renderNamespace(namespace);
                }
                result += escapeIdentifier(name);
                if (operator && value) {
                    result += operator;
                    if (value.type === 'String') {
                        result += escapeStr(value.value);
                    } else if (value.type === 'Substitution') {
                        result += renderSubstitution(value);
                    } else {
                        throw new Error(`Unknown attribute value type: ${(value as {type: string}).type}.`);
                    }
                    if (caseSensitivityModifier) {
                        result += ` ${escapeIdentifier(caseSensitivityModifier)}`;
                    }
                }
                result += ']';
            }
        }
        if (pseudoClasses) {
            for (const {name, argument} of pseudoClasses) {
                result += `:${escapeIdentifier(name)}`;
                if (argument) {
                    result += '(';
                    if (argument.type === 'Selector') {
                        result += render(argument);
                    } else if (argument.type === 'String') {
                        result += escapePseudoClassString(argument.value);
                    } else if (argument.type === 'Formula') {
                        result += renderFormula(argument.a, argument.b);
                    } else if (argument.type === 'FormulaOfSelector') {
                        result += renderFormula(argument.a, argument.b);
                        result += ' of ';
                        result += render(argument.selector);
                    } else if (argument.type === 'Substitution') {
                        result += renderSubstitution(argument);
                    } else {
                        throw new Error(`Unknown pseudo-class argument type: ${(argument as {type: string}).type}.`);
                    }
                    result += ')';
                }
            }
        }
        if (pseudoElement) {
            result += `::${escapeIdentifier(pseudoElement)}`;
        }
        if (nestedRule) {
            result += ` ${render(nestedRule)}`;
        }
        return result;
    }
    throw new Error('Render method accepts only Selector, Rule and RuleList.');
}
