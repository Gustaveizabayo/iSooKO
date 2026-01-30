import { useState } from 'react';
import api from '../services/api';

export interface SearchResult {
    id: string;
    title: string;
    description?: string;
    type: 'course' | 'instructor';
    thumbnailUrl?: string;
    instructor?: string;
}

export const useSearch = () => {
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [query, setQuery] = useState('');

    const search = async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        setQuery(searchQuery);
        setIsSearching(true);

        try {
            const response = await api.get(`/courses/search?q=${encodeURIComponent(searchQuery)}`);
            setResults(response.data);
        } catch (error) {
            console.error('Search error:', error);
            setResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const clearSearch = () => {
        setQuery('');
        setResults([]);
    };

    return {
        results,
        isSearching,
        query,
        search,
        clearSearch
    };
};
