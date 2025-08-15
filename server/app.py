from flask import Flask, jsonify, request
from flask_cors import CORS
from mftool import Mftool
import os
from dotenv import load_dotenv
import logging
from datetime import datetime, timedelta
import json

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize mftool
try:
    mf = Mftool()
    logger.info("MFTool initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize MFTool: {e}")
    mf = None

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'mftool_status': 'connected' if mf else 'disconnected'
    })

@app.route('/api/funds', methods=['GET'])
def get_all_funds():
    """Get all mutual funds with real-time data"""
    try:
        if not mf:
            return jsonify({'error': 'MFTool not available'}), 500
        
        # Get all mutual funds
        funds = mf.get_all_mutual_fund_names()
        
        # Get detailed information for each fund
        detailed_funds = []
        for fund in funds[:50]:  # Limit to first 50 for performance
            try:
                fund_code = fund['code']
                fund_info = mf.get_mutual_fund_details(fund_code)
                
                if fund_info and 'data' in fund_info:
                    data = fund_info['data']
                    detailed_fund = {
                        'id': fund_code,
                        'name': fund.get('name', 'N/A'),
                        'code': fund_code,
                        'category': data.get('category', 'N/A'),
                        'nav': data.get('nav', 0),
                        'nav_date': data.get('nav_date', 'N/A'),
                        'expense_ratio': data.get('expense_ratio', 'N/A'),
                        'fund_size': data.get('fund_size', 'N/A'),
                        'fund_age': data.get('fund_age', 'N/A'),
                        'min_investment': data.get('min_investment', 'N/A'),
                        'exit_load': data.get('exit_load', 'N/A'),
                        'fund_manager': data.get('fund_manager', 'N/A'),
                        'isin': data.get('isin', 'N/A'),
                        'amc': data.get('amc', 'N/A')
                    }
                    detailed_funds.append(detailed_fund)
            except Exception as e:
                logger.warning(f"Failed to get details for fund {fund_code}: {e}")
                continue
        
        return jsonify(detailed_funds)
    
    except Exception as e:
        logger.error(f"Error fetching funds: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/funds/<fund_code>', methods=['GET'])
def get_fund_details(fund_code):
    """Get detailed information for a specific mutual fund"""
    try:
        if not mf:
            return jsonify({'error': 'MFTool not available'}), 500
        
        # Get fund details
        fund_info = mf.get_mutual_fund_details(fund_code)
        
        if not fund_info or 'data' not in fund_info:
            return jsonify({'error': 'Fund not found'}), 404
        
        data = fund_info['data']
        
        # Get historical NAV data
        try:
            nav_history = mf.get_mutual_fund_nav_history(fund_code)
        except:
            nav_history = []
        
        # Get scheme info
        try:
            scheme_info = mf.get_scheme_details(fund_code)
        except:
            scheme_info = {}
        
        fund_details = {
            'id': fund_code,
            'name': data.get('name', 'N/A'),
            'code': fund_code,
            'category': data.get('category', 'N/A'),
            'nav': data.get('nav', 0),
            'nav_date': data.get('nav_date', 'N/A'),
            'expense_ratio': data.get('expense_ratio', 'N/A'),
            'fund_size': data.get('fund_size', 'N/A'),
            'fund_age': data.get('fund_age', 'N/A'),
            'min_investment': data.get('min_investment', 'N/A'),
            'exit_load': data.get('exit_load', 'N/A'),
            'fund_manager': data.get('fund_manager', 'N/A'),
            'isin': data.get('isin', 'N/A'),
            'amc': data.get('amc', 'N/A'),
            'nav_history': nav_history,
            'scheme_info': scheme_info
        }
        
        return jsonify(fund_details)
    
    except Exception as e:
        logger.error(f"Error fetching fund details: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/funds/search', methods=['GET'])
def search_funds():
    """Search mutual funds by name or category"""
    try:
        if not mf:
            return jsonify({'error': 'MFTool not available'}), 500
        
        query = request.args.get('q', '').lower()
        category = request.args.get('category', '')
        
        if not query and not category:
            return jsonify({'error': 'Search query or category required'}), 400
        
        # Get all funds
        funds = mf.get_all_mutual_fund_names()
        
        filtered_funds = []
        for fund in funds:
            fund_name = fund.get('name', '').lower()
            fund_code = fund['code']
            
            # Filter by search query
            if query and query not in fund_name:
                continue
            
            # Filter by category if specified
            if category:
                try:
                    fund_info = mf.get_mutual_fund_details(fund_code)
                    if fund_info and 'data' in fund_info:
                        fund_category = fund_info['data'].get('category', '').lower()
                        if category.lower() not in fund_category:
                            continue
                except:
                    continue
            
            filtered_funds.append({
                'id': fund_code,
                'name': fund.get('name', 'N/A'),
                'code': fund_code
            })
        
        return jsonify(filtered_funds[:20])  # Limit results
    
    except Exception as e:
        logger.error(f"Error searching funds: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/funds/categories', methods=['GET'])
def get_fund_categories():
    """Get all available fund categories"""
    try:
        if not mf:
            return jsonify({'error': 'MFTool not available'}), 500
        
        # Get all funds and extract categories
        funds = mf.get_all_mutual_fund_names()
        categories = set()
        
        for fund in funds[:100]:  # Sample first 100 funds
            try:
                fund_code = fund['code']
                fund_info = mf.get_mutual_fund_details(fund_code)
                
                if fund_info and 'data' in fund_info:
                    category = fund_info['data'].get('category', '')
                    if category:
                        categories.add(category)
            except:
                continue
        
        return jsonify(list(categories))
    
    except Exception as e:
        logger.error(f"Error fetching categories: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/portfolio', methods=['GET'])
def get_portfolio():
    """Get sample portfolio data (in real app, this would come from database)"""
    # This is sample data - in production, you'd fetch from a database
    sample_portfolio = [
        {
            'id': 1,
            'fund_code': '120010',
            'fund_name': 'HDFC Mid-Cap Opportunities Fund',
            'units': 1000,
            'nav': 45.67,
            'invested_amount': 45670,
            'current_value': 47850,
            'gain_loss': 2180,
            'gain_loss_percent': 4.78,
            'purchase_date': '2023-01-15'
        },
        {
            'id': 2,
            'fund_code': '120010',
            'fund_name': 'ICICI Prudential Bluechip Fund',
            'units': 500,
            'nav': 67.89,
            'invested_amount': 33945,
            'current_value': 35600,
            'gain_loss': 1655,
            'gain_loss_percent': 4.88,
            'purchase_date': '2023-03-20'
        }
    ]
    
    return jsonify(sample_portfolio)

@app.route('/api/market/summary', methods=['GET'])
def get_market_summary():
    """Get market summary and trending funds"""
    try:
        if not mf:
            return jsonify({'error': 'MFTool not available'}), 500
        
        # Get top performing funds
        top_funds = []
        funds = mf.get_all_mutual_fund_names()
        
        for fund in funds[:20]:  # Check first 20 funds
            try:
                fund_code = fund['code']
                fund_info = mf.get_mutual_fund_details(fund_code)
                
                if fund_info and 'data' in fund_info:
                    data = fund_info['data']
                    if data.get('nav'):
                        top_funds.append({
                            'code': fund_code,
                            'name': fund.get('name', 'N/A'),
                            'nav': data.get('nav', 0),
                            'category': data.get('category', 'N/A')
                        })
            except:
                continue
        
        # Sort by NAV (simplified ranking)
        top_funds.sort(key=lambda x: x['nav'], reverse=True)
        
        market_summary = {
            'total_funds': len(funds),
            'top_performing': top_funds[:10],
            'last_updated': datetime.now().isoformat(),
            'market_status': 'Open' if datetime.now().hour < 15 else 'Closed'
        }
        
        return jsonify(market_summary)
    
    except Exception as e:
        logger.error(f"Error fetching market summary: {e}")
        return jsonify({'error': str(e)}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    logger.info(f"Starting MFTracker server on port {port}")
    app.run(host='0.0.0.0', port=port, debug=debug)
