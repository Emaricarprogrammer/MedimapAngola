type TypeEntity = {
  farmacia: null
  deposito: null
}

export default interface EntityDatas
{
  id_entidade?:string,
  NIF_entidade:string,
  firma_entidade:string,
  tipo_entidade:"farmacia" | "deposito",
  createdAt?:Date,
  updatedAt?:Date,
  id_conta_fk:string,
}

export interface IEntityRepositories{
  createEntity(entityDatas: EntityDatas): Promise<EntityDatas | any>
  findEntity(id_entity: string, firma_entity?: string): Promise<EntityDatas | any>
  updateEntity(id_entity: string,entityDatas: Partial<EntityDatas>): Promise<EntityDatas | any>
}