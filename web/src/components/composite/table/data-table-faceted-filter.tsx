import { Column } from "@tanstack/react-table";
import { Check, PlusCircle } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { FilterValue, SelectOperators } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DataTableFacetedFilterProps<TData, TValue> {
	column?: Column<TData, TValue>;
	title?: string;
	options: {
		label: string;
		value: string;
		icon?: React.ComponentType<{ className?: string }>;
	}[];
}

// const selectOperators: SelectOperators[] = ["equals", "in", "notIn", "not"];

type ExcludeCheckBox = Extract<SelectOperators, "in" | "notIn">;

export function DataTableFacetedFilter<TData, TValue>({
	column,
	title,
	options,
}: DataTableFacetedFilterProps<TData, TValue>) {
	const facets = column?.getFacetedUniqueValues();

	const filterValue = column?.getFilterValue() as FilterValue | undefined;
	const selectedOperator: ExcludeCheckBox =
		(filterValue?.selectedOperator as ExcludeCheckBox) || "in";
	const selectedOptions = new Set(
		Array.isArray(filterValue?.selectedOptions)
			? filterValue?.selectedOptions
			: []
	);

	//! Keep this for later
	const handleOperatorChange = (
		newOperator: FilterValue["selectedOperator"]
	) => {
		column?.setFilterValue({
			selectedOperator: newOperator,
			selectedOptions: Array.from(selectedOptions),
		});
	};

	const handleOperatorToggle = () => {
		column?.setFilterValue({
			selectedOperator: selectedOperator !== "notIn" ? "notIn" : "in",
			selectedOptions: Array.from(selectedOptions),
		});
	};

	const handleOptionToggle = (optionValue: string) => {
		if (selectedOptions.has(optionValue)) {
			selectedOptions.delete(optionValue);
		} else {
			selectedOptions.add(optionValue);
		}
		column?.setFilterValue({
			selectedOperator,
			selectedOptions: Array.from(selectedOptions),
		});
	};

	const borderColor: string =
		selectedOptions?.size < 1
			? ""
			: selectedOperator === "notIn"
			? "border-red-400"
			: "border-blue-400";

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className={`h-8 border-dashed ${borderColor}`}
				>
					<PlusCircle />
					{title}
					{selectedOptions?.size > 0 && (
						<>
							<Separator orientation="vertical" className="mx-2 h-4" />
							<Badge
								variant="secondary"
								className="rounded-sm px-1 font-normal lg:hidden"
							>
								{selectedOptions.size}
							</Badge>
							<div className="hidden gap-1 lg:flex">
								{selectedOptions.size > 2 ? (
									<Badge
										variant="secondary"
										className="rounded-sm px-1 font-normal"
									>
										{selectedOptions.size} selected
									</Badge>
								) : (
									options
										.filter((option) => selectedOptions.has(option.value))
										.map((option) => (
											<Badge
												variant="secondary"
												key={option.value}
												className="rounded-sm px-1 font-normal"
											>
												{option.label}
											</Badge>
										))
								)}
							</div>
						</>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0" align="start">
				<Command>
					<CommandInput placeholder={title} />
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup>
							<CommandItem onSelect={() => handleOperatorToggle()}>
								<div
									className={cn(
										"flex size-4 items-center justify-center rounded-[4px] border",
										selectedOperator === "notIn"
											? "bg-primary border-primary text-primary-foreground"
											: "border-input [&_svg]:invisible"
									)}
								>
									<Check className="text-primary-foreground size-3.5" />
								</div>
								<span>Exclude</span>
							</CommandItem>
							<CommandSeparator />
						</CommandGroup>
						<CommandGroup>
							{options.map((option) => {
								const isSelected = selectedOptions.has(option.value);
								return (
									<CommandItem
										key={option.value}
										onSelect={() => handleOptionToggle(option.value)}
									>
										<div
											className={cn(
												"flex size-4 items-center justify-center rounded-[4px] border",
												isSelected
													? "bg-primary border-primary text-primary-foreground"
													: "border-input [&_svg]:invisible"
											)}
										>
											<Check className="text-primary-foreground size-3.5" />
										</div>
										{option.icon && (
											<option.icon className="text-muted-foreground size-4" />
										)}
										<span>{option.label}</span>
										{facets?.get(option.value) && (
											<span className="text-muted-foreground ml-auto flex size-4 items-center justify-center font-mono text-xs">
												{facets.get(option.value)}
											</span>
										)}
									</CommandItem>
								);
							})}
						</CommandGroup>
						{selectedOptions.size > 0 && (
							<>
								<CommandSeparator />
								<CommandGroup>
									<CommandItem
										onSelect={() => column?.setFilterValue(undefined)}
										className="justify-center text-center"
									>
										Clear filters
									</CommandItem>
								</CommandGroup>
							</>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
