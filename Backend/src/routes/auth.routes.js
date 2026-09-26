import {Router} from 'express'
import { loginValidator, registerValidator } from '../validator/auth.validator.js'
import { loginUserController, registerUserController, tokenRefreshController } from '../controllers/auth.controller.js'
import { authentication } from '../middleware/auth.middleware.js'

const router  = Router()

router.post('/register', registerValidator, registerUserController)
router.post('/login', loginValidator, loginUserController)
router.post('/refresh', tokenRefreshController)

export default router