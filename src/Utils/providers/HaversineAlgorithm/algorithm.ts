function calculateDistance(pharmacyLatitude: number, pharmacyLongitude: number, depositLatitude: number, depositLongitude: number): number {
    const converToRadians = (degrees: number) => degrees * (Math.PI / 180);
    const earthRadius = 6371; // Raio da Terra em quilômetros
    const phi1 = converToRadians(pharmacyLatitude);
    const phi2 = converToRadians(depositLatitude);
    const deltaPhi = converToRadians(depositLatitude - pharmacyLatitude);
    const deltaLambda = converToRadians(depositLongitude - pharmacyLongitude);

    const haversineAlgorithm =
        Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
        Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

    const haversine = 2 * Math.atan2(Math.sqrt(haversineAlgorithm), Math.sqrt(1 - haversineAlgorithm));
    return haversine * earthRadius; // Distância em quilômetros
}

export { calculateDistance };