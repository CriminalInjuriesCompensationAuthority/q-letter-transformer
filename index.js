'use strict';

const transform = require('./services/transformer');
const renderer = require('./services/templateRenderer');
const getPdfBuffer = require('./services/pdf');

function createLetterBuilder() {
    async function getLetterPdf(data){
        try {
            const {schema, letterData, isPreview} = data;
            const transformation = transform(schema);
            const html = renderer(transformation, letterData, isPreview);
            return getPdfBuffer(html);
        }
        catch (err) {
            throw new Error (`Failed to transform letter. Id: "${data.id}". Error: ${err}`)
        }
    }

    return Object.freeze({
        getLetterPdf
    });
}

module.exports = createLetterBuilder;
