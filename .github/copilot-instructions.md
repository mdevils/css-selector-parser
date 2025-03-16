This is a CSS selector parser which tries to follow latest CSS standards and also support experimental features.

Project structure:
- `src/` contains all the source code.
- `src/ast.ts` Abstract Syntax Tree.
- `src/index.ts` should contain all the public API and types used in public API.
- `src/indexes.ts` indexes for faster lookup.
- `src/parser.ts` contains the parser itself which produces AST from CSS selector string.
- `src/pseudo-signatures.ts` contains types and helper function for pseudo-classes and pseudo-elements.
- `src/renderer.ts` contains the renderer which converts AST back to CSS selector string.
- `src/syntax-definitions.ts` contains types and implementations of syntax definitions for different CSS versions.
- `src/utils.ts` helper functions.

We always write TypeScript with single quotes and 4 spaces for indentation,
so when your responses include TypeScript code, please follow those conventions.

All the imports include ".js" file extension because of the new ES module resolution algorithm.

We write code for better performance, but not at the cost of readability.

We write self-explanatory variable names and comments in English.

We don't keep trailing spaces.
