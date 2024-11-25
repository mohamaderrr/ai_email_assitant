import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send, X, Wand2, ChevronLeft, ChevronRight } from 'lucide-react'

export default function ComposeEmail({ onSend, onCancel, replyTo }) {
  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [generatedEmails, setGeneratedEmails] = useState([])
  const [currentEmailIndex, setCurrentEmailIndex] = useState(0)

  useEffect(() => {
    if (replyTo) {
      setTo(replyTo.from)
      setSubject(`Re: ${replyTo.subject}`)
      setBody(`\n\nOn ${replyTo.date}, ${replyTo.from} wrote:\n> ${replyTo.preview}`)
    }
  }, [replyTo])

  const handleSend = () => {
    onSend({ to, subject, body, from: 'me@example.com' })
  }

  const handleGenerateEmail = async () => {
    // Simulate AI email generation
    const newEmail = `Dear recipient,\n\nThis is AI-generated email #${generatedEmails.length + 1}. Please replace this content with your actual message.\n\nBest regards,\nAI Assistant`
    setGeneratedEmails([...generatedEmails, newEmail])
    setCurrentEmailIndex(generatedEmails.length)
    setBody(newEmail)
  }

  const handleNavigateEmails = (direction) => {
    let newIndex = currentEmailIndex + direction
    if (newIndex < 0) newIndex = generatedEmails.length - 1
    if (newIndex >= generatedEmails.length) newIndex = 0
    setCurrentEmailIndex(newIndex)
    setBody(generatedEmails[newIndex])
  }

  return (
    <div className="flex-1 bg-background p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Compose Email</h2>
        <Button variant="ghost" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-4 flex-grow flex flex-col">
        <Input
          type="email"
          placeholder="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <Textarea
          placeholder="Write your email here..."
          className="flex-grow"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>
      <div className="flex justify-end items-center space-x-2 mt-4">
        <div className="flex items-center">
          <Button 
            onClick={() => handleNavigateEmails(-1)} 
            variant="ghost" 
            size="icon" 
            disabled={generatedEmails.length === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="mx-2">
            {generatedEmails.length > 0 ? `${currentEmailIndex + 1}/${generatedEmails.length}` : '0/0'}
          </span>
          <Button 
            onClick={() => handleNavigateEmails(1)} 
            variant="ghost" 
            size="icon" 
            disabled={generatedEmails.length === 0}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={handleGenerateEmail} variant="outline">
          <Wand2 className="mr-2 h-4 w-4" />
          Generate Email
        </Button>
        <Button onClick={handleSend}>
          <Send className="mr-2 h-4 w-4" />
          Send
        </Button>
      </div>
    </div>
  )
}

