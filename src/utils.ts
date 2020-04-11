export function isIdentStart(c: string) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c === '-') || (c === '_');
}

export function isIdent(c: string) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9') || c === '-' || c === '_';
}

export function isHex(c: string) {
    return (c >= 'a' && c <= 'f') || (c >= 'A' && c <= 'F') || (c >= '0' && c <= '9');
}

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
                    chr === '_' || chr === '-' ||
                    (chr >= 'A' && chr <= 'Z') ||
                    (chr >= 'a' && chr <= 'z') ||
                    (i !== 0 && chr >= '0' && chr <= '9')
                )
            ) {
                let charCode = chr.charCodeAt(0);
                if ((charCode & 0xF800) === 0xD800) {
                    const extraCharCode = s.charCodeAt(i++);
                    if ((charCode & 0xFC00) !== 0xD800 || (extraCharCode & 0xFC00) !== 0xDC00) {
                        throw Error('UCS-2(decode): illegal sequence');
                    }
                    charCode = ((charCode & 0x3FF) << 10) + (extraCharCode & 0x3FF) + 0x10000;
                }
                result += '\\' + charCode.toString(16) + ' ';
            } else {
                result += chr;
            }
        }
        i++;
    }
    return result;
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
    return "\"" + result + "\"";
}

export const identSpecialChars: {[char: string]: true} = {
    '!': true,
    '"': true,
    '#': true,
    '$': true,
    '%': true,
    '&': true,
    '\'': true,
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

export const strReplacementsRev: {[char: string]: string} = {
    '\n': '\\n',
    '\r': '\\r',
    '\t': '\\t',
    '\f': '\\f',
    '\v': '\\v'
};

export const singleQuoteEscapeChars: {[char: string]: string} = {
    n: '\n',
    r: '\r',
    t: '\t',
    f: '\f',
    '\\': '\\',
    '\'': '\''
};

export const doubleQuotesEscapeChars: {[char: string]: string} = {
    n: '\n',
    r: '\r',
    t: '\t',
    f: '\f',
    '\\': '\\',
    '"': '"'
};
