# Magic Fables Generator

An AI-powered application that creates personalized fairy tales for children with text-to-speech capabilities.

## Overview

Magic Fables Generator uses OpenAI's GPT-4 to create unique, engaging stories for children based on your prompts. The application also converts these stories to audio using OpenAI's text-to-speech technology, providing a complete storytelling experience.

## Features

- **AI-Generated Stories**: Create custom fairy tales based on your prompts
- **Text-to-Speech**: Listen to the stories with high-quality voice narration
- **Multiple Voice Options**: Choose from different voice styles
- **Story Length Control**: Select short (~1.5 min), medium (~3 min), or long (~5 min) stories
- **Style Selection**: Choose from adventurous, magical, educational, or funny story styles
- **Multi-language Support**: Generate stories in different languages
- **Voice Recording**: Use your microphone to record story prompts
- **Story Library**: Save and access your previously generated stories

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory with your OpenAI API key (you can copy from `.env.example`):
   ```
   OPENAI_API_KEY=your-openai-api-key-here
   ```
   > **Important**: You must add your OpenAI API key to generate stories. Get your API key from [OpenAI's platform](https://platform.openai.com/).

4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

1. Enter a story prompt or use the microphone to record your idea
2. Select your preferred voice, story length, style, and language
3. Click "Generate Fable" to create your story
4. Once generated, you can read the story and listen to the audio narration
5. Your stories are saved automatically for future access

## Technologies Used

- **Next.js**: React framework for the frontend and API routes
- **OpenAI GPT-4**: For generating creative story content
- **OpenAI TTS-1**: For text-to-speech conversion
- **Tailwind CSS**: For styling the application
- **React**: For building the user interface

## Development

This project uses Next.js App Router. The main components are:

- `app/page.js`: Main application page
- `app/api/generate-story/route.js`: API endpoint for story generation
- `app/api/generate-tts/route.js`: API endpoint for text-to-speech conversion
- `app/api/transcribe/route.js`: API endpoint for voice recording transcription
- `components/`: UI components for the application

## License

[MIT](https://choosealicense.com/licenses/mit/)
