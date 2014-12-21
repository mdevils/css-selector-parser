{CssSelectorParser} = require('../index')
colors = require('colors')

assertEquals = (str, expr) ->
  if str == expr
    console.log "#{colors.green('OK', 'green')}: #{colors.yellow("'#{expr}'")} === #{colors.yellow("'#{str}'")}."
  else
    throw Error("Assertion failed: '#{expr}' should equal to '#{str}'.")

assertError = (str, cb) ->
  errStr = ''
  try
    cb()
  catch err
    errStr = err.message
  assertEquals str, errStr

parser = new CssSelectorParser
parser.registerAttrEqualityMods '^', '$', '*', '~'
parser.registerNestingOperators '>', '+', '~'

assertEquals '.class', parser.render(parser.parse('.class'))
assertEquals '.class1.class2', parser.render(parser.parse('.class1.class2'))
assertEquals 'tag.class', parser.render(parser.parse('tag.class'))
assertEquals 'tag#id.class', parser.render(parser.parse('tag#id.class'))
assertEquals 'tag#id.class[attr]', parser.render(parser.parse('tag#id.class[attr]'))
assertEquals 'tag#id.class[attr]', parser.render(parser.parse('tag#id.class[ attr ]'))
assertEquals 'tag#id.class[attr="value"]', parser.render(parser.parse('tag#id.class[attr=value]'))
assertEquals 'tag#id.class[attr~="value"]', parser.render(parser.parse('tag#id.class[attr~=value]'))
assertEquals 'tag#id.class[attr*="value"]', parser.render(parser.parse('tag#id.class[attr*=value]'))
assertEquals 'tag#id.class[attr^="value"]', parser.render(parser.parse('tag#id.class[attr^=value]'))
assertEquals 'tag#id.class[attr$="value"]', parser.render(parser.parse('tag#id.class[attr$=value]'))
assertEquals 'tagname[x="y"]', parser.render(parser.parse('tagname[   x =  y  ]'))
assertEquals 'tagname[x="y"]', parser.render(parser.parse('tagname[x="y"]'))
assertEquals 'tagname[x="y"][z]', parser.render(parser.parse('tagname[x="y"][z]'))
assertEquals 'tagname[x="y "]', parser.render(parser.parse('tagname[x="y "]'))
assertEquals 'tagname[x="y \\\""]', parser.render(parser.parse('tagname[x="y \\\""]'))
assertEquals 'tagname[x="y\'"]', parser.render(parser.parse('tagname[x="y\'"]'))
assertEquals 'tag1 tag2', parser.render(parser.parse('tag1   tag2'))
assertEquals 'tag1 > tag2', parser.render(parser.parse('tag1>tag2'))
assertEquals 'tag1 + tag2', parser.render(parser.parse('tag1+tag2'))
assertEquals 'tag1 ~ tag2', parser.render(parser.parse('tag1~tag2'))
assertEquals 'tag1:first', parser.render(parser.parse('tag1:first'))
assertEquals 'tag1:lt("3")', parser.render(parser.parse('tag1:lt(3)'))
assertEquals 'tag1:lt("3")', parser.render(parser.parse('tag1:lt( 3 )'))
assertEquals 'tag1:lt("3")', parser.render(parser.parse('tag1:lt(\'3\')'))
assertEquals 'tag1:lt("3")', parser.render(parser.parse('tag1:lt("3" )'))

assertEquals 'tag1:has(".class")', parser.render(parser.parse('tag1:has(.class)'))

parser.registerSelectorPseudos('has')
assertEquals 'tag1:has(.class)', parser.render(parser.parse('tag1:has(.class)'))
assertEquals 'tag1:has(.class, .class2)', parser.render(parser.parse('tag1:has(.class,.class2)'))
assertEquals 'tag1:has(.class:has(.subcls), .class2)', parser.render(parser.parse('tag1:has(.class:has(.subcls),.class2)'))

assertEquals '*', parser.render(parser.parse('*'))
assertEquals '*.class', parser.render(parser.parse('*.class'))
assertEquals '* + *', parser.render(parser.parse('* + *'))

assertError 'Expected ")" but end of file reached.', ->
  parser.parse(':has(.class')
assertError 'Expected ")" but end of file reached.', ->
  parser.parse(':has(:has(')

parser.unregisterSelectorPseudos('has')
assertEquals 'tag1:has(".class,.class2")', parser.render(parser.parse('tag1:has(.class,.class2)'))

assertError 'Expected "]" but "!" found.', ->
  parser.parse('[attr="val"!')
assertError 'Expected "]" but end of file reached.', ->
  parser.parse('[attr="val"')
assertError 'Expected "=" but "!" found.', ->
  parser.parse('[attr!="val"]')
assertError 'Expected "=" but end of file reached.', ->
  parser.parse('[attr')
assertError 'Expected ")" but "!" found.', ->
  parser.parse(':pseudoName("pseudoValue"!')
assertError 'Expected ")" but end of file reached.', ->
  parser.parse(':pseudoName("pseudoValue"')
assertError 'Rule expected after ">".', ->
  parser.parse('tag>')
assertError 'Rule expected after "+".', ->
  parser.parse('tag+')
assertError 'Rule expected after "~".', ->
  parser.parse('tag~')
assertError 'Rule expected but "!" found.', ->
  parser.parse('tag !')
assertError 'Rule expected but "!" found.', ->
  parser.parse('tag!')
assertError 'Rule expected after ",".', ->
  parser.parse('tag,')

assertEquals 'tag\\n\\\\name\\.\\[', parser.render(parser.parse('tag\\n\\\\name\\.\\['))
assertEquals '.cls\\n\\\\name\\.\\[', parser.render(parser.parse('.cls\\n\\\\name\\.\\['))
assertEquals '[attr\\n\\\\name\\.\\[="1"]', parser.render(parser.parse('[attr\\n\\\\name\\.\\[=1]'))
assertEquals ':pseudo\\n\\\\name\\.\\[\\(("123")', parser.render(parser.parse(':pseudo\\n\\\\name\\.\\[\\((123)'))
assertEquals '[attr="val\\nval"]', parser.render(parser.parse('[attr="val\nval"]'))
assertEquals '[attr="val\\"val"]', parser.render(parser.parse('[attr="val\\"val"]'))
assertEquals '[attr="val val"]', parser.render(parser.parse('[attr="val\\00a0val"]'))
assertEquals 'tag\\a0 tag', parser.render(parser.parse('tag\\00a0 tag'))
assertEquals '.class\\a0 class', parser.render(parser.parse('.class\\00a0 class'))
assertEquals '[attr\\a0 attr]', parser.render(parser.parse('[attr\\a0 attr]'))

assertEquals '[attr="$var"]', parser.render(parser.parse('[attr=$var]'))
assertEquals ':has("$var")', parser.render(parser.parse(':has($var)'))
parser.enableSubstitutes()
assertEquals '[attr=$var]', parser.render(parser.parse('[attr=$var]'))
assertEquals ':has($var)', parser.render(parser.parse(':has($var)'))
parser.disableSubstitutes()
assertEquals '[attr="$var"]', parser.render(parser.parse('[attr=$var]'))
assertEquals ':has("$var")', parser.render(parser.parse(':has($var)'))

parser.registerNestingOperators ';'
assertEquals 'tag1 ; tag2', parser.render(parser.parse('tag1 ; tag2'))
parser.unregisterNestingOperators ';'
assertError 'Rule expected but ";" found.', ->
  parser.parse('tag1 ; tag2')

parser.registerAttrEqualityMods ';'
assertEquals '[attr;="val"]', parser.render(parser.parse('[attr;=val]'))
parser.unregisterAttrEqualityMods ';'
assertError 'Expected "=" but ";" found.', ->
  parser.parse('[attr;=val]')

assertEquals '#y.cls1.cls2 .cls3 + abc#def[x="y"] > yy, ff', parser.render(parser.parse('.cls1.cls2#y .cls3+abc#def[x=y]>yy,ff'))
