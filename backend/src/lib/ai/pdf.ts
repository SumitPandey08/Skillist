const pdf = require('pdf-parse');

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  const data = await (pdf as any)(buffer);
  return data.text;
}
