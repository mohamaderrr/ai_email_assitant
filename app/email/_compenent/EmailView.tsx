import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Reply, Trash2, Users, Send, Sun, Moon } from 'lucide-react'

export default function EmailView({ selectedEmail, onReply, onReplyAll, onResend, onDelete, onToggleTheme, isDarkMode }) {
  if (!selectedEmail) {
    return (
      <div className="flex-1 bg-background p-4 hidden md:flex items-center justify-center text-muted-foreground">
        Select an email to view
      </div>
    )
  }

  return (
    <div className="flex-1 bg-background p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">{selectedEmail.subject}</h2>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => onDelete(selectedEmail.id)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
          <Button variant="outline" onClick={() => onReply(selectedEmail)}>
            <Reply className="mr-2 h-4 w-4" />
            Reply
          </Button>
          <Button variant="outline" onClick={() => onReplyAll(selectedEmail)}>
            <Users className="mr-2 h-4 w-4" />
            Reply All
          </Button>
          <Button variant="outline" onClick={() => onResend(selectedEmail)}>
            <Send className="mr-2 h-4 w-4" />
            Resend
          </Button>
          <Button variant="outline" onClick={onToggleTheme}>
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
        <div className="text-foreground">
          {selectedEmail.preview}
          <p className="mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, vitae aliquam nisl nunc vitae nisl. Sed vitae nisl eget nisl aliquam ultricies. Sed vitae nisl eget nisl aliquam ultricies.</p>
          <p className="mt-4">Regards,</p>
          <p>{selectedEmail.from}</p>
        </div>
      </ScrollArea>
    </div>
  )
}

