'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Upload, X, FileText, Image, File } from 'lucide-react';

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  value?: File[];
  onChange?: (files: File[]) => void;
  onError?: (error: string) => void;
  className?: string;
  disabled?: boolean;
  preview?: boolean;
}

const getFileIcon = (file: File) => {
  if (file.type.startsWith('image/')) return Image;
  if (file.type.includes('pdf')) return FileText;
  return File;
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const FileUpload = ({
  accept,
  multiple = false,
  maxSize = 5 * 1024 * 1024,
  maxFiles = 5,
  value,
  onChange,
  onError,
  className,
  disabled = false,
  preview = true,
}: FileUploadProps) => {
  const [files, setFiles] = React.useState<File[]>(value || []);
  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const isControlled = value !== undefined;
  const currentFiles = isControlled ? value : files;

  const updateFiles = (newFiles: File[]) => {
    if (!isControlled) {
      setFiles(newFiles);
    }
    onChange?.(newFiles);
  };

  const validateFiles = (fileList: File[]): File[] => {
    const validFiles: File[] = [];
    for (const file of fileList) {
      if (maxSize && file.size > maxSize) {
        onError?.(`"${file.name}" exceeds the maximum file size of ${formatFileSize(maxSize)}`);
        continue;
      }
      validFiles.push(file);
    }
    return validFiles;
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList?.length) return;

    const newFiles = Array.from(fileList);
    const validFiles = validateFiles(newFiles);

    if (!multiple) {
      updateFiles(validFiles.slice(0, 1));
      return;
    }

    const remaining = maxFiles - currentFiles.length;
    if (remaining <= 0) {
      onError?.(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const combined = [...currentFiles, ...validFiles].slice(0, maxFiles);
    updateFiles(combined);
  };

  const removeFile = (index: number) => {
    const newFiles = currentFiles.filter((_, i) => i !== index);
    updateFiles(newFiles);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  };

  const handleClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={cn(
          'relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          disabled={disabled}
        />
        <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
        <p className="text-sm font-medium">
          {isDragging ? 'Drop files here' : 'Drag & drop files or click to browse'}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {accept ? `Accepted: ${accept}` : 'All files supported'}
          {maxSize && ` | Max: ${formatFileSize(maxSize)}`}
        </p>
      </div>

      {currentFiles.length > 0 && preview && (
        <div className="space-y-2">
          {currentFiles.map((file, index) => {
            const FileIcon = getFileIcon(file);
            const isImage = file.type.startsWith('image/');
            const previewUrl = isImage ? URL.createObjectURL(file) : null;

            return (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center gap-3 rounded-lg border p-2"
              >
                {isImage && previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={file.name}
                    className="h-10 w-10 rounded object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                    <FileIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => removeFile(index)}
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove file</span>
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export { FileUpload };
export default FileUpload;
