import { Prisma, PrismaClient } from "@prisma/client"
import prisma from "@/lib/prisma/prisma"
import { CreateOrderInput, UpdateOrderInput } from "./order.schema"
import { PaginationOptions } from "../../interfaces/paginate.type";

export const findAll = async <T>(options: {
    pagination: PaginationOptions<T>;
    filters: Partial<T>;
}) => {
    const { page, limit, sortBy, sortOrder } = options.pagination;
    const skip = (page - 1) * limit;
    const where = options.filters;
    const orderBy = sortBy ? { [sortBy]: sortOrder } : undefined;

    const [data, total] = await Promise.all([
        prisma.order.findMany({ skip, take: limit, where, orderBy, include: { orderProductMap: true } }),
        prisma.order.count({ where }),
    ]);

    return {
        data,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
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