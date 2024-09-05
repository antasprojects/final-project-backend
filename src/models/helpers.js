


function getBoundaries(latitude, longitude, distance) {

    // console.log(latitude, longitude, distance);
    const earthRadius = 6378
    const latRad = latitude * (Math.PI / 180);
    const lonRad = longitude * (Math.PI / 180);

    const latMin = latRad - (distance / earthRadius);
    const latMax = latRad + (distance / earthRadius);
    const lonMin = lonRad - (distance / earthRadius) / Math.cos(latRad);
    const lonMax = lonRad + (distance / earthRadius) / Math.cos(latRad);

    const latMinDeg = latMin * (180 / Math.PI)
    const latMaxDeg = latMax * (180 / Math.PI)
    const lonMinDeg = lonMin * (180 / Math.PI)
    const lonMaxDeg = lonMax * (180 / Math.PI)

    const res = {
        latMin: latMinDeg.toPrecision(4),
        latMax: latMaxDeg.toPrecision(4),
        lonMin: lonMinDeg.toPrecision(4),
        lonMax: lonMaxDeg.toPrecision(4)
    }

    return res;
}


module.exports = {
    getBoundaries
}