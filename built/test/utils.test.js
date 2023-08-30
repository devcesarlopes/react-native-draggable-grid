"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../src/utils");
describe('utils 方法测试', function () {
    var arr = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
    it('findIndex 方法', function () {
        expect(utils_1.findIndex(arr, function (item) { return item.id === 1; })).toBe(0);
        expect(utils_1.findIndex(arr, function (item) { return item.id === 5; })).toBe(-1);
    });
    it('findKey 方法', function () {
        var map = {
            1: { val: 1 },
            2: { val: 2 },
            3: { val: 3 },
        };
        expect(utils_1.findKey(map, function (item) { return item.val === 1; })).toBe('1');
        expect(utils_1.findKey(map, function (item) { return item.val === 5; })).toBe(undefined);
    });
    it('differenceBy 方法', function () {
        var arr2 = [{ id: 1 }, { id: 3 }, { id: 5 }];
        expect(utils_1.differenceBy(arr, arr2, 'id')).toMatchObject([{ id: 2 }, { id: 4 }]);
        expect(utils_1.differenceBy(arr2, arr, 'id')).toMatchObject([{ id: 5 }]);
    });
});
//# sourceMappingURL=utils.test.js.map