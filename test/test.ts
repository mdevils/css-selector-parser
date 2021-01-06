import * as colors from 'colors';
import {CssSelectorParser} from '../src/old';

function assertEquals(str: string, expr: string) {
    if (str === expr) {
        return console.log(
            colors.green('OK') + ': ' + colors.yellow("'" + expr + "'") + ' === ' + colors.yellow("'" + str + "'") + '.'
        );
    } else {
        throw Error("Assertion failed: '" + expr + "' should equal to '" + str + "'.");
    }
}

function assertError(str: string, cb: () => void) {
    let err: Error;
    let errStr = '';
    try {
        cb();
    } catch (e) {
        err = e;
        errStr = err.message;
    }
    return assertEquals(str, errStr);
}

const parser = new CssSelectorParser();
parser.registerAttrEqualityMods('^', '$', '*', '~');
parser.registerNestingOperators('>', '+', '~');

assertEquals('.class', parser.render(parser.parse('.class')));
assertEquals('.class1.class2', parser.render(parser.parse('.class1.class2')));
assertEquals('tag.class', parser.render(parser.parse('tag.class')));
assertEquals('tag#id.class', parser.render(parser.parse('tag#id.class')));
assertEquals('tag#id.class[attr]', parser.render(parser.parse('tag#id.class[attr]')));
assertEquals('tag#id.class[attr]', parser.render(parser.parse('tag#id.class[ attr ]')));
assertEquals('tag#id.class[attr="value"]', parser.render(parser.parse('tag#id.class[attr=value]')));
assertEquals('tag#id.class[attr~="value"]', parser.render(parser.parse('tag#id.class[attr~=value]')));
assertEquals('tag#id.class[attr*="value"]', parser.render(parser.parse('tag#id.class[attr*=value]')));
assertEquals('tag#id.class[attr^="value"]', parser.render(parser.parse('tag#id.class[attr^=value]')));
assertEquals('tag#id.class[attr$="value"]', parser.render(parser.parse('tag#id.class[attr$=value]')));
assertEquals('tagname[x="y"]', parser.render(parser.parse('tagname[     x =    y    ]')));
assertEquals('tagname[x="y"]', parser.render(parser.parse('tagname[x="y"]')));
assertEquals('tagname[x="y"][z]', parser.render(parser.parse('tagname[x="y"][z]')));
assertEquals('tagname[x="y "]', parser.render(parser.parse('tagname[x="y "]')));
assertEquals('tagname[x="y \\""]', parser.render(parser.parse('tagname[x="y \\""]')));
assertEquals('tagname[x="y\'"]', parser.render(parser.parse('tagname[x="y\'"]')));
assertEquals('tag1 tag2', parser.render(parser.parse('tag1     tag2')));
assertEquals('tag1 > tag2', parser.render(parser.parse('tag1>tag2')));
assertEquals('tag1 + tag2', parser.render(parser.parse('tag1+tag2')));
assertEquals('tag1 ~ tag2', parser.render(parser.parse('tag1~tag2')));
assertEquals('tag1:first', parser.render(parser.parse('tag1:first')));
assertEquals('tag1:lt(\\33 )', parser.render(parser.parse('tag1:lt(3)')));
assertEquals('tag1:lt(\\33 )', parser.render(parser.parse('tag1:lt( 3 )')));
assertEquals('tag1:lt(\\33 )', parser.render(parser.parse("tag1:lt('3')")));
assertEquals('tag1:lt(\\33 )', parser.render(parser.parse('tag1:lt("3" )')));

parser.registerNumericPseudos('lt');

assertEquals('tag1:lt(3)', parser.render(parser.parse('tag1:lt(3)')));
assertEquals('tag1:has(\\.class)', parser.render(parser.parse('tag1:has(.class)')));

parser.registerSelectorPseudos('has');

assertEquals('tag1:has(.class)', parser.render(parser.parse('tag1:has(.class)')));
assertEquals('tag1:has(.class, .class2)', parser.render(parser.parse('tag1:has(.class,.class2)')));
assertEquals(
    'tag1:has(.class:has(.subcls), .class2)',
    parser.render(parser.parse('tag1:has(.class:has(.subcls),.class2)'))
);
assertEquals('*', parser.render(parser.parse('*')));
assertEquals('*.class', parser.render(parser.parse('*.class')));
assertEquals('* + *', parser.render(parser.parse('* + *')));
assertError('Expected ")" but end of file reached.', function () {
    return parser.parse(':has(.class');
});
assertError('Expected ")" but end of file reached.', function () {
    return parser.parse(':has(:has(');
});

parser.unregisterSelectorPseudos('has');

assertEquals('tag1:has(\\.class\\,\\.class2)', parser.render(parser.parse('tag1:has(.class,.class2)')));
assertError('Expected "]" but "!" found.', function () {
    return parser.parse('[attr="val"!');
});
assertError('Expected "]" but end of file reached.', function () {
    return parser.parse('[attr="val"');
});
assertError('Expected "=" but "!" found.', function () {
    return parser.parse('[attr!="val"]');
});
assertError('Expected "=" but end of file reached.', function () {
    return parser.parse('[attr');
});
assertError('Expected ")" but "!" found.', function () {
    return parser.parse(':pseudoName("pseudoValue"!');
});
assertError('Expected ")" but end of file reached.', function () {
    return parser.parse(':pseudoName("pseudoValue"');
});
assertError('Rule expected after ">".', function () {
    return parser.parse('tag>');
});
assertError('Rule expected after "+".', function () {
    return parser.parse('tag+');
});
assertError('Rule expected after "~".', function () {
    return parser.parse('tag~');
});
assertError('Rule expected but "!" found.', function () {
    return parser.parse('tag !');
});
assertError('Rule expected but "!" found.', function () {
    return parser.parse('tag!');
});
assertError('Rule expected after ",".', function () {
    return parser.parse('tag,');
});
assertError('Expected symbol but end of file reached.', function () {
    return parser.parse('#iframe_\\');
});
assertEquals('tag\\/name', parser.render(parser.parse('tag\\/name')));
assertEquals('.class\\/name', parser.render(parser.parse('.class\\/name')));
assertEquals('#id\\/name', parser.render(parser.parse('#id\\/name')));
assertEquals('.\\30 wow', parser.render(parser.parse('.\\30 wow')));
assertEquals('.\\30 wow', parser.render(parser.parse('.\\30wow')));
assertEquals('.\\20 wow', parser.render(parser.parse('.\\20wow')));
assertEquals('tagn\\\\name\\.\\[', parser.render(parser.parse('tag\\n\\\\name\\.\\[')));
assertEquals('.clsn\\\\name\\.\\[', parser.render(parser.parse('.cls\\n\\\\name\\.\\[')));
assertEquals('[attrn\\\\name\\.\\[="1"]', parser.render(parser.parse('[attr\\n\\\\name\\.\\[=1]')));
assertEquals(':pseudon\\\\name\\.\\[\\((\\31 23)', parser.render(parser.parse(':pseudo\\n\\\\name\\.\\[\\((123)')));
assertEquals('[attr="val\\nval"]', parser.render(parser.parse('[attr="val\nval"]')));
assertEquals('[attr="val\\"val"]', parser.render(parser.parse('[attr="val\\"val"]')));
assertEquals('[attr="val val"]', parser.render(parser.parse('[attr="val\\00a0val"]')));
assertEquals('tag\\a0 tag', parser.render(parser.parse('tag\\00a0 tag')));
assertEquals('.class\\a0 class', parser.render(parser.parse('.class\\00a0 class')));
assertEquals('[attr\\a0 attr]', parser.render(parser.parse('[attr\\a0 attr]')));
assertEquals('[attr="$var"]', parser.render(parser.parse('[attr=$var]')));
assertEquals(':has(\\$var)', parser.render(parser.parse(':has($var)')));

parser.enableSubstitutes();

assertEquals('[attr=$var]', parser.render(parser.parse('[attr=$var]')));
assertEquals(':has($var)', parser.render(parser.parse(':has($var)')));

parser.disableSubstitutes();

assertEquals('[attr="$var"]', parser.render(parser.parse('[attr=$var]')));
assertEquals(':has(\\$var)', parser.render(parser.parse(':has($var)')));

parser.registerNestingOperators(';');

assertEquals('tag1 ; tag2', parser.render(parser.parse('tag1 ; tag2')));

parser.unregisterNestingOperators(';');

assertError('Rule expected but ";" found.', function () {
    return parser.parse('tag1 ; tag2');
});

parser.registerAttrEqualityMods(';');

assertEquals('[attr;="val"]', parser.render(parser.parse('[attr;=val]')));

parser.unregisterAttrEqualityMods(';');

assertError('Expected "=" but ";" found.', function () {
    return parser.parse('[attr;=val]');
});
assertEquals(
    '#y.cls1.cls2 .cls3 + abc#def[x="y"] > yy, ff',
    parser.render(parser.parse('.cls1.cls2#y .cls3+abc#def[x=y]>yy,ff'))
);
assertEquals(
    '#google_ads_iframe_\\/100500\\/Pewpew_0',
    parser.render(parser.parse('#google_ads_iframe_\\/100500\\/Pewpew_0'))
);
assertEquals('#\\3123', parser.render(parser.parse('#\\3123')));
assertEquals('#\\31 23', parser.render(parser.parse('#\\31 23')));
assertEquals('#\\31 23', parser.render(parser.parse('#\\00031 23')));
assertEquals('#\\3123', parser.render(parser.parse('#\\0003123')));
assertEquals('#\\4123', parser.render(parser.parse('#\\0004123')));
