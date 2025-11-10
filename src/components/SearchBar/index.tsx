import { useState, useEffect, useRef } from 'react';
import { Input } from 'antd';

const { Search } = Input;

interface SearchBarProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  onChange?: (value: string) => void;
  allowClear?: boolean;
  size?: 'small' | 'middle' | 'large';
  debounceMs?: number;
}

const SearchBar = ({
  placeholder = 'Search...',
  onSearch,
  onChange,
  allowClear = true,
  size = 'middle',
  debounceMs = 500,
}: SearchBarProps) => {
  const [searchValue, setSearchValue] = useState('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (onChange) {
      timeoutRef.current = setTimeout(() => {
        onChange(searchValue);
      }, debounceMs);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchValue, onChange, debounceMs]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  return (
    <Search
      placeholder={placeholder}
      allowClear={allowClear}
      size={size}
      onSearch={onSearch}
      onChange={handleChange}
      enterButton
      className="w-full"
    />
  );
};

export default SearchBar;

