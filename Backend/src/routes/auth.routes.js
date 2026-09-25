import {Router} from 'express'
import { registerValidator } from '../validator/auth.validator.js'
import { registerUserController } from '../controllers/auth.controller.js'

const router  = Router()

router.post('/register', registerValidator, registerUserController)

export default router