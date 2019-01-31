import * as sdk from 'botpress/sdk'

import _ from 'lodash'

const generateFlow = (data): sdk.FlowGenerationResult => {
    console.log('poll data', data)
    /*let onInvalidText  = undefined
    if (data.config.invalidText && data.config.invalidText.length) {
        onInvalidText = data.config.invalidText
      }*/

    const nodes: sdk.SkillFlowNode[] = [
        {
            name: 'message_question',
            onEnter: [
                {
                    type: sdk.NodeActionType.RunAction,
                    name: 'poll-skills/poll_message',
                    args: data
                }
            ],
            next: [
                { condition: `temp['nextFieldLength'] >= temp['fieldsLength']`, node: '#' },
                { condition: 'true', node: 'question_show' }
            ]
        },
        {
            name: 'question_show',
            onReceive: [
                {
                    type: sdk.NodeActionType.RunAction,
                    name: 'poll-skills/poll_question',
                    args: data
                }
            ],
            next: [
                { condition: `temp['nextFieldLength'] >= temp['fieldsLength']`, node: '#' },
                { condition: 'true', node: 'validate_question' }
            ]
        },
        {
            name: 'validate_question',
            onEnter: [
                {
                    type: sdk.NodeActionType.RunAction,
                    name: 'poll-skills/poll_validate',
                    args: data
                }
            ],
            next: [
                { condition: `temp['validate'] === true`, node: 'message_question'},
                { condition: `temp['finalizedQuestion'] === true`, node: 'END' },
                { condition: 'true', node: 'message_question' }
            ]
        }
    ]
    return {
        transitions: createTransitions(data),
        flow: {
            nodes: nodes,
            catchAll: {
                next: []
            }
        }
    }
}

const createTransitions = data => {
    const transitions: sdk.NodeTransition[] = Object.keys(data.keywords).map(poll => {
        console.log('form createTransitions', poll)
        const pollShort = poll.length > 8 ? poll.substr(0, 7) + '...' : poll

        return {
            caption: `[${pollShort}]`,
            condition: `temp['nextFieldLength'] >= temp['fieldsLength']`,
            node: ''
        }
    })

    transitions.push({
        caption: 'always',
        condition: 'true',
        node: ''
    })

    return transitions
}

export default { generateFlow }