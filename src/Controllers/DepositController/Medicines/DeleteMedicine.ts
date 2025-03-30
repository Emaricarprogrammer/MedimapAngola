import {Request, Response} from "express"
import {PrismaClient} from "@prisma/client"
import { MedicineRepositories } from "../../../Repositories/DepositRepositories/MedicineRepository/MedicineRepository"
import { ValidatorProps } from "../../../Utils/Validators/validators/validators"

const prisma: PrismaClient = new PrismaClient()
const MedicineRepositoryInstance: MedicineRepositories = new MedicineRepositories(prisma)

export class DeleteMedicineController
{
    static async DeleteMedicine(req: Request, res: Response): Promise<Response>
    {
        try {
            const {id_medicamento} = req.params
            if (!id_medicamento)
            {
                return res.status(400).json({success: false, message: "Estamos tentando revolver este problema, por favor tente novamente."})
            }
            const VerifyMedicine = await ValidatorProps.MedicineExists(id_medicamento)
            if (!VerifyMedicine)
            {
                return res.status(404).json({success: false, message: "Ooooops! Não conseguimos encontrar este medicamento, por favor tente novamente!"})
            }
            const MedicineDeleted = await MedicineRepositoryInstance.deleteMedicine(id_medicamento)
            if (!MedicineDeleted)
            {
                return res.status(400).json({success: false, message:"Estamos tentando revolver este problema, por favor tente novamente."})
            }
            return res.status(200).json({success: true, message: "Medicamento deletado com sucesso."})

        } catch (error: any) {
            console.error("Houve um erro: ", error.message)
            return res.status(500).json({sucess: false, message: "Estamos tentando resolver este problema por favor, tente novamente mais tarde."})
        }
    }
}