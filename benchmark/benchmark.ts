import {createParser} from '../src';

const parse = createParser({substitutes: true});

function benchmark(name: string, tests: {[name: string]: () => void}) {
    const count = 10000;
    console.log(name + ' ' + count + ' times.');
    for (const testName of Object.keys(tests)) {
        const callback = tests[testName];
        let i = 0;
        const start = Date.now();
        while (i < count) {
            callback();
            i++;
        }
        const time = Date.now() - start;
        console.log('    "' + testName + '": ' + time + 'ms, ' + Math.round(count / time) + 'op/msec');
    }
    return console.log('');
}

const tests = [
    'a',
    'a,b,c',
    'ns|a,ns|b,ns|c||.cls',
    '.x.y.z',
    ':has(a>b)',
    ':nth-child(2n+1)',
    '[attr=value]',
    '[attr="value"]',
    "[attr='value']",
    'a[href^="/"], .container:has(nav) > ns|a[href]:lang($var)'
];

benchmark('Parse test', Object.fromEntries(tests.map((test) => [test, () => parse(test)])));
