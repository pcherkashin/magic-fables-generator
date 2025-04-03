'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Mic, Music, Clock, Palette, Globe } from 'lucide-react'

const voices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']
const lengths = ['Short (~1.5 min)', 'Medium (~3 min)', 'Long (~5 min)']
const styles = ['Adventurous', 'Magical', 'Educational', 'Funny']
const languages = [
  'English',
  'Ukrainian',
  'Italian',
  'Spanish',
  'French',
  'German',
  'Arabic',
  'Mandarin',
  'Hindi',
]

export default function StoryOptions({
  voice,
  setVoice,
  length,
  setLength,
  style,
  setStyle,
  language,
  setLanguage,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="flex items-center text-sm font-medium text-indigo-700">
          <Music className="h-4 w-4 mr-2 text-indigo-500" />
          Voice
        </label>
        <Select onValueChange={setVoice} value={voice}>
          <SelectTrigger className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500 bg-white">
            <SelectValue placeholder="Select voice" />
          </SelectTrigger>
          <SelectContent>
            {voices.map((v) => (
              <SelectItem key={v} value={v} className="hover:bg-indigo-50">
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="flex items-center text-sm font-medium text-indigo-700">
          <Clock className="h-4 w-4 mr-2 text-indigo-500" />
          Length
        </label>
        <Select onValueChange={setLength} value={length}>
          <SelectTrigger className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500 bg-white">
            <SelectValue placeholder="Select length" />
          </SelectTrigger>
          <SelectContent>
            {lengths.map((l) => (
              <SelectItem key={l} value={l} className="hover:bg-indigo-50">
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="flex items-center text-sm font-medium text-indigo-700">
          <Palette className="h-4 w-4 mr-2 text-indigo-500" />
          Style
        </label>
        <Select onValueChange={setStyle} value={style}>
          <SelectTrigger className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500 bg-white">
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent>
            {styles.map((s) => (
              <SelectItem key={s} value={s} className="hover:bg-indigo-50">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="flex items-center text-sm font-medium text-indigo-700">
          <Globe className="h-4 w-4 mr-2 text-indigo-500" />
          Language
        </label>
        <Select onValueChange={setLanguage} value={language}>
          <SelectTrigger className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500 bg-white">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang} value={lang} className="hover:bg-indigo-50">
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
