type TypeEntity = {
  farm: null
  depo: null
}

export default interface EntityInterface
{
  id_entidade?: string,
  nif_entidade: number,
  firma_entidade: string,
  tipo_entidade: string,
  id_conta_fk: string,
  createdAt?: Date,
  updatedAt?: Date
}
