import {
  createParser,
  setParser,
  regex,
  seq,
  rep,
  alt,
  ch,
  end,
  using
} from "../dist/parser";

let Term = createParser();
let Factor = createParser();
let Exp = createParser();
let Parser = createParser();

function passBracket(result) {
  return result.map(resultItem => {
    const [, exp, , ...rest] = resultItem;
    return [exp].concat(rest);
  });
}

const calculatorMap = {
  "+": function(left, right) {
    return parseInt(left) + parseInt(right);
  },
  "-": function(left, right) {
    return parseInt(left) - parseInt(right);
  },
  "*": function(left, right) {
    return parseInt(left) * parseInt(right);
  },
  "/": function(left, right) {
    return parseInt(left) / parseInt(right);
  }
};

let calculator = result => {
  return result.map(resultItem => {
    if (resultItem.length < 3) {
      return resultItem;
    }
    const [left, operator, right, ...rest] = resultItem;
    return [`${calculatorMap[operator](left, right)}`].concat(rest);
  });
};

setParser(
  Term,
  alt(regex("\\d+(\\.\\d+)?"), using(seq(ch("("), Exp, ch(")")), passBracket))
);

setParser(
  Factor,
  using(seq(Term, rep(seq(alt(ch("*"), ch("/")), Term))), calculator)
);

setParser(
  Exp,
  using(seq(Factor, rep(seq(alt(ch("+"), ch("-")), Factor))), calculator)
);

setParser(Parser, seq(Exp, end()));

for (const result of Parser[0]("123+321*(456+654)")) {
  console.log("RESULT :", result);
}
