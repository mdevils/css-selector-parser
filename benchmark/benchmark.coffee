{CssSelectorParser} = require('../index')

parser = new CssSelectorParser
parser.registerAttrEqualityMods '^', '$', '*', '~'
parser.registerNestingOperators '>', '+', '~'
parser.enableSubstitutes()
parser.registerSelectorPseudos('has')

benchmark = (name, tests) ->
  c = 10000
  console.log name + ' ' + c + ' times.'
  Object.keys(tests).forEach (testName) ->
    cb = tests[testName]
    i = 0
    start = new Date()
    while i < c
      cb()
      i++
    time = (new Date()) - start
    console.log '    "' + testName + '": ' + time + 'ms, ' + (Math.round(c/time)) + 'op/msec'
  console.log ''

benchmark 'Parse test',
  'a': (-> parser.parse('a'))
  'a,b,c': (-> parser.parse('a,b,c'))
  '.x.y.z': (-> parser.parse('.x.y.z'))
  ':has(a)': (-> parser.parse(':has(a)'))
  ':lte(a)': (-> parser.parse(':lte(a)'))
  '[attr=value]': (-> parser.parse('[attr=value]'))
  '[attr="value"]': (-> parser.parse('[attr="value"]'))
  '[attr=\'value\']': (-> parser.parse('[attr=\'value\']'))
  'a[href^=/], .container:has(nav) > a[href]:lt($var)': (-> parser.parse('a[href^=/], .container:has(nav) > a[href]:lt($var)'))
