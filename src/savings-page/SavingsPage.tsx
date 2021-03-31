import React, { Component, ChangeEvent } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import SavingsDataPoint from './SavingsDataPoint';
import SavingsTooltip from './SavingsTooltip';
import { simulate } from './computeSavings';

import './savings-page.css'

interface SavingsPageState {
    monthlySavings: Array<number>;
    relevantYears: Array<number>;
    totalSavingsData: Array<SavingsDataPoint>;
    averageYearlyReturn: number;
    taxOnTotal: number;
    initialCapital: number;
    minimumMonthlyIncome: number;
}

interface SavingsPageProps {}


class SavingsPage extends Component<SavingsPageProps, SavingsPageState> {

    constructor(props: SavingsPageProps) {
        super(props);
        this.state = {
            monthlySavings: [1000, 2500, 5000, 7500, 10000, 15000],
            relevantYears: [0, 5, 10, 15, 20, 25, 30, 35, 40],
            totalSavingsData: [],
            averageYearlyReturn: 0.05,
            taxOnTotal: 0.00375,
            initialCapital: 0,
            minimumMonthlyIncome: 0,
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount() {
        this.computeDataPoints();
    }

    computeDataPoints() {
        const { monthlySavings, relevantYears, averageYearlyReturn, taxOnTotal, initialCapital } = this.state
        const dataPoints = simulate(initialCapital, monthlySavings, relevantYears, averageYearlyReturn, taxOnTotal);

        this.setState({ totalSavingsData: dataPoints });
    }

    handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const target = event.target;
        const value = +target.value;
        const name = target.name;

        if (name === "averageYearlyReturn" && value >= 0 && value <= 1) {
            this.setState({
                averageYearlyReturn: value
            });
        } else if (name === "taxOnTotal" && value >= 0 && value <= 1) {
            this.setState({
                taxOnTotal: value
            });
        } else if (name === "initialCapital" && value >= 0) {
            this.setState({
                initialCapital: value
            });
        } else if (name === "minimumMonthlyIncome" && value >= 0) {
            this.setState({
                minimumMonthlyIncome: value
            });
        }
    }

    render() {
        const dataPoints = this.state.totalSavingsData;
        const savings = this.state.monthlySavings;

        const colors = [
            "#1E3231",
            "#485665",
            "#558C8C",
            "#8E7C93",
            "#D0A5C0",
            "#F6C0D0",
            "#82204A",
        ];

        const linesElements = savings.map((saving, index) => {
            const relevantPoints = dataPoints
                .filter(dataPoint => dataPoint.monthly === saving)
                .filter(dataPoint => dataPoint.yearsPassed % 5 === 0);
            return (
                <Line data={relevantPoints} type="monotone" dataKey="total" stroke={colors[index]} strokeWidth={3} key={index} />
            );
        });

        const retireSavings = (this.state.minimumMonthlyIncome * 12 * 25).toLocaleString('en-US', { style: 'currency', currency: 'SEK' });

        return (
            <div>
                <h1>Savings projector</h1>
                <div className="savings-page">
                    <div className="savings-page--chart-area">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dataPoints} margin={{left: 30}}>
                                { linesElements }
                                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                                <XAxis type="number" dataKey="yearsPassed" domain={[0, 'dataMax']} />
                                <YAxis />
                                <Tooltip content={SavingsTooltip}/>
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="savings-page--info-area">
                        <div className="info-area--block">
                            <span className="info-area--block-header"># Customize</span>
                            <div className="info-area--block--input-area">
                                <span>Average yearly return (0-1)*</span>
                                <input type="number" name="averageYearlyReturn" value={this.state.averageYearlyReturn} onChange={this.handleInputChange}></input>
                            </div>

                            <div className="info-area--block--input-area">
                                <span>Taxes on total (0-1)**</span>
                                <input type="number" name="taxOnTotal" value={this.state.taxOnTotal} onChange={this.handleInputChange}></input>
                            </div>

                            <div className="info-area--block--input-area">
                                <span>Starting capital (no decimals)</span>
                                <input type="number" name="initialCapital" value={this.state.initialCapital} onChange={this.handleInputChange}></input>
                            </div>

                            <div className="info-area-block--footnote">
                                <a href="https://www.investopedia.com/ask/answers/042415/what-average-annual-return-sp-500.asp">* S&P 500 historical yearly return is roughly 8%</a>
                                <br />
                                <span>** Swedish ISK accounts yearly tax is 0.375% = 0.00375</span>
                            </div>

                            <button className="info-area--button" onClick={(event) => this.computeDataPoints()}>Render</button>
                        </div>

                        <div className="info-area--block">
                            <span className="info-area--block-header"># Retire early</span>
                            <div className="info-area--block--input-area">
                                <span>Minimum monthly income</span>
                                <input type="number" name="minimumMonthlyIncome" value={this.state.minimumMonthlyIncome} onChange={this.handleInputChange}></input>
                            </div>

                            <div className="info-area--block--input-area">
                                <span>Amount needed to retire</span>
                                <span>{retireSavings}</span>
                            </div>
                        </div>

                        <div className="info-area--block">
                            <span className="info-area--block-header"># Fixed</span>
                            <div className="info-area--block--input-area">
                                <span>Monthly savings</span>
                                <span className="info-area--block--fixed-values">[1000, 2500, 5000, 7500, 10000, 15000]</span>
                            </div>
                        </div>

                        <div className="info-area--block">
                            <span className="info-area--block-header"># How it works</span>
                            <p>For every year, it computes:</p>
                            <ol>
                                <li>the yearly returns <code className="info--code">yearlyReturns = previousSavings * averageYearlyReturn</code>,</li>
                                <li>the taxes to be paid* <span className="info--code">taxes = (previousSavings + yearlyReturns) * taxOnTotal</span></li>
                                <li>and the new savings total: <span className="info--code">newTotal = previousSavings + yearlyReturns - taxes + yearSavings</span></li>
                            </ol>
                            <div className="info-area-block--footnote">
                                <span>* Swedish ISK accounts pay yearly taxes based on the total amount in the account.</span>
                            </div>
                            <a href="https://github.com/gpiress/savings-projection" className="info-area--link">Check the code on Github.</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SavingsPage;