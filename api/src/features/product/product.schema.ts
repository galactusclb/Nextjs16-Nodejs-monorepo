import z from "zod";

export const baseProductSchema = z.object({
    productName: z.string().min(1).max(100),
    productDescription: z.string().max(1000).optional(),
});

export type Product = z.infer<typeof baseProductSchema>;