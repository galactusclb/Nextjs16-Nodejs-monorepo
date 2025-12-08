import OrderMutateForm from '../components/OrderMutateForm';

interface OrderMutateContainerProps {
    orderId?: number;
}

export default function OrderMutateContainer({ orderId }: OrderMutateContainerProps){
    return <OrderMutateForm orderId={orderId} />;
}