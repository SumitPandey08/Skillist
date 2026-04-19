import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const CareerQuestionSchema = z.object({
  questions: z.array(z.object({
    id: z.string(),
    text: z.string(),
    options: z.array(z.string()),
  }))
});

const schema = zodToJsonSchema(CareerQuestionSchema, { $refStrategy: 'none' });
console.log(JSON.stringify(schema, null, 2));
