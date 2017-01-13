'use strict';

const assert = require('assert');
const parser = require('@emmetio/abbreviation');
require('babel-register');
const resolve = require('../index').default;
const stringify = require('./assets/stringify').default;

describe('Variable Resolver', () => {
    const variables = {
        lang: 'en',
        foo: () => 'bar'
    };

    const parse = abbr => resolve(parser(abbr), variables);
    const expand = abbr => stringify(parse(abbr));

    it('basic resolve', () => {
        assert.equal(expand('html[lang=${lang}]{lang is ${lang}!}'), '<html lang="en">lang is en!</html>');
        assert.equal(expand('div>span[lang=${lang}]{lang is ${lang}!}*2'), '<div><span*2@1 lang="en">lang is en!</span><span*2@2 lang="en">lang is en!</span></div>');
        assert.equal(expand('div>{${foo} ${unknown}}'), '<div>bar unknown</div>');
    });

    it('skip fields', () => {
        assert.equal(expand('{${0} ${1:foo} ${bar}}'), '${0} ${1:foo} bar');
    });
});
