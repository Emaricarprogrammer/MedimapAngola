interface RequestsMedicineDatas
{
    id_aquisicao_medicamento?: string
    id_aquisicao: string
}

interface IRequestsMedicineDatas
{
    createRequestsMedicines(requestsDatas: RequestsMedicineDatas): Promise<any>
}

export {RequestsMedicineDatas, IRequestsMedicineDatas}