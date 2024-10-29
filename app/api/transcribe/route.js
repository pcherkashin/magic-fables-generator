// /app/api/transcribe/route.js

import { NextResponse } from 'next/server'

export async function POST(request) {
  const openAiApiKey = process.env.OPENAI_API_KEY

  if (!openAiApiKey) {
    return NextResponse.json(
      { error: 'OpenAI API key is missing' },
      { status: 500 }
    )
  }

  try {
    const formData = await request.formData()
    const audioFile = formData.get('file')

    const response = await fetch(
      'https://api.openai.com/v1/audio/transcriptions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openAiApiKey}`,
        },
        body: formData, // Directly pass formData containing the file and model
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Transcription error: ${response.status} - ${errorText}`)
      return NextResponse.json(
        { error: 'Failed to transcribe audio' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json({ text: data.text })
  } catch (error) {
    console.error('Error during transcription:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
