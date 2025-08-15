import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown, DollarSign, PieChart, Plus, Eye, Activity, BarChart3 } from 'lucide-react'
import axios from 'axios'
import { Fund, PortfolioItem, MarketSummary } from '../types'

const Dashboard: React.FC = () => {
  const [portfolioData, setPortfolioData] = useState<PortfolioItem[] | null>(null)
  const [fundsData, setFundsData] = useState<Fund[]>([])
  const [marketSummary, setMarketSummary] = useState<MarketSummary | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [lastUpdated, setLastUpdated] = useState<string>('')

  useEffect(() => {
    fetchDashboardData()
    const interval = setInterval(fetchDashboardData, 300000) // Refresh every 5 minutes
    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [portfolioRes, fundsRes, marketRes] = await Promise.all([
        axios.get('/api/portfolio'),
        axios.get('/api/funds'),
        axios.get('/api/market/summary')
      ])

      setPortfolioData(portfolioRes.data)
      setFundsData(fundsRes.data)
      setMarketSummary(marketRes.data)
      setLastUpdated(new Date().toLocaleTimeString())
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateTotalValue = (): number => {
    if (!portfolioData) return 0
    return portfolioData.reduce((total, item) => total + item.current_value, 0)
  }

  const calculateTotalGainLoss = (): number => {
    if (!portfolioData) return 0
    return portfolioData.reduce((total, item) => total + item.gain_loss, 0)
  }

  const calculateTotalGainLossPercent = (): number => {
    if (!portfolioData) return 0
    const totalInvested = portfolioData.reduce((total, item) => total + item.invested_amount, 0)
    const totalGainLoss = calculateTotalGainLoss()
    return totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
        <span className="ml-3 text-gray-600">Loading live data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Real-time mutual fund portfolio overview</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Last updated</div>
          <div className="text-lg font-semibold text-gray-900">{lastUpdated}</div>
        </div>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Portfolio Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{calculateTotalValue().toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-primary-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Gain/Loss</p>
              <p className={`text-2xl font-bold ${calculateTotalGainLoss() >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                ₹{calculateTotalGainLoss().toLocaleString()}
              </p>
            </div>
            {calculateTotalGainLoss() >= 0 ? (
              <TrendingUp className="h-8 w-8 text-success-600" />
            ) : (
              <TrendingDown className="h-8 w-8 text-danger-600" />
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Return %</p>
              <p className={`text-2xl font-bold ${calculateTotalGainLossPercent() >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                {calculateTotalGainLossPercent().toFixed(2)}%
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-primary-600" />
          </div>
        </div>
      </div>

      {/* Market Summary */}
      {marketSummary && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Market Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-600">{marketSummary.total_funds.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total Funds</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">{marketSummary.market_status}</p>
              <p className="text-sm text-gray-600">Market Status</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(marketSummary.last_updated).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/funds"
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Eye className="h-4 w-4" />
            <span>Browse Funds</span>
          </Link>
          <Link
            to="/portfolio"
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <PieChart className="h-4 w-4" />
            <span>View Portfolio</span>
          </Link>
        </div>
      </div>

      {/* Recent Fund Performance */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Fund Performance</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fund Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAV</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAV Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fundsData.slice(0, 5).map((fund) => (
                <tr key={fund.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{fund.name}</div>
                    <div className="text-sm text-gray-500">{fund.code}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fund.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{fund.nav}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fund.nav_date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/funds/${fund.id}`}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
