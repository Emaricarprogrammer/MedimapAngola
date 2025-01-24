import { PrismaClient, Tipo_entidades } from '@prisma/client';
import EntityInterface from './../../Interfaces/EntityInterface/interface';
import { AccountRepository } from '../AccountRepository/AccountRespository';
import { Request } from 'express';
import {EmailSender} from "../../Utils/providers/SendEmails/SendEmail"




export class EntityRepository {
    Prisma: PrismaClient;
    AccountRepository: AccountRepository;
   
   
    constructor(prisma: PrismaClient) {
        this.Prisma = prisma;
        this.AccountRepository = new AccountRepository(prisma);
        
    }

    async createEntity(req: Request): Promise<EntityInterface> {
        const {
            NIF_entidade,
            firma_entidade,
            tipo_entidade,
            email_entidade,
            password_entidade,
            contactos,
            logradouro,
            numero_rua,
            cidade,
            pais,
            latitude,
            longitude
        } = req.body;
        
       

        // Criação da conta associada
         const entidade =  await this.Prisma.$transaction(async ()=>{
            
            // Criação da conta associada
            const email = email_entidade;
            const password = password_entidade;
            const AccountData = { email, password };
            const contacto_entidade=contactos;
            
            // Tentar criar a conta associada
            let Account;
            try {
                 const existingAccount = await this.Prisma.contas.findUnique(
                    {
                          where: { email: AccountData.email }
                    })
    
                  if (existingAccount) {
                       throw new Error('Já existe uma conta associada com este email.');
                    }
                    else{
                        Account = await this.AccountRepository.createAccount(AccountData);
                    }
            } catch (error) {
                console.error('Erro ao criar conta:', error);
                throw new Error('Erro ao criar conta associada no repositório.');
            }
    
            // Verificar se a conta foi criada com sucesso
            if (!Account || !Account.id_conta) {
                throw new Error('Falha ao criar conta associada, ID da conta é indefinido.');
            }
    
            const id_conta =  Account.id_conta;
    
            try {
                return await this.Prisma.entidades.create({
                    data: {
                        NIF_entidade: NIF_entidade,
                        firma_entidade: firma_entidade,
                        tipo_entidade: tipo_entidade,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        id_conta_fk: id_conta,
                        contacto_entidade:
                         { 
                            create: [ { contacto: contacto_entidade }],
                        
                         },
                        endereco_entidade: 
                        { 
                            create: [ { logradouro: logradouro, numero: numero_rua, cidade: cidade, pais: pais } ],
                            
                        },
                        geolocalizacao_entidade:
                        { 
                            create: [ { latitude: latitude, longitude: longitude } ] //-
                        }
    
                    }
           
                });

               

                
    
                
    
            } catch (error) {
                console.error('Erro ao criar entidade: ', error);
                throw new Error('Erro ao criar entidade no repositório.');
            }

        });
        return entidade;
      
    }

    async findEntity(req: Request): Promise<EntityInterface | null> {
        const id_entidade= req.params.id_entity
        return await this.Prisma.entidades.findUnique({
            where: { id_entidade }
        });
    }

    async updateEntity(req: Request): Promise<EntityInterface> {
        const { NIF_entidade, firma_entidade, tipo_entidade } = req.body;
        const id_entidade= req.params.id_entity

        try {
            if (!id_entidade) {
                throw new Error('ID da entidade é obrigatório.');
            }

            const entityUpdated = await this.Prisma.entidades.update({
                where: { id_entidade },
                data: {
                    NIF_entidade: NIF_entidade,
                    firma_entidade: firma_entidade,
                    tipo_entidade: tipo_entidade,
                    updatedAt: new Date()
                }
            });

            return entityUpdated;
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new Error('Entidade não encontrada.');
            }

            console.error('Erro ao atualizar entidade:', error);
            throw new Error('Erro inesperado ao atualizar entidade.');
        }
    }

    async deleteEntity(req:Request): Promise<void> {
        await this.Prisma.$transaction(async ()=>{

            const id_entidade= req.params.id_entity
            const id_conta_fk= req.params.id_conta_fk
            const id_entidade_fk= id_entidade
            try {
                await this.Prisma.contactos.deleteMany({
                    where: {id_entidade_fk}
                });
                await this.Prisma.enderecos.deleteMany({
                    where: {id_entidade_fk}
                });
                await this.Prisma.geolocalizacao.deleteMany({
                    where: {id_entidade_fk}
                });
                await this.Prisma.entidades.deleteMany({
                    where: { id_conta_fk}
                });
                await this.AccountRepository.deleteAccount(id_conta_fk);
            } catch (error: any) {
                if (error.code === 'P2025') {
                    throw new Error('Entidade não encontrada.');
                }
    
                console.error('Erro ao deletar entidade:', error);
                throw new Error('Erro inesperado ao deletar entidade.');
            }

        })
       
    }
}
