import { json, elementToValue } from "../sample/json";
import test from 'ava';

const data = JSON.stringify({
  a: "213",
  b: [1, 2, 3],
  c: "\n777"
});

test('json', t => {
  const obj = elementToValue(json[0](data)[0][0] as any)
  t.is(JSON.stringify(obj), data);
});
