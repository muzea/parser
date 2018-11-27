type ILast = (array: string[]) => string

const last: ILast = arr => arr[arr.length - 1];

type Item = ItemString | ItemReg | ItemSequence | ItemBranch


enum ItemType {
  string = 'string',
  regexp = 'regexp',
  sequence = 'sequence',
  branch = 'branch',
  repeat = 'repeat',
  end = 'end',
}

interface ItemEnd {
  type: ItemType.end
}

interface ItemString {
  type: ItemType.string
  expected: string
}

interface ItemReg {
  type: ItemType.regexp
  expected: RegExp
}

interface ItemSequence {
  type: ItemType.sequence
  expected: Item[]
}

interface ItemBranch {
  type: ItemType.branch
  expected: Item[]
}

interface ItemRepeat {
  type: ItemType.repeat
  maxRepeatTime: number
  expected: Item
}

type ICh = (expected: string) => ItemString

const ch: ICh = c => ({ type: ItemType.string, expected: c });

type IEnd = () => ItemEnd

const end: IEnd = () => ({ type: ItemType.end });

type IRegex = (expectedRegExp: string) => ItemReg

const regex: IRegex = expectedRegExp => ({ type: ItemType.regexp, expected: new RegExp(expectedRegExp) });

// const mergeResult = (result: IResult, resultItem: string[], parseResult: IResult) => {
//   const cacheResultItem = resultItem.slice(0, -1);
//   if (parseResult.length) {
//     for (const parseResultItem of parseResult) {
//       if (parseResultItem.length) {
//         result.push(cacheResultItem.concat(parseResultItem));
//       }
//     }
//   }
// };

type ISeq = (...expectedSequenceList: Item[]) => ItemSequence

const seq: ISeq = (...itemList) => {
  return {
    type: ItemType.sequence,
    expected: itemList,
  };
};

type IAlt = (...expectedBranchList: Item[]) => ItemBranch

const alt: IAlt = (...itemList) => {
  return {
    type: ItemType.branch,
    expected: itemList,
  };
};

type IAny = (expected: Item, maxRepeatTimes: number) => ItemRepeat

const any: IAny = (item, max) => {
  return {
    type: ItemType.repeat,
    expected: item,
    maxRepeatTime: max,
  };
};

type IOptOrRep = (expected: Item) => ItemRepeat
const opt: IOptOrRep = item => any(item, 1);
const rep: IOptOrRep = item => any(item, 998);


// type IUsing = (parser: IHParserFunc, handler: (result: IResult) => IResult) => [IParserFunc]

// const using: IUsing = (parser, handler) => [input => handler(parser[0](input))];

interface IParser {
  // expected: Item;
  setExpected(expected: Item): void;
  parser(input: string): string[];
  0: (input: string) => string[][];
}

class Parser implements IParser {
  private expected = null;
  parser(input: string) {
    return [];
  }
  0 = this.parser
  setExpected(expected: Item) {
    this.expected = expected;
  }
}

const createParser = () => {
  return new Parser()
};

const setParser = (parser: Parser, expected: Item) => {
  parser.setExpected(expected);
};

export {
  last,
  ch,
  end,
  regex,
  seq,
  alt,
  any,
  opt,
  rep,
  // using,
  createParser,
  setParser
};
