"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandom4digitNumber = void 0;
const generateRandom4digitNumber = () => {
    const min = 1000;
    const max = 9999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
exports.generateRandom4digitNumber = generateRandom4digitNumber;
//# sourceMappingURL=generateRoomNumber.js.map