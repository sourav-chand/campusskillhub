'use client';

import * as React from 'react';
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchInput } from '@/components/shared/search-input';
import { EmptyState } from '@/components/shared/empty-state';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Pagination } from '@/components/shared/pagination';
import {
  ChevronDown,
  Download,
  FileDown,
  FileSpreadsheet,
  Printer,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  searchable?: boolean;
  searchKey?: string;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  onRowClick?: (row: TData) => void;
  pageSize?: number;
  totalItems?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  showPagination?: boolean;
  showColumnToggle?: boolean;
  showExport?: boolean;
  onExportCSV?: () => void;
  onExportExcel?: () => void;
  onExportPDF?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  className?: string;
}

function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  searchable = false,
  searchKey,
  searchPlaceholder = 'Search...',
  onSearch,
  onRowClick,
  pageSize = 10,
  totalItems,
  currentPage,
  onPageChange,
  showPagination = true,
  showColumnToggle = false,
  showExport = false,
  onExportCSV,
  onExportExcel,
  onExportPDF,
  emptyTitle = 'No data found',
  emptyDescription = 'There are no items to display.',
  emptyActionLabel,
  onEmptyAction,
  className,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const paginationState =
    currentPage !== undefined
      ? { pageIndex: (currentPage - 1) * pageSize, pageSize }
      : undefined;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: paginationState,
    },
    manualPagination: onPageChange !== undefined,
    pageCount: totalItems ? Math.ceil(totalItems / pageSize) : undefined,
  });

  const handleSearch = (value: string) => {
    if (onSearch) {
      onSearch(value);
    } else if (searchKey) {
      table.getColumn(searchKey)?.setFilterValue(value);
    }
  };

  const pagination = onPageChange
    ? {
        currentPage: currentPage || 1,
        totalPages: totalItems
          ? Math.ceil(totalItems / pageSize)
          : table.getPageCount(),
        totalItems,
        pageSize,
        onPageChange,
      }
    : undefined;

  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center py-16', className)}>
        <LoadingSpinner text="Loading data..." />
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {searchable && (
          <SearchInput
            placeholder={searchPlaceholder}
            onSearch={handleSearch}
            className="w-full sm:w-72"
          />
        )}

        <div className="flex items-center gap-2">
          {showColumnToggle && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {showExport && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onExportCSV && (
                  <DropdownMenuCheckboxItem
                    checked={false}
                    onCheckedChange={onExportCSV}
                    className="cursor-pointer"
                  >
                    <FileDown className="mr-2 h-4 w-4" />
                    Export CSV
                  </DropdownMenuCheckboxItem>
                )}
                {onExportExcel && (
                  <DropdownMenuCheckboxItem
                    checked={false}
                    onCheckedChange={onExportExcel}
                    className="cursor-pointer"
                  >
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Export Excel
                  </DropdownMenuCheckboxItem>
                )}
                {onExportPDF && (
                  <DropdownMenuCheckboxItem
                    checked={false}
                    onCheckedChange={onExportPDF}
                    className="cursor-pointer"
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    Export PDF
                  </DropdownMenuCheckboxItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={() => onRowClick?.(row.original)}
                  className={cn(onRowClick && 'cursor-pointer')}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                    actionLabel={emptyActionLabel}
                    onAction={onEmptyAction}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {showPagination &&
        (pagination ? (
          <Pagination {...pagination} />
        ) : (
          table.getPageCount() > 1 && (
            <Pagination
              currentPage={table.getState().pagination.pageIndex + 1}
              totalPages={table.getPageCount()}
              onPageChange={(page) => table.setPageIndex(page - 1)}
            />
          )
        ))}
    </div>
  );
}

export { DataTable };
export type { DataTableProps };
export default DataTable;
