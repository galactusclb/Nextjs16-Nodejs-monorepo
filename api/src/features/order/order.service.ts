import { Order } from "@prisma/client";

import { PaginationOptions } from "../../interfaces/paginate.type";
import { NotFoundError } from "../../utils/errors/http-error";

import * as repo from "./order.repository";
import { CreateOrderInput, UpdateOrderInput } from "./order.schema";

export const doGetAllOrders = async <T>({ pagination, filters }: {
  pagination: PaginationOptions<T>;
  filters: Partial<T>;
}) => await repo.findAll({ pagination, filters });

export const doGetOrderById = async (id: Order['id']) => {
    const order = await repo.findById(id);

    if (!order) {
        throw new NotFoundError("Order not found");
    }

    return order;
}

export const doCreateOrder = async (input: CreateOrderInput) => {
    return await repo.createOrder(input);
}

export const doUpdateOrder = async (id: Order['id'], input: UpdateOrderInput) => {
    const order = await repo.findById(id);
    
    if (!order) {
        throw new NotFoundError('Order not found');
    }
    
    if (input.orderDescription) {
        await repo.updateOrder(id, { orderDescription: input.orderDescription });
    }

    return await repo.findById(id);
}

export const doDeleteOrder = async (id: Order['id'])=>{
    const deleteOrder = await repo.deleteOrderWithOrderRefferences(id);

    if(!deleteOrder) throw new NotFoundError('Order not found');

    return deleteOrder;
}