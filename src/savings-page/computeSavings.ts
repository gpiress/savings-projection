import SavingsDataPoint from "./SavingsDataPoint";


const simulate = (initialCapital: number, monthlySavings: Array<number>, relevantYears: Array<number>, averageReturn: number, taxOnReturns: number)
        : Array<SavingsDataPoint> => {
    let savingsDataPoints: Array<SavingsDataPoint> = [];

    let totalSavings: Map<number, number> = new Map();
    monthlySavings.forEach(saving => { 
        totalSavings.set(saving, initialCapital);
        savingsDataPoints.push({
            monthly: saving,
            total: initialCapital,
            yearsPassed: 0,
        });
    });

    const maxYear: number = relevantYears.reduce((max, current) => current > max ? current : max, -1);

    for (let i = 1; i <= maxYear; i++) {

        monthlySavings.forEach(savings => {
            const yearly = savings * 12;
            const previous = totalSavings.get(savings) || 0;
            const returnOnPrevious = previous * averageReturn;
            const returnMinusTaxes = returnOnPrevious * (1. - taxOnReturns);

            const newTotal = yearly + previous + returnMinusTaxes;
            totalSavings.set(savings, newTotal);

            savingsDataPoints.push({
                monthly: savings,
                total: newTotal,
                yearsPassed: i,
            });
        });

    }


    return savingsDataPoints;
};

export {
    simulate
};