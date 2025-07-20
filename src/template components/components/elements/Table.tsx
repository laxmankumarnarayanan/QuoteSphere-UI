import React, { useState, useMemo } from 'react';
import Tabs from './Tabs';
import StatusBadge, { StatusType } from './StatusBadge';
import { ChevronDown, ChevronUp, ArrowUpDown, Search } from 'lucide-react';
import Checkbox from './Checkbox';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton'; 
import TextInput from './TextInput';

export interface Column<T> {
  key: keyof T | 'actions' | 'selector';
  header: React.ReactNode;
  accessor?: (row: T) => React.ReactNode;
  render?: (row: T, rowIndex: number) => React.ReactNode;
  width?: string | number;
  minWidth?: string | number;
  sortable?: boolean;
  filterable?: boolean;
  dataType?: 'string' | 'number' | 'date' | 'status';
  align?: 'left' | 'center' | 'right';
}

interface TableProps<T extends { id: string | number }> {
  title?: string;
  columns: Column<T>[];
  data: T[];
  tabs?: {
    id: string;
    label: string;
    data: T[];
    columns?: Column<T>[];
  }[];
  defaultTabId?: string;
  isLoading?: boolean;
  onRowClick?: (row: T) => void;
  className?: string;
  enableSorting?: boolean;
  enableGlobalFilter?: boolean;
  enableRowSelection?: boolean;
  enablePagination?: boolean;
  pageSize?: number;
  renderTableActions?: () => React.ReactNode;
  renderRowActions?: (row: T) => React.ReactNode;
}

const Table = <T extends { id: string | number }>({
  title,
  columns: initialColumns,
  data: initialData,
  tabs,
  defaultTabId,
  isLoading = false,
  onRowClick,
  className,
  enableSorting = true,
  enableGlobalFilter = true,
  enableRowSelection = false,
  enablePagination = true,
  pageSize = 10,
  renderTableActions,
  renderRowActions,
}: TableProps<T>) => {
  const [activeTabId, setActiveTabId] = useState(defaultTabId || (tabs?.[0]?.id));
  const [sortConfig, setSortConfig] = useState<{ key: keyof T | null; direction: 'ascending' | 'descending' } | null>(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string | number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  const currentTabData = useMemo(() => {
    if (tabs && activeTabId) return tabs.find(tab => tab.id === activeTabId)?.data || initialData;
    return initialData;
  }, [tabs, activeTabId, initialData]);

  const currentColumns = useMemo(() => {
    let cols = (tabs && activeTabId ? tabs.find(tab => tab.id === activeTabId)?.columns : initialColumns) || initialColumns;
    if (enableRowSelection) {
      cols = [
        {
          key: 'selector' as any,
          header: (
            <Checkbox id="selectAllRows" checked={selectedRowIds.size === currentTabData.length && currentTabData.length > 0}
              onChange={(checked) => setSelectedRowIds(checked ? new Set(currentTabData.map(row => row.id)) : new Set())}
              label="" className="p-0 m-0" 
            />
          ),
          width: '60px', align: 'center',
          render: (row) => (
            <Checkbox id={`select-row-${row.id}`} checked={selectedRowIds.has(row.id)}
              onChange={(checked) => setSelectedRowIds(prev => { const ns = new Set(prev); if (checked) ns.add(row.id); else ns.delete(row.id); return ns; })}
              label="" className="p-0 m-0"
            />
          ),
        }, ...cols,
      ];
    }
    if (renderRowActions) {
        cols = [ ...cols, { key: 'actions' as any, header: 'Actions', width: '120px', align: 'right', render: (row) => renderRowActions(row) }];
    }
    return cols;
  }, [tabs, activeTabId, initialColumns, enableRowSelection, selectedRowIds.size, currentTabData, renderRowActions]);

  const filteredData = useMemo(() => {
    if (!globalFilter) return currentTabData;
    return currentTabData.filter(row =>
      currentColumns.some(col => {
        if (col.key === 'actions' || col.key === 'selector') return false;
        const value = col.accessor ? col.accessor(row) : (row[col.key as keyof T] as any);
        return String(value).toLowerCase().includes(globalFilter.toLowerCase());
      })
    );
  }, [currentTabData, globalFilter, currentColumns]);

  const sortedData = useMemo(() => {
    let sortableData = [...filteredData];
    if (sortConfig?.key) {
      sortableData.sort((a, b) => {
        const aVal = a[sortConfig.key!]; const bVal = b[sortConfig.key!];
        if (aVal == null) return 1; if (bVal == null) return -1;
        if (aVal < bVal) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortableData;
  }, [filteredData, sortConfig]);

  const paginatedData = useMemo(() => {
    if (!enablePagination) return sortedData;
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, enablePagination]);

  const totalPages = enablePagination ? Math.ceil(sortedData.length / pageSize) : 1;
  const requestSort = (key: keyof T) => {
    if (!enableSorting) return;
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig?.key === key && sortConfig.direction === 'ascending') direction = 'descending';
    setSortConfig({ key, direction });
  };

  const renderCellContent = (row: T, column: Column<T>, rowIndex: number) => {
    if (column.render) return column.render(row, rowIndex);
    if (column.accessor) return column.accessor(row);
    if (column.key === 'actions' || column.key === 'selector') return null;
    const value = row[column.key as keyof T] as any;
    if (column.dataType === 'status') return <StatusBadge status={value as StatusType} />;
    return value != null ? String(value) : '-';
  };

  const mainContent = (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full divide-y divide-slate-200 border border-slate-200 rounded-lg">
        <thead className="bg-slate-50">
          <tr>
            {currentColumns.map((column) => (
              <th key={String(column.key)} scope="col"
                className={`px-4 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap ${column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'} ${column.sortable && enableSorting ? 'cursor-pointer hover:bg-slate-100' : ''}`}
                style={{ width: column.width, minWidth: column.minWidth }}
                onClick={() => column.sortable && requestSort(column.key as keyof T)}
              >
                <div className={`flex items-center ${column.align === 'right' ? 'justify-end' : column.align === 'center' ? 'justify-center' : 'justify-start'}`}>
                  {column.header}
                  {enableSorting && column.sortable && (
                    <span className="ml-1.5 opacity-70">
                      {sortConfig?.key === column.key ? (sortConfig.direction === 'ascending' ? <ChevronUp size={14} /> : <ChevronDown size={14} />) : <ArrowUpDown size={14} className="text-slate-400"/>}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {isLoading ? (<tr><td colSpan={currentColumns.length} className="p-8 text-center text-slate-500">Loading...</td></tr>)
           : paginatedData.length === 0 ? (<tr><td colSpan={currentColumns.length} className="p-8 text-center text-slate-500">No data.</td></tr>)
           : (paginatedData.map((row, rowIndex) => (
              <tr key={row.id} className={`transition-colors duration-150 ${onRowClick ? 'cursor-pointer hover:bg-brand-50' : 'hover:bg-slate-50'}`} onClick={() => onRowClick?.(row)}>
                {currentColumns.map((column) => (
                  <td key={String(column.key)} className={`px-4 py-3 whitespace-nowrap text-sm text-slate-700 ${column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'}`} style={{ width: column.width, minWidth: column.minWidth }}>
                    {renderCellContent(row, column, rowIndex)}
                  </td>
                ))}
              </tr>)))}
        </tbody>
      </table>
      {enablePagination && totalPages > 0 && !isLoading && ( 
        <div className="flex items-center justify-between py-3 px-4 border-t border-slate-200 mt-0 rounded-b-lg bg-white">
            <span className="text-sm text-slate-600">
                Page {currentPage} of {totalPages} ({sortedData.length} items)
            </span>
            <div className="flex items-center space-x-2">
                <SecondaryButton size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</SecondaryButton>
                <SecondaryButton size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</SecondaryButton>
            </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={`bg-white rounded-xl shadow-lg p-5 ${className || ''}`}>
      {(title || enableGlobalFilter || renderTableActions) && (
        <div className="mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"> 
          {title && <h2 className="text-xl font-semibold text-slate-800 flex-shrink-0">{title}</h2>}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-start sm:justify-end flex-wrap"> 
            {enableGlobalFilter && (
              <TextInput
                id="table-global-filter" type="text" value={globalFilter} onChange={setGlobalFilter}
                placeholder="Search table..."
                leadingIcon={<Search size={16} className="text-slate-400"/>}
                className="min-w-[200px] sm:min-w-[250px] !mb-0" 
                inputClassName="py-2.5" 
              />
            )}
            {renderTableActions && renderTableActions()}
          </div>
        </div>
      )}
      {tabs?.length ? (
        <Tabs tabs={tabs.map(tab => ({ id: tab.id, label: tab.label, children: mainContent }))}
          defaultTabId={activeTabId}
          onTabChange={(tabId) => { setActiveTabId(tabId); setCurrentPage(1); setSortConfig(null); setGlobalFilter(''); setSelectedRowIds(new Set()); }}
          variant="pills" navClassName="mb-5"
        />
      ) : mainContent }
    </div>
  );
};
export default Table;