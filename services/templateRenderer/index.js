'use strict';

const nunjucks = require('nunjucks');

function render(transformation, data, isPreview){
    nunjucks
        .configure(
            [
                `node_modules/govuk-frontend/govuk/`,
                `node_modules/govuk-frontend/govuk/components/`,
                `node_modules/govuk-frontend/dist`,
                `node_modules/govuk-frontend/dist/govuk/`,
                `node_modules/govuk-frontend/dist/govuk/components/`,
                `page/`
            ],
            {
                autoescape: true
            }
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