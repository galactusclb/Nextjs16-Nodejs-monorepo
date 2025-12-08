"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { OrderTable } from "../components/orderTable";
import { Suspense } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePathname, useRouter } from "next/navigation";

function OrdersContainer() {

    const router = useRouter();
    const pathName = usePathname();

    const handleAddOrder = () => {
        router.push(`${pathName}/new`);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-semibold tracking-tight">
                    Order Management
                </h1>
                <Button onClick={handleAddOrder}>
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Add Order
                </Button>
            </div>

            <Suspense
                fallback={
                    <div className="py-8 text-center text-muted-foreground">
                        Loading orders...
                    </div>
                }
            >
                <OrderTable />
            </Suspense>
        </div>
    );
}

export { OrdersContainer };