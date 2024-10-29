'use client'

import { useState } from 'react'
import StoryInput from '@/components/StoryInput'
import Loader from '@/components/Loader'
import GeneratedStory from '@/components/GeneratedStory'
import StoryList from '@/components/StoryList'
import Pagination from '@/components/Pagination'

export default function MagicFablesPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedStory, setGeneratedStory] = useState(null)
  const [stories, setStories] = useState([]) // Previously generated stories
  const [currentPage, setCurrentPage] = useState(1)

  const handleGenerateStory = async (storyPrompt, voice, length, style) => {
    setIsGenerating(true)

    try {
      // Step 1: Generate the story text
      const storyResponse = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyPrompt, length, style }),
      })

      const storyData = await storyResponse.json()

      if (!storyResponse.ok || !storyData.story) {
        throw new Error('Failed to generate story text.')
      }

      // Step 2: Generate the TTS audio for the story
      const ttsResponse = await fetch('/api/generate-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyText: storyData.story, voice }),
      })

      const ttsData = await ttsResponse.json()

      if (!ttsResponse.ok || !ttsData.audio) {
        throw new Error('Failed to generate TTS audio.')
      }

      // Set generated story and include all relevant details in `stories`
      setGeneratedStory({
        title: storyPrompt,
        story: storyData.story,
        audioUrl: ttsData.audio,
      })
      setStories([
        ...stories,
        {
          id: stories.length + 1,
          title: storyPrompt,
          story: storyData.story,
          audioUrl: ttsData.audio,
          voice,
          length,
          style,
        },
      ])
    } catch (error) {
      console.error('Error generating story:', error)
      alert('Failed to generate story. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 p-4 sm:p-6 lg:p-8'>
      <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-center mb-8 text-purple-600'>
        MagicFables
      </h1>

      <div className='max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 mb-8'>
        <StoryInput
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          onGenerate={handleGenerateStory}
        />

        {isGenerating ? (
          <Loader />
        ) : (
          generatedStory && <GeneratedStory story={generatedStory} />
        )}
      </div>

      <div className='max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6'>
        <StoryList
          stories={stories.slice((currentPage - 1) * 10, currentPage * 10)}
        />
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalItems={stories.length}
          itemsPerPage={10}
        />
      </div>
    </div>
  )
}
