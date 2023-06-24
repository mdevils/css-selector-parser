import * as Lib from '../src';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const {ast, render, createParser} = require(process.env.TEST_DIST
    ? `../dist/${process.env.TEST_DIST}`
    : '../src') as typeof Lib;

export {ast, render, createParser};
