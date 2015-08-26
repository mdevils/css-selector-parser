var CssSelectorParser = require('../index').CssSelectorParser;
var parser = new CssSelectorParser;

parser.registerAttrEqualityMods('^', '$', '*', '~');
parser.registerNestingOperators('>', '+', '~');
parser.enableSubstitutes();
parser.registerSelectorPseudos('has');

function benchmark(name, tests) {
  var c;
  c = 10000;
  console.log(name + ' ' + c + ' times.');
  Object.keys(tests).forEach(function(testName) {
    var cb, i, start, time;
    cb = tests[testName];
    i = 0;
    start = new Date();
    while (i < c) {
      cb();
      i++;
    }
    time = (new Date()) - start;
    return console.log('    "' + testName + '": ' + time + 'ms, ' + (Math.round(c / time)) + 'op/msec');
  });
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
