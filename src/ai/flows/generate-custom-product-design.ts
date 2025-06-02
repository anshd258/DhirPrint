
'use server';
/**
 * @fileOverview An AI agent to generate custom product designs.
 *
 * - generateCustomProductDesign - Generates a design based on product type, size, prompts, and optional reference image.
 * - GenerateCustomProductDesignInput - Input schema for the flow.
 * - GenerateCustomProductDesignOutput - Output schema for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCustomProductDesignInputSchema = z.object({
  productType: z.enum(['Flex Banner', 'Acrylic Sign', 'Neon Sign']).describe('The type of product to design for.'),
  size: z.string().describe('The size specification for the product.'),
  mainPrompt: z.string().describe('The primary design prompt from the user.'),
  specialRequirements: z.string().optional().describe('Any special requirements or additional instructions.'),
  referenceImageDataUri: z.string().optional().describe("An optional reference image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  referenceImagePrompt: z.string().optional().describe("Prompt related to how the reference image should be used or enhanced."),
  designStyle: z.enum(['Modern', 'Vintage', 'Abstract', 'Photorealistic', 'Minimalist', 'Cartoonish']).optional().describe('The desired overall design style.'),
  colorPalettePreference: z.string().optional().describe('Preferred colors or color palette (e.g., "warm colors", "blue and gold", "monochromatic green").')
});
export type GenerateCustomProductDesignInput = z.infer<typeof GenerateCustomProductDesignInputSchema>;

const GenerateCustomProductDesignOutputSchema = z.object({
  generatedImageUrl: z
    .string()
    .describe(
      "The generated design image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateCustomProductDesignOutput = z.infer<typeof GenerateCustomProductDesignOutputSchema>;

export async function generateCustomProductDesign(input: GenerateCustomProductDesignInput): Promise<GenerateCustomProductDesignOutput> {
  return generateCustomProductDesignFlow(input);
}

const generateCustomProductDesignFlow = ai.defineFlow(
  {
    name: 'generateCustomProductDesignFlow',
    inputSchema: GenerateCustomProductDesignInputSchema,
    outputSchema: GenerateCustomProductDesignOutputSchema,
  },
  async (input) => {
    const { productType, size, mainPrompt, specialRequirements, referenceImageDataUri, referenceImagePrompt, designStyle, colorPalettePreference } = input;
    
    let promptParts: ({ media: { url: string } } | {text: string})[] = [];

    let textPrompt = `Generate a design for a ${productType} of size "${size}". The main idea is: "${mainPrompt}".`;
    
    if (specialRequirements) {
      textPrompt += ` Special requirements: "${specialRequirements}".`;
    }
    if (designStyle) {
        textPrompt += ` The design style should be: "${designStyle}".`;
    }
    if (colorPalettePreference) {
        textPrompt += ` The preferred color palette is: "${colorPalettePreference}".`;
    }

    if (referenceImageDataUri) {
      // Add image part first
      promptParts.push({ media: { url: referenceImageDataUri } });
      // Then add text describing how to use it
      if (referenceImagePrompt) {
        textPrompt += ` Regarding the provided reference image: "${referenceImagePrompt}".`;
      } else {
        textPrompt += ` Consider the provided reference image as inspiration or a base.`;
      }
    }
    
    // Add the fully constructed text prompt as the last part (or only part if no image)
    promptParts.push({ text: textPrompt });

    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp', 
      prompt: promptParts,
      config: {
        responseModalities: ['TEXT', 'IMAGE'], 
         safetySettings: [ 
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ],
      },
    });

    if (!media?.url) {
        throw new Error('AI did not return an image.');
    }

    return { generatedImageUrl: media.url };
  }
);

