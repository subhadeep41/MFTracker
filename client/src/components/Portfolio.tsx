import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, TrendingUp, TrendingDown, PieChart, DollarSign, RefreshCw } from 'lucide-react'
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import axios from 'axios'
import { Fund, PortfolioItem, PieChartData } from '../types'

const Portfolio: React.FC = () => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [funds, setFunds] = useState<Fund[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [showAddForm, setShowAddForm] = useState<boolean>(false)
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string>('')

  // Form state
  const [formData, setFormData] = useState({
    fund_code: '',
    fund_name: '',
    units: '',
    nav: '',
    purchase_date: ''
  })

  useEffect(() => {
    fetchPortfolioData()
    const interval = setInterval(fetchPortfolioData, 300000) // Refresh every 5 minutes
    return () => clearInterval(interval)
  }, [])

  const fetchPortfolioData = async () => {
    try {
      setLoading(true)
      const [portfolioRes, fundsRes] = await Promise.all([
        axios.get('/api/portfolio'),
        axios.get('/api/funds')
      ])
      setPortfolioData(portfolioRes.data)
      setFunds(fundsRes.data)
      setLastUpdated(new Date().toLocaleTimeString())
    } catch (error) {
      console.error('Error fetching portfolio data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateTotalValue = (): number => {
    return portfolio.reduce((total, item) => total + item.current_value, 0)
  }

  const calculateTotalGainLoss = (): number => {
    return portfolio.reduce((total, item) => total + item.gain_loss, 0)
  }

  const calculateTotalGainLossPercent = (): number => {
    const totalInvested = portfolio.reduce((total, item) => total + item.invested_amount, 0)
    const totalGainLoss = calculateTotalGainLoss()
    return totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0
  }

  const generatePieChartData = (): PieChartData[] => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316']
    
    return portfolio.map((item, index) => ({
      name: item.fund_name,
      value: item.current_value,
      color: colors[index % colors.length]
    }))
  }

  const handleAddFund = () => {
    setShowAddForm(true)
    setEditingItem(null)
    setFormData({
      fund_code: '',
      fund_name: '',
      units: '',
      nav: '',
      purchase_date: ''
    })
  }

  const handleEditFund = (item: PortfolioItem) => {
    setEditingItem(item)
    setShowAddForm(true)
    setFormData({
      fund_code: item.fund_code,
      fund_name: item.fund_name,
      units: item.units.toString(),
      nav: item.nav.toString(),
      purchase_date: item.purchase_date
    })
  }

  const handleDeleteFund = (id: number) => {
    if (window.confirm('Are you sure you want to delete this fund from your portfolio?')) {
      setPortfolio(portfolio.filter(item => item.id !== id))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newItem: PortfolioItem = {
      id: editingItem ? editingItem.id : Date.now(),
      fund_code: formData.fund_code,
      fund_name: formData.fund_name,
      units: parseFloat(formData.units),
      nav: parseFloat(formData.nav),
      invested_amount: parseFloat(formData.units) * parseFloat(formData.nav),
      current_value: parseFloat(formData.units) * parseFloat(formData.nav), // Simplified for demo
      gain_loss: 0, // Simplified for demo
      gain_loss_percent: 0, // Simplified for demo
      purchase_date: formData.purchase_date
    }

    if (editingItem) {
      setPortfolio(portfolio.map(item => item.id === editingItem.id ? newItem : item))
    } else {
      setPortfolio([...portfolio, newItem])
    }

    setShowAddForm(false)
    setEditingItem(null)
    setFormData({
      fund_code: '',
      fund_name: '',
      units: '',
      nav: '',
      purchase_date: ''
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (loading && portfolio.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
        <span className="ml-3 text-gray-600">Loading portfolio data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portfolio</h1>
          <p className="text-gray-600">Manage your mutual fund investments</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Last updated</div>
          <div className="text-lg font-semibold text-gray-900">{lastUpdated}</div>
        </div>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{calculateTotalValue().toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-primary-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
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

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Return %</p>
              <p className={`text-2xl font-bold ${calculateTotalGainLossPercent() >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                {calculateTotalGainLossPercent().toFixed(2)}%
              </p>
            </div>
            <PieChart className="h-8 w-8 text-primary-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Funds</p>
              <p className="text-2xl font-bold text-gray-900">{portfolio.length}</p>
            </div>
            <PieChart className="h-8 w-8 text-primary-600" />
          </div>
        </div>
      </div>

      {/* Portfolio Allocation Chart */}
      {portfolio.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Portfolio Allocation</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={generatePieChartData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {generatePieChartData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Value']} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Portfolio Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Your Holdings</h2>
          <div className="flex space-x-3">
            <button
              onClick={handleAddFund}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Fund</span>
            </button>
            <button
              onClick={fetchPortfolioData}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {portfolio.length === 0 ? (
          <div className="text-center py-12">
            <PieChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No funds in your portfolio yet</p>
            <p className="text-gray-400 mb-4">Start building your portfolio by adding mutual funds</p>
            <button
              onClick={handleAddFund}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors mx-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Add Your First Fund</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fund</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAV</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invested</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gain/Loss</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {portfolio.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.fund_name}</div>
                      <div className="text-sm text-gray-500">{item.fund_code}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.units}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{item.nav}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{item.invested_amount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{item.current_value.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${item.gain_loss >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                        ₹{item.gain_loss.toLocaleString()}
                      </div>
                      <div className={`text-xs ${item.gain_loss_percent >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                        {item.gain_loss_percent.toFixed(2)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditFund(item)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFund(item.id)}
                          className="text-danger-600 hover:text-danger-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Fund Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingItem ? 'Edit Fund' : 'Add New Fund'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fund Code</label>
                <input
                  type="text"
                  name="fund_code"
                  value={formData.fund_code}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fund Name</label>
                <input
                  type="text"
                  name="fund_name"
                  value={formData.fund_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Units</label>
                <input
                  type="number"
                  name="units"
                  value={formData.units}
                  onChange={handleInputChange}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NAV at Purchase</label>
                <input
                  type="number"
                  name="nav"
                  value={formData.nav}
                  onChange={handleInputChange}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
                <input
                  type="date"
                  name="purchase_date"
                  value={formData.purchase_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {editingItem ? 'Update' : 'Add'} Fund
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Portfolio
