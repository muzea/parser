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
  const [, exp, , ...rest] = result;
  return [exp].concat(rest);
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
  if (result.length < 3) {
    return result;
  }
  const [left, operator, right, ...rest] = result;
  return [`${calculatorMap[operator](left, right)}`].concat(rest);
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

console.log("RESULT :", Parser[0]("123+321*(456+654)"));
