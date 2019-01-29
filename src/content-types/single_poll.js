//CHECKSUM:2c904e79a3e2d0b6866d64bf8b24d1ef97224802983534bb9f720ce1567f4f21
"use strict";

const base = require('./_base');

function render(data) {
    const events = [];

    if (data.typing) {
        events.push({
            type: 'typing',
            value: data.typing
        });
    }

    return [...events, {
        on: 'webchat',
        text: data.text,
        quick_replies: data.polls.map(c => ({
            title: c.question,
            //payload: c.value.toUpperCase()
        })),
        typing: data.typing
    }];
}

function renderElement(data, channel) {
    if (channel === 'web' || channel === 'api' || channel === 'hibot') {
        return render(data);
    }

    return []; // TODO Handle channel not supported
}

module.exports = {
    id: 'builtin_single-polls',
    group: 'Built-in Messages',
    title: 'Single Polls',
    jsonSchema: {
        description: 'En esta skills puede realizar un formulario de preguntas',
        type: 'object',
        required: ['polls'],
        properties: {
            polls: {
                type: 'array',
                title: 'Polls Hibot',
                minItems: 1,
                maxItems: 10,
                items: {
                    type: 'object',
                    required: ['question', 'name_file', 'question_type'],
                    properties: {
                        question_type: {
                            title: 'Tipo de pregunta',
                            description: 'Estos son los diferentes tipos de pregunta.', 
                            type: 'string',
                            anyOf: [
                                {
                                  type: "string",
                                  enum: [
                                    "multiple"
                                  ],
                                  title: "Multiple"
                                },
                                {
                                  type: "string",
                                  enum: [
                                    "acotada"
                                  ],
                                  title: "Acotada"
                                },
                                {
                                  type: "string",
                                  enum: [
                                    "abierta"
                                  ],
                                  title: "Abierta"
                                }
                            ]
                        },
                        question: {
                            description: 'Descripción de la pregunta a evaluar',
                            type: 'string',
                            title: 'Pregunta ?'
                        },
                        name_file: {
                            description: 'Nombre de la variable donde se almacenara el campo',
                            type: 'string',
                            title: 'Nombre del campo'
                        },
                    }
                }
            },
            ...base.typingIndicators
        }
    },
    uiSchema: {
        variations: {
            'ui:options': {
                orderable: false
            }
        }
    },
    computePreviewText: formData => `Polls (${formData.polls.length}) ${formData.text}`,
    renderElement: renderElement
};