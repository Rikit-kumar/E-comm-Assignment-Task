import {Router} from 'express';
import { authentication } from '../middleware/auth.middleware.js';
import { createProductValidator, updateProductValidator, validateProductId } from '../validator/products.validator.js';
import { createProductsController, getAllProductsController, updateProductController, deleteProductController, getSingleProductByIdController } from '../controllers/products.controller.js';

const router = Router();

router.get("/", getAllProductsController)
router.get("/:id", validateProductId, getSingleProductByIdController)

router.post("/", authentication, createProductValidator, createProductsController)
router.put("/:id", authentication, validateProductId ,updateProductValidator, updateProductController)
router.delete("/:id", authentication, validateProductId, deleteProductController)

export default router