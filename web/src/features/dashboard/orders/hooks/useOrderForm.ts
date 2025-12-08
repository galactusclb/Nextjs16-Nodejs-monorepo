import { zodResolver } from '@hookform/resolvers/zod';

import { useEffect } from 'react';

import { useForm } from 'react-hook-form';

import { usePathname, useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { orderMutateSchema, type OrderMutateFormData } from '../schemas';

import { useFetchOrder } from './useFetchOrder';
import { useMutateOrder } from './useMutateOrder';

interface UseOrderFormOptions {
    orderId?: number;
}

export function useOrderForm({ orderId }: UseOrderFormOptions = {}) {
    const router = useRouter();
    const pathname = usePathname();

    const isEditing = !!orderId;
    const { data: order } = useFetchOrder(orderId);
    const { mutateOrder, loading } = useMutateOrder({
        orderId,
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

    const onSubmit = async (data: OrderMutateFormData) => {
        await mutateOrder(data);
    };

    const onInvalidSubmit = (errors: any) => {
        console.error('Form validation errors:', errors);
        toast.error('Form validation errors');
    };

    const goBack = () => {
        const basePath = pathname.substring(0, pathname.lastIndexOf('/'));
        router.push(basePath);
    };

    useEffect(() => {
        if (isEditing && order) {
            reset({
                orderDescription: order.orderDescription,
                productIds: order.orderProductMap?.map(map => map.productId) || [],
            });
        }
    }, [isEditing, order, reset]);


    return {
        form,
        handleSubmit,
        control,

        isEditing,
        loading,

        onSubmit,
        onInvalidSubmit,
        goBack,
    };
}
