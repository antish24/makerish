import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

export function SearchBar({ onSearch, initialQuery = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();

  // Load query from localStorage on mount
  useEffect(() => {
    const savedQuery = localStorage.getItem('madify_search_query');
    if (savedQuery) {
      setQuery(savedQuery);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const searchQuery = query.trim();
      
      // Save query to localStorage
      localStorage.setItem('madify_search_query', searchQuery);
      
      // Check if search is "ish" (case-insensitive)
      if (searchQuery.toLowerCase() === 'ish') {
        // Navigate to /ish page
        navigate('/ish');
      } else {
        // Normal flow - call the onSearch prop
        onSearch(searchQuery);
      }
    }
  };

  const handleChange = (value: string) => {
    setQuery(value);
    // Save to localStorage as user types (optional)
    localStorage.setItem('madify_search_query', value);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          type="text"
          placeholder="Search for songs or artists..."
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          className="pl-12 h-12 bg-card border-border text-foreground placeholder:text-muted-foreground rounded-full focus:ring-2 focus:ring-primary transition-all"
        />
      </div>
    </form>
  );
}