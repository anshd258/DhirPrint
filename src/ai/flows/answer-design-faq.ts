'use server';

/**
 * @fileOverview Answers user questions about the product design process.
 *
 * - answerDesignFAQ - A function that answers user questions about the product design process.
 * - AnswerDesignFAQInput - The input type for the answerDesignFAQ function.
 * - AnswerDesignFAQOutput - The return type for the answerDesignFAQ function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerDesignFAQInputSchema = z.object({
  question: z.string().describe('The user question about the product design process.'),
});
export type AnswerDesignFAQInput = z.infer<typeof AnswerDesignFAQInputSchema>;

const AnswerDesignFAQOutputSchema = z.object({
  answer: z.string().describe('The AI assistant answer to the user question.'),
});
export type AnswerDesignFAQOutput = z.infer<typeof AnswerDesignFAQOutputSchema>;

export async function answerDesignFAQ(input: AnswerDesignFAQInput): Promise<AnswerDesignFAQOutput> {
  return answerDesignFAQFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerDesignFAQPrompt',
  input: {schema: AnswerDesignFAQInputSchema},
  output: {schema: AnswerDesignFAQOutputSchema},
  prompt: `You are a helpful AI assistant answering questions about the product design process.
  Answer the following question:
  {{{question}}}`,
});

const answerDesignFAQFlow = ai.defineFlow(
  {
    name: 'answerDesignFAQFlow',
    inputSchema: AnswerDesignFAQInputSchema,
    outputSchema: AnswerDesignFAQOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
