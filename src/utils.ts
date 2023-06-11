export function isIdentStart(c: string) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '-' || c === '_';
}

export function isIdent(c: string) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9') || c === '-' || c === '_';
}

export function isHex(c: string) {
    return (c >= 'a' && c <= 'f') || (c >= 'A' && c <= 'F') || (c >= '0' && c <= '9');
}

export const identSpecialChars: Record<string, boolean> = {
    '!': true,
    '"': true,
    '#': true,
    $: true,
    '%': true,
    '&': true,
    "'": true,
    '(': true,
    ')': true,
    '*': true,
    '+': true,
    ',': true,
    '.': true,
    '/': true,
    ';': true,
    '<': true,
    '=': true,
    '>': true,
    '?': true,
    '@': true,
    '[': true,
    '\\': true,
    ']': true,
    '^': true,
    '`': true,
    '{': true,
    '|': true,
    '}': true,
    '~': true
};

export const strReplacementsRev: Record<string, string> = {
    '\n': '\\n',
    '\r': '\\r',
    '\t': '\\t',
    '\f': '\\f',
    '\v': '\\v'
};

export const stringEscapeChars: Record<string, string> = {
    n: '\n',
    r: '\r',
    t: '\t',
    f: '\f',
    '\\': '\\'
};

export const whitespaceChars: Record<string, boolean> = {
    ' ': true,
    '\t': true,
    '\n': true,
    '\r': true,
    '\f': true
};

export const quoteChars: Record<string, boolean> = {
    '"': true,
    "'": true
};

export const digitsChars: Record<string, boolean> = {
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
    8: true,
    9: true
};

export function escapeIdentifier(s: string) {
    const len = s.length;
    let result = '';
    let i = 0;
    while (i < len) {
        const chr = s.charAt(i);
        if (identSpecialChars[chr]) {
            result += '\\' + chr;
        } else {
            if (
                !(
                    chr === '_' ||
                    chr === '-' ||
                    (chr >= 'A' && chr <= 'Z') ||
                    (chr >= 'a' && chr <= 'z') ||
                    (i !== 0 && chr >= '0' && chr <= '9')
                )
            ) {
                let charCode = chr.charCodeAt(0);
                if ((charCode & 0xf800) === 0xd800) {
                    const extraCharCode = s.charCodeAt(i++);
                    if ((charCode & 0xfc00) !== 0xd800 || (extraCharCode & 0xfc00) !== 0xdc00) {
                        throw Error('UCS-2(decode): illegal sequence');
                    }
                    charCode = ((charCode & 0x3ff) << 10) + (extraCharCode & 0x3ff) + 0x10000;
                }
                result += '\\' + charCode.toString(16) + ' ';
            } else {
                result += chr;
            }
        }
        i++;
    }
    return result.trim();
}

export function escapeStr(s: string) {
    const len = s.length;
    let result = '';
    let i = 0;
    let replacement: string;
    while (i < len) {
        let chr = s.charAt(i);
        if (chr === '"') {
            chr = '\\"';
        } else if (chr === '\\') {
            chr = '\\\\';
        } else if ((replacement = strReplacementsRev[chr]) !== undefined) {
            chr = replacement;
        }
        result += chr;
        i++;
    }
    return `"${result}"`;
}

export const escapePseudoClassString = (s: string) => s.replace(/([\\)])/g, '\\$1');
