import * as Lib from '../src/index.js';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const {ast, render, createParser, traverse} = require(
    process.env.TEST_DIST ? `../dist/${process.env.TEST_DIST}/index.js` : '../src/index.js'
) as typeof Lib;

export {ast, render, createParser, traverse};
export type {AstEntity, AstSelector, TraversalContext} from '../src/index.js';
