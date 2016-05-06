import { createStore } from 'redux'
import reducer from '../reducers/options'
import { configBundle } from '../../utils/storage'

const store = createStore(reducer)

export default store

store.subscribe(() => {
  configBundle.writeAsync('settings.json', JSON.stringify(store.getState()))
    .then(() => {
      // TODO: IPC
      console.info('Data has been stored.')
    })
})
