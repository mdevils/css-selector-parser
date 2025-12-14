import {
    AstEntity,
    AstSelector,
    AstRule,
    AstTagName,
    AstWildcardTag,
    AstAttribute,
    AstPseudoClass,
    AstPseudoElement,
    AstFormulaOfSelector
} from './ast.js';

/**
 * Visitor function that is called for each node during traversal.
 * Return `false` to skip visiting children of this node.
 * Return `true` or `undefined` to continue traversal normally.
 */
export type VisitorFunction = (node: AstEntity, context: TraversalContext) => void | boolean | undefined;

/**
 * Visitor object with optional enter and exit hooks.
 * - `enter`: Called when first visiting a node (before its children)
 * - `exit`: Called when leaving a node (after its children)
 */
export interface Visitor {
    /**
     * Called when entering a node (before visiting its children).
     * Return `false` to skip visiting children of this node.
     */
    enter?: VisitorFunction;
    /**
     * Called when exiting a node (after visiting its children).
     */
    exit?: VisitorFunction;
}

/**
 * Context information provided to visitor functions during traversal.
 */
export interface TraversalContext {
    /** The current node being visited */
    node: AstEntity;
    /** Parent node (undefined for root) */
    parent?: AstEntity;
    /** Path of parent nodes from root to current node */
    parents: AstEntity[];
    /** Property name in parent that references this node */
    key?: string;
    /** Array index if this node is in an array */
    index?: number;
}

/**
 * Options for controlling traversal behavior.
 */
export interface TraverseOptions {
    /** Custom visitor implementation */
    visitor?: Visitor | VisitorFunction;
}

/**
 * Internal state for tracking traversal.
 */
interface TraversalState {
    visitor: Visitor;
    parents: AstEntity[];
}

/**
 * Traverses a CSS selector AST, calling visitor functions for each node.
 *
 * @param node - The root AST node to start traversal from
 * @param visitor - Visitor function or object with enter/exit hooks
 *
 * @example
 * ```typescript
 * import { createParser, traverse } from 'css-selector-parser';
 *
 * const parse = createParser();
 * const selector = parse('div.foo > span#bar');
 *
 * // Simple visitor function
 * traverse(selector, (node, context) => {
 *   console.log(node.type, context.parents.length);
 * });
 *
 * // Visitor with enter/exit hooks
 * traverse(selector, {
 *   enter(node, context) {
 *     if (node.type === 'ClassName') {
 *       console.log('Found class:', node.name);
 *     }
 *   },
 *   exit(node, context) {
 *     console.log('Leaving:', node.type);
 *   }
 * });
 *
 * // Skip subtrees
 * traverse(selector, {
 *   enter(node, context) {
 *     if (node.type === 'PseudoClass') {
 *       // Don't visit children of pseudo-classes
 *       return false;
 *     }
 *   }
 * });
 * ```
 */
export function traverse(node: AstEntity, visitor: Visitor | VisitorFunction): void {
    const visitorObj: Visitor = typeof visitor === 'function' ? {enter: visitor} : visitor;

    const state: TraversalState = {
        visitor: visitorObj,
        parents: []
    };

    visitNode(node, state, undefined, undefined, undefined);
}

/**
 * Visits a single node and its children.
 */
function visitNode(
    node: AstEntity,
    state: TraversalState,
    parent: AstEntity | undefined,
    key: string | undefined,
    index: number | undefined
): void {
    const context: TraversalContext = {
        node,
        parent,
        parents: [...state.parents],
        key,
        index
    };

    // Call enter hook
    let skipChildren = false;
    if (state.visitor.enter) {
        const result = state.visitor.enter(node, context);
        if (result === false) {
            skipChildren = true;
        }
    }

    // Visit children unless skipped
    if (!skipChildren) {
        state.parents.push(node);
        visitChildren(node, state);
        state.parents.pop();
    }

    // Call exit hook
    if (state.visitor.exit) {
        state.visitor.exit(node, context);
    }
}

/**
 * Visits all children of a node based on its type.
 */
function visitChildren(node: AstEntity, state: TraversalState): void {
    switch (node.type) {
        case 'Selector':
            visitSelector(node, state);
            break;
        case 'Rule':
            visitRule(node, state);
            break;
        case 'TagName':
            visitTagName(node, state);
            break;
        case 'WildcardTag':
            visitWildcardTag(node, state);
            break;
        case 'Attribute':
            visitAttribute(node, state);
            break;
        case 'PseudoClass':
            visitPseudoClass(node, state);
            break;
        case 'PseudoElement':
            visitPseudoElement(node, state);
            break;
        case 'FormulaOfSelector':
            visitFormulaOfSelector(node, state);
            break;
        // Leaf nodes with no children
        case 'Id':
        case 'ClassName':
        case 'NamespaceName':
        case 'WildcardNamespace':
        case 'NoNamespace':
        case 'NestingSelector':
        case 'String':
        case 'Formula':
        case 'Substitution':
            // No children to visit
            break;
    }
}

function visitSelector(node: AstSelector, state: TraversalState): void {
    node.rules.forEach((rule, index) => {
        visitNode(rule, state, node, 'rules', index);
    });
}

function visitRule(node: AstRule, state: TraversalState): void {
    node.items.forEach((item, index) => {
        visitNode(item, state, node, 'items', index);
    });

    if (node.nestedRule) {
        visitNode(node.nestedRule, state, node, 'nestedRule', undefined);
    }
}

function visitTagName(node: AstTagName, state: TraversalState): void {
    if (node.namespace) {
        visitNode(node.namespace, state, node, 'namespace', undefined);
    }
}

function visitWildcardTag(node: AstWildcardTag, state: TraversalState): void {
    if (node.namespace) {
        visitNode(node.namespace, state, node, 'namespace', undefined);
    }
}

function visitAttribute(node: AstAttribute, state: TraversalState): void {
    if (node.namespace) {
        visitNode(node.namespace, state, node, 'namespace', undefined);
    }
    if (node.value) {
        visitNode(node.value, state, node, 'value', undefined);
    }
}

function visitPseudoClass(node: AstPseudoClass, state: TraversalState): void {
    if (node.argument) {
        visitNode(node.argument, state, node, 'argument', undefined);
    }
}

function visitPseudoElement(node: AstPseudoElement, state: TraversalState): void {
    if (node.argument) {
        visitNode(node.argument, state, node, 'argument', undefined);
    }
}

function visitFormulaOfSelector(node: AstFormulaOfSelector, state: TraversalState): void {
    visitNode(node.selector, state, node, 'selector', undefined);
}
