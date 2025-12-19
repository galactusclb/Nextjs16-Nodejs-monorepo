import prisma from "@/lib/prisma/prisma"

export const findAll = async () => {
    return await prisma.product.findMany()
}