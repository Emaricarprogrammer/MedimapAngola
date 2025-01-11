type TypeRequest = {
    emediata: null
    pendente: null
}
export default interface RequestMedicineInterface
{
    id_aquisicao: string
    quantidade_aquisicao: number
    data_aquisicao: Date
    tipo_aquisicao: string
    createdAt?: Date
    updatedAt?: Date
    id_entidade_fk: string
}