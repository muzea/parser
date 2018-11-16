const last = arr => arr[arr.length - 1];

const fail = [() => []];

const ch = c => [
  input => {
    if (input && input.length >= c.length) {
      if (input.substr(0, c.length) === c) {
        return [[c, input.substr(c.length)]];
      }
    }
    return fail[0]();
  }
];

const end = () => [
  input => {
    if (input === "") {
      return [[input]];
    }
    return fail[0]();
  }
];

const regex = Expression => {
  const _Expression = new RegExp(Expression);
  return [
    input => {
      const match = _Expression.exec(input);
      if (match && match.index === 0) {
        return [[match[0], input.substr(match[0].length)]];
      }
      return fail[0]();
    }
  ];
};

const mergeSeqResult = (result, resultItem, parseResult) => {
  const cacheResultItem = resultItem.slice(0, -1);
  if (parseResult.length) {
    for (const parseResultItem of parseResult) {
      if (parseResultItem.length) {
        result.push(cacheResultItem.concat(parseResultItem));
      }
    }
  }
};

const seq = (...parserList) => [
  input => {
    let result = [[input]];
    for (const parser of parserList) {
      let nextResult = [];
      for (const resultItem of result) {
        const parseResult = parser[0](last(resultItem));
        mergeSeqResult(nextResult, resultItem, parseResult);
      }
      result = nextResult;
    }
    return result;
  }
];

const alt = (...parserList) => [
  input => {
    let result = [];
    for (const parser of parserList) {
      const parseResult = parser[0](input);
      if (parseResult.length) {
        for (const parseResultItem of parseResult) {
          if (parseResultItem.length) {
            result.push(parseResultItem);
          }
        }
      }
    }
    return result;
  }
];

const mergeAnyResult = (result, resultItem, parseResult) => {
  const cacheResultItem = resultItem.slice(0, -1);
  if (parseResult.length) {
    for (const parseResultItem of parseResult) {
      if (parseResultItem.length) {
        result.push(cacheResultItem.concat(parseResultItem));
      }
    }
  }
};

const any = (parser, max) => [
  input => {
    let result = [[input]];
    let current = 0;
    let prevResult = [[input]];
    do {
      if (current === max) {
        break;
      }

      let nextPrevResult = [];
      for (const prevResultItem of prevResult) {
        const parseResult = parser[0](last(prevResultItem));
        mergeAnyResult(nextPrevResult, prevResultItem, parseResult);
      }
      prevResult = nextPrevResult;
      result = result.concat(prevResult);
      current = current + 1;
    } while (prevResult.length);
    return result;
  }
];

const opt = parser => any(parser, 1);
const rep = parser => any(parser, 998);

const using = (parser, handler) => [input => handler(parser[0](input))];

let createParser = () => [fail];
let setParser = (object, parser) => {
  object[0] = parser[0];
};

export {
  last,
  fail,
  ch,
  end,
  regex,
  seq,
  alt,
  any,
  opt,
  rep,
  using,
  createParser,
  setParser
};
