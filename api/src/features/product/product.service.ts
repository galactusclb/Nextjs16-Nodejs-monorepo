
import * as repo from './product.repository';

export const doGetAllProducts = async () => {
    return await repo.findAll();
}