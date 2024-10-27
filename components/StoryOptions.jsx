import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const voices = ['Soft', 'Energetic', 'Robotic', 'Magical']
const lengths = ['Short (5 mins)', 'Medium (10 mins)', 'Long (20 mins)']
const styles = ['Adventurous', 'Magical', 'Educational', 'Funny']

export default function StoryOptions({ voice, setVoice, length, setLength, style, setStyle }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <Select onValueChange={setVoice} value={voice}>
        <SelectTrigger className="rounded-full">
          <SelectValue placeholder="Select voice" />
        </SelectTrigger>
        <SelectContent>
          {voices.map((voice) => (
            <SelectItem key={voice} value={voice}>{voice}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select onValueChange={setLength} value={length}>
        <SelectTrigger className="rounded-full">
          <SelectValue placeholder="Select length" />
        </SelectTrigger>
        <SelectContent>
          {lengths.map((length) => (
            <SelectItem key={length} value={length}>{length}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select onValueChange={setStyle} value={style}>
        <SelectTrigger className="rounded-full">
          <SelectValue placeholder="Select style" />
        </SelectTrigger>
        <SelectContent>
          {styles.map((style) => (
            <SelectItem key={style} value={style}>{style}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}