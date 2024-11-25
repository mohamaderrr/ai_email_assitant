import { ScrollArea } from "@/components/ui/scroll-area"
import SearchBar from './SearchBar'

export default function EmailList({ emails, onSelectEmail, onSearch }) {
  return (
    <div className="w-full md:w-1/3 bg-background border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <SearchBar onSearch={onSearch} />
      </div>
      <ScrollArea className="flex-grow">
        {emails.map((email) => (
          <div
            key={email.id}
            className="p-4 border-b border-border hover:bg-accent cursor-pointer"
            onClick={() => onSelectEmail(email)}
          >
            <div className="font-semibold">{email.from}</div>
            <div className="text-sm text-muted-foreground">{email.subject}</div>
            <div className="text-sm text-muted-foreground truncate">{email.preview}</div>
            <div className="text-xs text-muted-foreground mt-1">{email.date}</div>
          </div>
        ))}
      </ScrollArea>
    </div>
  )
}

