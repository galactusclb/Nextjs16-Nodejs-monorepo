import prisma from "../../utils/prisma"

export const findAll = async () => {
    return await prisma.product.findMany()
}