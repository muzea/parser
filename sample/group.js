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

function group(result) {
  return [result.slice(0, -1)].concat(result.slice(-1));
}

setParser(Term, alt(regex("\\d+(\\.\\d+)?"), seq(ch("("), Exp, ch(")"))));

setParser(
  Factor,
  using(seq(Term, rep(seq(alt(ch("*"), ch("/")), Term))), group)
);

setParser(
  Exp,
  using(seq(Factor, rep(seq(alt(ch("+"), ch("-")), Factor))), group)
);

setParser(Parser, seq(Exp, end()));

console.log("RESULT :", Parser[0]("123+321*(456+654)"));
