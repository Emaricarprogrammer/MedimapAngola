import {Request, Response, Router} from "express"
import { CreateEntityController } from "../../Controllers/EntityController/CreateEntity";
import { UpdateEntityController } from "../../Controllers/EntityController/UpdateEntity";
import DeleteEntityController from '../../Controllers/EntityController/DeleteEntity';

const EntityRoute: Router = Router();

EntityRoute.route("/signup").post((req: Request, res: Response) => {CreateEntityController.create(req, res)})
EntityRoute.route("/:id_entidade").patch((req: Request, res: Response) => {UpdateEntityController.updateEntity(req, res)})
EntityRoute.route("/:id_entidade").delete((req: Request, res: Response) => {DeleteEntityController.deleteEntity(req, res)})

export default EntityRoute
