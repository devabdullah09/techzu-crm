import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  BarChart3,
} from "lucide-react";
import { analyticsService, type AnalyticsData } from "../../services";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("revenue");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load analytics data on component mount
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setIsLoading(true);
        // Try to get real data first, fallback to mock data
        try {
          const data = await analyticsService.getAnalytics();
          setAnalyticsData(data);
        } catch (error) {
          console.log('Real analytics not available, using mock data');
          const mockData = await analyticsService.getMockAnalytics();
          setAnalyticsData(mockData);
        }
      } catch (error) {
        console.error('Failed to load analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const metrics = analyticsData ? [
    {
      name: "Total Revenue",
      value: `$${analyticsData.revenue.toLocaleString()}`,
      change: `+${analyticsData.growth_rate}%`,
      changeType: "positive" as const,
      icon: DollarSign,
      color: "purple",
    },
    {
      name: "Total Customers",
      value: analyticsData.customers.toLocaleString(),
      change: "+12%",
      changeType: "positive" as const,
      icon: Users,
      color: "blue",
    },
    {
      name: "Conversion Rate",
      value: `${analyticsData.conversion_rate}%`,
      change: "+2%",
      changeType: "positive" as const,
      icon: Target,
      color: "green",
    },
    {
      name: "Avg. Deal Size",
      value: `$${analyticsData.avg_deal_size.toLocaleString()}`,
      change: "-3%",
      changeType: "negative" as const,
      icon: BarChart3,
      color: "orange",
    },
  ] : [];

  const chartData = {
    revenue: [
      { month: "Jan", value: 12000 },
      { month: "Feb", value: 15000 },
      { month: "Mar", value: 18000 },
      { month: "Apr", value: 14000 },
      { month: "May", value: 22000 },
      { month: "Jun", value: 25000 },
    ],
    customers: [
      { month: "Jan", value: 150 },
      { month: "Feb", value: 180 },
      { month: "Mar", value: 220 },
      { month: "Apr", value: 200 },
      { month: "May", value: 280 },
      { month: "Jun", value: 320 },
    ],
    conversion: [
      { month: "Jan", value: 18 },
      { month: "Feb", value: 20 },
      { month: "Mar", value: 22 },
      { month: "Apr", value: 19 },
      { month: "May", value: 25 },
      { month: "Jun", value: 28 },
    ],
  };

  const topCustomers = analyticsData?.top_customers || [];

  const getMaxValue = (data: any[]) => {
    return Math.max(...data.map((item) => item.value));
  };

  const renderChart = (data: any[]) => {
    const maxValue = getMaxValue(data);

    return (
      <div className="chart-container">
        <div className="chart-bars">
          {data.map((item, index) => (
            <div key={index} className="chart-bar">
              <div
                className="bar-fill"
                style={{
                  height: `${(item.value / maxValue) * 100}%`,
                  backgroundColor:
                    selectedMetric === "revenue"
                      ? "#8b5cf6"
                      : selectedMetric === "customers"
                      ? "#3b82f6"
                      : "#10b981",
                }}
              />
              <span className="bar-label">{item.month}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="analytics">
        <div className="page-header">
          <h1>Analytics</h1>
          <p>Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics">
      <div className="page-header">
        <div className="header-content">
          <h1>Analytics</h1>
          <p>Track your business performance and insights</p>
        </div>
        <div className="header-controls">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-selector"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <div key={index} className={`metric-card metric-${metric.color}`}>
            <div className="metric-icon">
              <metric.icon size={24} />
            </div>
            <div className="metric-content">
              <h3 className="metric-title">{metric.name}</h3>
              <p className="metric-value">{metric.value}</p>
              <span className={`metric-change ${metric.changeType}`}>
                {metric.changeType === "positive" ? (
                  <TrendingUp size={16} />
                ) : (
                  <TrendingDown size={16} />
                )}
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="chart-section">
        <div className="chart-header">
          <h2>Performance Overview</h2>
          <div className="chart-controls">
            <button
              className={`chart-btn ${
                selectedMetric === "revenue" ? "active" : ""
              }`}
              onClick={() => setSelectedMetric("revenue")}
            >
              Revenue
            </button>
            <button
              className={`chart-btn ${
                selectedMetric === "customers" ? "active" : ""
              }`}
              onClick={() => setSelectedMetric("customers")}
            >
              Customers
            </button>
            <button
              className={`chart-btn ${
                selectedMetric === "conversion" ? "active" : ""
              }`}
              onClick={() => setSelectedMetric("conversion")}
            >
              Conversion
            </button>
          </div>
        </div>
        <div className="chart-wrapper">
          {renderChart(chartData[selectedMetric as keyof typeof chartData])}
        </div>
      </div>

      {/* Top Customers */}
      <div className="top-customers">
        <h2>Top Customers by Revenue</h2>
        <div className="customers-list">
          {topCustomers.map((customer, index) => (
            <div key={index} className="customer-item">
              <div className="customer-rank">#{index + 1}</div>
              <div className="customer-info">
                <h4>{customer.name}</h4>
                <p>{customer.deals} deals</p>
              </div>
              <div className="customer-revenue">{customer.revenue}</div>
              <span className={`status-badge status-active`}>
                {customer.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="insights-section">
        <h2>Key Insights</h2>
        <div className="insights-grid">
          {analyticsData?.insights.map((insight, index) => (
            <div key={index} className="insight-card">
              <h4>{insight.title}</h4>
              <p>{insight.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
