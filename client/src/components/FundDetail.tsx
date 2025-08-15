import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3, PieChart, DollarSign, Calendar, Building, User, FileText } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import axios from 'axios'
import { FundDetail as FundDetailType } from '../types'

const FundDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [fund, setFund] = useState<FundDetailType | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      fetchFundDetails()
    }
  }, [id])

  const fetchFundDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get(`/api/funds/${id}`)
      setFund(response.data)
    } catch (error: any) {
      console.error('Error fetching fund details:', error)
      setError(error.response?.data?.error || 'Failed to fetch fund details')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
        <span className="ml-3 text-gray-600">Loading fund details...</span>
      </div>
    )
  }

  if (error || !fund) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg mb-4">{error || 'Fund not found'}</p>
        <Link
          to="/funds"
          className="text-primary-600 hover:text-primary-900 underline"
        >
          ← Back to Funds
        </Link>
      </div>
    )
  }

  // Prepare chart data from NAV history
  const chartData = fund.nav_history?.slice(-30).map((item: any) => ({
    date: item.date || item.Date || 'N/A',
    nav: parseFloat(item.nav || item.NAV || 0)
  })) || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          to="/funds"
          className="flex items-center space-x-2 text-primary-600 hover:text-primary-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Funds</span>
        </Link>
        <div className="h-6 w-px bg-gray-300"></div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{fund.name}</h1>
          <p className="text-gray-600">Fund Code: {fund.code}</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current NAV</p>
              <p className="text-2xl font-bold text-gray-900">₹{fund.nav}</p>
            </div>
            <DollarSign className="h-8 w-8 text-primary-600" />
          </div>
          <p className="text-sm text-gray-500 mt-2">NAV Date: {fund.nav_date}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Category</p>
              <p className="text-lg font-semibold text-gray-900">{fund.category}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-primary-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expense Ratio</p>
              <p className="text-lg font-semibold text-gray-900">{fund.expense_ratio}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-warning-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Fund Size</p>
              <p className="text-lg font-semibold text-gray-900">{fund.fund_size}</p>
            </div>
            <PieChart className="h-8 w-8 text-success-600" />
          </div>
        </div>
      </div>

      {/* Fund Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Fund Information</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Building className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">AMC</p>
                <p className="text-sm text-gray-600">{fund.amc}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Fund Manager</p>
                <p className="text-sm text-gray-600">{fund.fund_manager}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Fund Age</p>
                <p className="text-sm text-gray-600">{fund.fund_age}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <DollarSign className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Min Investment</p>
                <p className="text-sm text-gray-600">{fund.min_investment}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Details</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">ISIN</p>
                <p className="text-sm text-gray-600 font-mono">{fund.isin}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Exit Load</p>
                <p className="text-sm text-gray-600">{fund.exit_load}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NAV History Chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">NAV History (Last 30 Days)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip 
                  formatter={(value: any) => [`₹${value}`, 'NAV']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="nav" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Scheme Information */}
      {fund.scheme_info && Object.keys(fund.scheme_info).length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Scheme Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(fund.scheme_info).map(([key, value]) => (
              <div key={key} className="border-b border-gray-100 pb-2">
                <p className="text-sm font-medium text-gray-900 capitalize">
                  {key.replace(/_/g, ' ')}
                </p>
                <p className="text-sm text-gray-600">{String(value)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Source Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <div className="status-indicator status-online"></div>
          <span>Data sourced from MFTool API - Real-time mutual fund information</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Last updated: {fund.nav_date} | Fund Code: {fund.code}
        </p>
      </div>
    </div>
  )
}

export default FundDetail
