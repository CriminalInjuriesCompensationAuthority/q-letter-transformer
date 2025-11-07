'use strict';

jest.mock('./services/transformer', () => jest.fn());
jest.mock('./services/templateRenderer', () => jest.fn());
jest.mock('./services/pdf', () => jest.fn());

const getPdf = require('./services/pdf');
const render = require('./services/templateRenderer');
const transform = require('./services/transformer');
const createLetterBuilder = require('./index.js');

beforeEach(() => jest.clearAllMocks());

test('getLetterPdf orchestrates transform → render → pdf and returns buffer', async () => {
    const buffer = Buffer.from('%PDF-1.7 ... %%EOF');
    transform.mockReturnValue({ pageTitle: 'T', content: '<p>C</p>' });
    render.mockReturnValue('<html>FINAL</html>');
    getPdf.mockResolvedValue(buffer);

    const { getLetterPdf } = createLetterBuilder();

    const input = {
        schema: { foo: 'bar' },
        letterData: { name: 'Ada' },
        isPreview: true
    };

    const out = await getLetterPdf(input);

    expect(transform).toHaveBeenCalledWith(input.schema);
    expect(render).toHaveBeenCalledWith({ pageTitle: 'T', content: '<p>C</p>' }, { name: 'Ada' }, true);
    expect(getPdf).toHaveBeenCalledWith('<html>FINAL</html>');
    expect(out).toBe(buffer);
});

test('bubbles errors from any step', async () => {
    transform.mockImplementation(() => { throw new Error('boom'); });
    const { getLetterPdf } = createLetterBuilder();
    await expect(getLetterPdf({ schema: {}, letterData: {} })).rejects.toThrow('boom');
});
