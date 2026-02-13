'use strict';

jest.mock('./services/transformer', () => jest.fn());
jest.mock('./services/templateRenderer', () => jest.fn());
jest.mock('./services/pdf', () => jest.fn());
jest.mock('./services/interpolator', () => jest.fn());

const htmlToPdfBuffer = require('./services/pdf');
const renderTemplate = require('./services/templateRenderer');
const transform = require('./services/transformer');
const interpolate = require('./services/interpolator');
const createLetterBuilder = require('./index.js');

beforeEach(() => jest.clearAllMocks());

test('getLetterPdf orchestrates interpolate -> transform -> render -> pdf and returns buffer', async () => {
    const buffer = Buffer.from('%PDF-1.7 ... %%EOF');
    interpolate.mockReturnValue({ foo: 'Ada' });
    transform.mockReturnValue({ pageTitle: 'T', content: '<p>C</p>' });
    renderTemplate.mockReturnValue('<html>FINAL</html>');
    htmlToPdfBuffer.mockResolvedValue(buffer);

    const { getLetter } = createLetterBuilder();

    const input = {
        schema: { foo: '{{{ name }}}' },
        letterData: { name: 'Ada' },
        isPreview: true
    };

    const out = await getLetter(input);

    expect(interpolate).toHaveBeenCalledWith({schema: input.schema, data: input.letterData});
    expect(transform).toHaveBeenCalledWith({ foo: 'Ada' });
    expect(renderTemplate).toHaveBeenCalledWith({ pageTitle: 'T', content: '<p>C</p>' }, { name: 'Ada' }, true);
    expect(htmlToPdfBuffer).toHaveBeenCalledWith('<html>FINAL</html>');
    expect(out).toBe(buffer);
});

test('bubbles errors from any step', async () => {
    transform.mockImplementation(() => { throw new Error('boom'); });
    const { getLetter } = createLetterBuilder();
    await expect(getLetter({ schema: {}, letterData: {} })).rejects.toThrow('boom');
});
