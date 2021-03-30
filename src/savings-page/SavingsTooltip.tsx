import { TooltipProps } from 'recharts';
import './savings-tooltip.css';


const SavingsTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
        const uniqueEntries: Array<any> = [];
        payload.forEach(entry => {
            const found = uniqueEntries.filter(itemList => itemList.payload?.monthly === entry.payload?.monthly).length > 0;
            if (!found) {
                uniqueEntries.push(entry);
            }
        });

        const entries = uniqueEntries.map((entry, index) => {
            const monthly = entry.payload?.monthly?.toLocaleString('SE');
            const total = entry.value?.toLocaleString('en-US', { style: 'currency', currency: 'SEK' });
            const text = `${monthly} - ${total}`;
            return (
                <p className="custom-tooltip--value" key={index}>{text}</p>
            );
        });

        return (
            <div className="custom-tooltip">
                <span className="custom-tooltip--years">After {payload?.[0]?.payload?.yearsPassed} years</span>
                <div className="custom-tooltip--values-list">
                    { entries }
                </div>
            </div>
        );
    }

    return null;
};

export default SavingsTooltip;