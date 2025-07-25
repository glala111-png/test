import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { mockWebsites } from '@/mock/websites';
import { Website, WebsiteStatus } from '@/types';

// 网站状态样式映射
const statusStyleMap = {
  [WebsiteStatus.NORMAL]: {
    bgClass: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    icon: 'fa-check-circle',
    text: '正常'
  },
  [WebsiteStatus.WARNING]: {
    bgClass: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    icon: 'fa-exclamation-triangle',
    text: '警告'
  },
  [WebsiteStatus.ALERT]: {
    bgClass: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    icon: 'fa-times-circle',
    text: '异常'
  },
  [WebsiteStatus.OFFLINE]: {
    bgClass: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400',
    icon: 'fa-wifi-slash',
    text: '离线'
  }
};

// 格式化监测频率显示
const formatFrequency = (frequency) => {
  const { interval, unit } = frequency;
  const unitTextMap = {
    'minute': '分钟',
    'hour': '小时',
    'day': '天'
  };
  return `${interval} ${unitTextMap[unit]}${interval > 1 ? 's' : ''}`;
}

const WebsiteList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [websitesPerPage] = useState(10);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [scanningWebsites, setScanningWebsites] = useState<string[]>([]);
  
  // 初始化网站数据
  useEffect(() => {
    setWebsites(mockWebsites);
  }, []);
  
  // 查看网站详情
  const handleView = (website: Website) => {
    setSelectedWebsite(website);
    setShowDetailModal(true);
  };
  
  // 编辑网站
  const handleEdit = (id: string) => {
    navigate(`/websites/edit/${id}`);
  };
  
   // 删除网站
  const handleDelete = (id: string) => {
    const websiteToDelete = websites.find(website => website.id === id);
    
    if (websiteToDelete && window.confirm(`确定要删除网站 "${websiteToDelete.name}" 吗？此操作不可撤销。`)) {
      setWebsites(prevWebsites => prevWebsites.filter(website => website.id !== id));
      toast.success(`网站 "${websiteToDelete.name}" 已成功删除`);
      
      // 如果删除后当前页没有数据且不是第一页，则返回上一页
      if (currentWebsites.length === 1 && currentPage > 1) {
        setCurrentPage(prevPage => prevPage - 1);
      }
    }
  };
  
  // 主动扫描网站
  const handleScan = (id: string) => {
    // 将网站ID添加到扫描中列表，用于显示加载状态
    setScanningWebsites(prev => [...prev, id]);
    
    // 模拟扫描过程
    setTimeout(() => {
      // 更新网站列表数据
      setWebsites(prevWebsites => 
        prevWebsites.map(website => 
          website.id === id 
            ? { ...website, lastChecked: new Date().toISOString() } 
            : website
        )
      );
      
      // 从扫描中列表移除网站ID
      setScanningWebsites(prev => prev.filter(websiteId => websiteId !== id));
      
      // 显示成功消息
      const website = websites.find(w => w.id === id);
      if (website) {
        toast.success(`网站 "${website.name}" 扫描完成，已更新监测时间`);
      }
    }, 2000); // 模拟2秒的扫描过程
  };
  
  // 过滤网站列表
  const filteredWebsites = websites.filter(website => 
    website.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    website.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    website.enterprise.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // 分页逻辑
  const indexOfLastWebsite = currentPage * websitesPerPage;
  const indexOfFirstWebsite = indexOfLastWebsite - websitesPerPage;
  const currentWebsites = filteredWebsites.slice(indexOfFirstWebsite, indexOfLastWebsite);
  const totalPages = Math.ceil(filteredWebsites.length / websitesPerPage);
  
  // 处理分页变化
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">网站管理</h1>
          <p className="text-gray-600 dark:text-gray-400">管理和配置您的监测网站</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索网站..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full sm:w-64"
            />
            <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
          
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
              <i className="fa-solid fa-filter mr-2"></i>筛选
            </button>
            
            <Link to="/websites/add">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center">
                <i className="fa-solid fa-plus mr-2"></i>添加网站
              </button>
            </Link>
            
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center">
              <i className="fa-solid fa-file-import mr-2"></i>批量导入
            </button>
          </div>
        </div>
      </div>
      
      {/* 网站列表表格 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">网站名称</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">所属企业</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">监测频率</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">最后检查</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">状态</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentWebsites.map((website) => (
                <tr key={website.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                     <div className="font-medium text-gray-900 dark:text-white">{website.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white truncate max-w-xs">{website.url}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{website.enterprise}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{formatFrequency(website.monitoringFrequency)}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {website.monitoringFrequency.smartAdjust ? '智能调整: 开启' : ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(website.lastChecked).toLocaleString('zh-CN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center ${statusStyleMap[website.status].bgClass} px-2.5 py-0.5 rounded-full text-xs font-medium`}>
                      <i className={`fa-solid ${statusStyleMap[website.status].icon} mr-1.5`}></i>
                      {statusStyleMap[website.status].text}
                    </div>
                  </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3 transition-colors duration-200"
                        onClick={() => handleView(website)}
                      >
                        查看
                      </button>
                      <button 
                        className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 mr-3 transition-colors duration-200"
                        onClick={() => handleScan(website.id)}
                        disabled={scanningWebsites.includes(website.id)}
                      >
                        {scanningWebsites.includes(website.id) ? (
                          <>
                            <i className="fa-solid fa-spinner fa-spin mr-1"></i>扫描中
                          </>
                        ) : (
                          <>
                            <i className="fa-solid fa-search-plus mr-1"></i>扫描
                          </>
                        )}
                      </button>
                      <button 
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-3 transition-colors duration-200"
                        onClick={() => handleEdit(website.id)}
                      >
                        编辑
                      </button>
                      <button 
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors duration-200"
                        onClick={() => handleDelete(website.id)}
                      >
                        删除
                      </button>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* 分页控件 */}
         {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              显示 {indexOfFirstWebsite + 1} 到 {Math.min(indexOfLastWebsite, filteredWebsites.length)} 条，共 {filteredWebsites.length} 条
            </div>
            <div className="flex space-x-1">
              <button 
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                首页
              </button>
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 rounded border text-sm ${
                    currentPage === i + 1
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
              <button 
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                末页
              </button>
       </div>
     </div>
   )}
   
   {/* 网站详情模态框 - 移至分页控件外部，确保始终可访问 */}
   {showDetailModal && selectedWebsite && (
     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
       <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
         <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
           <h3 className="text-xl font-bold text-gray-900 dark:text-white">网站详情</h3>
           <button 
             onClick={() => setShowDetailModal(false)}
             className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
           >
             <i className="fa-solid fa-times text-xl"></i>
           </button>
         </div>
         
         <div className="p-6 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
               <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">网站名称</h4>
               <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedWebsite.name}</p>
             </div>
             
             <div>
               <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">网站URL</h4>
               <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 break-all">
                 {selectedWebsite.url}
               </p>
             </div>
             
             <div>
               <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">所属企业</h4>
               <p className="text-gray-900 dark:text-white">{selectedWebsite.enterprise}</p>
             </div>
             
             <div>
               <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">状态</h4>
               <div className={`inline-flex items-center ${statusStyleMap[selectedWebsite.status].bgClass} px-2.5 py-0.5 rounded-full text-xs font-medium`}>
                 <i className={`fa-solid ${statusStyleMap[selectedWebsite.status].icon} mr-1.5`}></i>
                 {statusStyleMap[selectedWebsite.status].text}
               </div>
             </div>
           </div>
           
           <div>
             <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">监测配置</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                 <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">监测频率</h5>
                 <p className="text-gray-900 dark:text-white">{formatFrequency(selectedWebsite.monitoringFrequency)}</p>
                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                   {selectedWebsite.monitoringFrequency.smartAdjust ? '智能调整: 开启' : '智能调整: 关闭'}
                 </p>
               </div>
               
               <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                 <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">监测内容</h5>
                 <ul className="space-y-1 text-sm">
                   {selectedWebsite.monitoringContent.tampering && (
                     <li className="flex items-center text-gray-900 dark:text-white">
                       <i className="fa-solid fa-check text-green-500 mr-2"></i>网站篡改监测
                     </li>
                   )}
                   {selectedWebsite.monitoringContent.hiddenLinks && (
                     <li className="flex items-center text-gray-900 dark:text-white">
                       <i className="fa-solid fa-check text-green-500 mr-2"></i>暗链监测
                     </li>
                   )}
                   {selectedWebsite.monitoringContent.reactionaryContent && (
                     <li className="flex items-center text-gray-900 dark:text-white">
                       <i className="fa-solid fa-check text-green-500 mr-2"></i>反动内容监测
                     </li>
                   )}
                 </ul>
               </div>
             </div>
           </div>
           
           <div>
             <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">最近检查时间</h4>
             <p className="text-gray-900 dark:text-white">{new Date(selectedWebsite.lastChecked).toLocaleString('zh-CN')}</p>
           </div>
         </div>
         
         <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
           <button 
             onClick={() => {
               setShowDetailModal(false);
               handleEdit(selectedWebsite.id);
             }}
             className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium mr-3"
           >
             编辑网站
           </button>
           <button 
             onClick={() => setShowDetailModal(false)}
             className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
           >
             关闭
           </button>
         </div>
       </div>
     </div>
   )}
      </div>
    </div>
  );
};

export default WebsiteList;
