import {
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
} from '../src/parser';
import test from 'ava';

const testStr = '23333';

test('last', t => {
  t.snapshot(last(['2', '3', '3', '3']));
});

test('fail', t => {
  t.snapshot(fail[0](testStr));
});

test('ch', t => {
  const emptyParser = ch('');
  const charParser = ch('2');
  t.snapshot(emptyParser[0](testStr));
  t.snapshot(charParser[0](testStr));
});

test('end', t => {
  const emptyParser = end();
  t.snapshot(emptyParser[0](testStr));
  t.snapshot(emptyParser[0](''));
});

test('regex', t => {
  const shouldMatchParser = regex('2');
  const shouldNotMatchParser = regex('3');
  t.snapshot(shouldMatchParser[0](testStr));
  t.snapshot(shouldNotMatchParser[0](testStr));
});

test('seq', t => {
  const match2Parser = ch('2');
  const match3Parser = ch('3');
  const shouldMatchParser = seq(match2Parser, match3Parser);
  const shouldNotMatchParser = seq(match2Parser, match2Parser);
  t.snapshot(shouldMatchParser[0](testStr));
  t.snapshot(shouldNotMatchParser[0](testStr));
});

test('alt', t => {
  const match1Parser = ch('1');
  const match2Parser = ch('2');
  const match3Parser = ch('3');
  const shouldMatchParser = alt(match1Parser, match2Parser, match3Parser);
  const shouldNotMatchParser = alt(match1Parser, match3Parser);
  t.snapshot(shouldMatchParser[0](testStr));
  t.snapshot(shouldNotMatchParser[0](testStr));
});

test('any', t => {
  const match2Parser = ch('2');
  const match3Parser = ch('3');
  const matchOnceParser = any(match2Parser, 3);
  const matchTwiceParser = seq(match2Parser, any(match3Parser, 2));
  const matchMaxParser = seq(match2Parser, any(match3Parser, 4));
  t.snapshot(matchOnceParser[0](testStr));
  t.snapshot(matchTwiceParser[0](testStr));
  t.snapshot(matchMaxParser[0](testStr));
});

test('opt', t => {
  const match2Parser = ch('2');
  const match3Parser = ch('3');
  const shouldMatchParser = opt(match2Parser);
  const shouldNotMatchParser = opt(match3Parser);
  t.snapshot(shouldMatchParser[0](testStr));
  t.snapshot(shouldNotMatchParser[0](testStr));
});

test('rep', t => {
  const match2Parser = ch('2');
  const match3Parser = ch('3');
  const matchOnceParser = rep(match2Parser);
  const matchMaxParser = seq(match2Parser, rep(match3Parser));
  const shouldNotMatchParser = rep(match3Parser);
  t.snapshot(matchOnceParser[0](testStr));
  t.snapshot(matchMaxParser[0](testStr));
  t.snapshot(shouldNotMatchParser[0](testStr));
});

test('using', t => {
  let usingFunc = (result) => {
    return result;
  };
  const match2Parser = using(ch('2'), usingFunc);
  t.snapshot(match2Parser[0](testStr));
});


