"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTextFromPdf = extractTextFromPdf;
const pdf = require('pdf-parse');
async function extractTextFromPdf(buffer) {
    const data = await pdf(buffer);
    return data.text;
}
//# sourceMappingURL=pdf.js.map