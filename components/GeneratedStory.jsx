import { Button } from "@/components/ui/button"
import { Play, Download } from 'lucide-react'

export default function GeneratedStory({ story }) {
  return (
    <div className="mt-6 p-4 bg-yellow-100 rounded-xl">
      <h3 className="text-xl font-semibold mb-2">{story.title}</h3>
      <div className="flex items-center gap-4">
        <audio controls src={story.audioUrl} className="w-full">
          Your browser does not support the audio element.
        </audio>
        <Button className="rounded-full bg-pink-500 hover:bg-pink-600">
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </div>
    </div>
  );
}