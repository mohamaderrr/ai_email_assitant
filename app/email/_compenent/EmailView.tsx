'use client'

import { useState, useEffect } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Reply, Users, Send, Sun, Moon } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"

interface Email {
  id: string
  subject: string
  from: string
  to: string
  date: string
  body: string
}

interface EmailViewProps {
  selectedEmail: Email | null
  onReply: (email: Email) => void
  onReplyAll: (email: Email) => void
  onResend: (email: Email) => void
  onToggleTheme: () => void
  isDarkMode: boolean
}

export default function EmailView({ selectedEmail, onReply, onReplyAll, onResend, onToggleTheme, isDarkMode }: EmailViewProps) {
  const [sentiment, setSentiment] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (selectedEmail) {
      setSentiment(null)
      setError(null)
      fetchSentiment(selectedEmail.body)
    }
  }, [selectedEmail])

  const fetchSentiment = async (text: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })
      if (!response.ok) {
        throw new Error('Failed to fetch sentiment')
      }
      const data = await response.json()
      setSentiment(data.sentiment)
    } catch (error) {
      console.error('Error fetching sentiment:', error)
      setError('Failed to analyze sentiment')
    } finally {
      setIsLoading(false)
    }
  }

  if (!selectedEmail) {
    return (
      <div className="flex-1 bg-background p-4 hidden md:flex items-center justify-center text-muted-foreground">
        Select an email to view
      </div>
    )
  }

  const splitIntoChunks = (text: string, chunkSize: number) => {
    const words = text.split(' ')
    const chunks = []
    for (let i = 0; i < words.length; i += chunkSize) {
      chunks.push(words.slice(i, i + chunkSize).join(' '))
    }
    return chunks
  }

  const emailBodyChunks = splitIntoChunks(selectedEmail.body, 200)
  const subjectChunks = splitIntoChunks(selectedEmail.subject, 7)

  const getSentimentVariant = (sentiment: string | null) => {
    switch (sentiment) {
      case 'positive':
        return 'default'
      case 'negative':
        return 'destructive'
      case 'neutral':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <div className="flex-1 bg-background p-4 flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div className="max-w-[50%]">
          {subjectChunks.map((chunk, index) => (
            <h2 key={index} className="text-2xl font-semibold mb-1">{chunk}</h2>
          ))}
        </div>
        <div className="space-x-2 flex flex-wrap justify-end items-center">
          {isLoading ? (
            <Skeleton className="h-6 w-20" />
          ) : error ? (
            <Badge variant="outline" className="capitalize">
              Error
            </Badge>
          ) : sentiment ? (
            <Badge variant={getSentimentVariant(sentiment)} className="capitalize">
              {sentiment}
            </Badge>
          ) : null}
          <Button variant="outline" size="sm" onClick={() => onReply(selectedEmail)}>
            <Reply className="mr-2 h-4 w-4" />
            Reply
          </Button>
          <Button variant="outline" size="sm" onClick={() => onReplyAll(selectedEmail)}>
            <Users className="mr-2 h-4 w-4" />
            Reply All
          </Button>
          <Button variant="outline" size="sm" onClick={() => onResend(selectedEmail)}>
            <Send className="mr-2 h-4 w-4" />
            Resend
          </Button>
          <Button variant="outline" size="sm" onClick={onToggleTheme}>
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      <div className="text-sm text-muted-foreground mb-4">
        From: {selectedEmail.from}
        <span className="ml-4">To: {selectedEmail.to}</span>
        <span className="ml-4">{selectedEmail.date}</span>
      </div>
      <ScrollArea className="flex-grow">
        <div className="text-foreground text-sm leading-relaxed">
          {emailBodyChunks.map((chunk, index) => (
            <p key={index} className="mb-4 max-w-[66ch] break-words">{chunk}</p>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

