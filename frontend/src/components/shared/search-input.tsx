'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  debounceMs?: number;
  placeholder?: string;
  className?: string;
}

const SearchInput = ({
  value: externalValue,
  onChange,
  onSearch,
  debounceMs = 300,
  placeholder = 'Search...',
  className,
  ...props
}: SearchInputProps) => {
  const [internalValue, setInternalValue] = React.useState(
    externalValue || '',
  );
  const debouncedValue = useDebounce(internalValue, debounceMs);

  const isControlled = externalValue !== undefined;
  const displayValue = isControlled ? externalValue : internalValue;
  const onSearchRef = React.useRef(onSearch);
  onSearchRef.current = onSearch;

  React.useEffect(() => {
    if (debouncedValue !== undefined) {
      onSearchRef.current?.(debouncedValue);
    }
  }, [debouncedValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const handleClear = () => {
    if (!isControlled) {
      setInternalValue('');
    }
    onChange?.('');
    onSearch?.('');
  };

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        className="pl-8 pr-8"
        value={displayValue}
        onChange={handleChange}
        {...props}
      />
      {displayValue && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full px-3"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  );
};

export { SearchInput };
export default SearchInput;
