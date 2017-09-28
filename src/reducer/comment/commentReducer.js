import createReducer from '../../lib/configureReducer'

const initState = {
  inputShow: 0
}

export default createReducer({
  ['SHOW_COMMENT_INPUT']: (state, action) => {
    return {
      ...state,
      inputShow: state.inputShow + 1
    }
  },
  ['HIDE_COMMENT_INPUT']: (state, action) => {
    return {
      ...state,
      inputShow: 0
    }
  }
}, initState)