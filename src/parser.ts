type IResult = string[][];
type IParserFunc = (input?: string) => IResult;
type IHParserFunc = [IParserFunc]

type ILast = (array: string[]) => string

const last: ILast = arr => arr[arr.length - 1];

type IFail = [IParserFunc]
const fail: IFail = [() => []];

// const isDebug = false

type ICh = (expected: string) => [IParserFunc]

const ch: ICh = c => [
  input => {
    // if (isDebug) {
    //   console.log('ch')
    //   console.log('expected ', c)
    //   console.log('input', input)
    // }
    if (c === '') {
      return [['', input]]
    }
    if (input && input.length >= c.length) {
      if (input.substr(0, c.length) === c) {
        return [[c, input.substr(c.length)]];
      }
    }
    return fail[0]();
  }
];

type IEnd = () => [IParserFunc]

const end: IEnd = () => [
  input => {
    if (input === "") {
      return [[input]];
    }
    return fail[0]();
  }
];

type IRegex = (expectedRegExp: string) => [IParserFunc]

const regex: IRegex = expectedRegExp => {
  const expression = new RegExp(expectedRegExp, "u");
  return [
    input => {
      // if (isDebug) {
      //   console.log('regex')
      //   console.log('expected ', expectedRegExp)
      //   console.log('input', input)
      // }
      const match = expression.exec(input);
      if (match && match.index === 0) {
        return [[match[0], input.substr(match[0].length)]];
      }
      return fail[0]();
    }
  ];
};

const mergeResult = (result: IResult, resultItem: string[], parseResult: IResult) => {
  const cacheResultItem = resultItem.slice(0, -1);
  if (parseResult.length) {
    for (const parseResultItem of parseResult) {
      if (parseResultItem.length) {
        result.push(cacheResultItem.concat(parseResultItem));
      }
    }
  }
};

type ISeq = (...expectedSequenceList: IHParserFunc[]) => [IParserFunc]

const seq: ISeq = (...parserList) => [
  input => {
    // if (isDebug) {
    //   console.log('seq')
    //   console.log('input', input)
    // }
    let result = [[input]];
    for (const parser of parserList) {
      const nextResult = [];
      for (const resultItem of result) {
        const parseResult = parser[0](last(resultItem));
        mergeResult(nextResult, resultItem, parseResult);
      }
      result = nextResult;
    }
    return result;
  }
];

type IAlt = (...expectedBranchList: IHParserFunc[]) => [IParserFunc]

const alt: IAlt = (...parserList) => [
  input => {
    // if (isDebug) {
    //   console.log('alt')
    //   console.log('input', input)
    // }
    const result = [];
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

type IAny = (expected: IHParserFunc, maxRepeatTimes: number) => [IParserFunc]

const any: IAny = (parser, max) => [
  input => {
    // if (isDebug) {
    //   console.log('any')
    //   console.log('input', input)
    // }
    let result = [[input]];
    let current = 0;
    let prevResult = [[input]];
    do {
      if (current === max) {
        break;
      }

      const nextPrevResult = [];
      for (const prevResultItem of prevResult) {
        const parseResult = parser[0](last(prevResultItem));
        mergeResult(nextPrevResult, prevResultItem, parseResult);
      }
      prevResult = nextPrevResult;
      result = result.concat(prevResult);
      current = current + 1;
    } while (prevResult.length);
    return result;
  }
];

type IOptOrRep = (expected: IHParserFunc) => [IParserFunc]
const opt: IOptOrRep = parser => any(parser, 1);
const rep: IOptOrRep = parser => any(parser, 998);


type IUsing = (parser: IHParserFunc, handler: (result: IResult) => IResult) => [IParserFunc]

const using: IUsing = (parser, handler) => [input => handler(parser[0](input))];

const createParser = () => ([] as any as [IParserFunc]);
const setParser = (object: [IParserFunc], parser: [IParserFunc]) => {
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
