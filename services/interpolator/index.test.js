'use strict';

const interpolate = require('./index.js');

describe('interpolate', () => {
    test('replaces a single placeholder in a string value', () => {
        const schema = { title: 'Hello {{{name}}}' };
        const data = { name: 'Barry' };

        const result = interpolate({ schema, data });

        expect(result).toEqual({ title: 'Hello Barry' });
    });

    test('replaces multiple placeholders in the same string', () => {
        const schema = { title: 'Hello {{{first}}} {{{last}}}' };
        const data = { first: 'Barry', last: 'Piccinni' };

        const result = interpolate({ schema, data });

        expect(result).toEqual({ title: 'Hello Barry Piccinni' });
    });

    test('replaces placeholders across nested objects', () => {
        const schema = {
            letter: {
                subject: 'Case {{{caseId}}}',
                body: 'Dear {{{name}}}'
            }
        };
        const data = { caseId: 'ABC123', name: 'Barry' };

        const result = interpolate({ schema, data });

        expect(result).toEqual({
            letter: {
                subject: 'Case ABC123',
                body: 'Dear Barry'
            }
        });
    });

    test('replaces placeholders inside arrays', () => {
        const schema = {
            lines: ['Hello {{{name}}}', 'Ref: {{{ref}}}']
        };
        const data = { name: 'Barry', ref: 'XYZ999' };

        const result = interpolate({ schema, data });

        expect(result).toEqual({
            lines: ['Hello Barry', 'Ref: XYZ999']
        });
    });

    test('does not change values that contain no placeholders', () => {
        const schema = { title: 'Hello world', count: 3, ok: true, nil: null };
        const data = { name: 'Barry' };

        const result = interpolate({ schema, data });

        expect(result).toEqual(schema);
    });

    test('supports whitespace inside placeholder braces', () => {
        const schema = { title: 'Hello {{{   name   }}}' };
        const data = { name: 'Barry' };

        const result = interpolate({ schema, data });

        expect(result).toEqual({ title: 'Hello Barry' });
    });

    test('does not mutate the original schema object', () => {
        const schema = { title: 'Hello {{{name}}}' };
        const data = { name: 'Barry' };

        const before = JSON.parse(JSON.stringify(schema));
        interpolate({ schema, data });

        expect(schema).toEqual(before);
    });

    test('replaces repeated occurrences of the same placeholder', () => {
        const schema = { title: '{{{name}}} / {{{name}}} / {{{name}}}' };
        const data = { name: 'Barry' };

        const result = interpolate({ schema, data });

        expect(result).toEqual({ title: 'Barry / Barry / Barry' });
    });
});
