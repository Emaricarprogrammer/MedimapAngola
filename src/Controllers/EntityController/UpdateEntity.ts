import { Request, Response } from "express" 
import { PrismaClient, Prisma } from "@prisma/client" 
import { EntitiesRepositories } from '../../Repositories/EntityRepository/EntityRepository' 
import validator from "validator"
import { ValidatorProps } from "../../Utils/Validators/validators/validators" 
import { PasswordService } from "../../Utils/PasswordService/passwordService" 
import { ContactsRepository } from '../../Repositories/ContactsRepository/ContactsRepository' 
import { AccountRepository } from '../../Repositories/AccountRepository/AccountRespository' 
import { AdressRepositories } from '../../Repositories/AdressRepository/AdressRepository';

const prisma:PrismaClient = new PrismaClient()
const EntitiesRepositoriesInstance: EntitiesRepositories = new EntitiesRepositories(prisma)
const ContactsRepositoriesInstance: ContactsRepository = new ContactsRepository(prisma)
const AccountRepositoriesInstance: AccountRepository = new AccountRepository(prisma)
const AdressRepositoriesInstance: AdressRepositories = new AdressRepositories(prisma)

export class UpdateEntityController {
    static async updateEntity(req: Request, res: Response) {
        try {
            const { id_entidade } = req.params 
            const {
                nif,
                firma,
                tipo_entidade,
                contacto,
                email,
                password,
                newPassword,
                logradouro,
                rua,
                numero,
                cidade,
                pais,
            } = req.body 
            
            const EntityExists = await ValidatorProps.EntityExists(id_entidade)
            if (!EntityExists) {
                return res.status(404).json({ success: false, message: "Usuário não encontrado." }) 
            }

            const ContactsExists = await ValidatorProps.NumberExists(contacto)
            const NifExists = await ValidatorProps.NifExists(nif)

            if (!nif && !firma && !tipo_entidade && !contacto && !email && !password && !logradouro && !rua && !numero && !cidade && !pais) {
                return res.status(400).json({ success: false, message: "Informe pelo menos um campo para atualização." }) 
            }

            const EntityUpdateData: Partial<{ nif: string, tipo_entidade: string, firma: string}> = {} 
            const AccountUpdateData: Partial<{ email: string, password: string }> = {} 
            const AdressUpdateData: Partial<{ logradouro: string, rua: string, cidade: string, pais: string, numero: number }> = {} 
            const ContactsUpdateData: Partial<{ contacto: string }> = {} 

            if (nif) {
                if (NifExists) {
                    return res.status(400).json({
                        success: false,
                        message: "Oooooops! Este nif já está sendo usado, tente usar outro.",
                    }) 
                }

                if (!validator.isInt(nif))
                {
                    return res.status(400).json({
                        success: false,
                        message: "Por favor informe um nif válido.",
                    }) 
                }
                EntityUpdateData.nif = nif
            } 
            if (firma)
            {
                EntityUpdateData.firma = firma
            }
            if (tipo_entidade) {
                if (!["farmacia", "deposito"].includes(tipo_entidade.toLowerCase())) {
                    return res.status(400).json({ success: false, message: "Apenas aceitamos Farmácias e Depósitos." }) 
                }
                EntityUpdateData.tipo_entidade = tipo_entidade.toLowerCase() 
            }

            if (email) {
                if (!validator.isEmail(email)) {
                    return res.status(400).json({ success: false, message: "Formato de email inválido." }) 
                }
                const EmailExists = await ValidatorProps.EmailExists(email) 
                if (EmailExists) {
                    return res.status(400).json({ success: false, message: "Este email já está sendo usado." }) 
                }
                AccountUpdateData.email = email 
            }

            if (password && newPassword) {
                const returnedDatas = await prisma.contas.findFirst({
                    where: { id_conta: EntityExists.id_conta_fk }
                });
            
                if (!returnedDatas) {
                    return res.status(400).json({ success: false, message: "Conta não encontrada." });
                }
            
                // Comparar senha atual
                const verifyPassword = await PasswordService.PasswordCompare(password, returnedDatas.password);
                if (!verifyPassword) {
                    return res.status(400).json({ success: false, message: "A sua senha atual está incorreta!" });
                }
            
                // Validar nova senha
                const validatePassword = ValidatorProps.validatePassword(newPassword);
                if (validatePassword == false) {
                    return res.status(400).json({
                        success: false,
                        message: "A senha deve ter pelo menos 8 caracteres, conter uma letra maiúscula, um número e um caractere especial.",
                    });
                }
            
                // Gerar hash da nova senha
                const hashedPassword = await PasswordService.hashPassword(newPassword);
                AccountUpdateData.password = hashedPassword;
            }

            if (contacto) {
                if (ContactsExists) {
                    return res.status(400).json({ success: false, message: "O número já esta sendo usado." }) 
                }
                
                if (!validator.isInt(contacto))
                    {
                        return res.status(400).json({
                            success: false,
                            message: "Por favor informe um contacto válido.",
                        }) 
                    }
                ContactsUpdateData.contacto = contacto
            }

            if (logradouro)
            {
                AdressUpdateData.logradouro = logradouro
            }
            if (rua)
            {
                AdressUpdateData.rua = rua
            }
            if (cidade)
            {
                AdressUpdateData.cidade = cidade
            }
            if (numero)
            {
                AdressUpdateData.numero = numero
            }
            if (pais)
            {
                AdressUpdateData.pais = pais
            }

                
            if (Object.keys(AccountUpdateData).length > 0) {
                const AccountUpdated = await AccountRepositoriesInstance.updateAccount(EntityExists.id_conta_fk, AccountUpdateData) 
                if (!AccountUpdated) {
                    return res.status(500).json({ success: false, message: "Estamos tentando resolver este problema, por favor tente novamente." }) 
                }
            }

            if (Object.keys(EntityUpdateData).length > 0) {
                const EntityUpdated = await EntitiesRepositoriesInstance.updateEntity(id_entidade, { 
                    NIF_entidade: nif, 
                    tipo_entidade: tipo_entidade, 
                    firma_entidade: validator.escape(firma)
                }) 
                if (!EntityUpdated) {
                    return res.status(500).json({ success: false, message: "Erro ao atualizar este usúario." }) 
                }
            }

            if (Object.keys(ContactsUpdateData).length > 0) {
                    const ContactUpdated = await ContactsRepositoriesInstance.updateContacts({contacto: contacto, id_entidade_fk: id_entidade});
                    if (!ContactUpdated) {
                        return res.status(500).json({ success: false, message: "Erro ao atualizar este contato." });
                    }
                
            }
            if (Object.keys(AdressUpdateData).length > 0) {
                const AdressUpdated = await AdressRepositoriesInstance.updateAdress(id_entidade, AdressUpdateData);
                if (!AdressUpdated) {
                    return res.status(500).json({ success: false, message: "Erro ao atualizar este endereço." });
                }
            
        }
            return res.status(200).json({ success: true, message: "Atualização realizada com sucesso."}) 
        } catch (error) {
            console.error(error) 
            return res.status(500).json({ success: false, message: "Estamos tentando resolver este problema por favor, tente novamente mais tarde." }) 
        }
    }
}
