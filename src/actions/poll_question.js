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

const questions = async (args) => {
    const fieldsNames = Object.keys(args.keywords);
    const nextFieldLength = temp['nextFieldLength'] || 0;
    console.log('temp nextFieldLength', temp['nextFieldLength'])
    console.log('nextFieldLength', nextFieldLength)
    console.log('text payload', event.payload.text)
    console.log('fieldsNames', fieldsNames)
    if (fieldsNames) {
        temp['nextFieldLength'] = nextFieldLength + 1
        const values = {
            //...temp['values'],
            fields: {
                [fieldsNames[nextFieldLength]]: event.payload.text
            }
        }
        console.log('values temp', values)
        temp['fieldsLength'] = fieldsNames.length
    } else {
        console.log('pailas')
    }
}

return questions(args)

