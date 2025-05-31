/**
 * Table.tsx
 * A reusable table component with horizontal scrolling and tab support.
 */
import React from 'react';
import Tabs from './Tabs';
import StatusBadge from './StatusBadge';

interface Column {
  key: string;
  header: string;
  width?: number;
  type?: 'status';
}

interface TableProps {
  title?: string;
  tabs?: {
    id: string;
    label: string;
    columns: Column[];
    data: Record<string, any>[];
  }[];
  columns?: Column[];
  data?: Record<string, any>[];
}

const Table: React.FC<TableProps> = ({ title, tabs, columns, data }) => {
  if (tabs) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {title && (
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h2>
          </div>
        )}
        <Tabs
          tabs={tabs.map(tab => ({
            id: tab.id,
            label: tab.label,
            content: (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      {tab.columns.map((column) => (
                        <th
                          key={column.key}
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                          style={column.width ? { width: column.width } : undefined}
                        >
                          {column.header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {tab.data.map((row, rowIndex) => (
                      <tr 
                        key={rowIndex}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        {tab.columns.map((column) => (
                          <td
                            key={column.key}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300"
                          > 
                            {column.type === 'status' ? (
                              <StatusBadge status={row[column.key]} />
                            ) : (
                              row[column.key]
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ),
          }))}
        />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      {title && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h2>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {columns?.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                  style={column.width ? { width: column.width } : undefined}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data?.map((row, rowIndex) => (
              <tr 
                key={rowIndex}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                {columns?.map((column) => (
                  <td
                    key={column.key}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300"
                  >
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;