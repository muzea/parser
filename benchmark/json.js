import Benchmark from "benchmark";
import { json, elementToValue } from "../sample/json";

const data = JSON.stringify({
  a: "213",
  b: [1, 2, 3],
  c: "\n777"
});

const rdata = `var a=${data}`;

const suite = new Benchmark.Suite();

suite
  .add("parser#json", function() {
    elementToValue(json[0](data)[0][0]);
  })
  .add("JSON#parse", function() {
    JSON.parse(data);
  })
  .add("eval", function() {
    eval(rdata);
  })
  .on("cycle", function(event) {
    console.log(String(event.target));
  })
  .on("complete", function() {
    console.log("Fastest is " + this.filter("fastest").map("name"));
  })
  .run();
