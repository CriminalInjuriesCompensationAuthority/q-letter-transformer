'use strict';

const interpolate = require('./index.js');

describe('interpolate', () => {
    test('replaces a single placeholder in a string value', () => {
        const template = { title: 'Hello {{{name}}}' };
        const data = { name: 'Barry' };

        const result = interpolate({ template, data });

        expect(result).toEqual({ title: 'Hello Barry' });
    });

    test('replaces multiple placeholders in the same string', () => {
        const template = { title: 'Hello {{{first}}} {{{last}}}' };
        const data = { first: 'Barry', last: 'Piccinni' };

        const result = interpolate({ template, data });

        expect(result).toEqual({ title: 'Hello Barry Piccinni' });
    });

    test('replaces placeholders across nested objects', () => {
        const template = {
            letter: {
                subject: 'Case {{{caseId}}}',
                body: 'Dear {{{name}}}'
            }
        };
        const data = { caseId: 'ABC123', name: 'Barry' };

        const result = interpolate({ template, data });

        expect(result).toEqual({
            letter: {
                subject: 'Case ABC123',
                body: 'Dear Barry'
            }
        });
    });

    test('replaces placeholders inside arrays', () => {
        const template = {
            lines: ['Hello {{{name}}}', 'Ref: {{{ref}}}']
        };
        const data = { name: 'Barry', ref: 'XYZ999' };

        const result = interpolate({ template, data });

        expect(result).toEqual({
            lines: ['Hello Barry', 'Ref: XYZ999']
        });
    });

    test('does not change values that contain no placeholders', () => {
        const template = { title: 'Hello world', count: 3, ok: true, nil: null };
        const data = { name: 'Barry' };

        const result = interpolate({ template, data });

        expect(result).toEqual(template);
    });

    test('supports whitespace inside placeholder braces', () => {
        const template = { title: 'Hello {{{   name   }}}' };
        const data = { name: 'Barry' };

        const result = interpolate({ template, data });

        expect(result).toEqual({ title: 'Hello Barry' });
    });

    test('does not mutate the original template object', () => {
        const template = { title: 'Hello {{{name}}}' };
        const data = { name: 'Barry' };

        const before = JSON.parse(JSON.stringify(template));
        interpolate({ template, data });

        expect(template).toEqual(before);
    });

    test('replaces repeated occurrences of the same placeholder', () => {
        const template = { title: '{{{name}}} / {{{name}}} / {{{name}}}' };
        const data = { name: 'Barry' };

        const result = interpolate({ template, data });

        expect(result).toEqual({ title: 'Barry / Barry / Barry' });
    });
});
