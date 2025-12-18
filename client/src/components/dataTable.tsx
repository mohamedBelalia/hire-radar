"use client"

import * as React from "react"
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import DeleteDialog from "./delete-dialog"
import { EditSkillCategory } from "./add-edit"
import type { ColumnDef } from "@tanstack/react-table"



interface DataTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData>[]
  content: string
  showMenu?: boolean
  addComponent?: React.ReactNode
  actions?: {
    label: string
    onClick: (id: number) => void
    variant?: "default" | "destructive" | "outline"
  }[]
}

export function DataTable<TData extends { id: number, name?: string }>({ data, columns, showMenu= true, content, actions, addComponent }: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  // Dynamic filter for string columns: email or full_name
  const filterableColumns = columns.filter(
    (col) =>
      col.accessorKey &&
      ["full_name"].includes(col.accessorKey as string)
  )

  return (
    <div className="w-full">
      <div className="w-full">
        <div className="flex items-center py-4 space-x-2 w-full">
            <div className="flex space-x-2">
              {filterableColumns.map((col) => (
                <Input
                  key={col.accessorKey}
                  placeholder={`Filter ${col.header}...`}
                  value={(table.getColumn(col.accessorKey)?.getFilterValue() as string) ?? ""}
                  onChange={(e) =>
                    table.getColumn(col.accessorKey)?.setFilterValue(e.target.value)
                  }
                  className="max-w-sm"
                />
              ))}

              {showMenu && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      Columns <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {table
                      .getAllColumns()
                      .filter((column) => column.getCanHide())
                      .map((column) => (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) => column.toggleVisibility(!!value)}
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            {addComponent}
        </div>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-center">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
                {actions && <TableHead>Actions</TableHead>}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-center">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}

                  {actions && (
                    <TableCell>
                      <div className="flex space-x-2">

                        {actions.map((action) => {
                          if (action.label === "Delete") {
                            return (
                              <DeleteDialog
                                key={`delete-${row.original.id}`}
                                id={row.original.id}
                                variant={action.variant}
                                toDelete={content}
                                onDelete={() => action.onClick(row.original.id)}
                              />
                            )
                          }

                          if (action.label === "Edit") {
                            return (
                              <EditSkillCategory
                                key={`edit-${row.original.id}`}
                                id={row.original.id}
                                oldValue={row.original.name!}
                                toEdit={content}
                              />
                            )
                          }

                          return null
                        })}

                      </div>
                    </TableCell>
                  )}

                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + (actions ? 1 : 0)} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}