import { Image } from 'react-native'
import styled from '../../../utils/styledComponent'
import PropTypes from 'prop-types'

const XSmallIcon = styled(Image, (styleProps) => ({
  width: 20,
  height: 20,
  marginLeft: styleProps.marginLeft ? styleProps.marginLeft : 0,
  marginRight: styleProps.marginRight ? styleProps.marginRight : 0,
  marginBottom: styleProps.marginBottom ? styleProps.marginBottom : 0,
  marginTop: styleProps.marginTop ? styleProps.marginTop : 0
}))

XSmallIcon.propTypes = {
  styleProps: PropTypes.object
}

export default XSmallIcon
