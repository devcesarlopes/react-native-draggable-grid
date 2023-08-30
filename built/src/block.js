"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Block = void 0;
var React = require("react");
var react_native_1 = require("react-native");
var Block = function (_a) {
    var style = _a.style, dragStartAnimationStyle = _a.dragStartAnimationStyle, onPress = _a.onPress, onPressOut = _a.onPressOut, onLongPress = _a.onLongPress, children = _a.children, panHandlers = _a.panHandlers, delayLongPress = _a.delayLongPress, opacity = _a.opacity;
    var styles = react_native_1.StyleSheet.create({
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
            width: '90%',
            height: '100%',
            opacity: opacity,
            backgroundColor: '#d3d3d3',
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center'
        },
        childrenContainer: {
            width: '90%',
            height: '90%',
        },
    });
    return (<react_native_1.Animated.View style={[styles.blockContainer, style, dragStartAnimationStyle]} {...panHandlers}>
      <react_native_1.Animated.View style={styles.parentContainer}>
        <>
          <react_native_1.Animated.View style={styles.overlayContainer}/>
          <react_native_1.TouchableWithoutFeedback style={styles.childrenContainer} delayLongPress={delayLongPress} onPress={onPress} onLongPress={onLongPress} onPressOut={onPressOut}>
            {children}
          </react_native_1.TouchableWithoutFeedback>
        </>
      </react_native_1.Animated.View>
    </react_native_1.Animated.View>);
};
exports.Block = Block;
//# sourceMappingURL=block.js.map