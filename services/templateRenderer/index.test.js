'use strict';

jest.mock('nunjucks', () => ({
    configure: jest.fn(),
    renderString: jest.fn()
}));

const nunjucks = require('nunjucks');
const render = require('.');

beforeEach(() => jest.clearAllMocks());

test('renders watermark only when isPreview=true and injects title/content/data', () => {
    nunjucks.renderString.mockImplementation((tpl, ctx) => {
        const html =
            (ctx.isPreview ? '<div class="pdf-watermark">PREVIEW</div>' : '') +
            `<h1>${ctx.name ?? ''}</h1>`;
        return html;
    });

    const t = { pageTitle: 'Letter', content: '<p>Hello {{ name }}</p>' };

    const out1 = render(t, { name: 'foobar' }, true);
    const out2 = render(t, { name: 'foobar' }, false);

    expect(out1).toContain('pdf-watermark');
    expect(out2).not.toContain('pdf-watermark');
    expect(out1).toContain('foobar');
    expect(nunjucks.renderString).toHaveBeenCalledWith(
        expect.stringContaining(t.content),
        expect.objectContaining({ isPreview: true, name: 'foobar' })
    );
});
