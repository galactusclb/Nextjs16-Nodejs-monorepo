import { TableMetaData } from "@/lib/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ColumnFiltersState, PaginationState } from "@tanstack/react-table";
import { useCallback, useEffect } from "react";
import { fetchOrders } from "../service/order.service";
import { useOrderQueryParams } from "./useOrderQueryParams";

function useOrdersDetails() {
	// const { toast } = useToast();

	// const [pageMetaData, setPageMetaData] = useState<TableMetaData>({
	// 	pageIndex: 0,
	// 	pageSize: 15,
	// 	filters: {},
	// });
	const { queryParams, setQueryParams } = useOrderQueryParams();

	const queryKey = ["/orders", { ...queryParams }];

	const {
		data,
		error,
		isLoading: isOrderListLoading,
	} = useSuspenseQuery({
		queryKey,
		queryFn: () => fetchOrders({ ...queryParams } as TableMetaData),
		// keepPreviousData: true,
		staleTime: 5 * 60 * 1000,
	});

	const handleFilterSubmit = useCallback(
		(columnFilters: ColumnFiltersState) => {
			const newFilters: Record<string, unknown> = {};
			columnFilters.forEach(({ id, value }) => {
				newFilters[id] = value;
			});

			setQueryParams({
				filters: newFilters,
				pageIndex: 0,
			});
		},
		[setQueryParams]
	);

	const handlePaginationChange = useCallback(
		({ pageIndex, pageSize }: PaginationState) => {
			setQueryParams({ pageIndex, pageSize });
		},
		[setQueryParams]
	);

	useEffect(() => {
		if (error) {
			console.error(error);

			// toast({
			// 	title: "Error",
			// 	description: "Failed to fetch room data.",
			// 	variant: "destructive",
			// });
		}
	}, [error]);

	return {
		orderList: data?.data ?? [],
		totalPage: data?.meta?.totalPages ?? 0,
		error,
		isOrderListLoading,
		handleFilterSubmit,
		handlePaginationChange,
		pageMetaData : queryParams,
	};
}

export { useOrdersDetails };
