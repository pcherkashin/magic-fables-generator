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
    const { storyText, voice } = await request.json()
    console.log('Request received for TTS generation:', { storyText, voice })

    const audioResponse = await fetch(
      'https://api.openai.com/v1/audio/speech',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiApiKey}`,
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: storyText,
          voice: voice,
          response_format: 'mp3',
          speed: 1.0,
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

    const audioBuffer = await audioResponse.arrayBuffer()
    console.log('Audio generated successfully')

    return NextResponse.json({
      audio: `data:audio/mp3;base64,${Buffer.from(audioBuffer).toString(
        'base64'
      )}`,
    })
  } catch (error) {
    console.error('Error generating audio:', error)
    return NextResponse.json(
      { error: 'Failed to generate audio' },
      { status: 500 }
    )
  }
}
