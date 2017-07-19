// @flow
'use strict'

import React, { Component } from 'react'
import { 
  View,
  Text,
  TouchableOpacity,
  Button
} from 'react-native'
import {
  Thumbnail,
  Input,
  Content,
  Container
} from 'native-base'
import { memberInfoStyle } from './styles'

class MemberInfo extends Component {
  formData = {
    account: { text: '帳號' },
    password: { text: '設定密碼' },
    gender: { text: '性別' },
    birthday: { text: '生日' }
  }

  static navigationOptions = (navigation) => ({
    headerRight: <HeaderRight navigation={navigation.navigation} />
  })

  _renderFormComponent(key) {
    let data = this.formData[key]
    return (
      <View key={key} style={memberInfoStyle.formInput}>
        <View style={memberInfoStyle.input}>
          <Text style={memberInfoStyle.inputLabel}>{data.text}</Text>
        </View>
        <View style={memberInfoStyle.inputArea}>
          <Input style={memberInfoStyle.textInput} />
        </View>
      </View>
    )
  }

  render() {
    return (
      <Container style={memberInfoStyle.container}>
        <Content>
          <View style={memberInfoStyle.avatar}>
            <Thumbnail 
              source={require('../../assets/img/memberCenter/profileIcon.png')}
              style={memberInfoStyle.avatarImg}
            />
            <TouchableOpacity
              style={memberInfoStyle.uploadBtn}
            >
              <Text style={memberInfoStyle.uploadBtnText}>
                上傳照片
              </Text>
            </TouchableOpacity>
          </View>
          <View style={memberInfoStyle.form}>
            {
              Object.keys(this.formData)
                .map(this._renderFormComponent.bind(this))
            }
          </View>
        </Content>
      </Container>
    )
  }
}

class HeaderRight extends Component {
  render() {
    console.log(this.props)
    return (
      <Button 
        title="儲存"
        color="#fff"
        onPress={() => this.props.navigation.goBack()}
        />
    )
  }
}

export { MemberInfo as default, HeaderRight }
