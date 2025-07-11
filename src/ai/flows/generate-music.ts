import { defineFlow } from '@genkit-ai/flow';
import { generate } from '@genkit-ai/ai';
import { gemini15Pro } from '@genkit-ai/googleai';

export const generateMusicFlow = defineFlow(
  {
    name: 'generateMusic',
    inputSchema: {
      prompt: { type: 'string' },
      genre: { type: 'string', optional: true },
      mood: { type: 'string', optional: true }
    },
    outputSchema: {
      musicDescription: { type: 'string' },
      lyrics: { type: 'string', optional: true }
    }
  },
  async (input) => {
    const { output } = await generate({
      model: gemini15Pro, // This was the missing model parameter that caused the error
      prompt: `Generate music based on the following prompt: ${input.prompt}
               ${input.genre ? `Genre: ${input.genre}` : ''}
               ${input.mood ? `Mood: ${input.mood}` : ''}
               
               Please provide a detailed description of the music and any lyrics if appropriate.`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 1000
      }
    });
    
    return {
      musicDescription: output.text(),
      lyrics: extractLyrics(output.text())
    };
  }
);

// Helper function to extract lyrics from the generated text
function extractLyrics(text: string): string | undefined {
  const lyricsMatch = text.match(/Lyrics?:\s*([\s\S]*?)(?:\n\n|$)/i);
  return lyricsMatch ? lyricsMatch[1].trim() : undefined;
}