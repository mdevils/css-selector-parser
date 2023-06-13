import * as Lib from '../src';

// eslint-disable-next-line @typescript-eslint/no-var-requires
export = require(process.env.TEST_LIB ? '../lib' : '../src') as typeof Lib;
