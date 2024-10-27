import { Button } from "@/components/ui/button"
import { Play, Download } from 'lucide-react'

export default function StoryList({ stories }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
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
              <td>{story.voice}</td>
              <td>{story.length}</td>
              <td>{story.style}</td>
              <td>
                <Button size="sm" className="rounded-full bg-purple-500 hover:bg-purple-600">
                  <Play className="h-4 w-4" />
                </Button>
                <Button size="sm" className="rounded-full bg-pink-500 hover:bg-pink-600">
                  <Download className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}