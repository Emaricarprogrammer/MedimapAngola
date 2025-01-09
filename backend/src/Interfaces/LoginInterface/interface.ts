export interface AdminDatas
{
    email:string,
    password:string,
}
export type EntityType ={
    deposito: "deposito",
    farmacia: "farmacia"
}
export interface EntityDatas
{
    email: string,
    type_entity: EntityType,
    password: string
}
/*
export  interface IEntityLoginRepository
{
    login(EntityLoginDatas: EntityDatas): Promise<{token:string}>
}*/
export  interface IAdminLoginRepository
{
    login<T>(LoginDatas: T): Promise<{token:string}>
}
