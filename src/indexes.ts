export interface MulticharIndex {
    [key: string]: MulticharIndexChar;
}

export interface MulticharIndexChar {
    chars: MulticharIndex;
    self?: string;
}

type RegularIndex = Record<string, boolean>;

export const emptyMulticharIndex: MulticharIndex = {};
export const emptyRegularIndex: RegularIndex = {};

function extendIndex(item: string, index: MulticharIndex) {
    let currentIndex = index;
    for (let pos = 0; pos < item.length; pos++) {
        const isLast = pos === item.length - 1;
        const char = item.charAt(pos);
        const charIndex = currentIndex[char] || (currentIndex[char] = {chars: {}});
        if (isLast) {
            charIndex.self = item;
        }
        currentIndex = charIndex.chars;
    }
}

export function createMulticharIndex(items: string[]) {
    if (items.length === 0) {
        return emptyMulticharIndex;
    }
    const index: MulticharIndex = {};
    for (const item of items) {
        extendIndex(item, index);
    }
    return index;
}

export function createRegularIndex(items: string[]): RegularIndex {
    if (items.length === 0) {
        return emptyRegularIndex;
    }
    const result: RegularIndex = {};
    for (const item of items) {
        result[item] = true;
    }
    return result;
}
