'use strict';

const qTransformer = require('q-transformer')();

function transform(schema) {
    return qTransformer.transform({
        schemaKey: 'letterId',
        schema: schema
    });
}

module.exports = transform;