const { z } = require('zod');

const schema = z.object({
  foo: z.string()
});

console.log("schema.toJSONSchema:", typeof schema.toJSONSchema);
if (schema.toJSONSchema) {
    console.log(JSON.stringify(schema.toJSONSchema(), null, 2));
}

// Try without toJSONSchema but with zod-to-json-schema
try {
    const { zodToJsonSchema } = require('zod-to-json-schema');
    console.log("zod-to-json-schema result:", JSON.stringify(zodToJsonSchema(schema), null, 2));
} catch (e) {
    console.log("zod-to-json-schema failed:", e.message);
}
