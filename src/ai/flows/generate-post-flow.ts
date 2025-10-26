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
  prompt: `You are an expert SEO strategist and world-class copywriter. Your mission is to create a comprehensive, engaging, and highly optimized blog post based on the provided topic.

Your output must adhere to the following strict requirements:

1.  **Content Length**: The generated blog post content MUST be a minimum of 5000 words.
2.  **Deep Search**: Before writing, perform a deep search on the topic to gather in-depth information, statistics, and diverse perspectives. The content should reflect this deep research and provide significant value to the reader.
3.  **SEO Optimization**:
    *   **Keywords**: Naturally integrate primary and long-tail keywords throughout the article. The content must be rich in relevant keywords to maximize search engine visibility.
    *   **Structure**: Use clear headings (H1, H2, H3), subheadings, bullet points, and numbered lists to create a well-structured, easily scannable article.
    *   **Title**: The title must be compelling and SEO-friendly.
4.  **GEO-Targeting**: If the topic mentions a specific city, region, or country, incorporate relevant geo-specific keywords and information to make the content locally relevant.
5.  **External Links**: Include at least 5-10 useful and authoritative external links within the content. These links should point to reputable sources, studies, or tools that provide additional value to the reader. Format them correctly using Markdown syntax, e.g., \`[link text](URL)\`.
6.  **Formatting**: The entire blog post content must be in Markdown format.

Your final output should be a publish-ready, masterpiece article that is informative, engaging, and primed to rank high on search engines.

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
