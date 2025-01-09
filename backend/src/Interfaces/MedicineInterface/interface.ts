export default interface MedicineDatas
{
    id_medicamento?: string
    nome_generico_medicamento: string
    nome_comercial_medicamento: string
    origem_medicamento: string
    validade_medicamento: Date
    preco_medicamento: number
    imagem_url: string
    quantidade_disponivel_medicamento: number 
    createdAt?: Date
    updatedAt?: Date
    id_categoria: string,
    id_entidade_fk: string
}

export interface IMedicineRepositories
{
    createMedicine(medicineDatas: MedicineDatas): Promise<MedicineDatas | null>
    findMedicine(generic_name: string, comercial_name?:string): Promise<MedicineDatas | any>
    findAllMedicine(skip: number, page: number): Promise<MedicineDatas | any>
    updateMedicine(id_medicine: string, medicineDatas: Partial<MedicineDatas>): Promise<MedicineDatas | any>
    deleteMedicine(id_medicine: string): Promise<any>
}