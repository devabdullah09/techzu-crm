import { useState } from 'react';
import { databaseService, apiStatusService, type ApiStatusReport } from '../services';
import { RefreshCw, Database, AlertTriangle, CheckCircle, Activity, Wifi, WifiOff } from 'lucide-react';

const DatabaseManager = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ status: string; message: string } | null>(null);
  const [lastAction, setLastAction] = useState<string>('');
  const [apiStatus, setApiStatus] = useState<ApiStatusReport | null>(null);
  const [showApiStatus, setShowApiStatus] = useState(false);

  const checkStatus = async () => {
    setIsLoading(true);
    try {
      const result = await databaseService.checkDatabaseStatus();
      setStatus(result);
      setLastAction('Status check');
    } catch (error) {
      setStatus({ status: 'error', message: `Check failed: ${error}` });
    } finally {
      setIsLoading(false);
    }
  };

  const initializeDatabase = async () => {
    setIsLoading(true);
    try {
      const success = await databaseService.initializeDatabase();
      if (success) {
        setLastAction('Database initialization');
        await checkStatus(); // Refresh status after initialization
      } else {
        setStatus({ status: 'error', message: 'Database initialization failed' });
        setLastAction('Database initialization (failed)');
      }
    } catch (error) {
      setStatus({ status: 'error', message: `Initialization failed: ${error}` });
      setLastAction('Database initialization (error)');
    } finally {
      setIsLoading(false);
    }
  };

  const resetDatabase = async () => {
    setIsLoading(true);
    try {
      const success = await databaseService.resetDatabase();
      if (success) {
        setLastAction('Database reset');
        await checkStatus(); // Refresh status after reset
      } else {
        setStatus({ status: 'error', message: 'Database reset failed' });
        setLastAction('Database reset (failed)');
      }
    } catch (error) {
      setStatus({ status: 'error', message: `Reset failed: ${error}` });
      setLastAction('Database reset (error)');
    } finally {
      setIsLoading(false);
    }
  };

  const checkAllApiEndpoints = async () => {
    setIsLoading(true);
    try {
      const report = await apiStatusService.checkAllEndpoints();
      setApiStatus(report);
      setShowApiStatus(true);
      setLastAction('API endpoints check');
    } catch (error) {
      setStatus({ status: 'error', message: `API check failed: ${error}` });
      setLastAction('API endpoints check (failed)');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (!status) return <Database className="w-5 h-5 text-gray-400" />;
    
    switch (status.status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Database className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = () => {
    if (!status) return 'text-gray-600';
    
    switch (status.status) {
      case 'healthy':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  return (
    <div className="database-manager">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Database Manager</h2>
        </div>

        <div className="space-y-4">
          {/* Status Display */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              {getStatusIcon()}
              <span className="font-medium">Database Status</span>
            </div>
            <p className={`text-sm ${getStatusColor()}`}>
              {status ? status.message : 'Click "Check Status" to see current database status'}
            </p>
            {lastAction && (
              <p className="text-xs text-gray-500 mt-1">Last action: {lastAction}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={checkStatus}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Check Status
            </button>

            <button
              onClick={initializeDatabase}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Database className="w-4 h-4" />
              Initialize Database
            </button>

            <button
              onClick={resetDatabase}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <AlertTriangle className="w-4 h-4" />
              Reset Database
            </button>

            <button
              onClick={checkAllApiEndpoints}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Activity className="w-4 h-4" />
              Check All APIs
            </button>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Instructions:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Check Status:</strong> See the current database connection status</li>
              <li>• <strong>Initialize Database:</strong> Create the database tables and initial data</li>
              <li>• <strong>Reset Database:</strong> Clear all data and recreate the database (use with caution)</li>
              <li>• <strong>Check All APIs:</strong> Test all backend endpoints and see their status</li>
            </ul>
          </div>

          {/* Troubleshooting */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-medium text-yellow-900 mb-2">Troubleshooting:</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• If you see "Database does not exist" error, try "Initialize Database"</li>
              <li>• If you see "transaction is aborted" error, try "Reset Database"</li>
              <li>• The application will work with fallback authentication even if the database has issues</li>
            </ul>
          </div>

          {/* API Status Display */}
          {showApiStatus && apiStatus && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">API Endpoints Status</h3>
                <button
                  onClick={() => setShowApiStatus(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              
              <div className="mb-3">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                  apiStatus.overall === 'healthy' ? 'bg-green-100 text-green-800' :
                  apiStatus.overall === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {apiStatus.overall === 'healthy' ? <Wifi className="w-4 h-4" /> :
                   apiStatus.overall === 'partial' ? <Activity className="w-4 h-4" /> :
                   <WifiOff className="w-4 h-4" />}
                  {apiStatus.summary}
                </div>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {apiStatus.endpoints.map((endpoint, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                    <div className="flex items-center gap-2">
                      {endpoint.status === 'working' ? 
                        <CheckCircle className="w-4 h-4 text-green-500" /> :
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      }
                      <span className="text-sm font-medium">{endpoint.endpoint}</span>
                      <span className="text-xs text-gray-500">({endpoint.method})</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      endpoint.status === 'working' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {endpoint.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DatabaseManager;
