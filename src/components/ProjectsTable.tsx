import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';
import type { Project } from '../types';

const columnHelper = createColumnHelper<Project>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Project Name',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor(row => row.score?.total, {
    id: 'score',
    header: 'Total Score',
    cell: info => `${info.getValue() || 0}/100`,
  }),
  columnHelper.accessor(row => row.measures?.coverage, {
    id: 'coverage',
    header: 'Coverage',
    cell: info => `${info.getValue()?.toFixed(2) || 0}%`,
  }),
  columnHelper.accessor(row => row.measures?.bugs, {
    id: 'bugs',
    header: 'Bugs',
    cell: info => info.getValue() || 0,
  }),
  columnHelper.accessor(row => row.measures?.vulnerabilities, {
    id: 'vulnerabilities',
    header: 'Vulnerabilities',
    cell: info => info.getValue() || 0,
  }),
  columnHelper.accessor(row => row.measures?.code_smells, {
    id: 'codeSmells',
    header: 'Code Smells',
    cell: info => info.getValue() || 0,
  }),
];

interface ProjectsTableProps {
  projects: Project[];
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({ projects }) => {
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data: projects,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 10,
      },
      sorting: [
        {
          id: 'score',
          desc: true,
        },
      ],
    },
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-dark/40" />
        <input
          value={globalFilter ?? ''}
          onChange={e => setGlobalFilter(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
          placeholder="Search projects..."
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-semibold text-primary-navy uppercase tracking-wider cursor-pointer hover:text-primary-blue"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                      {header.column.getIsSorted() ? (
                        header.column.getIsSorted() === 'asc' ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )
                      ) : null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                className="hover:bg-primary-blue/5 border-t border-gray-100"
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-primary-dark">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            className="px-4 py-2 text-sm font-medium text-primary-dark bg-white border border-gray-200 rounded-md hover:bg-primary-blue/5 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-primary-dark bg-white border border-gray-200 rounded-md hover:bg-primary-blue/5 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
        <span className="text-sm text-primary-dark/70">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </span>
      </div>
    </div>
  );
};

export default ProjectsTable;