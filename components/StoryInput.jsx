'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mic } from 'lucide-react'
import StoryOptions from './StoryOptions'
import { useState } from 'react'

export default function StoryInput({
  isRecording,
  setIsRecording,
  onGenerate,
}) {
  const [storyPrompt, setStoryPrompt] = useState('')
  const [voice, setVoice] = useState('alloy') // Default to 'alloy' or any other supported voice
  const [length, setLength] = useState('Short (3 mins)')
  const [style, setStyle] = useState('Adventurous')

  const handleGenerateClick = () => {
    onGenerate(storyPrompt, voice, length, style) // Pass selected voice to the onGenerate function
  }

  return (
    <div>
      <div className='flex flex-col sm:flex-row gap-4 mb-6'>
        <div className='flex-1'>
          <Input
            placeholder='Type your story prompt here...'
            value={storyPrompt}
            onChange={(e) => setStoryPrompt(e.target.value)}
            className='rounded-full'
          />
        </div>
        <Button
          onClick={() => setIsRecording(!isRecording)}
          className={`rounded-full ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}>
          <Mic className='mr-2 h-4 w-4' />
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Button>
      </div>

      <StoryOptions
        voice={voice}
        setVoice={setVoice}
        length={length}
        setLength={setLength}
        style={style}
        setStyle={setStyle}
      />

      <Button
        onClick={handleGenerateClick}
        className='w-full rounded-full bg-green-500 hover:bg-green-600'>
        Generate Story
      </Button>
    </div>
  )
}
