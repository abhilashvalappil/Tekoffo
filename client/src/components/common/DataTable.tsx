import { Filter } from 'lucide-react';
import { Stack, Pagination } from '@mui/material';
import SearchBar from './SearchBar';
import SelectDropdown from './SelectDropdown';

const DataTable = ({
  title,
  searchPlaceholder,
  searchQuery,
  onSearchChange,
  statusFilter,
  onFilterChange,
  filterOptions,
  columns,
  data,
  renderRow,
  pagination,
  handlePageChange,
  error,
  emptyMessage
}) => {
  return (
    <div className="min-h-screen bg-white text-[#0A142F] ml-0 md:ml-64">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-3xl font-bold mb-8">{title}</h1>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          {/* Search */}
          <SearchBar
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={onSearchChange}
            className="w-full md:w-64"
            />

          {/* Filter */}
          <div className="flex flex-wrap gap-3">
            <SelectDropdown
              value={statusFilter}
              onChange={onFilterChange}
              options={filterOptions}
              icon={<Filter size={18} />}
              className="w-full sm:w-auto"
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 text-red-600 text-sm font-medium bg-red-100 border border-red-300 rounded-lg p-3">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {data && data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((item, idx) => renderRow(item, idx))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">{emptyMessage}</div>
          )}
        </div>

        {/* Pagination */}
        <Stack spacing={2} alignItems="center" className="mt-4">
          <Pagination
            count={pagination.pages}
            page={pagination.page}
            onChange={(_, value) => handlePageChange(value)}
            color="primary"
          />
        </Stack>
      </div>
    </div>
  );
};

export default DataTable;
