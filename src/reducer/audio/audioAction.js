import {
  createActions
} from 'redux-actions'

export default createActions({
  'CHANGE_PLAYING_STATE': playState => playState,
  'STORE_CAPSULES_AUDIOS': audios => audios,
  'SETTING_PLAYING_AUDIO_INFO': (audioName, audioLength, audioUrl) => ({audioName, audioLength, audioUrl}),
  'SETTING_NEW_AUDIO_POS': (i, j) => ({i, j})
})
