// @flow
import {
  AppRegistry
} from 'react-native'
import Test from './index.test'
import index from './src/index'

if (process.env.NODE_ENV === 'development')
  AppRegistry.registerComponent('talkTekApp', () => Test )
else
  AppRegistry.registerComponent('talkTekApp', () => index )