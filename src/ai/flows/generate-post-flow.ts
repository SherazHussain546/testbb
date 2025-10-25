'use server';
/**
 * @fileOverview A blog post generation AI agent.
 *
 * - generatePost - A function that handles the blog post generation process.
 * - GeneratePostInput - The input type for the generatePost function.
 * - GeneratePostOutput - The return type for the generatePost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePostInputSchema = z.object({
  topic: z.string().describe('The topic or a simple prompt for the blog post.'),
});
export type GeneratePostInput = z.infer<typeof GeneratePostInputSchema>;

const GeneratePostOutputSchema = z.object({
    title: z.string().describe('The generated title for the blog post.'),
    content: z.string().describe('The generated content for the blog post in Markdown format.'),
});
export type GeneratePostOutput = z.infer<typeof GeneratePostOutputSchema>;

export async function generatePost(input: GeneratePostInput): Promise<GeneratePostOutput> {
  return generatePostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePostPrompt',
  input: {schema: GeneratePostInputSchema},
  output: {schema: GeneratePostOutputSchema},
  prompt: `You are an expert copywriter and blogger. Your task is to write a compelling and well-structured blog post based on the provided topic.

The blog post content should be in Markdown format. It should be engaging, informative, and ready for publication.

Generate a suitable title and content for the blog post.

Topic: {{{topic}}}`,
});

const generatePostFlow = ai.defineFlow(
  {
    name: 'generatePostFlow',
    inputSchema: GeneratePostInputSchema,
    outputSchema: GeneratePostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
