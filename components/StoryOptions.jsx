'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const voices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']
const lengths = ['Short (3 mins)', 'Medium (5 mins)', 'Long (10 mins)']
const styles = ['Adventurous', 'Magical', 'Educational', 'Funny']
const languages = [
  'English',
  'Ukrainian',
  'Italian',
  'Spanish',
  'French',
  'German',
  'Arabic',
  'Chinese',
]

export default function StoryOptions({
  voice,
  setVoice,
  length,
  setLength,
  style,
  setStyle,
  language,
  setLanguage, // Add this prop
}) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6'>
      {' '}
      {/* Updated grid-cols */}
      <Select onValueChange={setVoice} value={voice}>
        <SelectTrigger className='rounded-full'>
          <SelectValue placeholder='Select voice' />
        </SelectTrigger>
        <SelectContent>
          {voices.map((voice) => (
            <SelectItem key={voice} value={voice}>
              {voice.charAt(0).toUpperCase() + voice.slice(1)}{' '}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select onValueChange={setLength} value={length}>
        <SelectTrigger className='rounded-full'>
          <SelectValue placeholder='Select length' />
        </SelectTrigger>
        <SelectContent>
          {lengths.map((length) => (
            <SelectItem key={length} value={length}>
              {length}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select onValueChange={setStyle} value={style}>
        <SelectTrigger className='rounded-full'>
          <SelectValue placeholder='Select style' />
        </SelectTrigger>
        <SelectContent>
          {styles.map((style) => (
            <SelectItem key={style} value={style}>
              {style}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select onValueChange={setLanguage} value={language}>
        {' '}
        {/* New language select */}
        <SelectTrigger className='rounded-full'>
          <SelectValue placeholder='Select language' />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang} value={lang}>
              {lang}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
