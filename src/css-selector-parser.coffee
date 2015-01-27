
class exports.CssSelectorParser

  constructor: ->
    @pseudos = {}
    @attrEqualityMods = {}
    @ruleNestingOperators = {}
    @substitutesEnabled = false

  registerSelectorPseudos: (name) ->
    for name in arguments
      @pseudos[name] = 'selector'
    @

  unregisterSelectorPseudos: (name) ->
    for name in arguments
      delete @pseudos[name]
    @

  registerNestingOperators: (op) ->
    for op in arguments
      @ruleNestingOperators[op] = true
    @

  unregisterNestingOperators: (op) ->
    for op in arguments
      delete @ruleNestingOperators[op]
    @

  registerAttrEqualityMods: (mod) ->
    for mod in arguments
      @attrEqualityMods[mod] = true
    @

  unregisterAttrEqualityMods: (mod) ->
    for mod in arguments
      delete @attrEqualityMods[mod]
    @

  enableSubstitutes: -> @substitutesEnabled = true; @
  disableSubstitutes: -> @substitutesEnabled = false; @

  isIdentStart = (c) -> (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')
  isIdent = (c) -> (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9') || c == '-' || c == '_'
  isHex = (c) -> (c >= 'a' && c <= 'f') || (c >= 'A' && c <= 'F')  || (c >= '0' && c <= '9')
  isAttrMatchOperator = (c) -> c == '=' || c == '^' || c == '$' || c == '*' || c == '~'
  identSpecialChars =
    '!': true
    '"': true
    '#': true
    '$': true
    '%': true
    '&': true
    '\'': true
    '(': true
    ')': true
    '*': true
    '+': true
    ',': true
    '.': true
    '/': true
    ';': true
    '<': true
    '=': true
    '>': true
    '?': true
    '@': true
    '[': true
    '\\': true
    ']': true
    '^': true
    '`': true
    '{': true
    '|': true
    '}': true
    '~': true
  identReplacements =
    'n': '\n'
    'r': '\r'
    't': '\t'
    ' ': ' '
    'f': '\f'
    'v': '\v'
  identReplacementsRev =
    '\n': '\\n'
    '\r': '\\r'
    '\t': '\\t'
    ' ': '\\ '
    '\f': '\\f'
    '\v': '\\v'
  strReplacementsRev =
    '\n': '\\n'
    '\r': '\\r'
    '\t': '\\t'
    '\f': '\\f'
    '\v': '\\v'

  singleQuoteEscapeChars =
    n: '\n'
    r: '\r'
    t: '\t'
    f: '\f'
    '\\': '\\'
    '\'': '\''
  doubleQuotesEscapeChars =
    n: '\n'
    r: '\r'
    t: '\t'
    f: '\f'
    '\\': '\\'
    '"': '"'

  ParseContext = (str, p, pseudos, attrEqualityMods, ruleNestingOperators, substitutesEnabled) ->
    l = str.length
    c = null

    getStr = (quote, escapeTable) ->
      result = ''
      p++
      c = str.charAt p
      while p < l
        if c == quote
          p++
          return result
        else if c == '\\'
          p++
          c = str.charAt p
          if c == quote
            result += quote
          else if esc = escapeTable[c]
            result += esc
          else if isHex c
            hex = c
            p++
            c = str.charAt p
            while isHex c
              hex += c
              p++
              c = str.charAt p
            if c == ' '
              p++
              c = str.charAt p
            result += String.fromCharCode(parseInt(hex, 16))
            continue
          else
            result += c
        else
          result += c
        p++
        c = str.charAt p
      result

    getIdent = ->
      result = ''
      c = str.charAt p
      while p < l
        if isIdent c
          result += c
        else if c == '\\'
          p++
          c = str.charAt p
          if identSpecialChars[c]
            result += c
          else if r = identReplacements[c]
            result += r
          else if isHex c
            hex = c
            p++
            c = str.charAt p
            while isHex c
              hex += c
              p++
              c = str.charAt p
            if c == ' '
              p++
              c = str.charAt p
            result += String.fromCharCode(parseInt(hex, 16))
            continue
          else result += c
        else return result
        p++
        c = str.charAt p
      result

    skipWhitespace = ->
      c = str.charAt(p)
      result = false
      while c == ' ' || c == "\t" || c == "\n" || c == "\r" || c == "\f"
        result = true
        p++
        c = str.charAt(p)
      result

    @parse = ->
      res = @parseSelector()
      if p < l
        throw Error('Rule expected but "' + str.charAt(p) + '" found.')
      res

    @parseSelector = ->
      selector = res = @parseSingleSelector()
      c = str.charAt(p)
      while c == ','
        p++
        skipWhitespace()
        if res.type != 'selectors'
          res = {type: 'selectors', selectors: [selector]}
        selector = @parseSingleSelector()
        throw Error('Rule expected after ",".') unless selector
        res.selectors.push selector
      res

    @parseSingleSelector = ->
      skipWhitespace()
      selector = { type : 'ruleSet' }
      rule = @parseRule()
      return null unless rule
      currentRule = selector
      while rule
        rule.type = 'rule'
        currentRule.rule = rule
        currentRule = rule
        skipWhitespace()
        c = str.charAt(p)
        break if p >= l || c == ',' || c == ')'
        if ruleNestingOperators[c]
          op = c
          p++
          skipWhitespace()
          rule = @parseRule()
          throw Error('Rule expected after "' + op + '".') unless rule
          rule.nestingOperator = op
        else
          rule = @parseRule()
          rule.nestingOperator = null if rule
      selector

    @parseRule = ->
      rule = null
      while p < l
        c = str.charAt(p)
        if c == '*'
          p++
          (rule = rule || {}).tagName = '*'
        else if isIdentStart(c) || c == '\\'
          (rule = rule || {}).tagName = getIdent()
        else if c == '.'
          p++
          rule = rule || {}
          (rule.classNames = rule.classNames || []).push getIdent()
        else if c == '#'
          p++
          c = str.charAt(p)
          id = ''
          while isIdent c
            id += c
            p++
            c = str.charAt(p)
          (rule = rule || {}).id = id
        else if c == '['
          p++
          skipWhitespace()
          attr = name: getIdent()
          skipWhitespace()
          if c == ']'
            p++
          else
            operator = ''
            if attrEqualityMods[c]
              operator = c
              p++
              c = str.charAt(p)
            throw Error('Expected "=" but end of file reached.') if p >= l
            throw Error('Expected "=" but "' + c + '" found.') if c != '='
            attr.operator = operator + '='
            p++
            skipWhitespace()
            attrValue = ''
            attr.valueType = 'string'
            if c == '"'
              attrValue = getStr '"', doubleQuotesEscapeChars
            else if c == '\''
              attrValue = getStr '\'', singleQuoteEscapeChars
            else if substitutesEnabled && c == '$'
              p++
              attrValue = getIdent()
              attr.valueType = 'substitute'
            else
              while p < l
                break if c == ']'
                attrValue += c
                p++
                c = str.charAt p
              attrValue = attrValue.trim()
            skipWhitespace()
            throw Error('Expected "]" but end of file reached.') if p >= l
            throw Error('Expected "]" but "' + c + '" found.') if c != ']'
            p++
            attr.value = attrValue
          (rule = rule || {})
          (rule.attrs = (rule.attrs || [])).push attr
        else if c == ':'
          p++
          pseudoName = getIdent()
          pseudo = name: pseudoName
          if c == '('
            p++
            value = ''
            skipWhitespace()
            if pseudos[pseudoName] == 'selector'
              pseudo.valueType = 'selector'
              value = @parseSelector()
            else
              pseudo.valueType = 'string'
              if c == '"'
                value = getStr '"', doubleQuotesEscapeChars
              else if c == '\''
                value = getStr '\'', singleQuoteEscapeChars
              else if substitutesEnabled && c == '$'
                p++
                value = getIdent()
                pseudo.valueType = 'substitute'
              else
                while p < l
                  break if c == ')'
                  value += c
                  p++
                  c = str.charAt p
                value = value.trim()
              skipWhitespace()
            throw Error('Expected ")" but end of file reached.') if p >= l
            throw Error('Expected ")" but "' + c + '" found.') if c != ')'
            p++
            pseudo.value = value
          (rule = rule || {})
          (rule.pseudos = (rule.pseudos || [])).push pseudo
        else break
      rule
    @

  parse: (str) ->
    context = new ParseContext(str, 0, @pseudos, @attrEqualityMods, @ruleNestingOperators, @substitutesEnabled)
    context.parse()

  escapeIdentifier: (s) ->
    result = ''
    i = 0
    l = s.length
    while i < l
      c = s.charAt(i)
      if identSpecialChars[c]
        result += '\\' + c
      else if r = identReplacementsRev[c]
        result += r
      else if (cc = c.charCodeAt(0)) && (cc < 32 || cc > 126)
        if ((cc & 0xF800) == 0xD800)
          extraCharCode = s.charCodeAt(i++)
          if ((cc & 0xFC00) != 0xD800 || (extraCharCode & 0xFC00) != 0xDC00)
            throw Error('UCS-2(decode): illegal sequence')
          cc = ((cc & 0x3FF) << 10) + (extraCharCode & 0x3FF) + 0x10000
        result += '\\' + cc.toString(16) + ' '
      else result += c
      i++
    result

  escapeStr: (s) ->
    result = ''
    i = 0
    l = s.length
    while i < l
      c = s.charAt(i)
      if c == '"'
        c = '\\"'
      else if c == '\\'
        c = '\\\\'
      else if r = strReplacementsRev[c]
        c = r
      result += c
      i++
    "\"#{result}\""

  render: (path) ->

    renderEntity = (entity) =>
      res = ''
      switch entity.type
        when 'ruleSet'
          currentEntity = entity.rule
          parts = []
          while currentEntity
            parts.push currentEntity.nestingOperator if currentEntity.nestingOperator
            parts.push renderEntity(currentEntity)
            currentEntity = currentEntity.rule
          res = parts.join ' '
        when 'selectors'
          res = entity.selectors.map(renderEntity).join ', '
        when 'rule'
          if entity.tagName
            if entity.tagName == '*'
              res = '*'
            else
              res = @escapeIdentifier(entity.tagName)
          if entity.id
            res += "##{@escapeIdentifier(entity.id)}"
          if entity.classNames
            res += (entity.classNames.map (cn) => ".#{@escapeIdentifier(cn)}").join ''
          if entity.attrs
            res += (entity.attrs.map (attr) =>
              if attr.operator
                if attr.valueType == 'substitute'
                  "[#{@escapeIdentifier(attr.name)}#{attr.operator}$#{attr.value}]"
                else
                  "[#{@escapeIdentifier(attr.name)}#{attr.operator}#{@escapeStr(attr.value)}]"
              else
                "[#{@escapeIdentifier(attr.name)}]"
            ).join ''
          if entity.pseudos
            res += (entity.pseudos.map (pseudo) =>
              if pseudo.valueType
                if pseudo.valueType == 'selector'
                  ":#{@escapeIdentifier(pseudo.name)}(#{renderEntity(pseudo.value)})"
                else if pseudo.valueType == 'substitute'
                  ":#{@escapeIdentifier(pseudo.name)}($#{pseudo.value})"
                else
                  ":#{@escapeIdentifier(pseudo.name)}(#{pseudo.value})"
              else
                  ":#{@escapeIdentifier(pseudo.name)}"
            ).join ''
        else throw Error('Unknown entity type: "' + entity.type +'".')
      res

    renderEntity path

