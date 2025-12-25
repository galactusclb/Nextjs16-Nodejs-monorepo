"use client";

import {
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	OnChangeFn,
	SortingState,
	ColumnDef as TanstackColumnDef,
	useReactTable,
	VisibilityState,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { PageSize } from "@/lib/types";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { Filters } from "./data-table-search-input";

export type ColumnMeta = {
	className?: string;
};

export type ColumnDefExtend<TData, TValue = unknown> = TanstackColumnDef<
	TData,
	TValue
> & {
	meta?: ColumnMeta;
};

export type ResponsiveTableProps<TData> = {
	data: TData[];
	columns: ColumnDefExtend<TData, unknown>[];
	filters?: Filters<TData>[];
	filterColumnKey?: string;
	filterPlaceholder?: string;
	enableToggleColumn?: boolean;
	enableClientFiltering?: boolean;
	onFilterSubmit?: (values: ColumnFiltersState) => void;

	enableClientPagination?: boolean; // Add this
	pageIndex?: number;
	pageSize?: PageSize;
	pageCount: number;
	onPaginationChange?: (pagination: {
		pageIndex: number;
		pageSize: PageSize;
	}) => void;
	columnVisibilityObj ?: VisibilityState
};

function ResponsiveTable<TData>({
	data,
	columns,
	filters = [],
	onFilterSubmit,
	filterColumnKey,
	filterPlaceholder = "Filter...",
	enableToggleColumn = true,
	enableClientFiltering = false,
	enableClientPagination = false,
	pageIndex = 0,
	pageSize = 15,
	pageCount,
	onPaginationChange,
	columnVisibilityObj
}: ResponsiveTableProps<TData>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState({});

	const handleColumnFiltersChange: OnChangeFn<ColumnFiltersState> = (
		updaterOrValue
	) => {
		const newFilters =
			typeof updaterOrValue === "function"
				? updaterOrValue(columnFilters)
				: updaterOrValue;

		setColumnFilters(newFilters);

		console.log("newFilters", newFilters);

		if (newFilters.length === 0) {
			onFilterSubmit?.(newFilters);
		}
	};

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		...(enableClientPagination
			? {
					getPaginationRowModel: getPaginationRowModel(),
			  }
			: {
					manualPagination: true,
					// pageCount: Math.ceil(data.length / pageSize),
			  }),
		onPaginationChange: onPaginationChange
			? (updaterOrValue) => {
					const value =
						typeof updaterOrValue === "function"
							? updaterOrValue({ pageIndex, pageSize })
							: updaterOrValue;

					onPaginationChange?.({
						pageIndex: value.pageIndex,
						pageSize: value.pageSize as PageSize,
					});
			  }
			: undefined,
		getSortedRowModel: getSortedRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		...(enableClientFiltering && {
			getFilteredRowModel: getFilteredRowModel(),
		}),
		onColumnFiltersChange: handleColumnFiltersChange,
		pageCount,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			...(enableClientPagination
				? {}
				: { pagination: { pageIndex, pageSize } }),
		},
	});

	useEffect(() => {
		setColumnVisibility(columnVisibilityObj ?? {})
	}, [columnVisibilityObj]);

	return (
		<div className="w-full">
			<div className="flex items-center py-4">
				<DataTableToolbar
					table={table}
					filters={filters}
					onFilterSubmit={() => onFilterSubmit?.(columnFilters)}
				/>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead
										key={header.id}
										className={
											(header.column.columnDef.meta as ColumnMeta)?.className
										}
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
											  )}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table?.getRowModel?.().rows?.length ? (
							table?.getRowModel?.().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell
											key={cell.id}
											className={
												(cell.column.columnDef.meta as ColumnMeta)?.className
											}
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
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
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<DataTablePagination table={table} />
			</div>
		</div>
	);
}

export { ResponsiveTable };
