import {Request, Response, Router} from "express"
import { CreateEntityController } from "../../Controllers/EntityController/CreateEntity";

const EntityRoute: Router = Router();
EntityRoute.route("/signup").post((req: Request, res: Response) => {CreateEntityController.create(req, res)})
export default EntityRoute
