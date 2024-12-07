import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send, X, Wand2, ChevronLeft, ChevronRight, Cpu } from 'lucide-react'
import axios from 'axios'
import { Email } from '@/lib/types';


interface ComposeEmailProps {
  onSend: (email: Email) => void;
  onCancel: () => void;
  replyTo?: Email;
}

type Model = 'gemini' | 'openai';

export default function ComposeEmail({ onSend, onCancel, replyTo }: ComposeEmailProps) {
  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const abortControllerRef = useRef<AbortController | null>(null)
  const [generatedEmails, setGeneratedEmails] = useState<string[]>([])
  const [currentEmailIndex, setCurrentEmailIndex] = useState(0)
  const [selectedModel, setSelectedModel] = useState<Model>('gemini')

  useEffect(() => {
    if (replyTo) {
      setTo(replyTo.from)
      setSubject(`Re: ${replyTo.subject}`)
      setBody(`\n\nOn ${replyTo.date}, ${replyTo.from} wrote:\n> ${replyTo.body.substring(0, 1000)}`)
    }
  }, [replyTo])

  const handleSend = async () => {
    setIsSending(true)
    setError('')
    try {
      const response = await axios.post('/api/email/send', { to, subject, body })
      onSend({ id: response.data.messageId, from: 'mohameder1412@gmail.com', to, subject, body, date: new Date().toISOString() })
      setIsSending(false)
    } catch (error) {
      console.error('Error sending email:', error)
      setError('Failed to send email. Please try again.')
      setIsSending(false)
    }
  }

  const handleGenerateEmail = async () => {
    setIsGenerating(true)
    setError('')
    abortControllerRef.current = new AbortController()
    try {
      const response = await fetch('/api/email/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          selectedEmailBody: body, 
          model: selectedModel, 
          to: to.trim() // Ensure 'to' is trimmed to remove any leading/trailing whitespace
        }),
        signal: abortControllerRef.current.signal,
      })
      if (!response.ok) {
        throw new Error('Failed to generate email')
      }
      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('Response body is null')
      }
      const decoder = new TextDecoder()
      let generatedText = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        generatedText += chunk
        setBody(prevBody => prevBody + chunk)
      }
      setGeneratedEmails(prev => [...prev, generatedText])
      setCurrentEmailIndex(prev => prev + 1)
    } catch (error) {
      const err = error as Error
      if (err.name === 'AbortError') {
        console.log('Email generation aborted')
      } else {
        console.error('Error generating email:', error)
        setError('Failed to generate email. Please try again.')
      }
    } finally {
      setIsGenerating(false)
      abortControllerRef.current = null
    }
  }

  const handleCancelGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }

  const handleNavigateEmail = (direction: 'prev' | 'next') => {
    let newIndex = direction === 'prev' ? currentEmailIndex - 1 : currentEmailIndex + 1
    if (newIndex < 0) newIndex = generatedEmails.length - 1
    if (newIndex >= generatedEmails.length) newIndex = 0
    setCurrentEmailIndex(newIndex)
    setBody(generatedEmails[newIndex])
  }

  const toggleModel = () => {
    setSelectedModel(prev => prev === 'gemini' ? 'openai' : 'gemini')
  }

  return (
    <div className="flex-1 bg-background p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Compose Email</h2>
        <Button variant="ghost" onClick={onCancel}>
          <span className="sr-only">Close</span>
          <X className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
      <div className="space-y-4 flex-grow flex flex-col">
        <div>
          <label htmlFor="to" className="sr-only">To</label>
          <Input
            id="to"
            type="email"
            placeholder="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            aria-label="Recipient email address"
          />
        </div>
        <div>
          <label htmlFor="subject" className="sr-only">Subject</label>
          <Input
            id="subject"
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            aria-label="Email subject"
          />
        </div>
        <div className="flex-grow">
          <label htmlFor="body" className="sr-only">Email body</label>
          <Textarea
            id="body"
            placeholder="Write your email here..."
            className="h-full min-h-[200px]"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            aria-label="Email body content"
          />
        </div>
      </div>
      {error && <p className="text-red-500 mt-2" role="alert">{error}</p>}
      <div className="flex justify-between items-center space-x-2 mt-4">
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => handleNavigateEmail('prev')}
            variant="outline"
            disabled={generatedEmails.length === 0}
            aria-label="Previous generated email"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </Button>
          <span aria-live="polite">
            {generatedEmails.length > 0 ? `${currentEmailIndex + 1}/${generatedEmails.length}` : '0/0'}
          </span>
          <Button
            onClick={() => handleNavigateEmail('next')}
            variant="outline"
            disabled={generatedEmails.length === 0}
            aria-label="Next generated email"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={toggleModel}
            variant="outline"
            aria-label={`Switch to ${selectedModel === 'gemini' ? 'openai' : 'Gemini'} model`}
          >
            <Cpu className="mr-2 h-4 w-4" aria-hidden="true" />
            {selectedModel === 'gemini' ? 'Gemini' : 'openai'}
          </Button>
          <Button
            onClick={isGenerating ? handleCancelGeneration : handleGenerateEmail}
            variant="outline"
            disabled={isSending}
            aria-label={isGenerating ? "Cancel email generation" : "Generate email content"}
          >
            {isGenerating ? (
              <>
                <X className="mr-2 h-4 w-4" aria-hidden="true" />
                Cancel Generation
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" aria-hidden="true" />
                Generate Email
              </>
            )}
          </Button>
          <Button
            onClick={handleSend}
            disabled={isSending || isGenerating}
            aria-label="Send email"
          >
            <Send className="mr-2 h-4 w-4" aria-hidden="true" />
            {isSending ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </div>
    </div>
  )
}

