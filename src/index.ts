import {PseudoSelectorType, parseCssSelector} from './parser-context';
import {Selector} from './selector';
import {renderEntity} from './render';

export class CssSelectorParser {
  protected pseudos: {[pseudo: string]: PseudoSelectorType} = {};
  protected attrEqualityMods: {[mod: string]: true} = {};
  protected ruleNestingOperators: {[operator: string]: true} = {};
  protected substitutesEnabled = false;

  public registerSelectorPseudos(...pseudos: string[]) {
    for (let pseudo of pseudos) {
      this.pseudos[pseudo] = 'selector';
    }
    return this;
  }

  public unregisterSelectorPseudos(...pseudos: string[]) {
    for (let pseudo of pseudos) {
      delete this.pseudos[pseudo];
    }
    return this;
  }

  public registerNumericPseudos(...pseudos: string[]) {
    for (let pseudo of pseudos) {
      this.pseudos[pseudo] = 'numeric';
    }
    return this;
  }

  public unregisterNumericPseudos(...pseudos: string[]) {
    for (let pseudo of pseudos) {
      delete this.pseudos[pseudo];
    }
    return this;
  }

  public registerNestingOperators(...operators: string[]) {
    for (let operator of operators) {
      this.ruleNestingOperators[operator] = true;
    }
    return this;
  }

  public unregisterNestingOperators(...operators: string[]) {
    for (let operator of operators) {
      delete this.ruleNestingOperators[operator];
    }
    return this;
  }

  public registerAttrEqualityMods(...mods: string[]) {
    for (let mod of mods) {
      this.attrEqualityMods[mod] = true;
    }
    return this;
  }

  public unregisterAttrEqualityMods(...mods: string[]) {
    for (let mod of mods) {
      delete this.attrEqualityMods[mod];
    }
    return this;
  }

  public enableSubstitutes() {
    this.substitutesEnabled = true;
    return this;
  }

  public disableSubstitutes() {
    this.substitutesEnabled = false;
    return this;
  }

  public parse(str: string) {
    return parseCssSelector(
        str,
        0,
        this.pseudos,
        this.attrEqualityMods,
        this.ruleNestingOperators,
        this.substitutesEnabled
    )!;
  }

  public render(path: Selector) {
    return renderEntity(path).trim();
  }
}
