import z from "zod";

export const orderBaseSchema = z.object({
    orderDescription: z.string()
        .min(1, { message: "Description is required" })
        .max(100, { message: "Description must be less than 100 characters" }),
});

export const orderProductMapSchema = z.object({
    id: z.string(),
    orderId: z.number(),
    productId: z.number(),
});

export const orderResponseSchema = orderBaseSchema.extend({
    id: z.number(),
    createdAt: z.any(),
    orderProductMap: z.array(orderProductMapSchema),
});

export const orderMutateSchema = orderBaseSchema.extend({
    productIds: z.array(z.number())
        .min(1, { message: "Please select at least one product" })
});

export const orderSchema = orderResponseSchema;

export type Order = z.infer<typeof orderResponseSchema>;
export type OrderMutateFormData = z.infer<typeof orderMutateSchema>;