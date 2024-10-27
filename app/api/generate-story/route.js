export async function POST(req) {
    try {
      const { storyPrompt, voice, length, style } = await req.json();
      
      // Simulated story generation
      const generatedStory = {
        title: `The ${style} Adventure of ${storyPrompt}`,
        audioUrl: `/audio/${storyPrompt}-story.mp3`, // Simulated audio URL
      };
      
      return new Response(JSON.stringify(generatedStory), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Story generation failed' }), {
        status: 500,
      });
    }
  }