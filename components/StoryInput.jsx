'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mic, Sparkles } from 'lucide-react'
import StoryOptions from './StoryOptions'

export default function StoryInput({
  isRecording,
  setIsRecording,
  onGenerate,
  isGenerating, // Added prop
}) {
  const [storyPrompt, setStoryPrompt] = useState('')
  const [voice, setVoice] = useState('alloy')
  const [length, setLength] = useState('Short (~1.5 min)')
  const [style, setStyle] = useState('Adventurous')
  const [isProcessing, setIsProcessing] = useState(false)
  const [language, setLanguage] = useState('English')
  const [isMobile, setIsMobile] = useState(false)
  const mediaRecorderRef = useRef(null)
  let audioChunks = []

  useEffect(() => {
    // Check if window is defined (runs only on client)
    if (typeof window !== 'undefined') {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
    }
  }, [])

  const handleGenerateClick = () => {
    if (!storyPrompt.trim()) {
      // Optionally add user feedback here (e.g., alert or inline message)
      console.warn('Story prompt cannot be empty.')
      return
    }
    onGenerate(storyPrompt, voice, length, style, language)
  }

  const handleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      // Check for mobile added here as navigator might not be available server-side initially
      const mobileCheck = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      if (mobileCheck) {
        startMobileRecording()
      } else {
        startWebRecording()
      }
    }
  }

  const startWebRecording = () => {
    setIsRecording(true)
    setIsProcessing(false) // Reset processing state
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const options = { mimeType: 'audio/webm;codecs=opus' }
        const mediaRecorder = new MediaRecorder(stream, options)
        mediaRecorderRef.current = mediaRecorder
        mediaRecorder.start()

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.push(event.data)
          }
        }

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
          audioChunks = []
          handleTranscription(audioBlob)
        }
      })
      .catch((error) => {
        console.error('Error requesting microphone access:', error)
        alert('Microphone access denied or unavailable. Please check your browser settings.')
        setIsRecording(false) // Reset recording state on error
      })
  }

  const startMobileRecording = () => {
    setIsRecording(true)
    setIsProcessing(false) // Reset processing state
    const mimeType = 'audio/mp4' // Common mobile format

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const options = { mimeType }
        const mediaRecorder = new MediaRecorder(stream, options)
        mediaRecorderRef.current = mediaRecorder
        mediaRecorder.start()

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.push(event.data)
          }
        }

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: mimeType })
          audioChunks = []
          handleTranscription(audioBlob)
        }
      })
      .catch((error) => {
        console.error('Error requesting microphone access (mobile):', error)
        alert('Microphone access denied or unavailable. Please check your browser/device settings.')
        setIsRecording(false) // Reset recording state on error
      })
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
      // Note: onstop event handles transcription
    }
    setIsRecording(false) // Set recording state immediately
  }

  const handleTranscription = async (audioBlob) => {
    try {
      setIsProcessing(true)
      const formData = new FormData()
      const fileType = audioBlob.type.includes('mp4') ? 'audio/mp4' : 'audio/webm'
      const fileName = `recording.${fileType.split('/')[1]}`
      formData.append('file', new File([audioBlob], fileName, { type: fileType }))
      formData.append('model', 'whisper-1') // Ensure this matches your API

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Transcription API error: ${response.status} ${errorText}`)
      }

      const data = await response.json()
      const transcription = data.text
      setStoryPrompt(transcription || 'Transcription failed, please try again.') // Provide feedback on failure
    } catch (error) {
      console.error('Error during transcription request:', error)
      setStoryPrompt('Transcription failed. Please check console or try again.') // User-facing error
    } finally {
      setIsProcessing(false)
      // setIsRecording(false); // Already set in stopRecording or on error
    }
  }

  return (
    <div className="space-y-8">
      {/* Prompt Input Section */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-indigo-700 mb-1">
          What kind of fable would you like to create?
        </label>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative w-full">
            <Input
              placeholder="Type or use voice to start your fable..."
              value={storyPrompt}
              onChange={(e) => setStoryPrompt(e.target.value)}
              className="w-full pl-4 pr-10 py-3 border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg shadow-sm"
            />
            {!isMobile && (
              <Button
                onClick={handleRecording}
                variant={isRecording ? "destructive" : "ghost"}
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                aria-label={isRecording ? "Stop Recording" : "Start Recording"}
                disabled={isProcessing}
              >
                <Mic className={`h-5 w-5 ${isRecording ? "text-red-500 animate-pulse" : "text-indigo-500"}`} />
              </Button>
            )}
          </div>
        </div>
        
        {/* Processing Indicator */}
        {isProcessing && (
          <p className="text-sm text-indigo-600 text-center animate-pulse">
            {isRecording ? "Recording..." : "Processing audio..."}
          </p>
        )}
      </div>

      {/* Story Options */}
      <div className="bg-indigo-50 p-5 rounded-lg">
        <h3 className="text-lg font-semibold text-indigo-700 mb-4">Customize Your Fable</h3>
        <StoryOptions
          voice={voice}
          setVoice={setVoice}
          length={length}
          setLength={setLength}
          style={style}
          setStyle={setStyle}
          language={language}
          setLanguage={setLanguage}
        />
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerateClick}
        className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-md transition-all duration-200 transform hover:-translate-y-1"
        disabled={isGenerating || isProcessing || !storyPrompt.trim()}
      >
        <Sparkles className="mr-2 h-5 w-5" />
        {isGenerating ? "Creating Your Magical Fable..." : "Generate Fable"}
      </Button>
    </div>
  )
}
