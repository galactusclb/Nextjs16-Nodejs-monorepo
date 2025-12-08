import { Input } from "@/components/ui/input";
import { FilterValue } from "@/lib/types";
import { Column, Table } from "@tanstack/react-table";
import { Filters } from "./data-table-toolbar";

interface DataTableSearchInputProps<TData, TValue> {
	filter: Filters<TData>;
	column?: Column<TData, TValue>;
	table?: Table<TData>;
	customFilterKey?: string;
	title?: string;
}

function DataTableSearchInput<TData, TValue>({
	filter,
    column,
    customFilterKey,
    table,
    title,
}: DataTableSearchInputProps<TData, TValue>) {

	const filterColumn = customFilterKey && table
        ? table.getColumn(customFilterKey)
        : column;

	const filterValue = filterColumn?.getFilterValue() as FilterValue | undefined;
    const selectedOptions = filterValue?.selectedOptions ?? "";

	const handleSearchChange = (value: string) => {
		filterColumn?.setFilterValue({
            selectedOperator: "contains",
            selectedOptions: value,
        });
	};

	return (
		<Input
			placeholder={filter.placeholder || `Filter ${filter.columnKey}...`}
			value={(selectedOptions as string) ?? ""}
			onChange={(e) => handleSearchChange(e.target.value)}
			className="max-w-36 sm:max-w-44"
		/>
	);
}

export { DataTableSearchInput };
