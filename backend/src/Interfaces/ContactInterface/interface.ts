export default interface ContactsDatas
{
    id_contacto?: string,
    contacto: string,
    id_entidade_fk: string
}
export interface IContactsRepositories
{
    createContacts(contactsData: ContactsDatas): Promise<ContactsDatas | any>
    
}