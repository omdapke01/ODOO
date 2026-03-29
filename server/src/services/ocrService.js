const Tesseract = require("tesseract.js");

function extractAmount(text) {
  const match = text.match(/(?:INR|USD|EUR|Rs\.?|₹|\$)\s?(\d[\d,]*\.?\d{0,2})/i);
  return match ? Number(match[1].replace(/,/g, "")) : null;
}

function extractDate(text) {
  const match = text.match(/\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\b/);
  return match ? match[1] : null;
}

async function parseReceipt(filePath) {
  const result = await Tesseract.recognize(filePath, "eng");
  const text = result.data.text || "";
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);

  return {
    amount: extractAmount(text),
    date: extractDate(text),
    merchantName: lines[0] || null,
    rawText: text,
  };
}

module.exports = { parseReceipt };
