import * as sdk from 'botpress/sdk'
import _ from 'lodash'
import poll from './poll'
import setup from './setup'

const onServerStarted = async (bp: typeof sdk) => {
  console.log('form-skills onServerStarted')
}

const onServerReady = async (bp: typeof sdk) => {
  await setup(bp)
  console.log('form-skills onServerReady')
}

const skillsToRegister: sdk.Skill[] = [
    {
      id: 'poll',
      name: 'Poll',
      flowGenerator: poll.generateFlow
    }
  ]

 const entryPoint: sdk.ModuleEntryPoint = { 
  onServerStarted,
  onServerReady,
  definition: {
    name: 'poll-skills',
    menuIcon: 'fiber_smart_record',
    fullName: 'Poll Skills',
    homepage: 'https://botpress.io',
    noInterface: true,
    plugins: [],
    moduleView: { stretched: true }
  },
  skills: skillsToRegister
 }

export default entryPoint 