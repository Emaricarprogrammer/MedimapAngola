interface RequestsMedicineDatas
{
    id_aquisicao_medicamento?: string
    id_medicamento: string
    id_aquisicao: string
    createdAt?: Date
    updatedAt?: Date
}

interface IRequestsMedicineDatas
{
    createRequestsMedicines(requestsDatas: RequestsMedicineDatas): Promise<any>
}

export {RequestsMedicineDatas, IRequestsMedicineDatas}