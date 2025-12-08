import apiClient from "@/lib/axios";

import { Product } from "../schemas/product.schema";

export const fetchProducts = (): Promise<{
    data: Product[],
    success: boolean
}> => apiClient.get('/products').then(res => res.data);