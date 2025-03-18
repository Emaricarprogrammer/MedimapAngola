export default interface ContactsDatas
{
    id_contacto?: string,
    contacto: number,
    id_entidade_fk: string
}
export interface IContactsRepositories
{
    createContacts(contactsData: ContactsDatas): Promise<ContactsDatas | any>
    updateContacts(contactsData: ContactsDatas): Promise<ContactsDatas>
    
}