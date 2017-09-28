// @flow

import { combineReducers } from 'redux'
import audio from './audio/audioReducer'
import member from './member/memberReducer'
import capsule from './capsule/capsuleReducer'
import comment from './comment/commentReducer'

export default combineReducers({
  audio,
  member,
  global,
  capsule,
  comment
})
