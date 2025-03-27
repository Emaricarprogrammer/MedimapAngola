
interface RequestMedicineDatas
{
    id_aquisicao?: string
    quantidade_aquisicao: string
    data_aquisicao: Date
    tipo_aquisicao: "emediata",
    createdAt?: Date
    updatedAt?: Date
    id_entidade_fk: string

}

interface IRequestMedicineRepositories
{
    createRequest(requestsDatas: RequestMedicineDatas): Promise<RequestMedicineDatas | any>

}
export {RequestMedicineDatas, IRequestMedicineRepositories}