// @flow
import { Player } from 'react-native-audio-toolkit'

let player = null
let isPlayerEnded = true
export default class PlayerControl {

  static async _init (url) {
    if (player) {
      await this._destroy(player)
    }
    isPlayerEnded = false
    return new Promise((resolve, reject) => {
        player = new Player(url, {
          autoDestory: false,
          continuesToPlayInBackground: true
        })
        player.prepare(resolve)
        player.on('ended', () => {
          isPlayerEnded = true
        })
      })
  }

  static _destroy (player) {
    return new Promise((resolve, reject) => {
      player.destroy(resolve)
    })
  }

  static play () {
    player? player.play(): null
  }

  static pause () {
    player? player.pause(): null
  }

  static playPause () {
    return new Promise((resolve, reject) => {
      player? player.playPause(resolve): null
    })
  }

  static seek (position: number) {
    return new Promise((resolve, reject) => {
      player? player.seek(position, resolve): null
    })
  }

  static wakeLock(isWake: boolean) {
    player.wakeLock = isWake
  }

  static get stoped():boolean {
    return player.isStopped
  }

  static get isEnded():boolean {
    return isPlayerEnded
  }

  static get currentTime():?number {
    return player.currentTime
  }

  static async load (url: string) {
    return await this._init(url)
  }
}