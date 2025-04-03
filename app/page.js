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

  const handleGenerateStory = async (
    storyPrompt,
    voice,
    length,
    style,
    language
  ) => {
    setIsGenerating(true)

    try {
      // Step 1: Generate the story text
      const storyResponse = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyPrompt, length, style, language }),
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-indigo-50 to-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-indigo-600 mb-6">
            Magic Fables Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Create AI-powered animated fairy tales for kids with just a few clicks. 
            Spark your child&apos;s imagination with personalized stories.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Story Generator Card */}
          <div className="bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 py-4 px-6">
              <h2 className="text-2xl font-bold text-white">Create Your Fable</h2>
            </div>
            <div className="p-6">
              <StoryInput
                isRecording={isRecording}
                setIsRecording={setIsRecording}
                onGenerate={handleGenerateStory}
                isGenerating={isGenerating} // Pass isGenerating state
              />

              {isGenerating ? (
                <div className="mt-8 flex justify-center">
                  <Loader />
                </div>
              ) : (
                generatedStory && <GeneratedStory story={generatedStory} />
              )}
            </div>
          </div>

          {/* Generated Stories Card */}
          {stories.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 py-4 px-6">
                <h2 className="text-2xl font-bold text-white">Your Fables</h2>
              </div>
              <div className="p-6">
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
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-indigo-600 mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md card-hover">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Interactive Animation</h3>
              <p className="text-gray-600">Experience beautifully animated fables tailored to each user</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md card-hover">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Adaptive Storytelling</h3>
              <p className="text-gray-600">Enjoy personalized stories with multiple options and outcomes</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md card-hover">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Learning & Fun</h3>
              <p className="text-gray-600">Have fun learning with our stories while also gaining new knowledge</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
