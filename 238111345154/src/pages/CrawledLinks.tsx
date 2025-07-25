import { useState } from 'react';
import { mockCrawledLinks } from '@/mock/crawledLinks';
import { CrawledLink, MaliciousFieldDetection } from '@/types';

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

// 状态样式映射
const statusStyleMap = {
  'success': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  'error': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
};

// 状态文本映射
const statusTextMap = {
  'success': '成功',
  'error': '失败'
};

// 恶意链接样式
const maliciousStyle = 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
const safeStyle = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';

// 恶意字段详情展示组件
const MaliciousFieldDetail = ({ field }: { field: MaliciousFieldDetection }) => {
  return (
    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
      <div className="flex justify-between items-start mb-2">
        <h5 className="font-medium text-red-800 dark:text-red-300">{field.field}</h5>
        <span className="text-xs px-2 py-0.5 rounded-full bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-300">
          风险度: {(field.confidence * 100).toFixed(0)}%
        </span>
      </div>
      <div className="space-y-2 text-sm">
        <div>
          <span className="text-gray-500 dark:text-gray-400">匹配模式:</span>
          <div className="font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 text-xs overflow-x-auto">
            {field.pattern}
          </div>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">位置:</span>
          <div className="mt-1">行 {field.position.line}, 列 {field.position.column}</div>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">文件路径:</span>
          <div className="mt-1 font-mono text-blue-600 dark:text-blue-400 text-xs break-all">{field.filePath}</div>
        </div>
      </div>
    </div>
  );
};

const CrawledLinks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [linksPerPage] = useState(10);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedLink, setSelectedLink] = useState<CrawledLink | null>(null);
  const [filterMalicious, setFilterMalicious] = useState(false);
  
  // 过滤爬取链接
  const filteredLinks = mockCrawledLinks.filter(link => {
    // 恶意链接过滤
    if (filterMalicious && !link.isMalicious) return false;
    
    // 搜索词过滤
    return link.websiteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           link.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
           link.extractedLinks.some(extractedLink => 
             extractedLink.toLowerCase().includes(searchTerm.toLowerCase())
           );
  });
  
  // 分页逻辑
  const indexOfLastLink = currentPage * linksPerPage;
  const indexOfFirstLink = indexOfLastLink - linksPerPage;
  const currentLinks = filteredLinks.slice(indexOfFirstLink, indexOfLastLink);
  const totalPages = Math.ceil(filteredLinks.length / linksPerPage);
  
  // 处理分页变化
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  
  // 查看链接详情
  const handleViewDetails = (link: CrawledLink) => {
    setSelectedLink(link);
    setShowDetailModal(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">爬取链接管理</h1>
          <p className="text-gray-600 dark:text-gray-400">查看所有站点监测过程中爬取到的URL及提取的链接</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索网站名称、URL或提取的链接..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full md:w-64"
            />
            <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="filterMalicious"
              checked={filterMalicious}
              onChange={(e) => setFilterMalicious(e.target.checked)}
              className="h-4 w-4 text-red-600 dark:text-red-500 focus:ring-red-500 border-gray-300 dark:border-gray-600 rounded"
            />
            <label htmlFor="filterMalicious" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              仅显示恶意链接
            </label>
          </div>
        </div>
      </div>
      
      {/* 爬取链接表格 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">网站名称</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">递归深度</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">爬取URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">提取链接数</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">安全状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">爬取时间</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentLinks.map((link) => (
                <tr key={link.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900 dark:text-white">{link.websiteName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium">
                      {link.depth}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white truncate max-w-xs">{link.url}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white truncate max-w-xs">{link.url}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{link.extractedLinks.length}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center ${link.isMalicious ? maliciousStyle : safeStyle} px-2.5 py-0.5 rounded-full text-xs font-medium`}>
                      <i className={`fa-solid ${link.isMalicious ? 'fa-exclamation-triangle' : 'fa-check-circle'} mr-1.5`}></i>
                      {link.isMalicious ? '检测到恶意字段' : '安全'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDateTime(link.crawledAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors duration-200"
                      onClick={() => handleViewDetails(link)}
                    >
                      查看详情
                    </button>
                  </td>
                </tr>
              ))}
              {currentLinks.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    暂无爬取链接数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* 分页控件 */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              显示 {indexOfFirstLink + 1} 到 {Math.min(indexOfLastLink, filteredLinks.length)} 条，共 {filteredLinks.length} 条
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
              
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                // 计算要显示的页码，实现页码截断逻辑
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded border text-sm ${
                      currentPage === pageNum
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
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
      </div>
      
      {/* 提取链接详情模态框 */}
      {showDetailModal && selectedLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">爬取链接详情</h3>
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
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">递归深度</h4>
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium text-lg">
                  {selectedLink.depth}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {selectedLink.depth >= 3 ? '已达到最大递归深度限制' : `距离最大深度还剩 ${3 - selectedLink.depth} 层`}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">网站URL</h4>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedLink.websiteName}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">爬取URL</h4>
                  <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 break-all">
                    {selectedLink.url}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">爬取时间</h4>
                  <p className="text-gray-900 dark:text-white">{formatDateTime(selectedLink.crawledAt)}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">安全状态</h4>
                  <div className={`inline-flex items-center ${selectedLink.isMalicious ? maliciousStyle : safeStyle} px-2.5 py-0.5 rounded-full text-xs font-medium`}>
                    <i className={`fa-solid ${selectedLink.isMalicious ? 'fa-exclamation-triangle' : 'fa-check-circle'} mr-1.5`}></i>
                    {selectedLink.isMalicious ? '检测到恶意字段' : '安全'}
                  </div>
                </div>
              </div>
              
              {/* 恶意字段检测结果 */}
              {selectedLink.isMalicious && selectedLink.maliciousFields && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center">
                    <i className="fa-solid fa-exclamation-triangle text-red-500 mr-2"></i>
                    恶意字段检测结果 ({selectedLink.maliciousFields.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedLink.maliciousFields.map((field, index) => (
                      <MaliciousFieldDetail key={index} field={field} />
                    ))}
                  </div>
                </div>
              )}
              
              {/* 提取的链接 */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">提取的链接 ({selectedLink.extractedLinks.length})</h4>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg max-h-96 overflow-y-auto">
                  <ul className="space-y-2">
                    {selectedLink.extractedLinks.map((link, index) => {
                      // 判断链接是否为恶意链接
                      const isMaliciousLink = link.includes('malicious') || 
                                            link.includes('phishing') || 
                                            link.includes('hack');
                      
                      return (
                        <li key={index} className="flex items-start">
                          <i className={`fa-solid ${isMaliciousLink ? 'fa-exclamation-circle text-red-500' : 'fa-link text-blue-500'} mt-1 mr-2 flex-shrink-0`}></i>
                          <a 
                            href={link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`text-sm break-all ${isMaliciousLink ? 'text-red-600 dark:text-red-400 font-medium' : 'text-blue-600 dark:text-blue-400'} hover:underline`}
                          >
                            {link}
                            {isMaliciousLink && (
                              <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                可疑
                              </span>
                            )}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button 
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                关闭
              </button>
              {selectedLink.isMalicious && (
                <button 
                  className="ml-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <i className="fa-solid fa-shield-alt mr-2"></i>处理威胁
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default CrawledLinks;