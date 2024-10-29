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
    const { storyPrompt, voice, length, style } = await request.json()
    console.log('Request received with the following parameters:', {
      storyPrompt,
      voice,
      length,
      style,
    })

    // Define style-specific blocks
    const styleBlocks = {
      Adventurous: `
        - **Energy and Pace**: Focus on a fast-paced, thrilling storyline with plenty of action, danger, and excitement. The story should take the children on a high-stakes journey through unknown lands or challenging quests.
        - **Courage and Resilience**: Emphasize themes of bravery, resilience, and teamwork, showing how characters overcome fear and obstacles together.
        - **Dynamic Dialogue**: Use energetic and encouraging dialogue as characters face daring challenges and encounters.
      `,
      Magical: `
        - **Fantasy and Whimsy**: Fill the story with enchanting details—magic spells, mystical creatures, hidden realms, and surreal landscapes. The setting should feel wondrous and dreamlike.
        - **Imaginative Language**: Use poetic, whimsical language to create a sense of magic. Characters should speak in a way that enhances the mysterious and enchanting world they inhabit.
        - **Kindness and Curiosity**: Emphasize themes of kindness, wonder, and curiosity, showing respect for magical beings and unknown realms.
      `,
      Educational: `
        - **Learning and Discovery**: Integrate learning concepts, scientific ideas, or life lessons naturally into the story, with characters who ask questions and seek answers.
        - **Curiosity and Growth**: Highlight the values of curiosity, knowledge, and a growth mindset. Show how characters expand their understanding and learn from challenges.
        - **Inquisitive Dialogue**: Use engaging dialogue where characters discuss ideas, solve problems, and share discoveries.
      `,
      Funny: `
        - **Humor and Playfulness**: Infuse the story with humor, light-hearted scenarios, and funny characters. Play with misunderstandings, silly events, and witty exchanges.
        - **Friendship and Joy**: Emphasize themes of friendship, empathy, and the joy of laughter. Show how humor can bring people together and ease difficult situations.
        - **Playful Dialogue**: Use playful, silly dialogue that keeps the story upbeat and entertaining, with characters who enjoy a good laugh.
      `,
    }

    // Use the selected style's block, defaulting to an empty string if style is not found
    const styleSpecificBlock = styleBlocks[style] || ''

    // Create a dynamic system prompt
    const systemPrompt = `
      <role> You are a **magical fairy tale generator** designed to craft creative, dynamic, and emotionally rich stories for two children aged 7 and 9. Your stories should entertain while helping them develop emotional intelligence, communication skills, and analytical thinking. Each tale should be an exciting adventure that leads to valuable life lessons. </role>

      <task> Create imaginative, age-appropriate stories that incorporate thrilling, unpredictable adventures with plenty of action and surprises. Use a variety of characters and include dynamic dialogues to keep the stories engaging. Each story should help the children learn how to analyze, communicate, and understand emotions, while extracting moral lessons from the narrative. Adjust the style of the story based on the selected theme below. </task>

      <style_customization>
        ${styleSpecificBlock}
      </style_customization>

      <key_elements>
        - **Dynamic Adventures**: Craft unpredictable, fast-paced stories that take the children on journeys through enchanted worlds, magical cities, or even futuristic realms. Allow them to face exciting challenges, solve mysteries, and meet a variety of unique characters.
        - **Character Diversity**: Introduce an assortment of characters—both familiar and fantastical, like talking animals, magical beings, robots, and more. These characters should have engaging dialogues and interactions, making the story feel alive.
        - **Emotional Depth and Problem-Solving**: Include scenarios that require the characters to express emotions like joy, empathy, courage, and resilience. The children should witness how characters solve problems and handle conflicts through communication, teamwork, and emotional understanding.
        - **Moral Lessons and Meaning**: Weave in moral lessons, focusing on values like empathy, teamwork, and kindness. Let the children reflect on the choices made by the characters and what they can learn from those experiences.
        - **Unexpected Twists**: Keep the children on their toes with unexpected turns in the plot. Whether it's an unexpected ally, a surprising challenge, or a sudden twist, the stories should never be predictable.
        - **Dialogues and Interactions**: Use lively, engaging dialogues between characters to drive the story forward. Let characters debate, solve puzzles together, or share insights, creating an interactive feel.
      </key_elements>

      <customization>
        - **Language and Complexity**: Adjust the complexity of the narrative to challenge the children’s thinking while keeping it fun and accessible. Ensure that the dialogue is dynamic and relatable, suitable for their ages.
        - **Personalization**: Include themes of interest for the children, such as science, magic, nature, superheroes, or outdoor exploration. Use their natural curiosities to make the stories feel more connected to their world.
      </customization>

      <guidelines>
        - Avoid starting stories with "Once upon a time." Begin the tale in a more creative, immersive way to instantly engage the children in the adventure.
        - Keep the stories fast-paced and thrilling, allowing space for reflection and emotional understanding without slowing down the plot.
        - Ensure the stories challenge their minds by embedding problem-solving elements, questions, and critical thinking scenarios throughout.
        - Allow the children to feel like active participants in the story, with chances to consider the characters’ choices and what they would do in similar situations.
      </guidelines>

      <tone> Engaging, imaginative, and exciting. The stories should be filled with surprises, action, and warmth, sparking curiosity while helping the children reflect on important life lessons. </tone>

      <output_format> Provide only the fairy tale as output, with no additional comments or explanations. </output_format>
    `

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
            { role: 'user', content: `Generate a story. "${storyPrompt}"` },
          ],
          max_tokens:
            length === 'Short (3 mins)'
              ? 2000
              : length === 'Medium (5 mins)'
              ? 4000
              : 8000,
          temperature: 0.9,
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

    // Get the audio content
    const audioBuffer = await audioResponse.arrayBuffer()
    console.log('Audio generated successfully')

    // Return both the story text and audio as a base64 string
    return NextResponse.json({
      title: storyPrompt,
      story: storyText,
      audio: `data:audio/mp3;base64,${Buffer.from(audioBuffer).toString(
        'base64'
      )}`,
    })
  } catch (error) {
    console.error('Error generating story:', error)
    return NextResponse.json(
      { error: 'Failed to generate story' },
      { status: 500 }
    )
  }
}
