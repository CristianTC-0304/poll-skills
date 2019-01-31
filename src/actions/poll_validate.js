'use strict'
const _ = require('lodash')

/**
 * Get a variable under this user's storage
 * @title Validate user choice
 * @category Skills
 * @hidden true
 * @author Botpress, Inc.
 * @param {string} data - The parameters of the available choices
 */

let nextFieldLength
let typeOption
let fieldsNames
let countQuestion
let message

const validate = async (args) => {
    temp['validate'] = false
    fieldsNames = Object.keys(args.keywords)
    nextFieldLength = temp['nextFieldLength'] || 0
    countQuestion = temp['countQuestion'] || 0
    console.log('args poll validate', args)
    console.log('fieldsNames', fieldsNames)
    console.log('nextFieldLength', nextFieldLength)
    const validate = args.keywords[fieldsNames[nextFieldLength]].question_type[0]
    typeOption = args.keywords[fieldsNames[nextFieldLength]].validate[0]
    console.log('validate poll', validate)
    console.log('typeOption poll', typeOption)
    const option = validateOption(validate)
}

function validateOption(type) {
    console.log('type poll', type)
    const userTex = temp['textUser']
    let option = {
        'abierta': function () {
            console.log('abierta')
            return 'Abierta'
        },
        'cerrada': function () {
            console.log('entro a cerrado')
            const selected = optionCerrada(userTex)
            if (selected.validate) {
                const values = {
                    //...temp['values'],
                    fields: {
                        [fieldsNames[nextFieldLength]]: userTex
                    }
                }
                console.log('values poll', values)
                temp['nextFieldLength'] = nextFieldLength + 1
                console.log('continuar con siguiente pregunta')
                temp['validate'] = true
            } else {
                message = 'Error en tu tipo de respuesta esperabamos SI o NO'
                sendMessage(message)
            }
            return 'Cerrada'
        },
        'multiple': function () {
            console.log('entro a multiple')
            const selected = optionMultiple(userTex)
            if (selected.validate) {
                temp['nextFieldLength'] = nextFieldLength + 1
                temp['countQuestion'] = 0
                temp['validate'] = true
            } else {
                countInvalidQuestion()
            }
            return 'Multiple'
        }
    };
    return (option[type] || option['default'])()
}

function optionCerrada(type) {
    console.log('optionCerrada', type)
    let sendOption = { keywords: null, validate: false }
    for (let inType of typeOption) {
        console.log('inTtype cell', inType)
        if (type == inType) {
            sendOption = {
                keywords: inType,
                validate: true
            }
            return sendOption
        }
    }
    return sendOption
}

function optionMultiple(type) {
    console.log('optionMultiple', type)
    let sendOption = { keywords: null, validate: false }
    for (let expresion of typeOption) {
        const regulate = new RegExp(expresion)

        console.log('expresion regulate', expresion)
        if (regulate.test(type)) {
            console.log('si tiene algo')
            sendOption = {
                keywords: expresion,
                validate: true
            }
            return sendOption
        } else {
            console.log('no tiene nada')
            return sendOption
        }
    }
}

function countInvalidQuestion() {
    temp['countQuestion'] = countQuestion + 1
    temp['nextFieldLength'] = nextFieldLength
    console.log('ejemplo jajajajja', temp['nextFieldLength'], temp['fieldsLength'])
    message = 'Error en tu tipo de respuesta esperabamos de 0 a 10'
    sendMessage(message)
    if (temp['countQuestion'] === 4) {
        message = 'finalizar conversación'
        sendMessage(message)
        temp['finalizedQuestion'] = true
    }
}

const sendMessage = async (message) => {
    const eventDestination = { target: `${event.target}`, botId: `${event.botId}`, channel: `${event.channel}`, threadId: `${event.threadId}` }
    const full_message = await bp.cms.renderElement('builtin_text', { type: 'text', text: message, typing: true }, eventDestination)
    await bp.events.replyToEvent(eventDestination, full_message)
}

return validate(args)