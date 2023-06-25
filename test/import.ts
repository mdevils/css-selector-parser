import * as Lib from '../src/index.js';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const {ast, render, createParser} = require(process.env.TEST_DIST
    ? `../dist/${process.env.TEST_DIST}/index.js`
    : '../src/index.js') as typeof Lib;

export {ast, render, createParser};
