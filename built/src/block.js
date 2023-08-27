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
    });
    return (<react_native_1.Animated.View style={[styles.blockContainer, style, dragStartAnimationStyle]} {...panHandlers}>
      <react_native_1.Animated.View>
        <>
          <react_native_1.Animated.View style={styles.overlayContainer}/>
          <react_native_1.TouchableWithoutFeedback delayLongPress={delayLongPress} onPress={onPress} onLongPress={onLongPress} onPressOut={onPressOut}>
            {children}
          </react_native_1.TouchableWithoutFeedback>
        </>
      </react_native_1.Animated.View>
    </react_native_1.Animated.View>);
};
exports.Block = Block;
//# sourceMappingURL=block.js.map