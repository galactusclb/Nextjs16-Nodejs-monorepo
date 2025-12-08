import { zodResolver } from '@hookform/resolvers/zod';

import { useEffect } from 'react';

import { useForm } from 'react-hook-form';

import { usePathname, useRouter } from 'next/navigation';

import { orderMutateSchema, type OrderMutateFormData } from '../schemas';

import { useCreateOrder } from './useCreateOrder';
import { useFetchOrder } from './useFetchOrder';

interface UseOrderFormOptions {
    orderId?: number;
}

export function useOrderForm({ orderId }: UseOrderFormOptions = {}) {
    const router = useRouter();
    const pathname = usePathname();

    const isEditing = !!orderId;
    const { data: order } = useFetchOrder(orderId);
    const { createOrder, loading } = useCreateOrder({
        onSuccess: () => goBack(),
    });

    const form = useForm<OrderMutateFormData>({
        resolver: zodResolver(orderMutateSchema),
        defaultValues: {
            orderDescription: "",
            productIds: [],
        }
    });

    const { handleSubmit, control, reset } = form;

    useEffect(() => {
        if (isEditing && order) {
            reset({
                orderDescription: order.orderDescription,
                productIds: order.orderProductMap?.map(map => map.productId) || [],
            });
        }
    }, [isEditing, order, reset]);

    const onSubmit = async (data: OrderMutateFormData) => {
        await createOrder(data);
    };

    const onInvalidSubmit = (errors: any) => {
        console.log('Form validation errors:', errors);
    };

    const goBack = () => {
        const basePath = pathname.substring(0, pathname.lastIndexOf('/'));
        router.push(basePath);
    };

    return {
        form,
        handleSubmit,
        control,

        isEditing,        
        createOrder,
        loading,
        
        onSubmit,
        onInvalidSubmit,
        goBack,
    };
}
