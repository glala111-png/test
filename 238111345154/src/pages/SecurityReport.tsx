import { useEffect, useState } from 'react';
import { toast } from "sonner";
import { 
  BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer 
} from 'recharts';
import { mockSecurityReport } from '@/mock/reports';
import { mockAnomalies } from '@/mock/anomalies';
import { Anomaly, AnomalyStatus, AnomalyType, WebsiteStatus } from '@/types';
import { tamperingDetectionLogic, hiddenLinkDetectionLogic, reactionaryContentDetectionLogic } from '@/lib/monitoringLogic';

// 状态颜色映射
const statusColorMap = {
  [WebsiteStatus.NORMAL]: 'bg-green-500',
  [WebsiteStatus.WARNING]: 'bg-yellow-500',
  [WebsiteStatus.ALERT]: 'bg-red-500',
  [WebsiteStatus.OFFLINE]: 'bg-gray-500'
};

// 异常类型文本映射
const anomalyTypeTextMap = {
  [AnomalyType.TAMPERING]: '篡改',
  [AnomalyType.HIDDEN_LINK]: '暗链',
  [AnomalyType.REACTIONARY_CONTENT]: '反动内容'
};

// 异常状态文本映射
const anomalyStatusTextMap = {
  [AnomalyStatus.PENDING]: '待处理',
  [AnomalyStatus.HANDLED]: '已处理',
  [AnomalyStatus.IGNORED]: '已忽略'
};

// 图表颜色
const chartColors = {
  tampering: '#ef4444',    // 红色 - 篡改
  hiddenLink: '#f59e0b',   // 黄色 - 暗链
  reactionary: '#8b5cf6',  // 紫色 - 反动内容
  barChart: '#3b82f6'      // 蓝色 - 柱状图
};

// 格式化日期时间
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const SecurityReport = () => {
  const [report, setReport] = useState(mockSecurityReport);
  const [anomalies, setAnomalies] = useState(mockAnomalies);
  const [showAllAnomalies, setShowAllAnomalies] = useState(false);
  const [showAnomalyDetail, setShowAnomalyDetail] = useState(false);
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null);
  
  // 查看异常详情
  const handleViewAnomalyDetail = (anomaly: Anomaly) => {
    setSelectedAnomaly(anomaly);
    setShowAnomalyDetail(true);
  };
  
  // 关闭异常详情
  const handleCloseAnomalyDetail = () => {
    setShowAnomalyDetail(false);
    setSelectedAnomaly(null);
  };
  
  // 异常类型颜色映射
  const anomalyTypeColorMap = {
    [AnomalyType.TAMPERING]: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    [AnomalyType.HIDDEN_LINK]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    [AnomalyType.REACTIONARY_CONTENT]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
  };
  
  // 异常状态颜色映射
   const anomalyStatusColorMap = {
     [AnomalyStatus.PENDING]: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
     [AnomalyStatus.HANDLED]: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
     [AnomalyStatus.IGNORED]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
   };
   
   // 处理异常
   const handleProcessAnomaly = (anomalyId: string) => {
     // 更新异常状态为已处理
     const updatedAnomalies = anomalies.map(anomaly => {
       if (anomaly.id === anomalyId) {
         return {
           ...anomaly,
           status: AnomalyStatus.HANDLED,
           handledAt: new Date().toISOString(),
           handledBy: '当前用户'
         };
       }
       return anomaly;
     });
     
     // 更新状态和本地存储
     setAnomalies(updatedAnomalies);
     localStorage.setItem('anomalies', JSON.stringify(updatedAnomalies));
     
     // 显示成功提示
     toast.success('异常已成功处理');
   };
  
  // 处理"查看全部异常"按钮点击
  const handleViewAllAnomalies = () => {
    setShowAllAnomalies(true);
  };
  
  // 处理"收起"按钮点击
  const handleCollapseAnomalies = () => {
    setShowAllAnomalies(false);
  };
  
  // 获取要显示的异常列表（全部或前3条）
  const displayedAnomalies = showAllAnomalies ? anomalies : anomalies.slice(0, 3);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">安全报告</h1>
        <p className="text-gray-600 dark:text-gray-400">
          查看企业网站安全状况和异常记录
        </p>
      </div>
      
      {/* 报告概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">监测网站总数</p>
              <h3 className="text-2xl font-bold mt-1">{report.websiteCount}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <i className="fa-solid fa-globe text-blue-600 dark:text-blue-400"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">异常网站数</p>
              <h3 className="text-2xl font-bold mt-1 text-red-600 dark:text-red-400">
                {report.alertCount + report.warningCount}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <i className="fa-solid fa-exclamation-triangle text-red-600 dark:text-red-400"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">本月异常总数</p>
              <h3 className="text-2xl font-bold mt-1">
                {report.anomalySummary.reduce((sum, item) => sum + item.count, 0)}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <i className="fa-solid fa-file-exclamation text-purple-600 dark:text-purple-400"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">已处理异常</p>
              <h3 className="text-2xl font-bold mt-1 text-green-600 dark:text-green-400">
                {anomalies.filter(a => a.status === AnomalyStatus.HANDLED).length}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <i className="fa-solid fa-check-circle text-green-600 dark:text-green-400"></i>
            </div>
          </div>
        </div>
      </div>
      
      {/* 安全概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">总扫描次数</p>
              <h3 className="text-2xl font-bold mt-1">24</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <i className="fa-solid fa-search text-blue-600 dark:text-blue-400"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">发现异常网站</p>
              <h3 className="text-2xl font-bold mt-1 text-red-600 dark:text-red-400">
                3
              </h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <i className="fa-solid fa-exclamation-triangle text-red-600 dark:text-red-400"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">已修复异常</p>
              <h3 className="text-2xl font-bold mt-1 text-green-600 dark:text-green-400">
                12
              </h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <i className="fa-solid fa-check-circle text-green-600 dark:text-green-400"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">上次扫描时间</p>
              <h3 className="text-2xl font-bold mt-1">
                {new Date().toLocaleString('zh-CN', { 
                  month: '2-digit', 
                  day: '2-digit', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <i className="fa-solid fa-clock text-purple-600 dark:text-purple-400"></i>
            </div>
          </div>
        </div>
      </div>
      
      {/* 安全风险详情 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="font-semibold text-lg">安全风险详情</h3>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select className="appearance-none bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-10 py-2.5">
                <option>所有网站</option>
                <option>企业官网</option>
                <option>产品展示页</option>
                <option>客户服务平台</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                <i className="fa-solid fa-chevron-down text-xs"></i>
              </div>
            </div>
            {!showAllAnomalies && anomalies.length > 3 ? (
              <button 
                className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                onClick={handleViewAllAnomalies}
              >
                查看全部异常
              </button>
            ) : showAllAnomalies ? (
              <button 
                className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                onClick={handleCollapseAnomalies}
              >
                收起
              </button>
            ) : null}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">网站名称</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">异常类型</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">扫描变化</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">上次扫描</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {displayedAnomalies.map((anomaly) => (
                <tr key={anomaly.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium">{anomaly.websiteName}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                      {anomaly.websiteUrl}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${anomalyTypeColorMap[anomaly.type]}`}>
                      {anomalyTypeTextMap[anomaly.type]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {anomaly.scanChanges && (
                      <div className="space-y-1">
                        {anomaly.scanChanges.added && anomaly.scanChanges.added > 0 && (
                          <div className="flex items-center text-green-600 text-sm">
                            <i className="fa-solid fa-plus-circle mr-1"></i>
                            <span>新增 {anomaly.scanChanges.added} 处</span>
                          </div>
                        )}
                        {anomaly.scanChanges.removed && anomaly.scanChanges.removed > 0 && (
                          <div className="flex items-center text-red-600 text-sm">
                            <i className="fa-solid fa-minus-circle mr-1"></i>
                            <span>已修复 {anomaly.scanChanges.removed} 处</span>
                          </div>
                        )}
                        {anomaly.scanChanges.changed && anomaly.scanChanges.changed > 0 && (
                          <div className="flex items-center text-yellow-600 text-sm">
                            <i className="fa-solid fa-exclamation-circle mr-1"></i>
                            <span>变化 {anomaly.scanChanges.changed} 处</span>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDateTime(anomaly.detectedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${anomalyStatusColorMap[anomaly.status]}`}>
                      {anomalyStatusTextMap[anomaly.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button 
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-3"
                      onClick={() => handleViewAnomalyDetail(anomaly)}
                    >
                      详情
                    </button>
                    {anomaly.status === AnomalyStatus.PENDING && (
                       <button 
                         className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                         onClick={() => handleProcessAnomaly(anomaly.id)}
                       >
                         处理
                       </button>
                     )}
                  </td>
                </tr>
              ))}
              {displayedAnomalies.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    暂无异常记录
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* 异常详情模态框 */}
      {showAnomalyDetail && selectedAnomaly && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">异常详情</h3>
              <button 
                onClick={handleCloseAnomalyDetail}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <i className="fa-solid fa-times text-xl"></i>
              </button>
            </div>
            
            <div className="p-5 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">网站名称</h4>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedAnomaly.websiteName}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">网站URL</h4>
                  <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 break-all">
                    {selectedAnomaly.websiteUrl}
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">异常类型</h4>
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${anomalyTypeColorMap[selectedAnomaly.type]}`}>
                  {anomalyTypeTextMap[selectedAnomaly.type]}
                </span>
              </div>
              
              <div>
                 <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">网站路径</h4>
                 <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg font-mono text-sm text-gray-900 dark:text-white">
                   <div>URL: {selectedAnomaly.websiteUrl}</div>
                   <div>完整路径: {selectedAnomaly.websiteUrl}{selectedAnomaly.position}</div>
                 </div>
                 <div className="mt-4">
                   <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">异常检测原因</h4>
                   <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg text-sm text-gray-900 dark:text-white">
                     {selectedAnomaly.type === AnomalyType.HIDDEN_LINK && (
                       <>
                         <p>• 扫描时检测到底部区域存在隐藏链接元素</p>
                         <p>• 链接使用CSS隐藏技术（display:none或visibility:hidden）</p>
                         <p>• 链接指向未授权的可疑域名</p>
                         <p>• 访问返回404可能是攻击者已移除链接或链接已失效</p>
                       </>
                     )}
                     {selectedAnomaly.type === AnomalyType.TAMPERING && (
                       <>
                         <p>• 页面内容与历史基线比对差异超过5%</p>
                         <p>• 关键HTML元素结构发生变化</p>
                         <p>• 检测到未授权的内容修改</p>
                       </>
                     )}
                     {selectedAnomaly.type === AnomalyType.REACTIONARY_CONTENT && (
                       <>
                         <p>• 文本内容中检测到敏感关键词</p>
                         <p>• 语义分析判定内容存在风险倾向</p>
                         <p>• 内容上下文与网站正常主题不符</p>
                       </>
                     )}
                   </div>
                 </div>
              </div>
              
              <div>
                 <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">异常内容</h4>
                 <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-gray-900 dark:text-white font-mono text-sm whitespace-pre-wrap">
                   {selectedAnomaly.content}
                   {selectedAnomaly.suspiciousDomains && selectedAnomaly.suspiciousDomains.length > 0 && (
                     <>
                       <div className="mt-3 text-red-600 dark:text-red-400">检测到可疑域名:</div>
                       <ul className="list-disc pl-5 mt-1 space-y-1">
                         {selectedAnomaly.suspiciousDomains.map((domain, index) => (
                           <li key={index}>{domain}</li>
                         ))}
                       </ul>
                       <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic">
                         注: 这些域名可能通过CSS隐藏技术、JavaScript动态加载或已被临时移除等方式存在于页面代码中，即使直接访问URL时不可见。系统在扫描时捕获到这些潜在风险链接。
                       </div>
                     </>
                   )}
                 </div>
              </div>
              
              {/* 风险评估 */}
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-2 flex items-center">
                  <i className="fa-solid fa-exclamation-triangle mr-2"></i>风险评估
                </h4>
                <p className="text-amber-700 dark:text-amber-400 text-sm">
                  {selectedAnomaly.type === AnomalyType.TAMPERING ? "网站内容被篡改可能导致用户误导、品牌损害或法律风险，建议立即处理。" : ""}
                  {selectedAnomaly.type === AnomalyType.HIDDEN_LINK ? "检测到的隐藏链接可能指向恶意网站，可能导致搜索引擎惩罚或用户安全风险。" : ""}
                  {selectedAnomaly.type === AnomalyType.REACTIONARY_CONTENT ? "检测到的反动内容可能违反法律法规和平台政策，存在严重法律风险，必须立即处理。" : ""}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">检测时间</h4>
                  <p className="text-gray-900 dark:text-white">{formatDateTime(selectedAnomaly.detectedAt)}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">状态</h4>
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${anomalyStatusColorMap[selectedAnomaly.status]}`}>
                    {anomalyStatusTextMap[selectedAnomaly.status]}
                  </span>
                </div>
              </div>
              
              {selectedAnomaly.status !== AnomalyStatus.PENDING && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">处理信息</h4>
                  <p className="text-gray-900 dark:text-white">
                    处理人: {selectedAnomaly.handledBy || '未知'}
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    处理时间: {selectedAnomaly.handledAt ? formatDateTime(selectedAnomaly.handledAt) : '未知'}
                  </p>
                </div>
              )}
            </div>
            
            <div className="p-5 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button 
                onClick={handleCloseAnomalyDetail}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityReport;