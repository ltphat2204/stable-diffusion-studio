import { useState, useEffect, useRef } from 'react';
import { useLoaderData } from '@remix-run/react';
import debounce from 'lodash/debounce';
import { searchModels } from '~/lib/api';
import type { ModelSearchInputProps } from '~/types';

export function ModelSearchInput({ fieldName, label, placeholder, values, handleChange, setFieldValue, isSubmitting }: ModelSearchInputProps) {
    const { backendUrl } = useLoaderData<{ backendUrl: string }>();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const debouncedSearchRef = useRef(
        debounce(async (query: string) => {
            if (query.trim().length < 3) {
                setSearchResults([]);
                setIsSearching(false);
                return;
            }
            setIsSearching(true);
            try {
                const results = await searchModels(query, backendUrl);
                setSearchResults(results);
            } catch (error) { 
                console.error(error);
            } finally {
                setIsSearching(false);
            }
        }, 300)
    );

    useEffect(() => {
        if (searchQuery.trim().length > 0) {
            debouncedSearchRef.current(searchQuery);
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);

    return (
        <div>
            <label htmlFor={fieldName} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
            <div className="relative">
                <input
                    id={fieldName}
                    name={fieldName}
                    type="text"
                    value={values[fieldName]}
                    onChange={(e) => {
                        handleChange(e);
                        setSearchQuery(e.target.value);
                    }}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder={placeholder}
                    disabled={isSubmitting}
                    required
                    autoComplete="off"
                />
                {isSearching && <div className="absolute right-3 top-2.5 text-gray-400 text-xs">Đang tìm...</div>}
                {searchResults.length > 0 && (
                    <ul className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {searchResults.map((m) => (
                            <li key={m}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFieldValue(fieldName, m);
                                        setSearchResults([]);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-white hover:bg-purple-600 cursor-pointer focus:outline-none focus:bg-purple-600"
                                >{m}</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}