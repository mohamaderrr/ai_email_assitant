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

  // Function to split text into chunks
  const splitIntoChunks = (text: string, chunkSize: number) => {
    const words = text.split(' ');
    const chunks = [];
    for (let i = 0; i < words.length; i += chunkSize) {
      chunks.push(words.slice(i, i + chunkSize).join(' '));
    }
    return chunks;
  };

  const emailBodyChunks = splitIntoChunks(selectedEmail.body, 200);
  const subjectChunks = splitIntoChunks(selectedEmail.subject, 7);

  return (
    <div className="flex-1 bg-background p-4 flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div className="max-w-[50%]">
          {subjectChunks.map((chunk, index) => (
            <h2 key={index} className="text-2xl font-semibold mb-1">{chunk}</h2>
          ))}
        </div>
        <div className="space-x-2 flex flex-wrap justify-end">
          <Button variant="outline" size="sm" onClick={() => onDelete(selectedEmail.id)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
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

