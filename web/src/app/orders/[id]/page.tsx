import { OrderMutateContainer } from '@/features/dashboard/orders';

interface EditOrderPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditOrderPage({ params }: EditOrderPageProps) {
    const { id } = await params;

    return <OrderMutateContainer orderId={Number(id)} />;
}