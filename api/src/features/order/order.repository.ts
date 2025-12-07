import { Prisma, PrismaClient } from "@prisma/client"
import prisma from "../../utils/prisma"
import { CreateOrderInput, UpdateOrderInput } from "./order.schema"

export const findAll = () => {
    return prisma.order.findMany({
        include: { orderProductMap: true }
    })
}

export const findById = (id: number, prismaIntance: PrismaClient | Prisma.TransactionClient = prisma) => {
    return prismaIntance.order.findUnique({
        where: { id },
        include: {
            orderProductMap: { include: { product: true } }
        }
    })
}

export const createOrder = async (input: CreateOrderInput) => {
    const { orderDescription, productIds } = input;

    const result = await prisma.$transaction(async (tx) => {

        const order = await tx.order.create({
            data: { orderDescription }
        });

        await tx.orderProductMap.createMany({
            data: productIds?.map((productId) => ({
                orderId: order.id,
                productId
            }))
        });

        return await findById(order.id, tx);
    });

    return result;
}

export const appendProductsOrder = (orderId: number, productIds: CreateOrderInput["productIds"]) => {
    return prisma.orderProductMap.createMany({
        data: productIds?.map((productId) => ({ orderId, productId }))
    })
}

export const updateOrder = async (id: number, input: UpdateOrderInput) => {
    return await prisma.order.update({
        where: { id },
        data: input,
        include: {
            orderProductMap: {
                include: { product: true }
            }
        }
    });
}

export const deleteOrderWithOrderRefferences = async (id: number) => {
    return await prisma.$transaction(async (tx) => {

        const hasOrder = await findById(id, tx);

        if (!hasOrder) return null;

        await tx.orderProductMap.deleteMany({
            where: { orderId: id }
        });

        const deletedOrder = await tx.order.delete({
            where: { id }
        });

        return deletedOrder;
    });
}