// @flow
import {
  fork,
  takeLatest,
  call,
  select,
  take,
  put,
} from 'redux-saga/effects'
import {
  CP_AUDIO_INFO_GET,
  CP_AUDIO_INFO_GET_SUCCESS,
  CP_AUDIO_INFO_GET_FAILURE,
  CP_AUDIO_GOOD_CHANGE_SUCCESS,
  CP_AUDIO_GOOD_CHANGE_FAILURE,
  CP_AUDIO_GET_DOC_SUCCESS,
  CP_AUDIO_GET_DOC_FAILURE,
  CP_AUDIO_GOOD_CHANGE,
  CP_AUDIO_GET_DOC,
  AUDIO_LOAD,
  AUDIO_LOADED,
  AUDIO_PLAY,
  AUDIO_PAUSE,
  AUDIO_SEEK,
  AUDIO_TO_NEXT_TRACK,
  AUDIO_TO_PREVIOUS_TRACK,
  AUDIO_UPDATE_INFO,
  AUDIO_UPDATE_CURRENT_TIME,
  AUDIO_GET_NEXT_TRACK,
  AUDIO_GET_PREVIOUS_TRACK,
  // --------R_START-------------
  ON_PRESS,
  ON_PRESS_REQUEST,
  ON_PRESS_SUCCESS,
  ON_PRESS_FAILURE,
} from './audioTypes'
import AudioModule from '../../api/audioModule'
import playerModule from '../../api/playerModule'
import {
  getCapsules,
  getPreviousKey,
  getIsPlayedInfo,
  getAudioLengthBySec,
  isPlaying
} from './audioSelector'
import audioActions from './audioAction'
import playerFactor from '../../factory/playerFactory'

/**
 * subroutines
 */

function * getAudioInfo (data) {
  let { parentKey, capsuleId, memberUid } = data.payload
  let value = yield call(() => new AudioModule().readOnce(`capsules/${parentKey}/audios/${capsuleId}`))
  let audioIsGood = yield call(() => new AudioModule().checkAudioIsLiked(capsuleId, memberUid))
  let key
  if (value) {
    key = CP_AUDIO_INFO_GET_SUCCESS
  } else {
    key = CP_AUDIO_INFO_GET_FAILURE
  }
  yield put({
    type: key,
    payload: {
      ...value,
      audioIsGood
    }
  })
}

function * setAudioGoodState (data) {
  const { isGood, capsulesId, parentKey, userId } = data.payload
  let audioInfo = yield call(() => new AudioModule().getAudioInfo(capsulesId, parentKey))
  try {
    let likeCounter = yield call(() => new AudioModule()[isGood ? 'cpAudioGood' : 'cpAudioNotGood'](capsulesId, parentKey, userId, (audioInfo.likeCounter||0) + (isGood ? +1 : -1)))
    yield put({
      type: CP_AUDIO_GOOD_CHANGE_SUCCESS,
      payload: {
        isGood,
        likeCounter
      }
    })
  } catch (e) {
    yield put({
      type: CP_AUDIO_GOOD_CHANGE_FAILURE,
      payload: e
    })
  }
}

function * getAudioDoc (data) {
  let { capsuleId, parentKey } = data.payload
  let draft = yield call(() => new AudioModule().getAudioDoc(capsuleId, parentKey))
  let type

  if (typeof draft === 'string') {
    type = CP_AUDIO_GET_DOC_SUCCESS
  } else {
    type = CP_AUDIO_GET_DOC_FAILURE
  }
  yield put({
    type,
    payload: {
      draft
    }
  })
}

type arg = {[key: string]: number}
function * audioLoad (value:{payload: { [audio: string]: {}, pos: number }}) {
  const {
    payload: {
      audio
    }
  } = value
  yield call(() => playerModule.load(audio.url))
  yield put({ type: AUDIO_LOADED })
}

function * audioPause () {
  yield call(() => playerModule.pause())
}

const getInfo: {} = (state) => state.audio.playingAudioInfo
const getAudios: {} = (state) => state.audio

function * selectTrack (offset: number) {
  let audios = yield select(getAudios)
  let {pos} = audios.playingAudioInfo.pos
  let datas = makePlain(audios.capsules)
  let index = pos + offset
  let returnIndex = 0
  let data
  if (index < 0) {
    returnIndex = datas.length - 1
  }
  else if (index >= datas.length) {
    returnIndex = 0
  } else {
    returnIndex = index
  }
  
  const iJ = countIJ(audios, returnIndex)
  return { audio: datas[returnIndex], ...iJ, pos: returnIndex }
}

function * audioToNextTrack () {
  let capsule = yield call(() => selectTrack(+1))
  console.log(capsule)
  yield put({
    type: CP_AUDIO_INFO_GET,
    payload: {
      parentKey: capsule.audio.parentKey,
      capsuleId: capsule.audio.id,
      memberUid: yield select((state) => (state.member.uid))
    }
  })
  yield put({
    type: AUDIO_LOAD,
    payload: capsule
  })
}

function * audioToPreviousTrack () {
  let capsule = yield call(() => selectTrack(-1))

  yield put({
    type: CP_AUDIO_INFO_GET,
    payload: {
      parentKey: capsule.audio.parentKey,
      capsuleId: capsule.audio.id,
      memberUid: yield select((state) => (state.member.uid))
    }
  })
  yield put({
    type: AUDIO_LOAD,
    payload: capsule
  })
}

function * audioSeek({ payload }) {
  let data = yield call(() => playerModule.seek(payload*1000))
}

function * audioUpdateCurrentTime () {
  let endTime = yield select((state) => state.audio.playingAudioInfo.length.sec)
  let value = playerModule.currentTime * 0.001
  value = value<0? 0: value
  let sec = Math.floor(value % 60)
  let min = Math.floor(value / 60)

  if (sec < 10) { sec = `0${sec}` }
  if (min < 10) { min = `0${min}` }

  let formatted = `${min}:${sec}`
  // console.log(value === endTime)
  if (value >= endTime - 1) {
    console.log('next')
    yield put({
      type: AUDIO_TO_NEXT_TRACK
    })
  }
  yield put({ type: AUDIO_UPDATE_INFO, payload: {
    currentTime: {
      sec: value,
      formatted
    }
  }})
}

function updateCurrentTime () {
  try {
    console.log('currentTime', playerFactor.player.currentTime)
    let audioLengthBySec = select(getAudioLengthBySec())
    // length = {
    //   formatted: '01:30',
    //   sec: '90',
    // }
    let length = playerFactor.currentTime(audioLengthBySec)
    console.log('length', length)
  } catch (error) {
    throw new Error(error.message)
  }
}

function * timer () {
  try {
    let isAudioPlaying = yield select(isPlaying())
    let timer
    if ( isAudioPlaying ) {
      yield call(startTimer, timer)
    } else {
      yield call(stopTimer, timer)
    }
  } catch (error) {

  }
}

function * startTimer (timer) {
  try {
    timer = setInterval(() => updateCurrentTime(), 400)
  } catch (error) {
    throw new Error(error.message)
  }
}

function * stopTimer (timer) {
  try {
    clearInterval(timer)
  } catch (error) {
    throw new Error(error.message)
  }
}

/**
 *  past two parameters into this function, and get two state from redux store
 *  to recognize if the audio is pressed or not , if be pressed before, then
 *  remove the previous button color, so we need to previousKey of audio
 *  and color the new button, so we need to currentKey of audio
 * @param parentKey : string
 * @param childKey : string
 * eg: -Ks7KSNKLADs32S
 */
function * updateButtonColor (parentKey, childKey) {
  try {
    /**
     * playedAudioInfo: object
     * eg: {
     *  active: '', // this is a abandon prop, we don't use that to do anything
     *  audioName: 'test'
     *  draft: '<p>test</p>'
     *  id: '-Ks8KN....JQ', <--this is childKey
     *  length: {
     *    formatted: '03:53',
     *    sec: '233',
     *  },
     *  likeCounter: 0,
     *  url: 'https://firebasestorage.googleapis.com/....',
     *  parentKey: '-Ks8NFRunciomingYJ...'
     */
    let isPlayed = yield select(getIsPlayedInfo())
    let previousKey = yield select(getPreviousKey())
    if (isPlayed) {
      yield put(audioActions.removeColorRequest())
      yield put(audioActions.removeColorSuccess({
              parentKey: previousKey.father,
              childKey: previousKey.child
            }))
      yield put(audioActions.addColorRequest())
      yield put(audioActions.addColorSuccess({parentKey, childKey}))
    } else {
      yield put(audioActions.addColorRequest())
      yield put(audioActions.addColorSuccess({parentKey, childKey}))
    }
  } catch (error) {
    throw new Error(error)
  }
} 

/**
 * get url and call initAndPlay function through the playFactory
 * playFactory is a singleton object
 *
 * @param url : string
 * eg:
 * "https://firebasestorage.googlepis.com/dfkajlksfjkf...."
 */
function * playNewAudio (url) {
  try {
    yield put(audioActions.audioPlayRequest())
    yield playerFactor.initAndPlay(url)
    yield put(audioActions.audioPlaySuccess())
  } catch (error) {
    throw new Error(error.message)
  }
}

/**
 * get the parentKey and childKey, according that,
 * we can get the specific capsule file we want
 *
 * @param parentKey : string
 * @param childKey : string
 * eg: Ks8Mn5r1iPn7FB8mLWI
 */
function * getAudioFilePicked (parentKey, childKey) {
  try {
    let capsule = yield select(getCapsules(parentKey, childKey))
    return capsule
  } catch( error) {
    throw new Error(error.message)
  }
}

/**
 * get the parentKey and capsule that user pick, and save capsule's file info into store
 * @param capsule : object
 * eg : capsule {
 *  acitve: '',
 *  audioName: "柯文哲好棒棒",
 *  draft: "<p>柯文哲好棒棒</p>",
 *  id: "KJKDFJKSFJDddfdKK",
 *  length: {
 *    formatted: "01:01",
 *    sec: "123"
 *  },
 *  likeCounter: 0,
 *  url: "https://firebasestorage.googlepis.com/dfkajlksfjkf....",
 * }
 */
function * setCapsulePickedIntoReduxStore(capsule, parentKey) {
  try {
    yield put(audioActions.savePlayingAudioStaticInfoRequest())
    yield put(audioActions.savePlayingAudioStaticInfoSuccess({capsule}))
  } catch (error) {
    // yield put(audioActions.savePlayingAudioStaticInfoFailure())
    throw new Error(error.message)
  }
}

/**
 * get ParentKey and childKey, and save them into store
 * this function mainly use for update the color of button
 * @param parentKey : string
 * @param childKey : string
 * eg: '-Ks7SNKSFDKLLSDF'
 */
function * setPreviousKey (parentKey, childKey) {
  try {
    yield put(audioActions.savePreviousKeyRequest())
    yield put(audioActions.savePreviousKeySuccess(parentKey, childKey))
  } catch (error) {
    throw new Error(error.message)
  }
}

/***
 * watcher
 */
// function * audioSaga () {
//   // yield takeLatest(AUDIO_LOAD, press)
//   yield takeLatest(AUDIO_LOADED, audioLoaded)
//   yield takeLatest(AUDIO_PLAY, audioPlay)
//   yield takeLatest(AUDIO_PAUSE, audioPause)
//   yield takeLatest(AUDIO_SEEK, audioSeek)
//   yield takeLatest(AUDIO_TO_NEXT_TRACK, audioToNextTrack)
//   yield takeLatest(AUDIO_TO_PREVIOUS_TRACK, audioToPreviousTrack)
//   yield takeLatest(AUDIO_UPDATE_INFO, audioUpdateInfo)
//   yield takeLatest(AUDIO_UPDATE_CURRENT_TIME, audioUpdateCurrentTime)
//   yield takeLatest(CP_AUDIO_INFO_GET, getAudioInfo)
//   yield takeLatest(CP_AUDIO_GOOD_CHANGE, setAudioGoodState)
//   yield takeLatest(CP_AUDIO_GET_DOC, getAudioDoc)
// }

function * onPressFlow () {
  while(true) {
    yield put(audioActions.onPressRequest())
    const {payload: {parentKey, childKey}} = yield take(ON_PRESS)
    let capsule = yield call(getAudioFilePicked, parentKey, childKey)
    yield call(setCapsulePickedIntoReduxStore, capsule)
    yield put(audioActions.showAudioPopoutBar())
    yield call(playNewAudio, capsule.url)
    yield call(updateButtonColor, parentKey, childKey)
    yield call(setPreviousKey, parentKey, childKey)
    yield call(timer)
    yield put(audioActions.onPressSuccess())
  }
}

function * playFlow () {
  try {

  } catch (error) {

  }
}

function * stopFlow () {
  try {

  } catch (error) {

  }
}

function * seekFlow () {
  try {

  } catch (error) {

  }
}

function * forward15 () {
  try {

  } catch (error) {

  }
}

function * backward15 () {
  try {

  } catch (error) {

  }
}

export default [
  // fork(audioSaga),
  fork(onPressFlow)
]
