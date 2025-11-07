'use strict';

const mockInstance = {
    transform: jest.fn().mockReturnValue({ pageTitle: 'X', content: '<p>Y</p>' })
};

jest.mock('q-transformer', () => {
    return () => mockInstance;
});

const transform = require('.');

beforeEach(() => {
    jest.clearAllMocks();
});

test('calls q-transformer.transform with schemaKey and schema', () => {
    const schema = { foo: 'bar' };

    const res = transform(schema);

    expect(mockInstance.transform).toHaveBeenCalledWith({
        schemaKey: 'letterId',
        schema
    });
    expect(res).toEqual({ pageTitle: 'X', content: '<p>Y</p>' });
});
