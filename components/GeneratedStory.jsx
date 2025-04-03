'use client'

import { Button } from '@/components/ui/button'
import { Download, Play, BookOpen } from 'lucide-react'
import { useState } from 'react'

export default function GeneratedStory({ story }) {
  const [showFullStory, setShowFullStory] = useState(false)
  
  if (!story) {
    return null // Don't render anything if there's no story
  }

  const handleDownload = () => {
    // Basic check for audioUrl
    if (!story.audioUrl) {
      console.error('No audio URL available for download.')
      alert('Audio is not available for download.')
      return
    }
    try {
      const link = document.createElement('a')
      link.href = story.audioUrl
      // Sanitize title for filename - replace non-alphanumeric with underscore
      const safeTitle = story.title?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'magic_fable'
      link.download = `${safeTitle}.mp3` // Assuming mp3, adjust if format varies
      document.body.appendChild(link) // Required for Firefox
      link.click()
      document.body.removeChild(link) // Clean up
    } catch (error) {
      console.error('Error triggering download:', error)
      alert('Failed to initiate download.')
    }
  }

  return (
    <div className="mt-8 space-y-6 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-100 shadow-inner">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-indigo-700">
          {story.title || 'Your Magical Fable'}
        </h3>
        <div className="flex space-x-2">
          <Button
            onClick={() => setShowFullStory(!showFullStory)}
            variant="outline"
            size="sm"
            className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            {showFullStory ? "Hide Story" : "Read Story"}
          </Button>
        </div>
      </div>
      
      {/* Story Text (Collapsible) */}
      {showFullStory && (
        <div className="bg-white p-4 rounded-md border border-indigo-100 shadow-sm">
          <p className="text-gray-700 whitespace-pre-line">{story.story}</p>
        </div>
      )}
      
      {/* Audio Player */}
      <div className="bg-white p-4 rounded-md border border-indigo-100 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center space-x-2 flex-grow">
            <Play className="h-5 w-5 text-indigo-500" />
            <audio 
              controls 
              src={story.audioUrl} 
              className="w-full flex-grow rounded-md"
              style={{ 
                height: '40px',
                background: 'linear-gradient(to right, #6366F1, #8B5CF6)'
              }}
            >
              Your browser does not support the audio element.
            </audio>
          </div>
          
          <Button
            onClick={handleDownload}
            variant="outline"
            size="sm"
            className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 whitespace-nowrap"
            disabled={!story.audioUrl}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Audio
          </Button>
        </div>
      </div>
      
      {/* Share Options (Optional) */}
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          className="text-indigo-600 hover:bg-indigo-50"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: story.title || 'My Magic Fable',
                text: 'Check out this fable I created with Magic Fables!',
              }).catch(err => console.error('Error sharing:', err));
            } else {
              alert('Sharing is not supported in your browser.');
            }
          }}
        >
          Share this fable
        </Button>
      </div>
    </div>
  )
}
