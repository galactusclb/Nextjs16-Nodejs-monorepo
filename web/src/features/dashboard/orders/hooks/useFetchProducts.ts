import { useQuery } from '@tanstack/react-query';

import { productSchema } from '../schemas/product.schema';
import { fetchProducts } from '../service/product.service';

export function useFetchProducts() {
    return useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const response = await fetchProducts();
            const products = response.data || [];
            return products.map(product => productSchema.parse(product));
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}
