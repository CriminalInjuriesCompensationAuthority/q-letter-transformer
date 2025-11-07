'use strict';

const pdfBuffer = Buffer.from('%PDF-1.7 ... %%EOF');

const mockPdf = jest.fn().mockResolvedValue(pdfBuffer);
const mockSetContent = jest.fn().mockResolvedValue();
const mockNewPage = jest.fn().mockResolvedValue({ setContent: mockSetContent, pdf: mockPdf });
const mockClose = jest.fn().mockResolvedValue();
const mockLaunch = jest.fn().mockResolvedValue({ newPage: mockNewPage, close: mockClose });

jest.mock('puppeteer', () => ({ launch: (...args) => mockLaunch(...args) }));

const createPdfBuffer = require('.');

beforeEach(() => jest.clearAllMocks());

test('launches puppeteer, sets content, generates pdf and closes', async () => {
    const html = '<html><body><h1>Hi</h1></body></html>';
    const out = await createPdfBuffer(html);

    expect(mockLaunch).toHaveBeenCalledWith({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    expect(mockNewPage).toHaveBeenCalled();
    expect(mockSetContent).toHaveBeenCalledWith(html, { waitUntil: 'networkidle0' });
    expect(mockPdf).toHaveBeenCalledWith({ format: 'A4', printBackground: true });
    expect(mockClose).toHaveBeenCalled();
    expect(out).toBe(pdfBuffer);
});
