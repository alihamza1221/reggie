'use client'

import { useState, useRef, useEffect } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Send } from 'lucide-react'

interface GPTCommandInputProps {
  onSubmit: (command: string) => void
}

export function GptCommandInput({ onSubmit }: GPTCommandInputProps) {
  const [command, setCommand] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [command])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (command.trim()) {
      onSubmit(command.trim())
      setCommand('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-2 max-w-3xl mx-auto">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          placeholder="Type your message here..."
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pr-12 resize-none overflow-hidden"
          rows={1}
          aria-label="Command input"
        />
        <Button 
          type="submit" 
          className="absolute bottom-2 right-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-gray-500 text-center">
        Press Enter to send, Shift+Enter for a new line
      </p>
    </form>
  )
}