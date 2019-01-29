import _ from 'lodash'
import * as sdk from 'botpress/sdk'

export default async (bp: typeof sdk) => {
    const router = bp.http.createRouterForBot('poll-skills')

    router.get('/poll/config', async (req, res) => {
        const config = await bp.config.getModuleConfigForBot('poll-skills', req.params.botId)
        res.send(_.pick(config, ['defaultContentElement', 'defaultContentRenderer', 'defaultMaxAttempts', 'matchNumbers']))
    })

    const config = await bp.config.getModuleConfig('poll-skills')
    const checkCategory = async () => {
        const categories = await bp.cms.getAllContentTypes().map(content => content.id)

        if (!categories.includes(config.defaultContentElement)) {
            bp.logger.warn(`Configured to use Content Element "${config.defaultContentElement}", but it was not found.`)

            if (config.defaultContentElement === 'builtin_single-polls') {
                bp.logger.warn(`You should probably install (and use) the @botpress/builtins
        module OR change the "defaultContentElement" in this module's configuration to use your own content element.`)
            }

            return
        }
    }

    if (!config.disableIntegrityCheck) {
        setTimeout(checkCategory, 3000)
    }
}