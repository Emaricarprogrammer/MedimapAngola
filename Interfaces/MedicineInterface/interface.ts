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
    id_categoria: string
}

export interface IMedicineRepositories
{
    createMedicine(medicineDatas: MedicineDatas): Promise<MedicineDatas | null>
    findMedicine(id_medicine: string): Promise<MedicineDatas | any>
    findAllMedicine(): Promise<MedicineDatas | any>
    updateMedicine(id_medicine: string, medicineDatas: Partial<MedicineDatas>): Promise<MedicineDatas | any>
    deleteMedicine(id_medicine: string): Promise<any>
}