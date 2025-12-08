'use client';

import { Button } from '@/components/ui/button';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { FormProvider } from 'react-hook-form';
import { useFetchProducts } from '../hooks/useFetchProducts';
import { useOrderForm } from '../hooks/useOrderForm';
import { ProductListItem } from './ProductListItem';

interface OrderMutateFormProps {
    orderId?: number;
}

export default function OrderMutateForm({ orderId }: OrderMutateFormProps) {
    const {
        form,
        handleSubmit,
        control,
        isEditing,
        loading,
        onSubmit,
        onInvalidSubmit,
        goBack,
    } = useOrderForm({ orderId });

    const { data: products = [] } = useFetchProducts();

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
                            <h2 className="text-lg font-semibold">
                                {isEditing ? 'Edit Order' : 'Create New Order'}
                            </h2>

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
                                                        <ProductListItem
                                                            key={product.id}
                                                            item={product}
                                                            isChecked={field.value.includes(product.id)}
                                                            onCheckedChange={(checked) => {
                                                                const newValues = checked
                                                                    ? [...field.value, product.id]
                                                                    : field.value.filter(id => id !== product.id);
                                                                field.onChange(newValues);
                                                            }}
                                                        />
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
                                {isEditing ? 'Update Order' : 'Create Order'}
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
}
