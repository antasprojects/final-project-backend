
class Journey {
    constructor(startLocation, endLocation, mode, steps) {
        this.startLocation = startLocation;
        this.endLocation = endLocation;
        this.mode = mode;
        this.steps = steps;
    }

    static create(startLocation, endLocation, mode, steps) {
        return new Journey(startLocation, endLocation, mode, steps);
    }
}

module.exports = Journey;