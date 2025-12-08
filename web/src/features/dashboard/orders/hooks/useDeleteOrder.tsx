 import { deleteOrder } from "../service/order.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Order } from "../schemas";

function useDeleteOrder({ item }: { item?: Order }) {
	const queryClient = useQueryClient();
	const [isOpen, toggleOpen] = useState<boolean>(false);

	const { mutate: onDelete, isPending } = useMutation({
		mutationFn: deleteOrder,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["/orders"] });
			toast.success(`Order #${item?.id} has been deleted successfully.`);
		},
		onError: (error: any) => {
			console.log("error", error);
			const errorMessage = error.response?.data?.message || "Failed to delete order.";
			toast.error(errorMessage);
		},
		onSettled: () => {
			toggleOpen(false);
		},
	});

	const confirmDeleteOrder = () => {
		if (item) {
			onDelete(item.id);
		}
	};

	return {
		confirmDeleteOrder,
		isOpen,
		toggleOpen,
		isPending,
	};
}

export { useDeleteOrder };
