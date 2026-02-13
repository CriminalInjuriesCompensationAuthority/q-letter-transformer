'use strict';

function interpolate({ schema, data }) {
    const TOKEN = /\{\{\{\s*([\w-]+)\s*\}\}\}/g;

    const json = JSON.stringify(schema);

    const replaced = json.replace(TOKEN, (_, key) => data[key]);

    return JSON.parse(replaced);
}

module.exports = interpolate;
