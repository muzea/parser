import {
  createParser,
  setParser,
  regex,
  seq,
  rep,
  alt,
  ch,
  end
} from "../dist/parser";

let Term = createParser();
let Factor = createParser();
let Exp = createParser();
let Parser = createParser();

setParser(Term, alt(regex("\\d+(\\.\\d+)?"), seq(ch("("), Exp, ch(")"))));

setParser(Factor, seq(Term, rep(seq(alt(ch("*"), ch("/")), Term))));

setParser(Exp, seq(Factor, rep(seq(alt(ch("+"), ch("-")), Factor))));

setParser(Parser, seq(Exp, end()));

for (const result of Parser[0]("123+321*(456+654)")) {
  console.log("RESULT :", result);
}
