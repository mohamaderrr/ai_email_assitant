import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'

export default function SearchBar({ onSearch }) {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search emails..."
        className="pl-8"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  )
}

