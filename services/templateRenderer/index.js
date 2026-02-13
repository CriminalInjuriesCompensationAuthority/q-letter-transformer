'use strict';

const nunjucks = require('nunjucks');
const path = require('node:path');

const govukFrontendRoot = path.dirname(require.resolve('govuk-frontend/package.json'));
const BASE_DIR = path.resolve(__dirname, '../..');

function render(transformation, data, isPreview){
    nunjucks
        .configure(
        [
            path.join(govukFrontendRoot, 'govuk/'),
            path.join(govukFrontendRoot, 'govuk/components/'),
            path.join(govukFrontendRoot, 'dist'),
            path.join(govukFrontendRoot, 'dist/govuk/'),
            path.join(govukFrontendRoot, 'dist/govuk/components/'),
            path.join(BASE_DIR, 'page/'),
        ],
        { autoescape: true }
    );

    return nunjucks.renderString(
        `
        {% from "button/macro.njk" import govukButton %}
        {% extends "index.njk" %}
        {% block pageTitle %}
            ${transformation.pageTitle} - {{ super() }}
        {% endblock %}
        {% block content %}
           {% if isPreview %}
             <div class="pdf-watermark">PREVIEW</div>
           {% endif %}
             <div class="govuk-grid-row">
               <div class="govuk-grid-column-two-thirds">
                 ${transformation.content}
               </div>
            </div>
        {% endblock %}
        `,
        { isPreview, ...data }
    );
}

module.exports = render;