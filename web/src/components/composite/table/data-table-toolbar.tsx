"use client";

import { Table } from "@tanstack/react-table";
import { LucideProps, Search, X } from "lucide-react";

import { DataTableViewOptions } from "@/components/composite/table/data-table-view-options";

import { Button } from "@/components/ui/button";
import { Table as TableType } from "@tanstack/react-table";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableSearchInput } from "./data-table-search-input";

export type filterOption = {
	value: string;
	label: string;
	icon?: ForwardRefExoticComponent<
		Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
	>;
};

export type Filters<TData> = {
	type?: "input" | "select";
	columnKey: string;
	customFilterKey?: string;
	placeholder?: string;
	customFilterComponent?:
		| React.ReactNode
		| ((table: TableType<TData>) => React.ReactNode);
	options?: filterOption[];
};

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
	filters?: Filters<TData>[];
	onFilterSubmit?: () => void;
}

export function DataTableToolbar<TData>({
	table,
	filters = [],
	onFilterSubmit,
}: DataTableToolbarProps<TData>) {
	const isFiltered = table.getState().columnFilters.length > 0;

	return (
		<div className="flex items-center w-full justify-between">
			<div className="flex flex-1 items-center gap-2">
				{/* <Input
					placeholder="Filter tasks..."
					value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
					onChange={(event) =>
						table.getColumn("title")?.setFilterValue(event.target.value)
					}
					className="h-8 w-[150px] lg:w-[250px]"
				/> */}
				{filters.map((filter, idx) => {
 
					const column = table?.getColumn(
						filter.columnKey
					);

					// If neither column nor custom filter component, skip
					if (!column && !filter.customFilterComponent) return null;

					// If custom filter component, render it
					if (filter.customFilterComponent) {
						return typeof filter.customFilterComponent === "function"
							? filter.customFilterComponent(table)
							: filter.customFilterComponent;
					}

					// If input filter and customFilterKey, pass both
					if (filter.type === "input" && filter.customFilterKey) {
						return (
							<DataTableSearchInput
								key={filter.customFilterKey}
								filter={filter}
								column={column}
								customFilterKey={filter.customFilterKey}
							/>
						);
					}

					if (column) {
						if (filter.type === "input") {
							return (
								<DataTableSearchInput
									key={filter.columnKey}
									filter={filter}
									column={column}
								/>
							);
						}

						return (
							<DataTableFacetedFilter
								key={idx}
								column={column}
								title={filter.columnKey}
								options={filter.options ?? []}
							/>
						);
					}

					return null;
				})}
				{isFiltered && (
					<>
						<Button
							variant="ghost"
							size="sm"
							className="h-8"
							onClick={() => table.resetColumnFilters()}
						>
							Reset
							<X />
						</Button>
						<Button
							variant="default"
							size="sm"
							className="h-8"
							onClick={onFilterSubmit}
						>
							Submit
							<Search />
						</Button>
					</>
				)}
			</div>
			<div className="flex items-center gap-2">
				<DataTableViewOptions table={table} />
				{/* <Button size="sm">Add Task</Button> */}
			</div>
		</div>
	);
}
