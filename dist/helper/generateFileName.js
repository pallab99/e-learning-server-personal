"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFileName = void 0;
const generateFileName = (path, identifier, fileName) => {
    return `${path}/${identifier}/${Date.now()}-${fileName}`.replace(/ /g, "");
};
exports.generateFileName = generateFileName;
