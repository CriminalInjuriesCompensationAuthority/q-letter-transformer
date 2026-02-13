'use strict';

const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

async function createPdfBuffer(html){
    const browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
    });
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
    });

    await browser.close();
    return pdfBuffer;
}

module.exports = createPdfBuffer;