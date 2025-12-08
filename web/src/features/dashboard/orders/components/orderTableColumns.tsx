import { ColumnDefExtend } from "@/components/composite/table/responsiveTable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import dayjs from "dayjs";
import { ArrowUpDown } from "lucide-react";
import { ReactNode } from "react";
import { Order } from "../schemas";

export function orderTableColumns({ 
	dropdownItems,
}: { 
	dropdownItems?: ((item: Order) => ReactNode)[];
}) {
	const columns: ColumnDefExtend<Order>[] = [
		{
			id: "select",
			header: ({ table }) => (
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && "indeterminate")
					}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label="Select all"
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label="Select row"
				/>
			),
			enableSorting: false,
			enableHiding: false,
			meta: {
				className : "w-12 border-r",
			}
		},
		{
			accessorKey: "id",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Order ID
						<ArrowUpDown />
					</Button>
				);
			}
		},
		{
			accessorKey: "orderDescription",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Order Description
						<ArrowUpDown />
					</Button>
				);
			},
			cell: ({ row }) => <div className="">{row.getValue("orderDescription")}</div>,
		},
		{
			accessorKey: "orderProductMap",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Count of Products
						<ArrowUpDown />
					</Button>
				);
			},
			cell: ({ row }) => {
				const orderProducts = row.original.orderProductMap;
				return (
					<div className="">
						{orderProducts?.length ?? 0}
					</div>
				);
			},
		},
		{
			accessorKey: "createdAt",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Created Date
						<ArrowUpDown />
					</Button>
				);
			},
			cell: ({ row }) => {
				const formattedDate = dayjs(row.getValue("createdAt")).format("MMM DD, YYYY hh:mm A");
				return (
					<div className="">
						{formattedDate}
					</div>
				);
			},
		},
		// {
		// 	accessorKey: "status",
		// 	header: "Status",
		// 	cell: ({ row }) => (
		// 		<div className="capitalize">{row.getValue("status")}</div>
		// 	),
		// },
		// {
		// 	id: "actions",
		// 	enableHiding: false,
		// 	cell: ({ row }) => {
		// 		const item = row.original;

		// 		return (
		// 			<DropdownMenu>
		// 				<DropdownMenuTrigger asChild>
		// 					<Button variant="ghost" className="h-8 w-8 p-0">
		// 						<span className="sr-only">Open menu</span>
		// 						<MoreHorizontal />
		// 					</Button>
		// 				</DropdownMenuTrigger>
		// 				<DropdownMenuContent align="end">
		// 					<DropdownMenuLabel>Actions</DropdownMenuLabel>
		// 					{dropdownItems?.map((renderDropdownItem, key) => (
		// 						<Fragment key={key}>{renderDropdownItem(item)}</Fragment>
		// 					))}
		// 					{/* <DropdownMenuItem onClick={() => onEdit(item)}>
		// 						Edit Details
		// 					</DropdownMenuItem>
		// 					<DropdownMenuItem onClick={() => onManageNotes(item)}>
		// 						Manage Notes
		// 					</DropdownMenuItem> */}
		// 					{/* <DropdownMenuSeparator /> */}
		// 					{/* {canDelete ? (
		// 						<DropdownMenuItem
		// 							onClick={() => onDelete(item)}
		// 							className="text-destructive focus:text-destructive focus:bg-destructive/10"
		// 						>
		// 							<Trash2 className="mr-2 h-4 w-4" />
		// 							Delete Room
		// 						</DropdownMenuItem>
		// 					) : null} */}
		// 					{/* <DropdownMenuItem onClick={() => onShowQr(item.id!)}>
		// 						Show QR Code
		// 					</DropdownMenuItem> */}
		// 				</DropdownMenuContent>
		// 			</DropdownMenu>
		// 		);
		// 	},
		// 	meta: {
		// 		className: "w-8",
		// 	},
		// },
	];

	return columns;
}
