'use strict';

function interpolate({ template, data }) {
    const TOKEN = /\{\{\{\s*([\w-]+)\s*\}\}\}/g;

    const json = JSON.stringify(template);

    const replaced = json.replace(TOKEN, (_, key) => data[key]);

    return JSON.parse(replaced);
}

module.exports = interpolate;
