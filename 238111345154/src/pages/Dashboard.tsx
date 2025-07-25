import { useEffect, useState } from 'react';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, 
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer 
} from 'recharts';
import { mockWebsites } from '@/mock/websites';
import { mockAnomalies } from '@/mock/anomalies';
import { mockSecurityReport } from '@/mock/reports';
import { AnomalyType, WebsiteStatus } from '@/types';

// 状态颜色映射
const statusColorMap = {
  [WebsiteStatus.NORMAL]: 'bg-green-500',
  [WebsiteStatus.WARNING]: 'bg-yellow-500',
  [WebsiteStatus.ALERT]: 'bg-red-500',
  [WebsiteStatus.OFFLINE]: 'bg-gray-500'
};

// 状态文本映射
const statusTextMap = {
  [WebsiteStatus.NORMAL]: '正常',
  [WebsiteStatus.WARNING]: '警告',
  [WebsiteStatus.ALERT]: '异常',
  [WebsiteStatus.OFFLINE]: '离线'
};

// 异常类型文本映射
const anomalyTypeTextMap = {
  [AnomalyType.TAMPERING]: '篡改',
  [AnomalyType.HIDDEN_LINK]: '暗链',
  [AnomalyType.REACTIONARY_CONTENT]: '反动内容'
};

// 图表颜色
const chartColors = {
  normal: '#10b981', // 绿色
  warning: '#f59e0b', // 黄色
  alert: '#ef4444',   // 红色
  offline: '#6b7280', // 灰色
  tampering: '#ef4444',    // 红色 - 篡改
  hiddenLink: '#f59e0b',   // 黄色 - 暗链
  reactionary: '#8b5cf6',  // 紫色 - 反动内容
  areaChart: '#3b82f680',  // 蓝色半透明 - 面积图
  barChart: '#3b82f6'      // 蓝色 - 柱状图
};

const Dashboard = () => {
  const [websiteStats, setWebsiteStats] = useState({
    total: 0,
    normal: 0,
    warning: 0,
    alert: 0,
    offline: 0
  });
  
  const [recentAnomalies, setRecentAnomalies] = useState([]);
  
  useEffect(() => {
    // 计算网站状态统计
    const stats = {
      total: mockWebsites.length,
      normal: mockWebsites.filter(w => w.status === WebsiteStatus.NORMAL).length,
      warning: mockWebsites.filter(w => w.status === WebsiteStatus.WARNING).length,
      alert: mockWebsites.filter(w => w.status === WebsiteStatus.ALERT).length,
      offline: mockWebsites.filter(w => w.status === WebsiteStatus.OFFLINE).length
    };
    
    setWebsiteStats(stats);
    
    // 获取最近5条异常记录
    const sortedAnomalies = [...mockAnomalies]
      .sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime())
      .slice(0, 5);
      
    setRecentAnomalies(sortedAnomalies);
  }, []);
  
  // 格式化日期时间
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">安全监测概览</h1>
        <p className="text-gray-600 dark:text-gray-400">实时监控您的网站安全状态和异常情况</p>
      </div>
      
      {/* 网站状态统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">总网站数</p>
              <h3 className="text-2xl font-bold mt-1">{websiteStats.total}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <i className="fa-solid fa-globe text-blue-600 dark:text-blue-400"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">正常网站</p>
              <h3 className="text-2xl font-bold mt-1">{websiteStats.normal}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <i className="fa-solid fa-check-circle text-green-600 dark:text-green-400"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">警告网站</p>
              <h3 className="text-2xl font-bold mt-1">{websiteStats.warning}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <i className="fa-solid fa-exclamation-triangle text-yellow-600 dark:text-yellow-400"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">异常网站</p>
              <h3 className="text-2xl font-bold mt-1">{websiteStats.alert}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <i className="fa-solid fa-times-circle text-red-600 dark:text-red-400"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">离线网站</p>
              <h3 className="text-2xl font-bold mt-1">{websiteStats.offline}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <i className="fa-solid fa-wifi-slash text-gray-600 dark:text-gray-400"></i>
            </div>
          </div>
        </div>
      </div>
      
      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 异常趋势图 */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-lg">异常趋势分析</h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">近30天</div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={mockSecurityReport.trendData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorAnomaly" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColors.barChart} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={chartColors.barChart} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="anomalyCount" 
                  stroke={chartColors.barChart} 
                  fillOpacity={1} 
                  fill="url(#colorAnomaly)" 
                  name="异常数量"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* 异常类型分布 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-lg">异常类型分布</h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">本月</div>
          </div>
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockSecurityReport.anomalySummary}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="count"
                  label={({ name, percent }) => `${anomalyTypeTextMap[name]} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {mockSecurityReport.anomalySummary.map((entry, index) => {
                    const colors = [
                      chartColors.tampering, 
                      chartColors.hiddenLink, 
                      chartColors.reactionary
                    ];
                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                  })}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} 次`, '异常数量']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* 最近异常记录 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-lg">最近异常记录</h3>
          <button className="text-blue-600 dark:text-blue-400 text-sm hover:underline">查看全部</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">网站名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">异常类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">检测时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentAnomalies.map((anomaly) => (
                <tr key={anomaly.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="font-medium">{anomaly.websiteName}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                      {anomaly.websiteUrl}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      anomaly.type === AnomalyType.TAMPERING ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                      anomaly.type === AnomalyType.HIDDEN_LINK ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                    }`}>
                      {anomalyTypeTextMap[anomaly.type]}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDateTime(anomaly.detectedAt)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      anomaly.status === 'pending' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' :
                      anomaly.status === 'handled' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {anomaly.status === 'pending' ? '待处理' : 
                       anomaly.status === 'handled' ? '已处理' : '已忽略'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-3">详情</button>
                    <button className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300">处理</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
