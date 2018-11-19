type IResult = Array<Array<string>>;
type IParserFunc = () => IResult;

type IParser = ICh | IEnd | IRegex | ISeq | IAlt | IAny | IOptOrRep

type ILast = (array: Array<string>) => string

const last: ILast = arr => arr[arr.length - 1];

const fail: [IParserFunc] = [() => []];

type IChFunc = (input: string) => IResult
type ICh = (expected: string) => [IChFunc]

const ch: ICh = c => [
  input => {
    if (input && input.length >= c.length) {
      if (input.substr(0, c.length) === c) {
        return [[c, input.substr(c.length)]];
      }
    }
    return fail[0]();
  }
];

type IEndFunc = (input: string) => IResult
type IEnd = () => [IEndFunc]

const end: IEnd = () => [
  input => {
    if (input === "") {
      return [[input]];
    }
    return fail[0]();
  }
];

type IRegexFunc = (input: string) => IResult
type IRegex = (expectedRegExp: string) => [IRegexFunc]

const regex: IRegex = Expression => {
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

const mergeResult = (result: IResult, resultItem: Array<string>, parseResult: IResult) => {
  const cacheResultItem = resultItem.slice(0, -1);
  if (parseResult.length) {
    for (const parseResultItem of parseResult) {
      if (parseResultItem.length) {
        result.push(cacheResultItem.concat(parseResultItem));
      }
    }
  }
};

type ISeqFunc = (input: string) => IResult
type ISeq = (...expectedSequenceList: IParser[]) => [ISeqFunc]

const seq: ISeq = (...parserList) => [
  input => {
    let result = [[input]];
    for (const parser of parserList) {
      let nextResult = [];
      for (const resultItem of result) {
        const parseResult = parser[0](last(resultItem));
        mergeResult(nextResult, resultItem, parseResult);
      }
      result = nextResult;
    }
    return result;
  }
];

type IAltFunc = (input: string) => IResult
type IAlt = (...expectedBranchList: IParser[]) => [IAltFunc]

const alt: IAlt = (...parserList) => [
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

type IAnyFunc = (input: string) => IResult
type IAny = (expected: IParser, maxRepeatTimes: number) => [IAnyFunc]

const any: IAny = (parser, max) => [
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
        mergeResult(nextPrevResult, prevResultItem, parseResult);
      }
      prevResult = nextPrevResult;
      result = result.concat(prevResult);
      current = current + 1;
    } while (prevResult.length);
    return result;
  }
];

type IOptOrRep = (expected: IParser) => [IAnyFunc]
const opt: IOptOrRep = parser => any(parser, 1);
const rep: IOptOrRep = parser => any(parser, 998);


type IUsing = (parser: IParser, handler: (result: IResult) => IResult) => [(input: string) => IResult]

const using: IUsing = (parser, handler) => [input => handler(parser[0](input))];

let createParser = () => [fail];
let setParser = (object: IParser, parser: IParser) => {
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
