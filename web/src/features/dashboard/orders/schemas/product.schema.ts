import z from "zod";

export const baseProductSchema = z.object({
    productName: z.string().min(1).max(100),
    productDescription: z.string().max(1000).optional(),
});

export const productSchema = baseProductSchema.extend({
    id: z.number(),
    createdAt: z.any(),
})

export type Product = z.infer<typeof productSchema>;