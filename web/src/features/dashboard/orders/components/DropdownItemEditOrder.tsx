'use client';

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Edit } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { Order } from "../schemas";

function DropdownItemEditOrder({ item }: { item: Order }) {
	const router = useRouter();
	const pathname = usePathname();

	const handleEdit = () => {
		router.push(`${pathname}/${item.id}`);
	};

	return (
		<DropdownMenuItem onClick={handleEdit}>
			<Edit className="mr-2 h-4 w-4" />
			Edit Order
		</DropdownMenuItem>
	);
}

export { DropdownItemEditOrder };
