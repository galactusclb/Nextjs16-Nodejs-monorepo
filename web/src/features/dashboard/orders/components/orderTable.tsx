import { ResponsiveTable } from "@/components/composite/table/responsiveTable";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { PageSize } from "@/lib/types";
import { useOrdersDetails } from "../hooks/useOrdersDetails";
import { orderTableColumns } from "./orderTableColumns";
import { DropdownItemDeleteOrderDialogPanel } from "./DropdownItemDeleteOrderDialogPanel";
import { DropdownItemEditOrder } from "./DropdownItemEditOrder";

function OrderTable() {
	const {
		pageMetaData,
		orderList,
		handleFilterSubmit,
		handlePaginationChange,
		totalPage,
	} = useOrdersDetails();

	const columns = orderTableColumns({
		dropdownItems: [
			(item) => <DropdownItemEditOrder item={item} />,
			() => <DropdownMenuSeparator />,
			(item) => <DropdownItemDeleteOrderDialogPanel item={item} />,
		],
	});

	return (
		<ResponsiveTable
			columns={columns}
			data={orderList}
			filters={[
				{
					columnKey: "orderDescription",
					type: "input",
				},
			]}
			onFilterSubmit={handleFilterSubmit}
			onPaginationChange={handlePaginationChange}
			pageIndex={pageMetaData.pageIndex}
			pageSize={pageMetaData.pageSize as PageSize}
			pageCount={totalPage}
		/>
	);
}

export { OrderTable };
