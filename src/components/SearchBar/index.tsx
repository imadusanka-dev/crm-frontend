import { Input } from 'antd';

const { Search } = Input;

interface SearchBarProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  onChange?: (value: string) => void;
  allowClear?: boolean;
  size?: 'small' | 'middle' | 'large';
}

const SearchBar = ({
  placeholder = 'Search...',
  onSearch,
  onChange,
  allowClear = true,
  size = 'middle',
}: SearchBarProps) => {
  return (
    <Search
      placeholder={placeholder}
      allowClear={allowClear}
      size={size}
      onSearch={onSearch}
      onChange={(e) => onChange?.(e.target.value)}
      enterButton
      className="w-full"
    />
  );
};

export default SearchBar;

