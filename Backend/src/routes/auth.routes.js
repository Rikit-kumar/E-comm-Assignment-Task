import {Router} from 'express'
import { loginValidator, registerValidator } from '../validator/auth.validator.js'
import { loginUserController, registerUserController } from '../controllers/auth.controller.js'

const router  = Router()

router.post('/register', registerValidator, registerUserController)
router.post('/login', loginValidator, loginUserController)

export default router