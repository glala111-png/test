import { SecurityReport, AnomalyType } from '@/types';

// 模拟安全报告数据
export const mockSecurityReport: SecurityReport = {
  id: 'rpt-202507',
  enterprise: '示例科技有限公司',
  period: {
    start: '2025-07-01T00:00:00',
    end: '2025-07-24T23:59:59'
  },
  websiteCount: 5,
  normalCount: 2,
  warningCount: 1,
  alertCount: 1,
  offlineCount: 1,
  anomalySummary: [
    {
      type: AnomalyType.TAMPERING,
      count: 8,
      percentage: 50
    },
    {
      type: AnomalyType.HIDDEN_LINK,
      count: 5,
      percentage: 31.25
    },
    {
      type: AnomalyType.REACTIONARY_CONTENT,
      count: 3,
      percentage: 18.75
    }
  ],
  trendData: [
    { date: '07/01', anomalyCount: 2 },
    { date: '07/05', anomalyCount: 1 },
    { date: '07/10', anomalyCount: 3 },
    { date: '07/15', anomalyCount: 2 },
    { date: '07/20', anomalyCount: 4 },
    { date: '07/23', anomalyCount: 1 },
    { date: '07/24', anomalyCount: 2 }
  ]
};
