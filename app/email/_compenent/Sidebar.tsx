import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Inbox, Send, File, Trash, Star, PenSquare } from 'lucide-react'

const folders = [
  { name: 'Inbox', icon: Inbox },
  { name: 'Sent', icon: Send },
  { name: 'Drafts', icon: File },
  { name: 'Trash', icon: Trash },
  { name: 'Starred', icon: Star },
]

export default function Sidebar({ selectedFolder, onSelectFolder, onCompose }) {
  return (
    <div className="w-64 bg-secondary text-secondary-foreground p-4 hidden md:block">
      <Button className="w-full mb-4" variant="default" onClick={onCompose}>
        <PenSquare className="mr-2 h-4 w-4" />
        Compose
      </Button>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        {folders.map((folder) => (
          <Button
            key={folder.name}
            variant="ghost"
            className={`w-full justify-start mb-2 ${selectedFolder === folder.name.toLowerCase() ? 'bg-primary/10' : ''}`}
            onClick={() => onSelectFolder(folder.name.toLowerCase())}
          >
            <folder.icon className="mr-2 h-4 w-4" />
            {folder.name}
          </Button>
        ))}
      </ScrollArea>
    </div>
  )
}

