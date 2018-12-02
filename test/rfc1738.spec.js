import { isHttpurl } from '../sample/rfc1738'
import test from 'ava';

test('is-url', t => {
  const list = [
    'http://google.com',
    'http://www.google.com',
    'http://google.com/something',
    'http://google.com/something?q=query',
    'http://google.co.uk',
    'http://www.google.co.uk',
    'http://google.cat',
    'http://0.0.0.0',
    'http://localhost',
    'http://localhost:4000',
    'http://localhost:342/a/path',
  ];
  for (const item of list) {
    t.is(isHttpurl(item), true);
  }
});
