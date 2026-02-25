'use strict';

const transform = require('./services/transformer');
const renderTemplate = require('./services/templateRenderer');
const htmlToPdfBuffer = require('./services/pdf');
const interpolate = require('./services/interpolator');

function createLetterBuilder() {
    async function getLetter(data, opts){
        const format = (opts?.format ?? 'PDF').toUpperCase();
        try {
            const {template, letterData, isPreview = false} = data;
            const interpolatedTemplate = interpolate({template, data: letterData});
            if (format === "TEMPLATE"){
                return interpolatedTemplate;
            }

            const transformedTemplate = transform(interpolatedTemplate);
            const html = renderTemplate(transformedTemplate, letterData, isPreview);
            if(format === "HTML"){
                return html
            }

            return htmlToPdfBuffer(html);
        }
        catch (err) {
            throw new Error (`Failed to transform letter. Id: "${data.id}". Error: ${err}`)
        }
    }

    return Object.freeze({
        getLetter
    });
}

module.exports = createLetterBuilder;
