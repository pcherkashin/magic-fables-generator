import { NextResponse } from 'next/server'

export async function POST(request) {
  const openAiApiKey = process.env.OPENAI_API_KEY

  if (!openAiApiKey) {
    console.error('Error: Missing OpenAI API key')
    return NextResponse.json(
      { error: 'Missing OpenAI API key' },
      { status: 500 }
    )
  }

  try {
    // Extract variables from the request body
    const {
      storyPrompt,
      voice,
      length,
      style,
      audioVoice = 'fable',
      speed = 1.0,
      responseFormat = 'mp3',
    } = await request.json()
    console.log('Request received with the following parameters:', {
      storyPrompt,
      voice,
      length,
      style,
      audioVoice,
      speed,
      responseFormat,
    })

    // Create a dynamic system prompt
    const systemPrompt = `
      You are a professional storyteller specializing in creating engaging fables for children. 
      Please create a story that uses the following details:
      
      - **Voice**: ${voice} (e.g., soft, energetic, robotic)
      - **Length**: ${length} (e.g., short, medium, long)
      - **Style**: ${style} (e.g., adventurous, magical, educational, funny)

      The story prompt is: "${storyPrompt}".
      
      Make sure the story is suitable for children and captivating. Keep it within the specified length.
    `
    console.log('System prompt created:', systemPrompt)

    // Step 1: Generate story text using Chat Completion
    const storyResponse = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Generate a story for: "${storyPrompt}"` },
          ],
          max_tokens:
            length === 'Short (5 mins)'
              ? 500
              : length === 'Medium (10 mins)'
              ? 1000
              : 1500,
          temperature: 0.7,
        }),
      }
    )

    if (!storyResponse.ok) {
      console.error(
        'Error fetching story from OpenAI:',
        storyResponse.statusText
      )
      throw new Error('Failed to fetch story from OpenAI')
    }

    const storyData = await storyResponse.json()
    const storyText = storyData.choices[0].message.content
    console.log('Story text generated:', storyText)

    // Step 2: Convert story text to audio using TTS
    const audioResponse = await fetch(
      'https://api.openai.com/v1/audio/speech',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiApiKey}`,
        },
        body: JSON.stringify({
          model: 'tts-1', // or 'tts-1-hd' for higher quality
          input: storyText,
          voice: audioVoice, // Choose from alloy, echo, fable, onyx, nova, shimmer
          response_format: responseFormat, // e.g., mp3
          speed: speed,
        }),
      }
    )

    if (!audioResponse.ok) {
      console.error(
        'Error generating audio from OpenAI:',
        audioResponse.statusText
      )
      throw new Error('Failed to generate audio from OpenAI')
    }

    // Get the audio content
    const audioBuffer = await audioResponse.arrayBuffer()
    console.log('Audio generated successfully')

    // Return both the story text and audio as a base64 string
    return NextResponse.json({
      title: storyPrompt,
      story: storyText,
      audio: `data:audio/${responseFormat};base64,${Buffer.from(
        audioBuffer
      ).toString('base64')}`,
    })
  } catch (error) {
    console.error('Error generating story:', error)
    return NextResponse.json(
      { error: 'Failed to generate story' },
      { status: 500 }
    )
  }
}
