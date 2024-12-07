import { useRef, useCallback } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import SearchBar from './SearchBar'
import { Email } from '@/lib/types';

interface EmailListProps {
  emails: Email[];
  onSelectEmail: (email: Email) => void; // Single unified Email type
  onSearch: (searchTerm: string) => void;
  onLoadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
}


export default function EmailList({ 
  emails, 
  onSelectEmail, 
  onSearch, 
  onLoadMore,
  isLoading,
  hasMore
}: EmailListProps) {
  const observer = useRef<IntersectionObserver | null>(null)
  const lastEmailElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore()
      }
    })
    if (node) observer.current.observe(node)
  }, [isLoading, hasMore, onLoadMore])

  return (
    <div className="w-full md:w-1/3 bg-background border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <SearchBar onSearch={onSearch} />
      </div>
      <ScrollArea className="flex-grow">
        {emails.map((email, index) => (
          <div
            key={email.id}
            ref={index === emails.length - 1 ? lastEmailElementRef : null}
            className="p-4 border-b border-border hover:bg-accent cursor-pointer"
            onClick={() => onSelectEmail(email)}
          >
            <div className="font-semibold">{email.from}</div>
            <div className="text-sm text-muted-foreground">{email.subject}</div>
            <div className="text-sm text-muted-foreground truncate">{email.preview}</div>
            <div className="text-xs text-muted-foreground mt-1">{email.date}</div>
          </div>
        ))}
        {isLoading && (
          <div className="p-4 text-center text-muted-foreground">
            Loading more emails...
          </div>
        )}
        {!isLoading && !hasMore && (
          <div className="p-4 text-center text-muted-foreground">
            No more emails to load
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

