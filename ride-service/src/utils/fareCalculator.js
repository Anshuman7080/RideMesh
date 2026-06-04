const calculateFare = (distanceKm) => {

    const baseFare = 50;
    const perKmCharge = 12;

    return baseFare + (distanceKm * perKmCharge);
};

module.exports = {
    calculateFare
};