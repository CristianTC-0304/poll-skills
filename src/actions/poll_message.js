'use strict'
const _ = require('lodash')
const INTENT_PREFIX = 'intent:'

/**
 * Get a variable under this user's storage
 * @title Validate user choice
 * @category Skills
 * @hidden true
 * @author Botpress, Inc.
 * @param {string} data - The parameters of the available choices
 */

const message = async(args) => { 
    const fieldsName = Object.keys(args.keywords)
    const nextFieldLength = temp['nextFieldLength'] || 0
    console.log('nextFieldLength poll message', nextFieldLength)
    console.log('fieldsName example', fieldsName)
    if (nextFieldLength < fieldsName.length) {
        const questionMessage = args.keywords[fieldsName[nextFieldLength]].message[0]
        sendMessage(questionMessage)
        temp['nextFieldLength'] = nextFieldLength
        temp['fieldsLength'] = fieldsName.length
    } else {
        console.log('no hacer nada')
    }
}

const sendMessage = async (message) => {
    console.log('message', message)
    const eventDestination = {target:`${event.target}`, botId: `${event.botId}`, channel: `${event.channel}`, threadId: `${event.threadId}`}
    const full_message = await bp.cms.renderElement('builtin_text', {type: 'text', text: message, typing: true}, eventDestination)
    await bp.events.replyToEvent(eventDestination, full_message) 
}

return message(args)