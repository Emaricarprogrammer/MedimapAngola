import { Request, Response, Router, response } from 'express';
import EntityController from '../../Controllers/EntityController/EntityController';
import {celebrate} from "celebrate"
import helmet from 'helmet';


const entityController= new EntityController()
const RouteEntity: Router = Router();
RouteEntity.route("/signup").post((req: Request, res: Response) => {entityController.CreateEntityAccount(req,res);})

RouteEntity.route("/:id_entity").post( helmet() ,(req: Request, res: Response) => {entityController.FindEntity(req,res);})

RouteEntity.route("/edit/:id_entity").put(helmet(), (req:Request, res:Response) => {entityController.UpdateEntity(req, res)})

RouteEntity.route("/delete/:id_entity/:id_conta_fk").delete(helmet(), (req:Request, res:Response) => {entityController.DeleteEntity(req, res)})




export default RouteEntity;
