import { TableMetaData } from "@/lib/types";
import apiClient from "@/lib/axios";

import { Order, OrderMutateFormData } from "../schemas";

export const fetchOrderById = async (orderId: number): Promise<{
    success: boolean,
    data: Order
}> => {
    return await apiClient.get(`/orders/${orderId}`).then(res => res.data)
}

export const fetchOrders = ({ pageIndex, pageSize, filters }: TableMetaData): Promise<{
    data: Order[],
    meta: {
        limit: number,
        page: number,
        total: number,
        totalPages?: number,
    }
}> => {
    const params = new URLSearchParams();
    params.append("page", (pageIndex + 1).toString()); // assuming 1-based pages in API
    params.append("limit", pageSize.toString());
    if (filters) {
        console.log(filters);

        Object.entries(filters).forEach(([key, value]) => {
            if (!value?.selectedOptions || value?.selectedOperator === null) return
            if (Array.isArray(value?.selectedOptions) && (!value.selectedOptions || value.selectedOptions.length === 0)) return

            const queryKey = value.selectedOperator ? `${key}[${value.selectedOperator}]` : key;

            if (Array.isArray(value.selectedOptions)) {
                params.append(queryKey, value.selectedOptions.join(','));
            } else if (value.selectedOptions instanceof Date) {
                params.append(queryKey, value.selectedOptions.toISOString());
            } else {
                params.append(queryKey, value.selectedOptions);
            }

        });
    }
    return apiClient.get(`/orders?${params.toString()}`).then(res => res.data);
};

export const createOrderAction = async (data: OrderMutateFormData, idempotencyKey?: string): Promise<{
    success: boolean;
    data?: Order;
    error?: string;
}> => {
    try {
        const response = await apiClient.post('/orders', data, {
            headers: idempotencyKey ? { 'idempotency-key': idempotencyKey } : {},
        });
        return {
            success: true,
            data: response.data,
        };
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Failed to create order. Please try again.';
        return {
            success: false,
            error: errorMessage,
        };
    }
};

export const updateOrderAction = async (orderId: number, data: OrderMutateFormData): Promise<{
    success: boolean;
    data?: Order;
    error?: string;
}> => {
    try {
        console.log('updating data', data)
        const response = await apiClient.put(`/orders/${orderId}`, data);
        return {
            success: true,
            data: response.data,
        };
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Failed to update order. Please try again.';
        return {
            success: false,
            error: errorMessage,
        };
    }
};

export const deleteOrder = async (orderId: number): Promise<void> => {
    await apiClient.delete(`/orders/${orderId}`);
};