// @flow
'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Container,
  View,
  Text,
  Header,
  Left,
  Body,
  Right,
  Button,
  Content,
  Footer,
} from 'native-base'
import {
  TouchableHighlight,
  Image
} from 'react-native'
import styles from './styles'
import Slider from 'react-native-slider'
import { Player } from 'react-native-audio-toolkit'


// const buttons = {
//   close: require('../../assets/img/playAudio/close.png'),
//   footer: {
//     active: {
//       goodActive: {
//         link: require('../../assets/img/playAudio/goodActive.png'),
//         name: '203'
//       },
//       timerActive: {
//         link: require('../../assets/img/playAudio/timerActive.png'),
//         name: '20:39'
//       },
//     },
//     notActive: {
//       good: {
//         link: require('../../assets/img/playAudio/good.png'),
//         name: '203'
//       },
//       timer: {
//         link: require('../../assets/img/playAudio/timer.png'),
//         name: '20:39'
//       },
//       addSpeed: {
//         link: require('../../assets/img/playAudio/addSpeed.png'),
//         name: '速率'
//       },
//       word: {
//         link: require('../../assets/img/playAudio/word.png'),
//         name: '文檔'
//       },
//       more: {
//         link: require('../../assets/img/playAudio/more.png'),
//         name: '更多'
//       }
//     }
//   },
//   body: {
//     backward15: {
//       link: require('../../assets/img/audioElement/backward15.png')
//     },
//     backward: {
//       link: require('../../assets/img/audioElement/backward.png')
//     },
//     play: {
//       link: require('../../assets/img/playAudio/play.png')
//     },
//     forward: {
//       link: require('../../assets/img/audioElement/forward.png')
//     },
//     forward15: {
//       link: require('../../assets/img/audioElement/forward15.png')
//     },
//   }
// }

export default class PlayAudio extends Component {
  static navigationOptions = {
    header: null,
    tabBarVisible: false,
  }

  state = {
    playState: null // need to use redux to solve it
  }

  buttons = {
    close: require('../../assets/img/playAudio/close.png'),
    footer: {
      active: {
        goodActive: {
          link: require('../../assets/img/playAudio/goodActive.png'),
          name: '203'
        },
        timerActive: {
          link: require('../../assets/img/playAudio/timerActive.png'),
          name: '20:39'
        },
      },
      notActive: {
        good: {
          link: require('../../assets/img/playAudio/good.png'),
          name: '203'
        },
        timer: {
          link: require('../../assets/img/playAudio/timer.png'),
          name: '20:39'
        },
        addSpeed: {
          link: require('../../assets/img/playAudio/addSpeed.png'),
          name: '速率'
        },
        word: {
          link: require('../../assets/img/playAudio/word.png'),
          name: '文檔'
        },
        more: {
          link: require('../../assets/img/playAudio/more.png'),
          name: '更多'
        }
      }
    },
    body: {
      backward15: {
        twoState: false,
        link: require('../../assets/img/audioElement/backward15.png')
      },
      backward: {
        twoState: false,
        link: require('../../assets/img/audioElement/backward.png')
      },
      playOrPause: {
        twoState: true,
        playLink: require('../../assets/img/playAudio/play.png'),
        pauseLink: require('../../assets/img/audioElement/pause.png'),
        func: this.props.navigation.state.params.playOrPauseFunc
      },
      forward: {
        twoState: false,
        link: require('../../assets/img/audioElement/forward.png')
      },
      forward15: {
        twoState: false,
        link: require('../../assets/img/audioElement/forward15.png')
      },
    }
  }

  render () {
    const {
      goBack,
    } = this.props.navigation
    const {
      audioLength,
      player,
      title,
      playState,
      playOrPauseFunc
    } = this.props.navigation.state.params
    const footerButtons = Object.values(this.buttons.footer.notActive).map((button, i) => {
      return (
        <TouchableHighlight
          transparent
          key={i}
        >
          <View style={styles.footerFunUnit}>
            <Image
              source={button.link}
              style={styles.footerImages}
            />
            <Text
              style={styles.footerText}
            >
              {button.name}
            </Text>
          </View>
        </TouchableHighlight>
      )
    })

    const bodyButtons = Object.values(this.buttons.body).map((button, i) => (
      <TouchableHighlight
        key={i}
        onPress={() => button.func()}
      >
        <Image
          source={button.twoState
            ? (playState === 'playing'
              ? button.pauseLink : button.playLink
            )
            : button.link
          }
          style={styles.bodyImages}
        />
      </TouchableHighlight>
    ))

    return (
      <Container style={styles.container}>
        <Header style={styles.header}>
          <Left/>
          <Body/>
          <Right>
            <Button
              transparent
              onPress={() => goBack()}
            >
              <Image
                source={this.buttons.close}
              />
            </Button>
          </Right>
        </Header>
        <Content>
          <View style={styles.banner}>
           <Image
             source={require('../../assets/img/knowledgeCapsule/banner.png')}
           />
          </View>
          <View style={styles.body}>
            <View style={styles.title}>
              <Text style={styles.titleText}>
                {title}
              </Text>
            </View>
            <View style={styles.audioType}>
              <Text style={styles.audioTypeText}>
                #方法技能
              </Text>
            </View>
            <View style={styles.slider}>
              <View style={styles.sliderTime}>
                <Text style={styles.sliderTimeText}>00:48</Text>
                <Text/>
                <Text style={styles.sliderTimeText}>{audioLength}</Text>
              </View>
              <Slider
                minimumTrackTintColor='rgb(31, 191, 179)'
                thumbTouchSize={{width: 20, height: 20}}
                trackStyle={styles.track}
                thumbStyle={styles.trackThumb}
              />
            </View>
            <View style={styles.audioFunc}>
              {bodyButtons}
            </View>
          </View>
        </Content>
        <View style={styles.footer}>
          {footerButtons}
        </View>
      </Container>
    )
  }
}

PlayAudio.propTypes = {
  navigation: PropTypes.object.isRequired
}