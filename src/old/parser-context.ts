import {AttrValueType, Rule, RulePseudoClass, RuleSet, Selector} from './selector';
import {
    doubleQuotesEscapeChars,
    identSpecialChars,
    isHex,
    isIdent,
    isIdentStart,
    singleQuoteEscapeChars
} from './utils';

export type PseudoSelectorType = 'numeric' | 'selector';

interface PartialRuleAttr {
    name: string;
    operator?: string;
    valueType?: AttrValueType;
    value?: string;
}

export function parseCssSelector(
    str: string,
    pos: number,
    pseudos: {[key: string]: PseudoSelectorType},
    attrEqualityMods: {[key: string]: true},
    ruleNestingOperators: {[key: string]: true},
    substitutesEnabled: boolean
) {
    const l = str.length;
    let chr: any = '';

    function getStr(quote: string, escapeTable: {[key: string]: string}) {
        let result = '';
        pos++;
        chr = str.charAt(pos);
        while (pos < l) {
            if (chr === quote) {
                pos++;
                return result;
            } else if (chr === '\\') {
                pos++;
                chr = str.charAt(pos);
                let esc;
                if (chr === quote) {
                    result += quote;
                } else if ((esc = escapeTable[chr]) !== undefined) {
                    result += esc;
                } else if (isHex(chr)) {
                    let hex = chr;
                    pos++;
                    chr = str.charAt(pos);
                    while (isHex(chr)) {
                        hex += chr;
                        pos++;
                        chr = str.charAt(pos);
                    }
                    if (chr === ' ') {
                        pos++;
                        chr = str.charAt(pos);
                    }
                    result += String.fromCharCode(parseInt(hex, 16));
                    continue;
                } else {
                    result += chr;
                }
            } else {
                result += chr;
            }
            pos++;
            chr = str.charAt(pos);
        }
        return result;
    }

    function getIdent() {
        let result = '';
        chr = str.charAt(pos);
        while (pos < l) {
            if (isIdent(chr)) {
                result += chr;
            } else if (chr === '\\') {
                pos++;
                if (pos >= l) {
                    throw Error('Expected symbol but end of file reached.');
                }
                chr = str.charAt(pos);
                if (identSpecialChars[chr]) {
                    result += chr;
                } else if (isHex(chr)) {
                    let hex = chr;
                    pos++;
                    chr = str.charAt(pos);
                    while (isHex(chr)) {
                        hex += chr;
                        pos++;
                        chr = str.charAt(pos);
                    }
                    if (chr === ' ') {
                        pos++;
                        chr = str.charAt(pos);
                    }
                    result += String.fromCharCode(parseInt(hex, 16));
                    continue;
                } else {
                    result += chr;
                }
            } else {
                return result;
            }
            pos++;
            chr = str.charAt(pos);
        }
        return result;
    }

    function skipWhitespace() {
        chr = str.charAt(pos);
        let result = false;
        while (chr === ' ' || chr === '\t' || chr === '\n' || chr === '\r' || chr === '\f') {
            result = true;
            pos++;
            chr = str.charAt(pos);
        }
        return result;
    }

    function parse() {
        const res = parseSelector();
        if (pos < l) {
            throw Error('Rule expected but "' + str.charAt(pos) + '" found.');
        }
        return res;
    }

    function parseSelector() {
        let selector = parseSingleSelector();
        if (!selector) {
            return null;
        }
        let res: Selector = selector;
        chr = str.charAt(pos);
        while (chr === ',') {
            pos++;
            skipWhitespace();
            if (res.type !== 'selectors') {
                res = {
                    type: 'selectors',
                    selectors: [selector]
                };
            }
            selector = parseSingleSelector();
            if (!selector) {
                throw Error('Rule expected after ",".');
            }
            res.selectors.push(selector);
        }
        return res;
    }

    function parseSingleSelector(): RuleSet | null {
        skipWhitespace();
        const selector: Partial<RuleSet> = {
            type: 'ruleSet'
        };
        let rule = parseRule();
        if (!rule) {
            return null;
        }
        let currentRule: Partial<RuleSet | Rule> = selector;
        while (rule) {
            rule.type = 'rule';
            currentRule.rule = rule;
            currentRule = rule;
            skipWhitespace();
            chr = str.charAt(pos);
            if (pos >= l || chr === ',' || chr === ')') {
                break;
            }
            if (ruleNestingOperators[chr]) {
                const op = chr;
                pos++;
                skipWhitespace();
                rule = parseRule();
                if (!rule) {
                    throw Error('Rule expected after "' + op + '".');
                }
                rule.nestingOperator = op;
            } else {
                rule = parseRule();
                if (rule) {
                    rule.nestingOperator = null;
                }
            }
        }
        return selector as RuleSet | null;
    }

    function parseRule(): Rule | null {
        let rule: Partial<Rule> | null = null;
        while (pos < l) {
            chr = str.charAt(pos);
            if (chr === '*') {
                pos++;
                (rule = rule || {}).tagName = '*';
            } else if (isIdentStart(chr) || chr === '\\') {
                (rule = rule || {}).tagName = getIdent();
            } else if (chr === '.') {
                pos++;
                rule = rule || {};
                (rule.classNames = rule.classNames || []).push(getIdent());
            } else if (chr === '#') {
                pos++;
                (rule = rule || {}).id = getIdent();
            } else if (chr === '[') {
                pos++;
                skipWhitespace();
                const attr: PartialRuleAttr = {
                    name: getIdent()
                };
                skipWhitespace();
                if (chr === ']') {
                    pos++;
                } else {
                    let operator = '';
                    if (attrEqualityMods[chr]) {
                        operator = chr;
                        pos++;
                        chr = str.charAt(pos);
                    }
                    if (pos >= l) {
                        throw Error('Expected "=" but end of file reached.');
                    }
                    if (chr !== '=') {
                        throw Error('Expected "=" but "' + chr + '" found.');
                    }
                    attr.operator = operator + '=';
                    pos++;
                    skipWhitespace();
                    let attrValue = '';
                    attr.valueType = 'string';
                    if (chr === '"') {
                        attrValue = getStr('"', doubleQuotesEscapeChars);
                    } else if (chr === "'") {
                        attrValue = getStr("'", singleQuoteEscapeChars);
                    } else if (substitutesEnabled && chr === '$') {
                        pos++;
                        attrValue = getIdent();
                        attr.valueType = 'substitute';
                    } else {
                        while (pos < l) {
                            if (chr === ']') {
                                break;
                            }
                            attrValue += chr;
                            pos++;
                            chr = str.charAt(pos);
                        }
                        attrValue = attrValue.trim();
                    }
                    skipWhitespace();
                    if (pos >= l) {
                        throw Error('Expected "]" but end of file reached.');
                    }
                    if (chr !== ']') {
                        throw Error('Expected "]" but "' + chr + '" found.');
                    }
                    pos++;
                    attr.value = attrValue;
                }
                rule = rule || {};
                (rule.attrs = rule.attrs || []).push(attr);
            } else if (chr === ':') {
                pos++;
                const pseudoName = getIdent();
                const pseudo: Partial<RulePseudoClass> = {
                    name: pseudoName
                };
                if (chr === '(') {
                    pos++;
                    let value: string | Selector | null = '';
                    skipWhitespace();
                    if (pseudos[pseudoName] === 'selector') {
                        pseudo.valueType = 'selector';
                        value = parseSelector() as any;
                    } else {
                        pseudo.valueType = pseudos[pseudoName] || 'string';
                        if (chr === '"') {
                            value = getStr('"', doubleQuotesEscapeChars);
                        } else if (chr === "'") {
                            value = getStr("'", singleQuoteEscapeChars);
                        } else if (substitutesEnabled && chr === '$') {
                            pos++;
                            value = getIdent();
                            pseudo.valueType = 'substitute';
                        } else {
                            while (pos < l) {
                                if (chr === ')') {
                                    break;
                                }
                                value += chr;
                                pos++;
                                chr = str.charAt(pos);
                            }
                            value = value.trim();
                        }
                        skipWhitespace();
                    }
                    if (pos >= l) {
                        throw Error('Expected ")" but end of file reached.');
                    }
                    if (chr !== ')') {
                        throw Error('Expected ")" but "' + chr + '" found.');
                    }
                    pos++;
                    pseudo.value = value as any;
                }
                rule = rule || {};
                (rule.pseudos = rule.pseudos || []).push(pseudo as RulePseudoClass);
            } else {
                break;
            }
        }
        return rule as Rule;
    }

    return parse();
}
