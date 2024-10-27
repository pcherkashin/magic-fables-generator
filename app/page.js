'use client'

import { useState } from 'react'
import StoryInput from "@/components/StoryInput"
import Loader from "@/components/Loader"
import GeneratedStory from "@/components/GeneratedStory"
import StoryList from "@/components/StoryList"
import Pagination from "@/components/Pagination"

export default function MagicFablesPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedStory, setGeneratedStory] = useState(null)
  const [stories, setStories] = useState([]) // Previously generated stories
  const [currentPage, setCurrentPage] = useState(1)

  const handleGenerateStory = async (storyPrompt, voice, length, style) => {
    setIsGenerating(true)
    
    // Call API to generate the story
    const response = await fetch('/api/generate-story', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ storyPrompt, voice, length, style }),
    });
    
    const data = await response.json();
    
    setGeneratedStory({ title: data.title, audioUrl: data.audioUrl });
    setIsGenerating(false);
    
    // Update stories (add the new story)
    setStories([...stories, { id: stories.length + 1, ...data }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 p-4 sm:p-6 lg:p-8">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center mb-8 text-purple-600">MagicFables</h1>
      
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 mb-8">
        <StoryInput 
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          onGenerate={handleGenerateStory}
        />
        
        {isGenerating ? <Loader /> : generatedStory && <GeneratedStory story={generatedStory} />}
      </div>
      
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <StoryList stories={stories.slice((currentPage - 1) * 10, currentPage * 10)} />
        <Pagination 
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalItems={stories.length}
          itemsPerPage={10}
        />
      </div>
    </div>
  );
}