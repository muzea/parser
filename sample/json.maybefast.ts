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

function toValue(cont) {
  return (result) => {
    return result.map(resultItem => {
      const ret = [cont(resultItem.slice(0, -1))]
      Array.prototype.push.apply(ret, resultItem.slice(-1))
      return ret
    });
  }
}

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
  alt(
    object,
    array,
    string,
    number,
    using(
      ch("true"),
      toValue(() => true)
    ),
    using(
      ch("false"),
      toValue(() => false)
    ),
    using(
      ch("null"),
      toValue(() => null)
    ),
  ),
)

// setParser(
//   object,
//   alt(
//     using(
//       seq(
//         ch("{"),
//         ws,
//         ch("}")
//       ),
//       toValue(() => ({}))
//     ),
//     using(
//       seq(
//         ch("{"),
//         members,
//         ch("}")
//       ),
//       toValue(([, m]) => {
//         const ret = {};
//         console.log('members', m);
//         (m as [string, string[]]).forEach(([k, v]) => {
//           console.log('k', k)
//           ret[k] = v
//         })
//         return ret
//       })
//     )
//   ),
// )

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
  alt(
    using(
      member,
      toValue((v) => {
        console.log('f v', v)
        return [v]
      })
    ),
    seq(
      member,
      ch(","),
      members
    )
  ),
)

// setParser(
//   members,
//   alt(
//     using(
//       member,
//       toValue((v) => {
//         console.log('f v', v)
//         return [v]
//       })
//     ),
//     using(
//       seq(
//         member,
//         ch(","),
//         members
//       ),
//       toValue((arg) => {
//         const m = arg[0]
//         const ms = arg[2]
//         console.log('m', m);
//         console.log('ms', ms);
//         (ms as Array<any>).push(m);
//         console.log('ret', ms);
//         return ms;
//       })
//     )
//   ),
// )

// setParser(
//   members,
//   using(
//     alt(
//       member,
//       seq(
//         member,
//         ch(","),
//         members
//       )
//     ),
//     group('members')
//   )
// )

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
    toValue(([ , k, , , v]) => [k, v])
  )
)

setParser(
  array,
  alt(
    using(
      seq(
        ch("["),
        ws,
        ch("]")
      ),
      toValue(() => ([]))
    ),
    using(
      seq(
        ch("["),
        elements,
        ch("]")
      ),
      toValue(([, e]) => e)
    )
  ),
)

setParser(
  elements,
  alt(
    element,
    using(
      seq(
        element,
        ch(","),
        elements
      ),
      toValue(([e, ,es]) => {
        return [e].concat(es)
      })
    )
  ),
)

setParser(
  element,
  using(
    seq(
      ws,
      value,
      ws
    ),
    toValue(([, v]) => v)
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
    toValue(([, v]) => v)
  )
)


setParser(
  characters,
  alt(
    ch(""),
    using(
      seq(
        character,
        characters
      ),
      toValue(([c, cs]) => c + cs)
    )
  ),
)


setParser(
  character,
  alt(
    regex("^[\\u{0020}\\u{0021}\\u{0023}-\\u{005b}\\u{005d}-\\u{10FFFF}]+"),
    using(
      seq(
        ch("\\"),
        escape
      ),
      toValue(([e, c]) => e + c)
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
    using(
      seq(
        ch("u"),
        hex,
        hex,
        hex,
        hex
      ),
      toValue(([p, h1, h2, h3, h4]) => p + h1 + h2 + h3 + h4)
    )
  )
)


setParser(
  hex,
  alt(
    digit,
    regex("[A-F]"),
    regex("[a-f]")
  ),
)

setParser(
  number,
  using(
    seq(
      int,
      frac,
      exp
    ),
    toValue(([i, f, e]) => (parseInt(i, 10) + (f ? parseFloat(f) : 0)) * Math.pow(10, parseInt(e, 10)))
  ) 
)


setParser(
  int,
  alt(
    digit,
    using(
      seq(
        onenine,
        digits
      ),
      toValue(([o, d]) => o + d)
    ),
    using(
      seq(
        ch("-"),
        digits
      ),
      toValue(([, d]) => '-' + d)
    ),
    using(
      seq(
        ch("-"),
        onenine,
        digits
      ),
      toValue(([, o, d]) => '-' + o + d)
    )
  )
)


setParser(
  digits,
  alt(
    digit,
    using(
      seq(
        digit,
        digits
      ),
      toValue(([d ,ds]) => d + ds)
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
    using(
      seq(
        ch("."),
        digits
      ),
      toValue(([p, d]) => p + d)
    )
  )
)


setParser(
  exp,
  alt(
    using(
      ch(""),
      toValue(() => '0')
    ),
    using(
      seq(
        ch("E"),
        sign,
        digits
      ),
      toValue(([, s, d]) => s + d)
    ),
    using(
      seq(
        ch("e"),
        sign,
        digits
      ),
      toValue(([, s, d]) => s + d)
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

export {
  json,
}

const data = JSON.stringify({
  a: '213',
  b: [1, 2, 3],
  c: "\n777"
})

for (const result of json[0](data)) {
  console.log("RESULT :", JSON.stringify(result, null, 2));
}
