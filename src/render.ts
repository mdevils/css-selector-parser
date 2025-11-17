import {AstEntity, AstNamespaceName, AstNoNamespace, AstSubstitution, AstWildcardNamespace} from './ast.js';
import {escapeIdentifier, escapeString} from './utils.js';

const errorPrefix = `css-selector-parser render error: `;

function renderNamespace(namespace: AstNamespaceName | AstWildcardNamespace | AstNoNamespace) {
    if (namespace.type === 'WildcardNamespace') {
        return '*|';
    } else if (namespace.type === 'NamespaceName') {
        return `${escapeIdentifier(namespace.name)}|`;
    } else if (namespace.type === 'NoNamespace') {
        return '|';
    }
    throw new Error(`${errorPrefix}Unknown namespace type: ${(namespace as {type: string}).type}.`);
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
 *             items: [
 *                 ast.tagName({name: 'a'}),
 *                 ast.id({name: 'user-23'}),
 *                 ast.className({name: 'user'}),
 *                 ast.pseudoClass({name: 'visited'}),
 *                 ast.pseudoElement({name: 'before'})
 *             ]
 *         })
 *     ]
 * });
 *
 * console.log(render(selector)); // a#user-23.user:visited::before
 */
export function render(entity: AstEntity): string {
    if (entity.type === 'Selector') {
        return entity.rules.map(render).join(', ');
    }
    if (entity.type === 'Rule') {
        let result = '';
        const {items, combinator, nestedRule} = entity;
        if (combinator) {
            result += `${combinator} `;
        }
        for (const item of items) {
            result += render(item);
        }
        if (nestedRule) {
            result += ` ${render(nestedRule)}`;
        }
        return result;
    } else if (entity.type === 'TagName' || entity.type === 'WildcardTag') {
        let result = '';
        const namespace = entity.namespace;
        if (namespace) {
            result += renderNamespace(namespace);
        }
        if (entity.type === 'TagName') {
            result += escapeIdentifier(entity.name);
        } else if (entity.type === 'WildcardTag') {
            result += '*';
        }
        return result;
    } else if (entity.type === 'Id') {
        return `#${escapeIdentifier(entity.name)}`;
    } else if (entity.type === 'ClassName') {
        return `.${escapeIdentifier(entity.name)}`;
    } else if (entity.type === 'NestingSelector') {
        return '&';
    } else if (entity.type === 'Attribute') {
        const {name, namespace, operator, value, caseSensitivityModifier} = entity;
        let result = '[';
        if (namespace) {
            result += renderNamespace(namespace);
        }
        result += escapeIdentifier(name);
        if (operator && value) {
            result += operator;
            if (value.type === 'String') {
                result += escapeString(value.value);
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
        return result;
    } else if (entity.type === 'PseudoClass') {
        const {name, argument} = entity;
        let result = `:${escapeIdentifier(name)}`;
        if (argument) {
            result += `(${argument.type === 'String' ? escapeIdentifier(argument.value) : render(argument)})`;
        }
        return result;
    } else if (entity.type === 'PseudoElement') {
        const {name, argument} = entity;
        let result = `::${escapeIdentifier(name)}`;
        if (argument) {
            result += `(${argument.type === 'String' ? escapeIdentifier(argument.value) : render(argument)})`;
        }
        return result;
    } else if (entity.type === 'String') {
        throw new Error(`${errorPrefix}String cannot be rendered outside of context.`);
    } else if (entity.type === 'Formula') {
        return renderFormula(entity.a, entity.b);
    } else if (entity.type === 'FormulaOfSelector') {
        return renderFormula(entity.a, entity.b) + ' of ' + render(entity.selector);
    } else if (entity.type === 'Substitution') {
        return `$${escapeIdentifier(entity.name)}`;
    }
    throw new Error(`Unknown type specified to render method: ${entity.type}.`);
}
