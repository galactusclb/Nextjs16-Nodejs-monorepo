'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { useCreateOrder } from '../hooks/useCreateOrder';
import { useFetchProducts } from '../hooks/useFetchProducts';
import { orderMutateSchema, type OrderMutateFormData } from '../schemas';

export default function OrderMutateForm() {
    const router = useRouter();
    const pathname = usePathname();

    const { data: products = [], isLoading: loadingProducts, error: productsError } = useFetchProducts();
    const { createOrder, loading } = useCreateOrder({
        onSuccess: () => goBack(),
    });

    const form = useForm<OrderMutateFormData>({
        resolver: zodResolver(orderMutateSchema),
        defaultValues: {
            orderDescription: "",
            productIds: [],
        }
    })

    const { handleSubmit, formState: { errors }, control } = form

    const onSubmit = async (data: OrderMutateFormData) => {
        await createOrder(data);
    }

    const onInvalidSubmit = (errors: any) => {
        console.log('Form validation errors:', errors);
    }

    const goBack = () => {
        const basePath = pathname.substring(0, pathname.lastIndexOf('/'));
        router.push(basePath);
    };


    if (loadingProducts) {
        return <div className="px-6 pb-4">Loading products...</div>
    }

    if (productsError) {
        return <div className="px-6 pb-4">Error loading products. Please refresh the page.</div>
    }

    return (
        <div className="px-6 pb-4">
            <div className="mb-6">
                <Button
                    variant="ghost"
                    onClick={goBack}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground p-0"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Orders
                </Button>
            </div>

            <div className="max-w-2xl">
                <FormProvider {...form}>
                    <form onSubmit={handleSubmit(onSubmit, onInvalidSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold">Create New Order</h2>

                            <FormField
                                control={control}
                                name="orderDescription"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="orderDescription">Order Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                id="orderDescription"
                                                placeholder="Enter order description"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="productIds"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Products</FormLabel>
                                        <FormControl>
                                            <div className="space-y-3 border rounded-lg p-4">
                                                {products.length === 0 ? (
                                                    <p className="text-sm text-muted-foreground">No products available</p>
                                                ) : (
                                                    products.map((product) => (
                                                        <div key={product.id} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={`product-${product.id}`}
                                                                checked={field.value.includes(product.id)}
                                                                onCheckedChange={(checked) => {
                                                                    const newValues = checked
                                                                        ? [...field.value, product.id]
                                                                        : field.value.filter(id => id !== product.id);
                                                                    field.onChange(newValues);
                                                                }}
                                                            />
                                                            <label
                                                                htmlFor={`product-${product.id}`}
                                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                            >
                                                                {product.productName}
                                                            </label>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button
                                type='button'
                                variant={"outline"}
                                size={"lg"}
                                onClick={goBack}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                size={"lg"}
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Order
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
}
