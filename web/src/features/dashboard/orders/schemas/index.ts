import z from "zod";

export const orderBaseSchema = z.object({
    orderDescription: z.string().min(1).max(100),
    productIds: z.array(z.number())
});

export const orderProductMapSchema = z.object({
    id: z.string(),
    orderId: z.number(),
    productId: z.number(),
});

export const orderSchema = orderBaseSchema.extend({
    id: z.number(),
    createdAt: z.any(),
    orderProductMap: z.array(orderProductMapSchema),
})

export const orderMutateSchema = orderBaseSchema;

export type Order = z.infer<typeof orderSchema>
export type OrderMutateFormData = z.infer<typeof orderMutateSchema>