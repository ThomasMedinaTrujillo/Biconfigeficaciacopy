import BaseBarChart from "./components/graphs/BaseBarChart";
import BaseLineChart from "./components/graphs/BaseLineChart";

const GraphShowcase = () => {
    const barData = [
        { month: 'Jan', sales: 400, profit: 240 },
        { month: 'Feb', sales: 300, profit: 221 },
        { month: 'Mar', sales: 500, profit: 290 },
    ];

    // Time-series data (basic line chart)
    const timeSeriesData = [
        { date: '2024-01-01', visits: 400, pageViews: 2400 },
        { date: '2024-01-02', visits: 480, pageViews: 2210 },
        { date: '2024-01-03', visits: 520, pageViews: 2290 },
        { date: '2024-01-04', visits: 380, pageViews: 2000 },
        { date: '2024-01-05', visits: 490, pageViews: 2181 },
        { date: '2024-01-06', visits: 530, pageViews: 2500 },
        { date: '2024-01-07', visits: 610, pageViews: 2100 },
    ];

    // Comparative trends data
    const trendsData = [
        { week: 'Week 1', revenue: 4000, expenses: 2400 },
        { week: 'Week 2', revenue: 5200, expenses: 2210 },
        { week: 'Week 3', revenue: 4800, expenses: 2290 },
        { week: 'Week 4', revenue: 6100, expenses: 2000 },
        { week: 'Week 5', revenue: 7200, expenses: 2181 },
        { week: 'Week 6', revenue: 6800, expenses: 2500 },
    ];

    // Dual-axis data (different scales)
    const dualAxisData = [
        { month: 'Jan', temperature: 65, humidity: 72 },
        { month: 'Feb', temperature: 68, humidity: 65 },
        { month: 'Mar', temperature: 72, humidity: 58 },
        { month: 'Apr', temperature: 78, humidity: 52 },
        { month: 'May', temperature: 85, humidity: 43 },
        { month: 'Jun', temperature: 92, humidity: 38 },
    ];

    // Multi-line comparison data
    const multiLineData = [
        { period: 'Q1', productA: 2400, productB: 1800, productC: 1200 },
        { period: 'Q2', productA: 2210, productB: 2000, productC: 1800 },
        { period: 'Q3', productA: 2290, productB: 2100, productC: 2400 },
        { period: 'Q4', productA: 2000, productB: 2300, productC: 2100 },
    ];

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Graph Showcase</h1>
            <p>This is where we will showcase our graphs.</p>

            <hr style={{ margin: '2rem 0' }} />

            <h2>Bar Charts</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                <div>
                    <h3>Vertical Bar Chart</h3>
                    <BaseBarChart
                        data={barData}
                        xKey="month"
                        yKeys={['sales', 'profit']}
                    />
                </div>

                <div>
                    <h3>Horizontal Stacked Bar Chart</h3>
                    <BaseBarChart
                        data={barData}
                        xKey="month"
                        yKeys={['sales', 'profit']}
                        layout="horizontal"
                        stacked={true}
                    />
                </div>
            </div>

            <hr style={{ margin: '2rem 0' }} />

            <h2>Line Charts</h2>

            <div style={{ marginBottom: '3rem' }}>
                <h3>Basic Time Series - Visits vs Page Views</h3>
                <BaseLineChart
                    data={timeSeriesData}
                    xKey="date"
                    yKeys={['visits', 'pageViews']}
                    curveType="monotone"
                    showDots={true}
                    strokeWidth={2}
                />
            </div>

            <div style={{ marginBottom: '3rem' }}>
                <h3>Comparative Trends - Revenue vs Expenses</h3>
                <BaseLineChart
                    data={trendsData}
                    xKey="week"
                    yKeys={['revenue', 'expenses']}
                    curveType="linear"
                    showDots={false}
                    strokeWidth={3}
                />
            </div>

            <div style={{ marginBottom: '3rem' }}>
                <h3>Dual-Axis Visualization - Temperature vs Humidity</h3>
                <BaseLineChart
                    data={dualAxisData}
                    xKey="month"
                    yKeys={['temperature', 'humidity']}
                    secondaryAxisKey="humidity"
                    secondaryAxisOrientation="right"
                    curveType="monotone"
                    showDots={true}
                />
            </div>

            <div style={{ marginBottom: '3rem' }}>
                <h3>Multi-Line Comparison - Product Sales</h3>
                <BaseLineChart
                    data={multiLineData}
                    xKey="period"
                    yKeys={['productA', 'productB', 'productC']}
                    curveType="step"
                    showDots={true}
                    strokeWidth={2}
                />
            </div>
        </div>
    );
}

export default GraphShowcase;