export interface Fund {
  id: string;
  name: string;
  code: string;
  category: string;
  nav: number;
  nav_date: string;
  expense_ratio: string;
  fund_size: string;
  fund_age: string;
  min_investment: string;
  exit_load: string;
  fund_manager: string;
  isin: string;
  amc: string;
}

export interface FundDetail extends Fund {
  nav_history?: any[];
  scheme_info?: any;
}

export interface PortfolioItem {
  id: number;
  fund_code: string;
  fund_name: string;
  units: number;
  nav: number;
  invested_amount: number;
  current_value: number;
  gain_loss: number;
  gain_loss_percent: number;
  purchase_date: string;
}

export interface MarketSummary {
  total_funds: number;
  top_performing: Array<{
    code: string;
    name: string;
    nav: number;
    category: string;
  }>;
  last_updated: string;
  market_status: string;
}

export interface SearchResult {
  id: string;
  name: string;
  code: string;
}

export interface NavItem {
  path: string;
  label: string;
  icon: any;
}

export interface PerformanceData {
  date: string;
  nav: number;
}

export interface ComparisonData {
  name: string;
  value: number;
  color: string;
}

export interface PieChartData {
  name: string;
  value: number;
  color: string;
}
