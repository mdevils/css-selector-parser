import {CssSelectorParser} from '../src';

const parser = new CssSelectorParser();

parser.registerAttrEqualityMods('^', '$', '*', '~');
parser.registerNestingOperators('>', '+', '~');
parser.enableSubstitutes();
parser.registerSelectorPseudos('has');

function benchmark(name: string, tests: {[name: string]: () => void}) {
  const count = 10000;
  console.log(name + ' ' + count + ' times.');
  for (let testName of Object.keys(tests)) {
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

benchmark('Parse test', {
  'a': (function() {
    return parser.parse('a');
  }),
  'a,b,c': (function() {
    return parser.parse('a,b,c');
  }),
  '.x.y.z': (function() {
    return parser.parse('.x.y.z');
  }),
  ':has(a)': (function() {
    return parser.parse(':has(a)');
  }),
  ':lte(a)': (function() {
    return parser.parse(':lte(a)');
  }),
  '[attr=value]': (function() {
    return parser.parse('[attr=value]');
  }),
  '[attr="value"]': (function() {
    return parser.parse('[attr="value"]');
  }),
  '[attr=\'value\']': (function() {
    return parser.parse('[attr=\'value\']');
  }),
  'a[href^=/], .container:has(nav) > a[href]:lt($var)': (function() {
    return parser.parse('a[href^=/], .container:has(nav) > a[href]:lt($var)');
  })
});
