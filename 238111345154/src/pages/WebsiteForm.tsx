import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { mockWebsites } from '@/mock/websites';
import { Website } from '@/types';

// 表单验证schema
const websiteSchema = z.object({
  name: z.string().min(2, '网站名称至少需要2个字符').max(100, '网站名称不能超过100个字符'),
  url: z.string().url('请输入有效的URL地址'),
  enterprise: z.string().min(2, '企业名称至少需要2个字符').max(100, '企业名称不能超过100个字符'),
  monitoringInterval: z.string().min(1, '请输入监测间隔'),
  monitoringUnit: z.enum(['minute', 'hour', 'day']),
  smartAdjust: z.boolean(),
  tampering: z.boolean(),
  hiddenLinks: z.boolean(),
  reactionaryContent: z.boolean(),
});

// 时间单位选项
const monitoringUnits = [
  { value: 'minute', label: '分钟' },
  { value: 'hour', label: '小时' },
  { value: 'day', label: '天' }
];

const WebsiteForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    enterprise: '',
    monitoringInterval: '30',
    monitoringUnit: 'minute',
    smartAdjust: true,
    tampering: true,
    hiddenLinks: true,
    reactionaryContent: true,
  });
  
  useEffect(() => {
    if (isEditMode) {
      // 在编辑模式下，从模拟数据中获取网站信息
      const websiteToEdit = mockWebsites.find(website => website.id === id);
      if (websiteToEdit) {
        setFormData({
          name: websiteToEdit.name,
          url: websiteToEdit.url,
          enterprise: websiteToEdit.enterprise,
          monitoringInterval: websiteToEdit.monitoringFrequency.interval.toString(),
          monitoringUnit: websiteToEdit.monitoringFrequency.unit,
          smartAdjust: websiteToEdit.monitoringFrequency.smartAdjust,
          tampering: websiteToEdit.monitoringContent.tampering,
          hiddenLinks: websiteToEdit.monitoringContent.hiddenLinks,
          reactionaryContent: websiteToEdit.monitoringContent.reactionaryContent,
        });
      } else {
        toast.error('未找到网站信息');
        navigate('/websites');
      }
    }
  }, [id, isEditMode, navigate]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 处理表单字段变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // 表单提交处理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    try {
      websiteSchema.parse(formData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errorMessages: Record<string, string> = {};
        err.errors.forEach(error => {
          errorMessages[error.path[0]] = error.message;
        });
        setErrors(errorMessages);
        return;
      }
    }
    
    // 验证监测频率范围
    const interval = parseInt(formData.monitoringInterval);
    if (formData.monitoringUnit === 'minute' && (interval < 5 || interval > 60)) {
      setErrors({ monitoringInterval: '分钟监测间隔必须在5-60之间' });
      return;
    }
    if (formData.monitoringUnit === 'hour' && (interval < 1 || interval > 24)) {
      setErrors({ monitoringInterval: '小时监测间隔必须在1-24之间' });
      return;
    }
    if (formData.monitoringUnit === 'day' && (interval < 1 || interval > 7)) {
      setErrors({ monitoringInterval: '天监测间隔必须在1-7之间' });
      return;
    }
    
    // 验证至少选择一种监测内容
    if (!formData.tampering && !formData.hiddenLinks && !formData.reactionaryContent) {
      toast.error('至少需要选择一种监测内容');
      return;
    }
     
     // 验证至少选择一种监测内容
     if (!formData.tampering && !formData.hiddenLinks && !formData.reactionaryContent) {
       toast.error('至少需要选择一种监测内容');
       return;
     }
     

    setIsSubmitting(true);
    
      try {
       // 在实际应用中，这里会发送API请求保存网站信息
       // 这里使用setTimeout模拟API请求延迟
       setTimeout(() => {
         if (isEditMode) {
           // 更新模拟数据
           const index = mockWebsites.findIndex(website => website.id === id);
           if (index !== -1) {
             const updatedWebsite = {
               ...mockWebsites[index],
               name: formData.name,
               url: formData.url,
               enterprise: formData.enterprise,
               monitoringFrequency: {
                 interval: parseInt(formData.monitoringInterval),
                 unit: formData.monitoringUnit,
                 smartAdjust: formData.smartAdjust
               },
               monitoringContent: {
                 tampering: formData.tampering,
                 hiddenLinks: formData.hiddenLinks,
                 reactionaryContent: formData.reactionaryContent
               }
             };
             // 更新模拟数据数组
             mockWebsites[index] = updatedWebsite;
           }
           toast.success('网站更新成功！');
         } else {
           toast.success('网站添加成功！');
         }
         navigate('/websites');
       }, 1500);
     } catch (error) {
      if (isEditMode) {
        toast.error('更新网站失败，请重试');
      } else {
        toast.error('添加网站失败，请重试');
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">{isEditMode ? '编辑网站' : '添加网站'}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {isEditMode ? '修改网站的基本信息和监测选项' : '配置需要监测的网站基本信息和监测选项'}
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 基本信息部分 */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <i className="fa-solid fa-info-circle text-blue-600 dark:text-blue-400 mr-2"></i>
              基本信息
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  网站名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  网站URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className={`w-full px-4 py-2 border ${errors.url ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
                />
                {errors.url && (
                  <p className="mt-1 text-sm text-red-500">{errors.url}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="enterprise" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  所属企业 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="enterprise"
                  name="enterprise"
                  value={formData.enterprise}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${errors.enterprise ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
                />
                {errors.enterprise && (
                  <p className="mt-1 text-sm text-red-500">{errors.enterprise}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* 监测配置部分 */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <i className="fa-solid fa-cog text-blue-600 dark:text-blue-400 mr-2"></i>
              监测配置
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  监测频率 <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    id="monitoringInterval"
                    name="monitoringInterval"
                    value={formData.monitoringInterval}
                    onChange={handleChange}
                    min="1"
                    className={`w-24 px-4 py-2 border ${errors.monitoringInterval ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
                  />
                  <select
                    id="monitoringUnit"
                    name="monitoringUnit"
                    value={formData.monitoringUnit}
                    onChange={handleChange}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    {monitoringUnits.map(unit => (
                      <option key={unit.value} value={unit.value}>{unit.label}</option>
                    ))}
                  </select>
                </div>
                {errors.monitoringInterval && (
                  <p className="mt-1 text-sm text-red-500">{errors.monitoringInterval}</p>
                )}
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <ul className="list-disc pl-5">
                    <li>分钟: 5-60分钟</li>
                    <li>小时: 1-24小时</li>
                    <li>天: 1-7天</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="smartAdjust"
                  name="smartAdjust"
                  checked={formData.smartAdjust}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 dark:text-blue-500 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                />
                <label htmlFor="smartAdjust" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  智能调整监测频率
                </label>
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                监测内容 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="tampering"name="tampering"
                      type="checkbox"
                      checked={formData.tampering}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 dark:text-blue-500 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="tampering" className="font-medium text-gray-700 dark:text-gray-300">网站篡改监测</label>
                    <p className="text-gray-500 dark:text-gray-400">监测网站内容和结构是否被篡改</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="hiddenLinks"
                      name="hiddenLinks"
                      type="checkbox"
                      checked={formData.hiddenLinks}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 dark:text-blue-500 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="hiddenLinks" className="font-medium text-gray-700 dark:text-gray-300">暗链监测</label>
                    <p className="text-gray-500 dark:text-gray-400">检测网站中隐藏的恶意链接</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="reactionaryContent"
                      name="reactionaryContent"
                      type="checkbox"
                      checked={formData.reactionaryContent}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 dark:text-blue-500 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="reactionaryContent" className="font-medium text-gray-700 dark:text-gray-300">反动内容监测</label>
                    <p className="text-gray-500 dark:text-gray-400">识别网页中的反动文字和图片</p>
                  </div>
                </div>
              </div>
            </div>
            
             
          </div>
          
          {/* 操作按钮 */}
          <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/websites')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isSubmitting 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                  保存中...
                </>
              ) : (
                '保存网站'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WebsiteForm;
