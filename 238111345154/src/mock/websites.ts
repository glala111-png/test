import { Website, WebsiteStatus } from '@/types';

// 模拟网站数据
export const mockWebsites: Website[] = [
  {
    id: '1',
    name: '企业官网',
    url: 'https://www.example-corp.com',
    enterprise: '示例科技有限公司',
    monitoringFrequency: {
      interval: 30,
      unit: 'minute',
      smartAdjust: true
    },
    monitoringContent: {
      tampering: true,
      hiddenLinks: true,
      reactionaryContent: true
    },
    lastChecked: '2025-07-24T14:30:00',
    status: WebsiteStatus.NORMAL,
    createdAt: '2025-06-15T09:20:00'
  },
  {
    id: '2',
    name: '产品展示页',
    url: 'https://products.example-corp.com',
    enterprise: '示例科技有限公司',
    monitoringFrequency: {
      interval: 1,
      unit: 'hour',
      smartAdjust: true
    },
    monitoringContent: {
      tampering: true,
      hiddenLinks: true,
      reactionaryContent: false
    },
    lastChecked: '2025-07-24T15:15:00',
    status: WebsiteStatus.ALERT,
    createdAt: '2025-06-20T14:10:00'
  },
  {
    id: '3',
    name: '客户服务平台',
    url: 'https://service.example-corp.com',
    enterprise: '示例科技有限公司',
    monitoringFrequency: {
      interval: 6,
      unit: 'hour',
      smartAdjust: false
    },
    monitoringContent: {
      tampering: true,
      hiddenLinks: false,
      reactionaryContent: true
    },
    lastChecked: '2025-07-24T12:00:00',
    status: WebsiteStatus.WARNING,
    createdAt: '2025-07-01T10:30:00'
  },
  {
    id: '4',
    name: '员工内网',
    url: 'https://intranet.example-corp.com',
    enterprise: '示例科技有限公司',
    monitoringFrequency: {
      interval: 1,
      unit: 'day',
      smartAdjust: false
    },
    monitoringContent: {
      tampering: true,
      hiddenLinks: true,
      reactionaryContent: true
    },
    lastChecked: '2025-07-23T20:00:00',
    status: WebsiteStatus.OFFLINE,
    createdAt: '2025-05-10T16:45:00'
  },
  {
    id: '5',
    name: '品牌宣传站',
    url: 'https://brand.example-corp.com',
    enterprise: '示例科技有限公司',
    monitoringFrequency: {
      interval: 2,
      unit: 'hour',
      smartAdjust: true
    },
    monitoringContent: {
      tampering: true,
      hiddenLinks: true,
      reactionaryContent: true
    },
    lastChecked: '2025-07-24T15:00:00',
    status: WebsiteStatus.NORMAL,
    createdAt: '2025-07-10T11:20:00'
  },
  {
    id: '6',
    name: 'Cacts网站',
    url: 'https://cacts.cn',
    enterprise: '示例科技有限公司',
    monitoringFrequency: {
      interval: 1,
      unit: 'hour',
      smartAdjust: true
    },
    monitoringContent: {
      tampering: true,
      hiddenLinks: true,
      reactionaryContent: true
    },
    lastChecked: '2025-07-24T19:22:02',
    status: WebsiteStatus.ALERT,
    createdAt: '2025-07-24T19:20:00'
  }
];