import { Amplify, API, Auth } from 'aws-amplify'
import settings from '../aws-settings.json'

let amplifySettings = {}
const service = {
  init: () => {
    if (Object.keys(amplifySettings).length === 0) {
      Amplify.configure(settings)
      amplifySettings = settings
    } else {
      // Service is already configured
    }
  },

  getItems: async () => {
    // https://docs.amplify.aws/lib/restapi/fetch/q/platform/js/
    API.get('default', 'items', {}).then((response) => {
      console.log(response)
    })
  },

  postItems: async () => {
    const myInit = {
      headers: {
        Authorization: `Bearer ${(await Auth.currentSession())
          .getIdToken()
          .getJwtToken()}`,
      },
    }
    // https://docs.amplify.aws/lib/restapi/fetch/q/platform/js/
    API.post('default', 'items', myInit).then((response) => {
      console.log(response)
    })
  },

  getMessages: async () => {
    API.get('default', 'messages', {}).then((response) => {
      console.log(response)
    })
  },
}

export default service
