import { Router } from 'express';

import { validate } from '../../middleware/validate.middleware';

import { createOrder, deleteOrder, getAllOrders, getOrder, updateOrder } from './order.controller';
import { createOrderSchema, deleteOrderSchema, getOrderByIdSchema, updateOrderSchema } from './order.schema';

const router = Router();

router.get('/', getAllOrders);
router.get('/:id', validate(getOrderByIdSchema), getOrder);
router.post('/', validate(createOrderSchema), createOrder);
router.put('/:id', validate(updateOrderSchema), updateOrder);
router.delete('/:id', validate(deleteOrderSchema), deleteOrder)

export default router;
