import { Anomaly, AnomalyStatus, AnomalyType } from '@/types';

// 模拟异常记录数据
export const mockAnomalies: Anomaly[] = [
  {
    id: 'anom-001',
    websiteId: '2',
    websiteName: '产品展示页',
    websiteUrl: 'https://products.example-corp.com',
    type: AnomalyType.TAMPERING,
    content: '首页banner图片被替换为不明图片',
  position: '/banner',
    detectedAt: '2025-07-24T15:15:00',
    status: AnomalyStatus.PENDING,
    scanChanges: {
      added: 1,
      removed: 0,
      changed: 0
    },
    previousScanAt: '2025-07-23T15:15:00'
  },
  {
    id: 'anom-002',
    websiteId: '3',
    websiteName: '客户服务平台',
    websiteUrl: 'https://service.example-corp.com',
    type: AnomalyType.HIDDEN_LINK,
    content: '页面底部存在隐藏链接指向可疑网站',
  position: '/help-center/footer',
    detectedAt: '2025-07-24T12:00:00',
    status: AnomalyStatus.PENDING,
    scanChanges: {
      added: 0,
      removed: 0,
      changed: 1
    },
    previousScanAt: '2025-07-23T12:00:00'
  },
  {
    id: 'anom-003',
    websiteId: '2',
    websiteName: '产品展示页',
    websiteUrl: 'https://products.example-corp.com',
    type: AnomalyType.REACTIONARY_CONTENT,
    content: '产品描述中发现不当文字内容',
  position: '/products/specifications',
    detectedAt: '2025-07-24T10:30:00',
    status: AnomalyStatus.HANDLED,
    handledAt: '2025-07-24T11:45:00',
    handledBy: '管理员',
    scanChanges: {
      added: 0,
      removed: 1,
      changed: 0
    },
    previousScanAt: '2025-07-23T10:30:00'
  },
  {
    id: 'anom-004',
    websiteId: '6',
    websiteName: 'Cacts网站',
    websiteUrl: 'https://cacts.cn',
     type: AnomalyType.HIDDEN_LINK,
     content: '页面底部发现隐藏链接指向可疑域名。检测到使用CSS隐藏技术的<a>标签，链接目标为未授权域名，可能存在暗链风险。',
   position: '/footer',
     detectedAt: '2025-07-24T19:22:02',
     status: AnomalyStatus.PENDING,
     scanChanges: {
       added: 1,
       removed: 0,
       changed: 0
     },
     previousScanAt: null,
     suspiciousDomains: ['malicious-example.com', 'suspicious-domain.net']
   },
  {
    id: 'anom-005',
    websiteId: '6',
    websiteName: 'Cacts网站',
    websiteUrl: 'https://cacts.cn',
     type: AnomalyType.HIDDEN_LINK,
     content: '页面底部发现隐藏链接指向可疑域名',
   position: '/admin',
     detectedAt: new Date().toISOString(),
     status: AnomalyStatus.PENDING,
     scanChanges: {
       added: 1,
       removed: 0,
       changed: 0
     },
     previousScanAt: null,
     suspiciousDomains: ['phishing-site.org', 'malware-distribution.com']
   }
];