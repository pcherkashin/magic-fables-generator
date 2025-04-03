'use client'

import { Sparkles } from 'lucide-react'

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-indigo-200 opacity-25"></div>
        
        {/* Spinning gradient border */}
        <div className="h-16 w-16 rounded-full border-b-4 border-l-4 border-r-4 border-transparent border-t-4 border-t-indigo-600 border-r-purple-600 border-b-pink-500 border-l-indigo-400 animate-spin"></div>
        
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="h-6 w-6 text-indigo-600 animate-pulse" />
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-lg font-medium text-indigo-700">Creating your magical fable...</p>
        <p className="text-sm text-indigo-500 mt-1">This may take a moment as we craft your story</p>
      </div>
    </div>
  )
}