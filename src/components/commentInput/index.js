import React, { Component } from 'react'
import {
  KeyboardAvoidingView,
  TextInput,
  View,
  Keyboard
} from 'react-native'
import commentAction from '../../reducer/comment/commentAction'
import { bindActionCreators } from 'redux'
import {connect} from 'react-redux'
import { Button } from '../../components/button'
import { LAYOUT, COLORS } from 'StyleConfig'

const style = {
  wrapper: {
    backgroundColor: COLORS.pureWhite,
    width: '100%',
    position: 'absolute',
    bottom: 0
  },
  mainView: {
    padding: 10
  },
  inputStyle: {
    height: 32, 
    borderColor: 'gray', 
    borderWidth: 1,
    borderRadius: 7,
    flex: 3,
    alignItems: 'center',
    paddingTop:5,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 5
  }
}

class CommentInput extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.isShow) {
      this.refs.input.focus()
      console.log(this.refs)
    }
  }

  componentDidMount() {
    Keyboard.addListener('keyboardWillHide', this._keyboardDidHide)
  }

  _keyboardDidHide = () => {
    this.props.action.hideCommentInput()
  }

  render() {
    return (
      <KeyboardAvoidingView behavior='padding' style={style.wrapper}>
        <View style={[LAYOUT.horizontal, style.mainView, this.props.isShow? {}: {display: 'none'}]}>
          <TextInput
            style={style.inputStyle}
            placeholder='輸入您的留言'
            ref='input'
            />
          <Button
            text="送出"
            backgroundColor={COLORS.green}
            textColor='white'
            borderRadius={5}
            style={{flex: 1, marginLeft: 3}}
            />
        </View>
      </KeyboardAvoidingView> 
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isShow: state.comment.inputShow
  }
}

const mapActionToProps = (dispatch) => {
  return {
    action: bindActionCreators({...commentAction}, dispatch)
  }
}

export default connect(mapStateToProps, mapActionToProps)(CommentInput)