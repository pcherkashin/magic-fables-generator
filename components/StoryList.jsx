'use client'

import { Button } from '@/components/ui/button'
import { Download, Play, BookOpen } from 'lucide-react'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { useState } from 'react'

export default function StoryList({ stories }) {
  const [expandedStory, setExpandedStory] = useState(null)
  
  const handleDownload = (audioUrl, title) => {
    if (!audioUrl) {
      console.error('No audio URL available for download.')
      alert('Audio is not available for download.')
      return
    }
    try {
      const link = document.createElement('a')
      link.href = audioUrl
      const safeTitle = title?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'magic_fable'
      link.download = `${safeTitle}.mp3` // Assuming mp3
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error triggering download:', error)
      alert('Failed to initiate download.')
    }
  }

  const toggleStoryExpansion = (id) => {
    if (expandedStory === id) {
      setExpandedStory(null)
    } else {
      setExpandedStory(id)
    }
  }

  if (!stories || stories.length === 0) {
    return (
      <div className="text-center py-8 bg-indigo-50 rounded-lg border border-indigo-100">
        <div className="flex flex-col items-center justify-center space-y-3">
          <BookOpen className="h-12 w-12 text-indigo-300" />
          <h3 className="text-xl font-semibold text-indigo-700">No Fables Yet</h3>
          <p className="text-indigo-500 max-w-md">
            Your magical fables will appear here once you create them. Start by entering a prompt above!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden border border-indigo-100 rounded-lg shadow-sm">
        <Table>
          <TableHeader className="bg-gradient-to-r from-indigo-500 to-purple-600">
            <TableRow>
              <TableHead className="text-white font-medium">Title</TableHead>
              <TableHead className="text-white font-medium hidden sm:table-cell">Voice</TableHead>
              <TableHead className="text-white font-medium hidden md:table-cell">Length</TableHead>
              <TableHead className="text-white font-medium hidden lg:table-cell">Style</TableHead>
              <TableHead className="text-white font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stories.map((story) => (
              <>
                <TableRow 
                  key={story.id}
                  className="hover:bg-indigo-50 transition-colors"
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 mr-2 text-indigo-600 hover:text-indigo-800 hover:bg-transparent"
                        onClick={() => toggleStoryExpansion(story.id)}
                      >
                        <BookOpen className="h-4 w-4" />
                      </Button>
                      <span className="truncate max-w-[150px] sm:max-w-xs">
                        {story.title || 'Untitled Fable'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-gray-600">
                    {story.voice || 'N/A'}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-gray-600">
                    {story.length || 'N/A'}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-gray-600">
                    {story.style || 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <audio 
                        controls 
                        controlsList="nodownload noplaybackrate" 
                        src={story.audioUrl} 
                        className="h-8 max-w-[150px] sm:max-w-[200px]"
                        style={{ 
                          background: 'linear-gradient(to right, #6366F1, #8B5CF6)',
                          borderRadius: '9999px'
                        }}
                      >
                        Your browser does not support the audio element.
                      </audio>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownload(story.audioUrl, story.title)}
                        disabled={!story.audioUrl}
                        aria-label="Download audio"
                        className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                {expandedStory === story.id && (
                  <TableRow>
                    <TableCell colSpan={5} className="bg-indigo-50 p-4">
                      <div className="bg-white p-4 rounded-md border border-indigo-100 shadow-sm">
                        <p className="text-gray-700 whitespace-pre-line">{story.story}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
