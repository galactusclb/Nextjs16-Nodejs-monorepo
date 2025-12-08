import { ResponsiveTable } from "@/components/composite/table/responsiveTable";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { PageSize } from "@/lib/types";
import { useOrdersDetails } from "../hooks/useOrdersDetails";
import { orderTableColumns } from "./orderTableColumns";

function OrderTable() {
	const {
		pageMetaData,
		orderList,
		isOrderListLoading,
		handleFilterSubmit,
		handlePaginationChange,
		totalPage,
	} = useOrdersDetails({});

	const columns = orderTableColumns({
		dropdownItems: [
			// (item) => <DropdownItemEditRoomDialog item={item} />,
			// (item) => <DropdownItemViewNoteDialog item={item} />,
			// (item) => <DropdownItemShowRoomQRDialog item={item} />,
			// (item) => <DropdownItemMapRoomQRDialog item={item} />,
			() => <DropdownMenuSeparator />,
			// (item) => <DropdownItemDeleteRoomDialog item={item} />,
		],
	});

	// if (isRoomListLoading) return <>Loading...</>;

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
