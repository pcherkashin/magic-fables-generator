'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mic } from 'lucide-react'
import StoryOptions from './StoryOptions'

export default function StoryInput({
  isRecording,
  setIsRecording,
  onGenerate,
}) {
  const [storyPrompt, setStoryPrompt] = useState('')
  const [voice, setVoice] = useState('alloy') // Default to 'alloy' or any other supported voice
  const [length, setLength] = useState('Short (3 mins)')
  const [style, setStyle] = useState('Adventurous')
  const [isProcessing, setIsProcessing] = useState(false)

  const mediaRecorderRef = useRef(null)
  let audioChunks = []

  const handleGenerateClick = () => {
    onGenerate(storyPrompt, voice, length, style) // Pass selected voice to the onGenerate function
  }

  const handleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        startMobileRecording()
      } else {
        startWebRecording()
      }
    }
  }

  const startWebRecording = () => {
    setIsRecording(true)
    setIsProcessing(false) // Reset processing state at start
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
        console.error('Error starting web recording:', error)
        setIsProcessing(false)
      })
  }

  const startMobileRecording = () => {
    setIsRecording(true)
    setIsProcessing(false)
    const mimeType = 'audio/mp4'

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
        console.error('Error starting mobile recording:', error)
        setIsProcessing(false)
      })
  }

  const stopRecording = () => {
    setIsRecording(false)
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
    }
  }

  const handleTranscription = async (audioBlob) => {
    try {
      setIsProcessing(true) // Set to transcribing state

      const formData = new FormData()
      formData.append(
        'file',
        new File([audioBlob], 'recording.webm', { type: audioBlob.type })
      )
      formData.append('model', 'whisper-1') // Whisper model for transcription

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Transcription error: ${errorText}`)
      }

      const data = await response.json()
      const transcription = data.text
      setStoryPrompt(transcription) // Update storyPrompt with transcription result
      console.log('Transcription:', transcription)
    } catch (error) {
      console.error('Error during transcription:', error)
    } finally {
      setIsProcessing(false) // Ensure "Voice Input" button label resets
      setIsRecording(false) // Reset to default button state
    }
  }

  return (
    <div>
      <div className='flex flex-col sm:flex-row gap-4 mb-6'>
        <div className='flex-1'>
          <Input
            placeholder='Type your story prompt here or use voice input...'
            value={storyPrompt}
            onChange={(e) => setStoryPrompt(e.target.value)}
            className='rounded-full'
          />
        </div>
        <Button
          onClick={handleRecording}
          className={`rounded-full ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}>
          <Mic className='mr-2 h-4 w-4' />
          {isProcessing ? 'Transcribing...' : 'Voice Input'}
        </Button>
      </div>

      {isProcessing && (
        <p className='text-gray-500 mt-2'>Processing transcription...</p>
      )}

      <StoryOptions
        voice={voice}
        setVoice={setVoice}
        length={length}
        setLength={setLength}
        style={style}
        setStyle={setStyle}
      />

      <Button
        onClick={handleGenerateClick}
        className='w-full rounded-full bg-green-500 hover:bg-green-600'>
        Generate Story
      </Button>
    </div>
  )
}
