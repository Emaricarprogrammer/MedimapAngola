type TypeEntity = {
  farm: null
  depo: null
}
enum contas{
  Adimin,
  Entidade
}

export default interface EntityInterface
{
  id_entidade?:string,
  NIF_entidade?:number,
  firma_entidade?:string,
  tipo_entidade?:string,
  createdAt?:Date,
  updatedAt?:Date,
  id_conta_fk?:string|undefined,
  
 
}