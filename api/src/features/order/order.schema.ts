import z from "zod";

export const orderBaseSchema = z.object({
    orderDescription: z.string().min(1).max(100),
    productIds: z.array(z.number())
});

export const createOrderSchema = {
    body: orderBaseSchema.extend({
        productIds: orderBaseSchema.shape.productIds.min(1),
    })
}

export const updateOrderSchema = {
    params: z.object({
        id: z.coerce.number().int().positive(),
    }),
    body: orderBaseSchema.partial(),
}

export const getOrderByIdSchema = {
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
};

export const deleteOrderSchema = updateOrderSchema;

export type CreateOrderInput = z.infer<typeof createOrderSchema.body>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema.body>;
export type GetOrderByIdParams = z.infer<typeof getOrderByIdSchema.params>;
export type DeleteOrderInput = UpdateOrderInput;