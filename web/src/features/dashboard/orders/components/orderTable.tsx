import { ResponsiveTable } from "@/components/composite/table/responsiveTable";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { PageSize } from "@/lib/types";
import { useOrdersDetails } from "../hooks/useOrdersDetails";
import { orderTableColumns } from "./orderTableColumns";
import { DropdownItemDeleteOrderDialog } from "./dropdownItemDeleteOrderDialog";
import { DropdownItemEditOrder } from "./DropdownItemEditOrder";

function OrderTable() {
	const {
		pageMetaData,
		orderList,
		handleFilterSubmit,
		handlePaginationChange,
		totalPage,
	} = useOrdersDetails({});

	const columns = orderTableColumns({
		dropdownItems: [
			(item) => <DropdownItemEditOrder item={item} />,
			() => <DropdownMenuSeparator />,
			(item) => <DropdownItemDeleteOrderDialog item={item} />,
		],
	});

	return (
		<ResponsiveTable
			columns={columns}
			data={orderList}
			filterColumnKey="roomNumber"
			filters={[
				// {
				// 	columnKey: "roomNumber",
				// 	type: "input",
				// },
				// {
				// 	columnKey: "mainType",
				// 	type: "select",
				// 	options: [
				// 		{
				// 			label: "SBG",
				// 			value: "SBG",
				// 		},
				// 		{
				// 			label: "SHM",
				// 			value: "SHM",
				// 		},
				// 	],
				// },
			]}
			onFilterSubmit={handleFilterSubmit}
			onPaginationChange={handlePaginationChange}
			pageIndex={pageMetaData.pageIndex}
			pageSize={pageMetaData.pageSize as PageSize}
			pageCount={totalPage}
			//   pageCount={Math.ceil(totalCount / pageSize)}
			//   isLoading={isRoomListLoading}
		/>
	);
}

export { OrderTable };
