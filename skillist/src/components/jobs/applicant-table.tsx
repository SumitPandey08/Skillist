'use client'

import * as React from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Sparkles, ArrowUpDown } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Applicant {
  id: string
  studentName: string
  matchScore: number
  status: string
  appliedAt: string
}

const columns: ColumnDef<Applicant>[] = [
  {
    accessorKey: 'studentName',
    header: 'Candidate',
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('studentName')}</div>
    ),
  },
  {
    accessorKey: 'matchScore',
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1 hover:text-foreground transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Match Score
          <ArrowUpDown className="h-3 w-3" />
        </button>
      )
    },
    cell: ({ row }) => {
      const score = row.getValue('matchScore') as number
      return (
        <div className="flex items-center gap-2">
          <div className="w-12 text-right font-bold text-primary">{score}%</div>
          {score >= 80 && (
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 gap-1 text-[10px] py-0">
              <Sparkles className="h-2.5 w-2.5" /> AI PICK
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'appliedAt',
    header: 'Applied Date',
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm">
        {new Date(row.getValue('appliedAt')).toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize text-[10px]">
        {row.getValue('status')}
      </Badge>
    ),
  },
]

export function ApplicantTable({ data }: { data: Applicant[] }) {
  const router = useRouter()
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'matchScore', desc: true },
  ])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  return (
    <div className="rounded-md border bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50/50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
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
                className="cursor-pointer hover:bg-slate-50/80 transition-colors"
                onClick={() => router.push(`/employer/candidates/${row.original.id}`)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No applicants yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
