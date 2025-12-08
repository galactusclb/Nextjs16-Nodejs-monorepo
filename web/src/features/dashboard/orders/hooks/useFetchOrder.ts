
import { useQuery } from '@tanstack/react-query';

import { orderResponseSchema } from '../schemas';
import { fetchOrderById } from '../service/order.service';

export function useFetchOrder(orderId?: number) {
    return useQuery({
        queryKey: ['orders', orderId],
        queryFn: async () => {
            if (!orderId) return null;
            const response = await fetchOrderById(orderId);
            return orderResponseSchema.parse(response.data);
        },
        enabled: !!orderId,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}
