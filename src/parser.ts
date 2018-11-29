type IResult = string[];
type IParserFunc = (input?: string) => IResult;
type IHParserFunc = [IParserFunc]

type ILast = (array: string[]) => string

const last: ILast = arr => arr[arr.length - 1];

type IFail = [IParserFunc]
const fail: IFail = [() => []];

type ICh = (expected: string) => [IParserFunc]

const ch: ICh = c => [
  input => {
    if (input && input.length >= c.length) {
      if (input.substr(0, c.length) === c) {
        return [c, input.substr(c.length)];
      }
    }
    return fail[0]();
  }
];

type IEnd = () => [IParserFunc]

const end: IEnd = () => [
  input => {
    if (input === "") {
      return [input];
    }
    return fail[0]();
  }
];

type IRegex = (expectedRegExp: string) => [IParserFunc]

const regex: IRegex = expectedRegExp => {
  const expression = new RegExp(expectedRegExp);
  return [
    input => {
      const match = expression.exec(input);
      if (match && match.index === 0) {
        return [match[0], input.substr(match[0].length)];
      }
      return fail[0]();
    }
  ];
};

const mergeResult = (result: IResult, parseResult: IResult) => {
  result.splice(-1, 1);
  result.push(...parseResult)
};

type ISeq = (...expectedSequenceList: IHParserFunc[]) => [IParserFunc]

const seq: ISeq = (...parserList) => [
  input => {
    const result = [input];
    for (const parser of parserList) {
      const parseResult = parser[0](last(result));
      if (parseResult.length === 0) {
        return fail[0]();
      }
      mergeResult(result, parseResult)
    }
    return result;
  }
];

type IAlt = (...expectedBranchList: IHParserFunc[]) => [IParserFunc]

const alt: IAlt = (...parserList) => [
  input => {
    for (const parser of parserList) {
      const parseResult = parser[0](input);
      if (parseResult.length) {
        return parseResult
      }
    }
    return fail[0]();
  }
];

type IAny = (expected: IHParserFunc, maxRepeatTimes: number) => [IParserFunc]

const any: IAny = (parser, max) => [
  input => {
    const result = [input];
    let current = 0;
    do {
      if (current === max) {
        break;
      }
      const parseResult = parser[0](last(result));
      if (parseResult.length) {
        mergeResult(result, parseResult)
      } else {
        break;
      }
      current = current + 1;
    } while (true);
    return result;
  }
];

type IOptOrRep = (expected: IHParserFunc) => [IParserFunc]
const opt: IOptOrRep = parser => any(parser, 1);
const rep: IOptOrRep = parser => any(parser, 998);


type IUsing = (parser: IHParserFunc, handler: (result: IResult) => IResult) => [IParserFunc]

const using: IUsing = (parser, handler) => [input => handler(parser[0](input))];

const createParser = () => fail.slice();
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
