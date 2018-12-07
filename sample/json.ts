import {
  createParser,
  setParser,
  ch,
  regex,
  seq,
  alt,
  end,
  using
} from '../src/parser'


const json = createParser();
const element = createParser();
const value = createParser();
const object = createParser();
const members = createParser();
const member = createParser();
const array = createParser();
const elements = createParser();
const string = createParser();
const characters = createParser();
const character = createParser();
const escape = createParser();
const hex = createParser();
const number = createParser();
const int = createParser();
const digits = createParser();
const digit = createParser();
const onenine = createParser();
const frac = createParser();
const exp = createParser();
const sign = createParser();
const ws = createParser();

function group(type) {
  return (result) => {
    return result.map(resultItem => {
      return [{
        type,
        value: resultItem.slice(0, -1)
      }].concat(resultItem.slice(-1));
    });
  }
}


setParser(
  value,
  using(
    alt(
      object,
      array,
      string,
      number,
      ch("true"),
      ch("false"),
      ch("null")
    ),
    group('value')
  )
)

setParser(
  object,
  using(
    alt(
      seq(
        ch("{"),
        ws,
        ch("}")
      ),
      seq(
        ch("{"),
        members,
        ch("}")
      )
    ),
    group('object')
  )
)

setParser(
  members,
  using(
    alt(
      member,
      seq(
        member,
        ch(","),
        members
      )
    ),
    group('members')
  )
)

setParser(
  member,
  using(
    seq(
      ws,
      string,
      ws,
      ch(":"),
      element
    ),
    group('member')
  )
)

setParser(
  array,
  using(
    alt(
      seq(
        ch("["),
        ws,
        ch("]")
      ),
      seq(
        ch("["),
        elements,
        ch("]")
      )
    ),
    group('array')
  )
)

setParser(
  elements,
  using(
    alt(
      element,
      seq(
        element,
        ch(","),
        elements
      )
    ),
    group('elements')
  )
)

setParser(
  element,
  using(
    seq(
      ws,
      value,
      ws
    ),
    group('element')
  )
)

setParser(
  string,
  using(
    seq(
      ch('"'),
      characters,
      ch('"')
    ),
    group('string')
  )
)


setParser(
  characters,
  using(
    alt(
      ch(""),
      seq(
        character,
        characters
      )
    ),
    group('string')
  )
)


setParser(
  character,
  using(
    alt(
      regex("^[\\u{0020}\\u{0021}\\u{0023}-\\u{005b}\\u{005d}-\\u{10FFFF}]+"),
      seq(
        ch("\\"),
        escape
      )
    ),
    group('character')
  )
)

setParser(
  escape,
  using(
    alt(
      ch('"'),
      ch('\\'),
      ch('/'),
      ch('b'),
      ch('n'),
      ch('r'),
      ch('t'),
      seq(
        ch("u"),
        hex,
        hex,
        hex,
        hex
      )
    ),
    group('escape')
  )
)


setParser(
  hex,
  using(
    alt(
      digit,
      regex("[A-F]"),
      regex("[a-f]")
    ),
    group('hex')
  )
)

setParser(
  number,
  using(
    seq(
      int,
      frac,
      exp
    ),
    group('hex')
  )
)


setParser(
  int,
  using(
    alt(
      digit,
      seq(
        onenine,
        digits
      ),
      seq(
        ch("-"),
        digits
      ),
      seq(
        ch("-"),
        onenine,
        digits
      )
    ),
    group('int')
  )
)


setParser(
  digits,
  using(
    alt(
      digit,
      seq(
        digit,
        digits
      )
    ),
    group('digits')
  )
)


setParser(
  digit,
  using(
    alt(
      ch("0"),
      onenine
    ),
    group('digit')
  )
)

setParser(
  onenine,
  using(
    regex("[1-9]"),
    group('onenine')
  )
)


setParser(
  frac,
  using(
    alt(
      ch(""),
      seq(
        ch("."),
        digits
      )
    ),
    group('frac')
  )
)


setParser(
  exp,
  using(
    alt(
      ch(""),
      seq(
        ch("E"),
        sign,
        digits
      ),
      seq(
        ch("e"),
        sign,
        digits
      )
    ),
    group('exp')
  )
)

setParser(
  sign,
  using(
    alt(
      ch(""),
      ch("+"),
      ch("-")
    ),
    group('sign')
  )
)

setParser(
  ws,
  using(
    alt(
      ch(""),
      ch("\u0009"),
      ch("\u000a"),
      ch("\u0020")
    ),
    group('ws')
  )
)


setParser(json, seq(element, end()))

const data = JSON.stringify({
  a: '213',
  b: [1, 2, 3],
  c: "\n777"
})

for (const result of json[0](data)) {
  console.log("RESULT :", JSON.stringify(result, null, 2));
}
