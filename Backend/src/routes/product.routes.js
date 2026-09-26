import {Router} from 'express';
import { authentication } from '../middleware/auth.middleware.js';
import { createProductValidator, updateProductValidator, validateProductId } from '../validator/products.validator.js';
import { createProductsController, getAllProductsController, updateProductController } from '../controllers/products.controller.js';

const router = Router();

router.post("/", authentication, createProductValidator, createProductsController)
router.get("/", getAllProductsController)
router.put("/:id", authentication, validateProductId ,updateProductValidator, updateProductController)

export default router