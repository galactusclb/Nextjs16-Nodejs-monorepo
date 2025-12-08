import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';

import { OrderMutateFormData } from '../schemas';
import { createOrderAction, updateOrderAction } from '../service/order.service';

interface UseMutateOrderOptions {
    orderId?: number;
    onSuccess?: () => void;
}

export function useMutateOrder(options?: UseMutateOrderOptions) {
    const queryClient = useQueryClient();
    const isUpdate = !!options?.orderId;

    const {mutate, isPending, isError, error} = useMutation({
        mutationFn: async (data: OrderMutateFormData) => {
            const result = isUpdate
                ? await updateOrderAction(options!.orderId!, data)
                : await createOrderAction(data);

            if (!result.success) {
                throw new Error(result.error || (isUpdate ? 'Failed to update order' : 'Failed to create order'));
            }
            return result.data;
        },
        onSuccess: () => {
            const message = isUpdate ? 'Order updated successfully!' : 'Order created successfully!';
            toast.success(message);
            
            queryClient.invalidateQueries({ queryKey: ["/orders"] });
            
            options?.onSuccess?.();
        },
        onError: (error: Error) => {
            toast.error(error.message || 'An unexpected error occurred');
        },
    });

    return {
        mutateOrder: mutate,
        loading: isPending,
        isError: isError,
        error: error,
    };
}
