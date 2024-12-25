import {Request, Response, Router} from "express"
import { LoginEntity } from "../Controllers/LoginEntitiesControllers.ts/LoginEntities";

const route: Router = Router();
const Login = new LoginEntity()

route.route("/sign-in").post((req: Request, res: Response) => {Login.LoginEntities(req, res)})
export default route
