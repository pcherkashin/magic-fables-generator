'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

export default function StoryList({ stories }) {
  const handleDownload = (audioUrl, title) => {
    const link = document.createElement('a')
    link.href = audioUrl
    link.download = `${title}.mp3`
    link.click()
  }

  return (
    <div className='overflow-x-auto'>
      <table className='w-full border-collapse'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='p-3 text-left font-semibold'>Title</th>
            <th className='p-3 text-left font-semibold'>Voice</th>
            <th className='p-3 text-left font-semibold'>Length</th>
            <th className='p-3 text-left font-semibold'>Style</th>
            <th className='p-3 text-left font-semibold'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stories.map((story, index) => (
            <tr
              key={story.id}
              className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className='p-3'>
                <div className='break-words max-w-xs'>{story.title}</div>
              </td>
              <td className='p-3'>{story.voice || 'N/A'}</td>
              <td className='p-3'>{story.length || 'N/A'}</td>
              <td className='p-3'>{story.style || 'N/A'}</td>
              <td className='p-3'>
                <div className='flex items-center gap-2'>
                  <audio controls className='w-48 h-8'>
                    <source src={story.audioUrl} type='audio/mpeg' />
                    Your browser does not support the audio element.
                  </audio>
                  <Button
                    size='sm'
                    onClick={() => handleDownload(story.audioUrl, story.title)}
                    className='rounded-full bg-pink-500 hover:bg-pink-600 p-2'>
                    <Download className='h-4 w-4' />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
