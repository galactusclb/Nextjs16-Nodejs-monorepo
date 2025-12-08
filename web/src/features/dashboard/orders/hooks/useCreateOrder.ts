import { useMutation } from '@tanstack/react-query';

import { toast } from 'sonner';

import { OrderMutateFormData } from '../schemas';
import { createOrderAction } from '../service/order.service';

interface UseCreateOrderOptions {
    onSuccess?: () => void;
}

export function useCreateOrder(options?: UseCreateOrderOptions) {
    const {mutate, isPending, isError, error} = useMutation({
        mutationFn: async (data: OrderMutateFormData) => {
            const result = await createOrderAction(data);
            if (!result.success) {
                throw new Error(result.error || 'Failed to create order');
            }
            return result.data;
        },
        onSuccess: () => {
            toast.success('Order created successfully!');
            options?.onSuccess?.();
        },
        onError: (error: Error) => {
            toast.error(error.message || 'An unexpected error occurred');
        },
    });

    return {
        createOrder: mutate,
        loading: isPending,
        isError: isError,
        error: error,
    };
}
