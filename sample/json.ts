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
    group('characters')
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
    group('number')
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


interface Item {
  type: string;
  value: Array<Item|string>
}

function pass(obj: Item, index: number): Item|string {
  return obj.value[index]
}

function objectToValue(obj: Item): object {
  const valueItem = pass(obj, 1) as Item
  if (valueItem.type === 'ws') {
    return {}
  }
  const ret: any = {}
  let membersItem = valueItem
  let memberItem = pass(membersItem, 0) as Item
  while (true) {
    const key = stringToValue(pass(memberItem, 1) as Item)
    const objValue = elementToValue(pass(memberItem, 4) as Item)
    ret[key] = objValue
    if (membersItem.value.length === 1) {
      break
    }
    membersItem = pass(membersItem, 2) as Item
    memberItem = pass(membersItem, 0) as Item
  }
  return ret
}

function arrayToValue(obj: Item): any[] {
  const valueItem = pass(obj, 1) as Item
  if (valueItem.type === 'ws') {
    return []
  }
  const ret: any = []
  let elementsItem = valueItem
  let elementItem = pass(elementsItem, 0) as Item
  while (true) {
    ret.push(elementToValue(elementItem))
    if (elementsItem.value.length === 1) {
      break
    }
    elementsItem = pass(elementsItem, 2) as Item
    elementItem = pass(elementsItem, 0) as Item
  }
  return ret
}

function digitToValue(obj: Item): number {
  if (typeof obj.value[0] === 'string') {
    return parseInt(obj.value[0] as string, 10)
  }
  return parseInt((obj.value[0] as Item).value[0] as string, 10)
}

function digitsToValue(obj: Item): number {
  let digitsItem = obj
  let ret = 0
  let digitItem = pass(digitsItem, 0) as Item
  while (true) {
    ret = 10 * ret + digitToValue(digitItem)
    if (digitsItem.value.length === 1) {
      break
    }
    digitsItem = pass(digitsItem, 1) as Item
    digitItem = pass(digitsItem, 0) as Item
  }
  return ret
}

function hexToValue(obj: Item): string {
  if (typeof obj.value[0] === 'string') {
    return obj.value[0] as string
  }
  return digitToValue(obj.value[0] as Item).toString()
}

const codeMap = {
  '"': '\"',
  '/': '\/',
  '\\': '\\',
  'b': '\b',
  'n': '\n',
  'r': '\r',
  't': '\t',
}

function escapeToValue(obj: Item): string {
  if (obj.value.length === 1) {
    return codeMap[obj.value[0] as string]
  }
  const code = parseInt(`${hexToValue(obj.value[1] as Item)}${hexToValue(obj.value[2] as Item)}${hexToValue(obj.value[3] as Item)}${hexToValue(obj.value[4] as Item)}`, 16);
  return String.fromCharCode(code)
}

function stringToValue(obj: Item): string {
  let charactersItem = pass(obj, 1) as Item
  let ret = ''
  let characterItem = pass(charactersItem, 0)
  while (true) {
    if (characterItem as string === '') {
      break
    }
    if ((characterItem as Item).value.length === 1) {
      ret += (characterItem as Item).value[0]
    } else {
      ret += escapeToValue((characterItem as Item).value[1] as Item)
    }
    if (charactersItem.value.length === 1) {
      break
    }
    charactersItem = pass(charactersItem, 1) as Item
    characterItem = pass(charactersItem, 0) as Item
  }
  return ret
}

function intToValue(obj: Item): number {
  switch (obj.value.length) {
    case 1: return digitToValue(obj.value[0] as Item)
    case 2: {
      if (obj.value[0] === '-') {
        return -1 * digitsToValue(obj.value[1] as Item)
      }
      return 10 * parseInt((obj.value[0] as Item).value[0] as string, 10) + digitsToValue(obj.value[1] as Item)
    }
    case 3: return -1 * (10 * parseInt((obj.value[1] as Item).value[0] as string, 10) + digitsToValue(obj.value[2] as Item))
  }
}

function fracToValue(obj: Item): number {
  if (obj.value.length === 1) {
    return 0
  }
  const num = digitsToValue(pass(obj, 1) as Item)
  return parseFloat(`0.${num}`)
  // :)
}

function expToValue(obj: Item): number {
  if (obj.value.length === 1) {
    return 0
  }
  const num = digitsToValue(pass(obj, 2) as Item)
  if ((obj.value[1] as Item).value[0] === '-') {
    return -num
  }
  return num
}

function numberToValue(obj: Item): number {
  const [intItem, fracItem, expItem] = obj.value
  const intValue = intToValue(intItem as Item)
  const fracValue = fracToValue(fracItem as Item)
  const expValue = expToValue(expItem as Item)
  return (intValue + fracValue) * Math.pow(10, expValue)
}

function elementToValue(obj: Item): any {
  const valueItem = pass(obj, 1)
  const rawValue = pass(valueItem as Item, 0)
  switch (rawValue) {
    case 'true': return true
    case 'false': return false
    case 'null': return null
  }
  switch ((rawValue as Item).type) {
    case 'object': return objectToValue(rawValue as Item)
    case 'array': return arrayToValue(rawValue as Item)
    case 'string': return stringToValue(rawValue as Item)
    case 'number': return numberToValue(rawValue as Item)
  }
}

export {
  json,
  elementToValue,
  Item
}

// const data = JSON.stringify({
//   a: '213',
//   b: [1, 2, 3],
//   c: "\n777"
// })

// for (const result of json[0](data)) {
//   // console.log("RESULT :", JSON.stringify(result, null, 2));
//   const r = elementToValue(result[0] as any as Item)
//   console.log(JSON.stringify(r, null, 2))
// }
