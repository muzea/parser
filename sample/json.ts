import {
  createParser,
  setParser,
  ch,
  regex,
  seq,
  alt,
  end
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

setParser(
  value,
  alt(
    object,
    array,
    string,
    number,
    ch("true"),
    ch("false"),
    ch("null")
  )
)

setParser(
  object,
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
  )
)

setParser(
  members,
  alt(
    member,
    seq(
      member,
      ch(","),
      members
    )
  )
)

setParser(
  member,
  seq(
    ws,
    string,
    ws,
    ch(":"),
    element
  )
)

setParser(
  array,
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
  )
)

setParser(
  elements,
  alt(
    element,
    seq(
      element,
      ch(","),
      elements
    )
  )
)

setParser(
  element,
  seq(
    ws,
    value,
    ws
  )
)

setParser(
  string,
  seq(
    ch('"'),
    characters,
    ch('"')
  )
)


setParser(
  characters,
  alt(
    ch(""),
    seq(
      character,
      characters
    )
  )
)


setParser(
  character,
  alt(
    regex("^[\\u{0020}\\u{0021}\\u{0023}-\\u{005b}\\u{005d}-\\u{10FFFF}]+"),
    seq(
      ch("\\"),
      escape
    )
  )
)

setParser(
  escape,
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
  )
)


setParser(
  hex,
  alt(
    digit,
    regex("[A-F]"),
    regex("[a-f]")
  )
)

setParser(
  number,
  seq(
    int,
    frac,
    exp
  )
)


setParser(
  int,
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
  )
)


setParser(
  digits,
  alt(
    digit,
    seq(
      digit,
      digits
    )
  )
)


setParser(
  digit,
  alt(
    ch("0"),
    onenine
  )
)

setParser(
  onenine,
  regex("[1-9]")
)


setParser(
  frac,
  alt(
    ch(""),
    seq(
      ch("."),
      digits
    )
  )
)


setParser(
  exp,
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
  )
)

setParser(
  sign,
  alt(
    ch(""),
    ch("+"),
    ch("-")
  )
)

setParser(
  ws,
  alt(
    ch(""),
    ch("\u0009"),
    ch("\u000a"),
    ch("\u0020")
  )
)


setParser(json, seq(element, end()))

const data = JSON.stringify({
  a: '213',
  b: [1, 2, 3],
  c: "\n777"
})

for (const result of json[0](data)) {
  console.log("RESULT :", result);
}
