import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Trash2 } from "lucide-react";
import { useDeleteOrder } from "../hooks/useDeleteOrder";
import { Order } from "../schemas";

function DropdownItemDeleteOrderDialog({ item }: { item: Order }) {

	const { isOpen, toggleOpen, confirmDeleteOrder } = useDeleteOrder({
		item,
	});

	return (
		<>
			<DropdownMenuItem
				onSelect={(e) => {
					e.preventDefault();
					toggleOpen(true);
				}}
				className="text-destructive focus:text-destructive focus:bg-destructive/10"
			>
				<Trash2 className="mr-2 h-4 w-4 text-destructive focus:text-destructive" />
				Delete Order
			</DropdownMenuItem>
			<AlertDialog
				open={isOpen}
				onOpenChange={(open) => !open && toggleOpen(false)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete Order {item.id}.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => toggleOpen(false)}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => confirmDeleteOrder()}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

export { DropdownItemDeleteOrderDialog };
