import EntityInterface from "../EntityInterface/interface"

export default interface AdressInterface
{
    id_endereco: string
    logradouro: string
    numero: number
    cidade: string
    pais: string
    id_entidade_fk: string
  }