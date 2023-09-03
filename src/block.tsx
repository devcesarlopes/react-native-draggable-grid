/** @format */

import * as React from 'react'
import {
  Animated,
  StyleProp,
  TouchableWithoutFeedback,
  StyleSheet,
  GestureResponderHandlers,
} from 'react-native'
import { FunctionComponent } from 'react'

interface BlockProps {
  style?: StyleProp<any>
  dragStartAnimationStyle: StyleProp<any>
  onPress?: () => void
  onLongPress: () => void
  onPressOut: () => void,
  panHandlers: GestureResponderHandlers
  delayLongPress:number
  children?:React.ReactNode
  opacity:any
  overlayWidth:number
  overlayColor: string
}

export const Block: FunctionComponent<BlockProps> = ({
  style,
  dragStartAnimationStyle,
  onPress,
  onPressOut,
  onLongPress,
  children,
  panHandlers,
  delayLongPress,
  opacity,
  overlayWidth,
  overlayColor
}) => {
  const styles = StyleSheet.create({
    blockContainer: {
      alignItems: 'center',
    },
    parentContainer: {
      display: 'flex',
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center'
    },
    overlayContainer: {
      position: 'absolute',
      display: 'flex',
      width: `${overlayWidth}%`,
      height: '100%',
      opacity: opacity,
      backgroundColor: overlayColor,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center'
    },
    childrenContainer: {
      width: '90%',
      height: '90%',
    },
  })
  
  return (
    <Animated.View style={[styles.blockContainer, style, dragStartAnimationStyle]} {...panHandlers}>
      <Animated.View style={styles.parentContainer}>
        <>
          <Animated.View style={styles.overlayContainer} />
          <TouchableWithoutFeedback style={styles.childrenContainer} delayLongPress={delayLongPress} onPress={onPress} onLongPress={onLongPress} onPressOut={onPressOut}>
            {children}
          </TouchableWithoutFeedback>
        </>
      </Animated.View>
    </Animated.View>
  )
}
