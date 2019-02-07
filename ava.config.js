export default {
  files: ["test/**/*.{js,ts}"],
  sources: ["src/*.{js,jsx}", "sample/*.{js,jsx}", "!dist/**/*"],
  cache: true,
  concurrency: 5,
  failFast: true,
  failWithoutAssertions: false,
  verbose: true,
  compileEnhancements: false,
  extensions: ["ts"],
  require: ["ts-node/register"]
};
