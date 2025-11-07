# Letter Transformer

Takes a JSON object containing **letter data** and a **template/schema**, renders it to HTML, and returns a **PDF `Buffer`**.  
Supports a **preview mode** (`isPreview: true`) that adds a visible `PREVIEW` watermark.

## Install

```bash
npm i
```

> Requires Node.js and Chromium (handled automatically by `puppeteer`).

## Usage

```js
const fs = require('fs');
const path = require('path');

const createLetterService = require('./index');
const letterService = createLetterService();

// `letter` is the JSON payload shown below under "Example input"
(async () => {
  const out = await letterService.getLetterPdf(letter); // => Buffer

  const outputDir = path.resolve('./output');
  const outputPath = path.join(outputDir, 'a-letter.pdf');

  await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.promises.writeFile(outputPath, out);

  return outputPath;
})();
```

## API

### `getLetterPdf({ schema, letterData, isPreview }): Promise<Buffer>`

- **schema**: JSON schema describing page metadata and HTML content (Nunjucks syntax allowed in strings).
- **letterData**: Plain object with values referenced by the template (e.g., `applicantForename`).
- **isPreview**: `boolean` – when `true`, the output PDF includes a `PREVIEW` watermark.
- **Returns**: a Node.js **`Buffer`** containing the PDF bytes.

## Example input

```json
{
  "id": "123abc",
  "letterData": {
    "caseReferenceNumber": "X/25/700100-TM2A",
    "applicantForename": "Barry",
    "applicantSurname": "Piccinni",
    "dateSent": "27 Oct 2025"
  },
  "isPreview": true,
  "schema": {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "nil-decison-letter": {
        "title": "Decision about your application for compensation",
        "description": "<div class=\"govuk-body\">{{ applicantForename }} {{ applicantSurname }}<br>Reference number: {{ caseReferenceNumber }}<br>{{ dateSent }}</div>"
      }
    },
    "meta": {
      "pageType": "context"
    },
    "examples": [{}],
    "invalidExamples": [
      { "foo": "bar" }
    ]
  }
}
```

## Notes

- Templates use **Nunjucks**; data from `letterData` is available to expressions like `{{ applicantForename }}`.
- The PDF is generated via **Puppeteer** with `A4` format and `printBackground: true`. Adjust in `services/pdf` if needed.
