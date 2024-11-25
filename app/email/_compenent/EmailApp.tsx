'use client'

import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import EmailList from './EmailList'
import EmailView from './EmailView'
import ComposeEmail from './ComposeEmail'

export default function EmailApp() {
  const [selectedFolder, setSelectedFolder] = useState('inbox')
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [isComposing, setIsComposing] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [emails, setEmails] = useState([
    { id: 1, from: "John Doe", to: "me@example.com", subject: "Meeting tomorrow", preview: "Hi, just a reminder about our meeting...", date: "10:30 AM", folder: "inbox" },
    { id: 2, from: "Jane Smith", to: "me@example.com", subject: "Project update", preview: "I've finished the first phase of the project...", date: "Yesterday", folder: "inbox" },
    { id: 3, from: "Bob Johnson", to: "me@example.com", subject: "Lunch next week?", preview: "Are you free for lunch next Tuesday?...", date: "Mon", folder: "inbox" },
  ])
  const [filteredEmails, setFilteredEmails] = useState(emails)

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  const handleSendEmail = (email) => {
    const newEmail = {
      id: emails.length + 1,
      ...email,
      date: new Date().toLocaleTimeString(),
      folder: 'sent'
    }
    setEmails([...emails, newEmail])
    setFilteredEmails([...emails, newEmail])
    setIsComposing(false)
  }

  const handleDeleteEmail = (emailId) => {
    const updatedEmails = emails.filter(email => email.id !== emailId)
    setEmails(updatedEmails)
    setFilteredEmails(updatedEmails)
    setSelectedEmail(null)
  }

  const handleReply = (email) => {
    setIsComposing(true)
    setSelectedEmail(email)
  }

  const handleReplyAll = (email) => {
    setIsComposing(true)
    setSelectedEmail({ ...email, to: `${email.from}, ${email.to}` })
  }

  const handleResend = (email) => {
    const resendEmail = {
      ...email,
      id: emails.length + 1,
      date: new Date().toLocaleTimeString(),
    }
    setEmails([...emails, resendEmail])
    setFilteredEmails([...emails, resendEmail])
  }

  const handleSearch = (searchTerm) => {
    const filtered = emails.filter(email => 
      email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.preview.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredEmails(filtered)
  }

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className="flex h-screen w-full bg-background">
      <Sidebar 
        selectedFolder={selectedFolder} 
        onSelectFolder={setSelectedFolder}
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

