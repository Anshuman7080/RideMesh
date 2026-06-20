const calculateFare = (distanceKm) => {
  const baseFare = 50;
  const perKmCharge = 12;

  const fare = baseFare + (distanceKm * perKmCharge);


  return parseFloat(fare.toFixed(2));
};

module.exports = {
  calculateFare
};
