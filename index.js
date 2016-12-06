'use strict';

/**
 * Replaces all unescaped ${variable} occurances in given parsed abbreviation
 * `tree` with values provided in `variables` hash. Precede `$` with `\` to
 * escape it and skip replacement
 * @param {Node} tree Parsed abbreviation tree
 * @param {Object} variables Variables values
 * @return {Node}
 */
export default function replaceVariables(tree, variables) {
    tree.walk();
}

function replaceInNode(node, variables) {
    // replace variables in attributes
    const attrs = node.attributes;
    for (let i = 0, il = attrs.length; i < il; i++) {
        const attr = attrs[i];
        if (typeof attr.value === 'string') {
            node.setAttribute(attr.name, replaceInString(attr.value, variables));
        }
    }

    // A special case for `${child}` variable: for it’s first occurance, split
    // current node in two and put current node’s children between them so the
    // final output will look like the  childrend are inside current text value
    if (node.value != null) {
        let updated = false;
        const vars = Object.assign(variables, {
            child(str, v) {

            }
        })
    }
}

/**
 * Replaces all unescaped `${variable}` occurances in given string with values
 * from `variables` object
 * @param  {String} string
 * @param  {Object} variables
 * @return {String}
 */
function replaceInString(string, variables) {
    const model = createModel(string);
    let offset = 0;
    let output = '';

    for (let i = 0, il = model.variables.length; i < il; i++) {
        const v = model.variables[i];
        let value = v.name in variables ? variables[v.name] : v.name;
        if (typeof value === 'function') {
            value = value(model.string, v);
        }

        output += model.string.slice(offset, v.location) + value;
        offset = v.location + v.length;
    }

    return output + model.string.slice(offset);
}

/**
 * Creates variable model from given string. The model contains a `string` with
 * all escaped variable tokens written without escape symbol and `variables`
 * property with all unescaped variables and their ranges
 * @param  {String} string
 * @return {Object}
 */
function createModel(string) {
    const reVariable = /\$\{([\w\-]+)\}/g;
    const escapeCharCode = 92; // `\` symbol
    const variables = [];

    // We have to replace unescaped (e.g. not preceded with `\`) tokens.
    // Instead of writing a stream parser, we’ll cut some edges here:
    // 1. Find all tokens
    // 2. Walk string char-by-char and resolve only tokens that are not escaped
    const tokens = new Map();
    let m;
    while (m = reVariable.exec(str)) {
        tokens.set(m.index, m);
    }

    if (tokens.size) { // nothing to parse
        let start = 0, pos = 0, len = string.length;
        let output = '';
        while (pos < len) {
            if (str.charCodeAt(pos) === escapeCharCode && tokens.has(pos + 1)) {
                // Found escape symbol that escapes variable: we should
                // omit this symbol in output string and skip variable
                const token = tokens.get(pos + 1);
                output += string.slice(start, pos) + token[0];
                start = pos = token.index + token[0].length;
                tokens.delete(pos + 1);
                continue;
            }

            pos++;
        }

        string = output + string.slice(start);

        // Not using `.map()` here to reduce memory allocations
        const validMatches = Array.from(tokens.values());
        for (let i = 0, il = validMatches.length; i < il; i++) {
            const token = validMatches[i];
            variables.push({
                name: token[1],
                location: token.index,
                length: token[0].length
            });
        }
    }

    return {string, variables};
}

function splitNodeAtValuePos(node, pos) {
    
}
