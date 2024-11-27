'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import Sidebar from './Sidebar'
import EmailList from './EmailList'
import EmailView from './EmailView'
import ComposeEmail from './ComposeEmail'

interface Email {
  id: string
  from: string
  to: string
  subject: string
  preview: string
  date: string
  body: string
  folder: string
}

export default function EmailApp() {
  const [selectedFolder, setSelectedFolder] = useState('inbox')
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [isComposing, setIsComposing] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [emails, setEmails] = useState<Email[]>([])
  const [filteredEmails, setFilteredEmails] = useState<Email[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEmails()
  }, [])

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  const fetchEmails = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get('/api/email/fetch')
      const fetchedEmails = response.data.emails.map((email: any, index: number) => ({
        id: index + 1,
        from: email.from,
        to: email.to,
        subject: email.subject,
        preview: email.body.substring(0, 100) + '...',
        date: new Date(email.date).toLocaleString(),
        body: email.body,
        folder: 'inbox' // Assuming all fetched emails are in the inbox
      }))
      setEmails(fetchedEmails)
      setFilteredEmails(fetchedEmails)
    } catch (err) {
      setError('Failed to fetch emails. Please try again later.')
      console.error('Error fetching emails:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSentEmails = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get('/api/email/sent-emails')
      const fetchedSentEmails = response.data.emails.map((email: any, index: number) => ({
        id: `sent_${index + 1}`,
        from: email.from,
        to: email.to,
        subject: email.subject,
        preview: email.snippet || '',
        date: new Date(email.date).toLocaleString(),
        body: email.snippet || '', // We don't have full body in sent emails API
        folder: 'sent'
      }))
      setEmails(prevEmails => [...prevEmails, ...fetchedSentEmails])
      setFilteredEmails(prevEmails => [...prevEmails, ...fetchedSentEmails])
    } catch (err) {
      setError('Failed to fetch sent emails. Please try again later.')
      console.error('Error fetching sent emails:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendEmail = async (email: Omit<Email, 'id' | 'date' | 'preview' | 'folder'>) => {
    try {
      setIsLoading(true)
      const response = await axios.post('/api/email/send', email)
      const newEmail = {
        id: `sent_${emails.length + 1}`,
        ...email,
        preview: email.body.substring(0, 100) + '...',
        date: new Date().toLocaleString(),
        folder: 'sent'
      }
      setEmails(prevEmails => [newEmail, ...prevEmails])
      setFilteredEmails(prevEmails => [newEmail, ...prevEmails])
      setIsComposing(false)
    } catch (err) {
      setError('Failed to send email. Please try again later.')
      console.error('Error sending email:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteEmail = (emailToDelete: Email) => {
    const updatedEmails = emails.filter(email => email.id !== emailToDelete.id)
    setEmails(updatedEmails)
    setFilteredEmails(updatedEmails)
    setSelectedEmail(null)
  }

  const handleReply = (email: Email) => {
    setIsComposing(true)
    setSelectedEmail(email)
  }

  const handleReplyAll = (email: Email) => {
    setIsComposing(true)
    setSelectedEmail({ ...email, to: `${email.from}, ${email.to}` })
  }

  const handleResend = (email: Email) => {
    const resendEmail = {
      ...email,
      id: `sent_${emails.length + 1}`,
      date: new Date().toLocaleString(),
    }
    setEmails([...emails, resendEmail])
    setFilteredEmails([...emails, resendEmail])
  }

  const handleSearch = (searchTerm: string) => {
    const filtered = emails.filter(email => 
      email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.body.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredEmails(filtered)
  }

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleSelectFolder = (folder: string) => {
    setSelectedFolder(folder)
    if (folder === 'sent' && !emails.some(email => email.folder === 'sent')) {
      fetchSentEmails()
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>
  }

  return (
    <div className="flex h-screen w-full bg-background">
      <Sidebar 
        selectedFolder={selectedFolder} 
        onSelectFolder={handleSelectFolder}
        onCompose={() => setIsComposing(true)}
      />
      <div className="flex flex-1 flex-col md:flex-row">
        <EmailList 
          emails={filteredEmails.filter(email => email.folder === selectedFolder)} 
          onSelectEmail={setSelectedEmail}
          onSearch={handleSearch}
        />
        {isComposing ? (
          <ComposeEmail 
            onSend={handleSendEmail} 
            onCancel={() => setIsComposing(false)}
            replyTo={selectedEmail}
          />
        ) : (
          <EmailView 
            selectedEmail={selectedEmail} 
            onReply={handleReply}
            onReplyAll={handleReplyAll}
            onResend={handleResend}
            onDelete={handleDeleteEmail}
            onToggleTheme={handleToggleTheme}
            isDarkMode={isDarkMode}
          />
        )}
      </div>
    </div>
  )
}

