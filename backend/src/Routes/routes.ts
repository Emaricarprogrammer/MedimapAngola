import {Request, Response, Router} from "express"
import { LoginEntity } from "../Controllers/LoginEntitiesControllers.ts/LoginEntities";
import { PrismaClient } from "@prisma/client";
import {ForgotPasswordController} from "../Controllers/ForgotPassowordController/ForgotPassword"

const route: Router = Router();

route.route("/login").post((req: Request, res: Response) => {LoginEntity.LoginEntities(req, res)})
route.route("/forgot_password").post((req: Request, res: Response) => {ForgotPasswordController.ForgotPassword(req, res)})
route.route("/reset_password/:authtoken").post((req: Request, res: Response) => {ForgotPasswordController.ResetPassword(req, res)})

route.route("/teste").post((req: Request, res: Response) =>
{
    const {nif, firma, tipo, id} = req.body
    const prisma =new  PrismaClient()
    const i  = prisma.entidades.create({
        data:{
            NIF_entidade: 29393932222221,
            firma_entidade:"Vamos ver so e filhos",
            tipo_entidade:"deposito",
            id_conta_fk: "01b72519-c997-4772-bab0-99647ffc87d7"
        }
    })
    console.log(i.then((result)=>{
        console.log(result)
    }).catch((err)=>{console.log(err)}))
    
})
export default route
