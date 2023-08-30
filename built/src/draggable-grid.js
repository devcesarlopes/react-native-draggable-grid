"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DraggableGrid = void 0;
var React = require("react");
var react_1 = require("react");
var react_native_1 = require("react-native");
var block_1 = require("./block");
var utils_1 = require("./utils");
var activeBlockOffset = { x: 0, y: 0 };
exports.DraggableGrid = function (props) {
    var blockPositions = react_1.useState([])[0];
    var orderMap = react_1.useState({})[0];
    var itemMap = react_1.useState({})[0];
    var items = react_1.useState([])[0];
    var _a = react_1.useState(0), blockHeight = _a[0], setBlockHeight = _a[1];
    var _b = react_1.useState(0), blockWidth = _b[0], setBlockWidth = _b[1];
    var gridHeight = react_1.useState(new react_native_1.Animated.Value(0))[0];
    var _c = react_1.useState(false), hadInitBlockSize = _c[0], setHadInitBlockSize = _c[1];
    var isDragging = react_1.useRef(false);
    var dragStartAnimatedValue = react_1.useState(new react_native_1.Animated.Value(1))[0];
    var _d = react_1.useState({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    }), gridLayout = _d[0], setGridLayout = _d[1];
    var _e = react_1.useState(), activeItemIndex = _e[0], setActiveItemIndex = _e[1];
    var overlayOpacity = 0.5;
    var assessGridSize = function (event) {
        if (!hadInitBlockSize) {
            var blockWidth_1 = event.nativeEvent.layout.width / props.numColumns;
            var blockHeight_1 = props.itemHeight || blockWidth_1;
            setBlockWidth(blockWidth_1);
            setBlockHeight(blockHeight_1);
            setGridLayout(event.nativeEvent.layout);
            setHadInitBlockSize(true);
        }
    };
    var _f = react_1.useState(false), panResponderCapture = _f[0], setPanResponderCapture = _f[1];
    var panResponder = react_native_1.PanResponder.create({
        onStartShouldSetPanResponder: function () { return true; },
        onStartShouldSetPanResponderCapture: function () { return false; },
        onMoveShouldSetPanResponder: function () { return panResponderCapture; },
        onMoveShouldSetPanResponderCapture: function () { return panResponderCapture; },
        onShouldBlockNativeResponder: function () { return false; },
        onPanResponderTerminationRequest: function () { return false; },
        onPanResponderGrant: onStartDrag,
        onPanResponderMove: onHandMove,
        onPanResponderRelease: onHandRelease,
    });
    function initBlockPositions() {
        items.forEach(function (_, index) {
            blockPositions[index] = getBlockPositionByOrder(index);
        });
    }
    function getBlockPositionByOrder(order) {
        if (blockPositions[order]) {
            return blockPositions[order];
        }
        var columnOnRow = order % props.numColumns;
        var y = blockHeight * Math.floor(order / props.numColumns);
        var x = columnOnRow * blockWidth;
        return {
            x: x,
            y: y,
        };
    }
    function resetGridHeight() {
        var rowCount = Math.ceil(props.data.length / props.numColumns);
        gridHeight.setValue(rowCount * blockHeight);
    }
    function onBlockPress(itemIndex) {
        props.onItemPress && props.onItemPress(items[itemIndex].itemData);
    }
    function onStartDrag(_, gestureState) {
        var activeItem = getActiveItem();
        if (!activeItem)
            return false;
        isDragging.current = true;
        props.onDragStart && props.onDragStart(activeItem.itemData);
        var x0 = gestureState.x0, y0 = gestureState.y0, moveX = gestureState.moveX, moveY = gestureState.moveY;
        var activeOrigin = blockPositions[orderMap[activeItem.key].order];
        var x = activeOrigin.x - x0;
        var y = activeOrigin.y - y0;
        activeItem.currentPosition.setOffset({
            x: x,
            y: y,
        });
        activeBlockOffset = {
            x: x,
            y: y,
        };
        activeItem.currentPosition.setValue({
            x: moveX,
            y: moveY,
        });
    }
    function areItemsOverlapping(item1, item2) {
        var item1Left = item1.x;
        var item1Right = item1.x + item1.width;
        var item1Top = item1.y;
        var item1Bottom = item1.y + item1.height;
        var item2Left = item2.x;
        var item2Right = item2.x + item2.width;
        var item2Top = item2.y;
        var item2Bottom = item2.y + item2.height;
        return (item1Left < item2Right &&
            item1Right > item2Left &&
            item1Top < item2Bottom &&
            item1Bottom > item2Top);
    }
    function onHandMove(_, gestureState) {
        var activeItem = getActiveItem();
        if (!activeItem)
            return false;
        var moveX = gestureState.moveX, moveY = gestureState.moveY;
        props.onDragging && props.onDragging(gestureState);
        var xChokeAmount = Math.max(0, activeBlockOffset.x + moveX - (gridLayout.width - blockWidth));
        var xMinChokeAmount = Math.min(0, activeBlockOffset.x + moveX);
        var dragPosition = {
            x: moveX - xChokeAmount - xMinChokeAmount,
            y: moveY,
        };
        var originPosition = blockPositions[orderMap[activeItem.key].order];
        var dragPositionToActivePositionDistance = getDistance(dragPosition, originPosition);
        activeItem.currentPosition.setValue(dragPosition);
        var closetItemIndex = activeItemIndex;
        var closetDistance = dragPositionToActivePositionDistance;
        var horizontalMargin = 0.2;
        var verticalMargin = 0.1;
        items.map(function (item, index) {
            if (item.itemData.disabledReSorted)
                return;
            var activeItemCoordinates = {
                x: parseFloat(JSON.stringify(activeItem.currentPosition.x)) + blockWidth / 2,
                y: parseFloat(JSON.stringify(activeItem.currentPosition.y)) + blockHeight / 2,
                width: blockWidth - (horizontalMargin * blockWidth),
                height: blockHeight - (verticalMargin * blockHeight)
            };
            if (index != activeItemIndex) {
                var coordinates = {
                    x: parseFloat(JSON.stringify(item.currentPosition.x)) + blockWidth / 2,
                    y: parseFloat(JSON.stringify(item.currentPosition.y)) + blockWidth / 2,
                    width: blockWidth - (horizontalMargin * blockWidth),
                    height: blockHeight - (verticalMargin * blockHeight)
                };
                var dragPositionToItemPositionDistance = getDistance(dragPosition, blockPositions[orderMap[item.key].order]);
                if (areItemsOverlapping(coordinates, activeItemCoordinates)) {
                    if (JSON.stringify(item.isOverlaying) === '0')
                        displayOverlay(index);
                }
                else {
                    if (JSON.stringify(item.isOverlaying) !== '0')
                        hideOverlay(index);
                }
                if (dragPositionToItemPositionDistance < closetDistance &&
                    dragPositionToItemPositionDistance < blockWidth) {
                    closetItemIndex = index;
                    closetDistance = dragPositionToItemPositionDistance;
                }
            }
        });
        if (activeItemIndex != closetItemIndex) {
            var closetOrder = orderMap[items[closetItemIndex].key].order;
            resetBlockPositionByOrder(orderMap[activeItem.key].order, closetOrder);
            orderMap[activeItem.key].order = closetOrder;
            props.onResetSort && props.onResetSort(getSortData());
        }
    }
    function onHandRelease() {
        var activeItem = getActiveItem();
        if (!activeItem)
            return false;
        props.onDragRelease && props.onDragRelease(getSortData());
        setPanResponderCapture(false);
        activeItem.currentPosition.flattenOffset();
        moveBlockToBlockOrderPosition(activeItem.key);
        endDragStartAnimation();
        isDragging.current = false;
        setActiveItemIndex(undefined);
        items.forEach(function (item, index) {
            if (JSON.stringify(item.isOverlaying) !== '0') {
                hideOverlay(index);
                props.onReleaseOverlaying && props.onReleaseOverlaying(activeItem.itemData, item.itemData);
            }
        });
    }
    function resetBlockPositionByOrder(activeItemOrder, insertedPositionOrder) {
        var disabledReSortedItemCount = 0;
        if (activeItemOrder > insertedPositionOrder) {
            for (var i = activeItemOrder - 1; i >= insertedPositionOrder; i--) {
                var key = getKeyByOrder(i);
                var item = itemMap[key];
                if (item && item.disabledReSorted) {
                    disabledReSortedItemCount++;
                }
                else {
                    orderMap[key].order += disabledReSortedItemCount + 1;
                    disabledReSortedItemCount = 0;
                    moveBlockToBlockOrderPosition(key);
                }
            }
        }
        else {
            for (var i = activeItemOrder + 1; i <= insertedPositionOrder; i++) {
                var key = getKeyByOrder(i);
                var item = itemMap[key];
                if (item && item.disabledReSorted) {
                    disabledReSortedItemCount++;
                }
                else {
                    orderMap[key].order -= disabledReSortedItemCount + 1;
                    disabledReSortedItemCount = 0;
                    moveBlockToBlockOrderPosition(key);
                }
            }
        }
    }
    function moveBlockToBlockOrderPosition(itemKey) {
        var itemIndex = utils_1.findIndex(items, function (item) { return "" + item.key === "" + itemKey; });
        items[itemIndex].currentPosition.flattenOffset();
        react_native_1.Animated.timing(items[itemIndex].currentPosition, {
            toValue: blockPositions[orderMap[itemKey].order],
            duration: 200,
            useNativeDriver: false,
        }).start();
    }
    function displayOverlay(itemIndex) {
        items[itemIndex].currentPosition.flattenOffset();
        react_native_1.Animated.timing(items[itemIndex].isOverlaying, {
            toValue: overlayOpacity,
            duration: 20,
            useNativeDriver: false,
        }).start();
    }
    function hideOverlay(itemIndex) {
        items[itemIndex].currentPosition.flattenOffset();
        react_native_1.Animated.timing(items[itemIndex].isOverlaying, {
            toValue: 0,
            duration: 20,
            useNativeDriver: false,
        }).start();
    }
    function getKeyByOrder(order) {
        return utils_1.findKey(orderMap, function (item) { return item.order === order; });
    }
    function getSortData() {
        var sortData = [];
        items.forEach(function (item) {
            sortData[orderMap[item.key].order] = item.itemData;
        });
        return sortData;
    }
    function getDistance(startOffset, endOffset) {
        var xDistance = startOffset.x + activeBlockOffset.x - endOffset.x;
        var yDistance = startOffset.y + activeBlockOffset.y - endOffset.y;
        return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
    }
    function setActiveBlock(itemIndex, item) {
        if (item.disabledDrag)
            return;
        setPanResponderCapture(true);
        setActiveItemIndex(itemIndex);
    }
    function onPressOut() {
        if (!isDragging.current)
            setActiveItemIndex(undefined);
    }
    function startDragStartAnimation() {
        if (!props.dragStartAnimation) {
            dragStartAnimatedValue.setValue(1);
            react_native_1.Animated.timing(dragStartAnimatedValue, {
                toValue: 1.1,
                duration: 100,
                useNativeDriver: false,
            }).start();
        }
    }
    function endDragStartAnimation() {
        if (!props.dragStartAnimation) {
            react_native_1.Animated.timing(dragStartAnimatedValue, {
                toValue: 1,
                duration: 100,
                useNativeDriver: false,
            }).start();
        }
    }
    function getBlockStyle(itemIndex) {
        return [
            {
                justifyContent: 'center',
                alignItems: 'center',
            },
            hadInitBlockSize && {
                width: blockWidth,
                height: blockHeight,
                position: 'absolute',
                top: items[itemIndex].currentPosition.getLayout().top,
                left: items[itemIndex].currentPosition.getLayout().left,
            },
        ];
    }
    function getDragStartAnimation(itemIndex) {
        if (activeItemIndex != itemIndex) {
            return;
        }
        var dragStartAnimation = props.dragStartAnimation || getDefaultDragStartAnimation();
        return __assign({ zIndex: 3 }, dragStartAnimation);
    }
    function getActiveItem() {
        if (activeItemIndex === undefined)
            return false;
        return items[activeItemIndex];
    }
    function getDefaultDragStartAnimation() {
        return {
            transform: [
                {
                    scale: dragStartAnimatedValue,
                },
            ],
            shadowColor: '#000000',
            shadowOpacity: 0.2,
            shadowRadius: 6,
            shadowOffset: {
                width: 1,
                height: 1,
            },
        };
    }
    function addItem(item, index) {
        blockPositions.push(getBlockPositionByOrder(items.length));
        orderMap[item.key] = {
            order: index,
        };
        itemMap[item.key] = item;
        items.push({
            key: item.key,
            itemData: item,
            currentPosition: new react_native_1.Animated.ValueXY(getBlockPositionByOrder(index)),
            isOverlaying: new react_native_1.Animated.Value(0),
        });
    }
    function removeItem(item) {
        var itemIndex = utils_1.findIndex(items, function (curItem) { return curItem.key === item.key; });
        items.splice(itemIndex, 1);
        blockPositions.pop();
        delete orderMap[item.key];
    }
    function diffData() {
        props.data.forEach(function (item, index) {
            if (orderMap[item.key]) {
                if (orderMap[item.key].order != index) {
                    orderMap[item.key].order = index;
                    moveBlockToBlockOrderPosition(item.key);
                }
                var currentItem = items.find(function (i) { return i.key === item.key; });
                if (currentItem) {
                    currentItem.itemData = item;
                }
                itemMap[item.key] = item;
            }
            else {
                addItem(item, index);
            }
        });
        var deleteItems = utils_1.differenceBy(items, props.data, 'key');
        deleteItems.forEach(function (item) {
            removeItem(item);
        });
    }
    react_1.useEffect(function () {
        startDragStartAnimation();
    }, [activeItemIndex]);
    react_1.useEffect(function () {
        if (hadInitBlockSize) {
            initBlockPositions();
        }
    }, [gridLayout]);
    react_1.useEffect(function () {
        resetGridHeight();
    });
    if (hadInitBlockSize) {
        diffData();
    }
    var itemList = items.map(function (item, itemIndex) {
        return (<block_1.Block onPress={onBlockPress.bind(null, itemIndex)} onPressOut={onPressOut} onLongPress={setActiveBlock.bind(null, itemIndex, item.itemData)} panHandlers={panResponder.panHandlers} style={getBlockStyle(itemIndex)} dragStartAnimationStyle={getDragStartAnimation(itemIndex)} delayLongPress={props.delayLongPress || 300} opacity={item.isOverlaying} key={item.key}>
        {props.renderItem(item.itemData, orderMap[item.key].order)}
      </block_1.Block>);
    });
    return (<react_native_1.Animated.View style={[
        styles.draggableGrid,
        props.style,
        {
            height: gridHeight,
        },
    ]} onLayout={assessGridSize}>
      {hadInitBlockSize && itemList}
    </react_native_1.Animated.View>);
};
var styles = react_native_1.StyleSheet.create({
    draggableGrid: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});
//# sourceMappingURL=draggable-grid.js.map