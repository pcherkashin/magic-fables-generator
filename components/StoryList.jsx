import { Button } from '@/components/ui/button'
import { Play, Download } from 'lucide-react'

export default function StoryList({ stories }) {
  const handleDownload = (audioUrl, title) => {
    const link = document.createElement('a')
    link.href = audioUrl
    link.download = `${title}.mp3`
    link.click()
  }

  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Voice</th>
            <th>Length</th>
            <th>Style</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stories.map((story) => (
            <tr key={story.id}>
              <td>{story.title}</td>
              <td>{story.voice || 'N/A'}</td>
              <td>{story.length || 'N/A'}</td>
              <td>{story.style || 'N/A'}</td>
              <td className='flex items-center gap-2'>
                {/* Play audio element directly with controls */}
                <audio src={story.audioUrl} controls className='w-full'>
                  Your browser does not support the audio element.
                </audio>
                <Button
                  size='sm'
                  onClick={() => handleDownload(story.audioUrl, story.title)}
                  className='rounded-full bg-pink-500 hover:bg-pink-600'>
                  <Download className='h-4 w-4' />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
