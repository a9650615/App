import React, { Component } from 'react'
import { Tester, TestHookStore } from 'cavy'
import AppSpec from './specs/AppSpec'
import App from './src/index'

const testHookStore = new TestHookStore()

export default class AppWrapper extends Component {
  render() {
    return (
      <Tester specs={[AppSpec]} store={testHookStore} waitTime={10000}>
        <App />
      </Tester>
    )
  }
}