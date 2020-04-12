import {Rule, SelectorEntity} from './selector';
import {escapeIdentifier, escapeStr} from './utils';

export function renderEntity(entity: SelectorEntity) {
    let res = '';
    switch (entity.type) {
        case 'ruleSet':
            let currentEntity: Rule | undefined = entity.rule;
            let parts = [];
            while (currentEntity) {
                if (currentEntity.nestingOperator) {
                    parts.push(currentEntity.nestingOperator);
                }
                parts.push(renderEntity(currentEntity));
                currentEntity = currentEntity.rule;
            }
            res = parts.join(' ');
            break;
        case 'selectors':
            res = entity.selectors.map(renderEntity).join(', ');
            break;
        case 'rule':
            if (entity.tagName) {
                if (entity.tagName === '*') {
                    res = '*';
                } else {
                    res = escapeIdentifier(entity.tagName);
                }
            }
            if (entity.id) {
                res += "#" + escapeIdentifier(entity.id);
            }
            if (entity.classNames) {
                res += entity.classNames.map((cn) => {
                    return "." + (escapeIdentifier(cn));
                }).join('');
            }
            if (entity.attrs) {
                res += entity.attrs.map((attr) => {
                    if ('operator' in attr) {
                        if (attr.valueType === 'substitute') {
                            return "[" + escapeIdentifier(attr.name) + attr.operator + "$" + attr.value + "]";
                        } else {
                            return "[" + escapeIdentifier(attr.name) + attr.operator + escapeStr(attr.value) + "]";
                        }
                    } else {
                        return "[" + escapeIdentifier(attr.name) + "]";
                    }
                }).join('');
            }
            if (entity.pseudos) {
                res += entity.pseudos.map((pseudo) => {
                    if (pseudo.valueType) {
                        if (pseudo.valueType === 'selector') {
                            return ":" + escapeIdentifier(pseudo.name) + "(" + renderEntity(pseudo.value) + ")";
                        } else if (pseudo.valueType === 'substitute') {
                            return ":" + escapeIdentifier(pseudo.name) + "($" + pseudo.value + ")";
                        } else if (pseudo.valueType === 'numeric') {
                            return ":" + escapeIdentifier(pseudo.name) + "(" + pseudo.value + ")";
                        } else {
                            return (
                                ":" + escapeIdentifier(pseudo.name) +
                                "(" + escapeIdentifier(pseudo.value) + ")"
                            );
                        }
                    } else {
                        return ":" + escapeIdentifier((pseudo as any).name);
                    }
                }).join('');
            }
            break;
        default:
            throw Error('Unknown entity type: "' + (entity as any).type + '".');
    }
    return res;
}
