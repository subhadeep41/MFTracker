import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { TrendingUp, BarChart3, PieChart, Home, Activity } from 'lucide-react'
import { NavItem } from '../types'

const Navbar: React.FC = () => {
  const location = useLocation()
  
  const navItems: NavItem[] = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/funds', label: 'Funds', icon: TrendingUp },
    { path: '/portfolio', label: 'Portfolio', icon: PieChart },
  ]

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">MFTracker</span>
              <span className="text-sm text-gray-500">Live Data</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary-600 bg-primary-50 border border-primary-200'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="status-indicator status-online"></div>
              <span>Live Data</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
