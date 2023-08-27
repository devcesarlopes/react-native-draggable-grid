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
}) => {
  const styles = StyleSheet.create({
    blockContainer: {
      alignItems: 'center',
    },
    overlayContainer: {
      top: '-3%',
      left: '-6%',
      width: '90%',
      height: '106%',
      opacity: opacity,
      position: 'absolute',
      backgroundColor: '#d3d3d3',
      borderRadius: 20,
      paddingHorizontal: '2%',
    },
  })
  
  return (
    <Animated.View style={[styles.blockContainer, style, dragStartAnimationStyle]} {...panHandlers}>
      <Animated.View>
        <>
          <Animated.View style={styles.overlayContainer} />
          <TouchableWithoutFeedback delayLongPress={delayLongPress} onPress={onPress} onLongPress={onLongPress} onPressOut={onPressOut}>
            {children}
          </TouchableWithoutFeedback>
        </>
      </Animated.View>
    </Animated.View>
  )
}
