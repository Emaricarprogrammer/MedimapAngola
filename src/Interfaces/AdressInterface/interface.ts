
export default interface AdressDatas
{
    id_endereco?: string
    logradouro: string
    rua: string
    numero: number
    cidade: string
    pais: string
    id_entidade_fk: string
  }

export interface IAdressRepositories
{
  createAdress(adressDatas: AdressDatas): Promise<AdressDatas>
  updateAdress(id_entity: string, adressDatas: Partial<AdressDatas>): Promise<AdressDatas>

}