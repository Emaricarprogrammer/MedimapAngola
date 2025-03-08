export default interface GeolocationDatas
{
    id_geolocalizacao?: string
    latitude: number
    longitude: number
    id_entidade_fk: string
}

export interface IGeolocation{
    createGeolocation(geoDatas: GeolocationDatas): Promise<GeolocationDatas>
}