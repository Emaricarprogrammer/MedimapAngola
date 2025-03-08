function calculateDistance(pharmacyLatitude: number, pharmacyLongitude: number, depositLatitude: number, depositLongitude: number)
{
    const converToRadians = (degrees: number) => degrees * (Math.PI / 180)
    const earthRadio = 6371
    const phi1 = converToRadians(pharmacyLatitude)
    const phi2 = converToRadians(depositLatitude)
    const deltaPhi = converToRadians(pharmacyLatitude - depositLatitude)
    const deltaLambda = converToRadians(pharmacyLongitude - depositLongitude)

    const haversineAlgorithm = Math.sin(deltaPhi/2)*Math.sin(deltaPhi/2)+Math.cos(phi1)*Math.cos(phi2)*Math.sin(deltaLambda /2)*Math.sin(deltaLambda/2)
    const haversine = 2  * Math.atan2(Math.sqrt(haversineAlgorithm), Math.sqrt(1-haversineAlgorithm))
    return haversine * earthRadio
}

export {calculateDistance}