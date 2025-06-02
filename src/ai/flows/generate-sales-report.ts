'use server';

/**
 * @fileOverview An AI agent for generating sales reports.
 *
 * - generateSalesReport - A function that generates a sales report based on provided criteria.
 * - GenerateSalesReportInput - The input type for the generateSalesReport function.
 * - GenerateSalesReportOutput - The return type for the generateSalesReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSalesReportInputSchema = z.object({
  criteria: z
    .string()
    .describe(
      'Criteria for generating the sales report, e.g., date range, product categories, etc.'
    ),
});
export type GenerateSalesReportInput = z.infer<typeof GenerateSalesReportInputSchema>;

const GenerateSalesReportOutputSchema = z.object({
  report: z.string().describe('The generated sales report in a readable format.'),
  summary: z.string().describe('A brief summary of the sales report.'),
});
export type GenerateSalesReportOutput = z.infer<typeof GenerateSalesReportOutputSchema>;

export async function generateSalesReport(input: GenerateSalesReportInput): Promise<GenerateSalesReportOutput> {
  return generateSalesReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSalesReportPrompt',
  input: {schema: GenerateSalesReportInputSchema},
  output: {schema: GenerateSalesReportOutputSchema},
  prompt: `You are an expert sales data analyst. Based on the following criteria, generate a comprehensive sales report and a brief summary of the report.

Criteria: {{{criteria}}}

Report Format: The sales report should be well-formatted and easy to read, including key metrics and trends.
Summary Format: A concise summary of the main findings in the sales report.
`,
});

const generateSalesReportFlow = ai.defineFlow(
  {
    name: 'generateSalesReportFlow',
    inputSchema: GenerateSalesReportInputSchema,
    outputSchema: GenerateSalesReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
