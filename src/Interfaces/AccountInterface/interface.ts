export interface AccountData{
    id_conta?: string,
    email: string,
    password: string
}
export interface AccountDatasResponse
{
    id_conta: string,
    email: string
}
export interface IAccountRepository
{
    createAccount(AccountDatas: AccountData):Promise<AccountDatasResponse>
    updateAccount(id_account: string, datas: Partial<AccountData>): Promise<AccountDatasResponse>
    
}