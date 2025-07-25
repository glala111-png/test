// 网站信息类型定义
export interface Website {
  id: string;
  name: string;
  url: string;
  enterprise: string;
  monitoringFrequency: MonitoringFrequency;
  monitoringContent: MonitoringContent;
  lastChecked: string;
  status: WebsiteStatus;
  createdAt: string;
}

// 监测频率类型
export type MonitoringFrequency = {
  interval: number; // 间隔时间
  unit: 'minute' | 'hour' | 'day'; // 时间单位
  smartAdjust: boolean; // 是否智能调整
};

// 监测内容类型
export type MonitoringContent = {
  tampering: boolean; // 篡改监测
  hiddenLinks: boolean; // 暗链监测
  reactionaryContent: boolean; // 反动内容监测
};

// 通知方式枚举
export enum NotificationMethod {
  EMAIL = 'email',
  SMS = 'sms',
  SYSTEM = 'system',
}

// 网站状态枚举
export enum WebsiteStatus {
  NORMAL = 'normal',
  WARNING = 'warning',
  ALERT = 'alert',
  OFFLINE = 'offline',
}

// 异常记录类型
export interface Anomaly {
  id: string;
  websiteId: string;
  websiteName: string;
  websiteUrl: string;
  type: AnomalyType;
  content: string;
  position: string;
  detectedAt: string;
  status: AnomalyStatus;
  handledAt?: string;
  handledBy?: string;
  scanChanges?: {
    added: number;
    removed: number;
    changed: number;
  };
  previousScanAt?: string;
  suspiciousDomains?: string[]; // 检测到的可疑域名
}

// 异常类型枚举
export enum AnomalyType {
  TAMPERING = 'tampering', // 篡改
  HIDDEN_LINK = 'hidden_link', // 暗链
  REACTIONARY_CONTENT = 'reactionary_content', // 反动内容
}

// 异常状态枚举
export enum AnomalyStatus {
  PENDING = 'pending', // 待处理
  HANDLED = 'handled', // 已处理
  IGNORED = 'ignored', // 已忽略
}

// 安全报告类型
export interface SecurityReport {
  id: string;
  enterprise: string;
  period: {
    start: string;
    end: string;
  };
  websiteCount: number;
  normalCount: number;
  warningCount: number;
  alertCount: number;
  offlineCount: number;
  anomalySummary: AnomalySummary[];
  trendData: TrendDataPoint[];
}

// 异常摘要类型
export interface AnomalySummary {
  type: AnomalyType;
  count: number;
  percentage: number;
}

// 趋势数据点类型
export interface TrendDataPoint {
  date: string;
  anomalyCount: number;
}

/**
 * 恶意字段检测结果类型
 */
export interface MaliciousFieldDetection {
  field: string;
  pattern: string;
  position: {
    line: number;
    column: number;
  };
  filePath: string;
  confidence: number;
}

/**
 * 爬取链接类型
 */
export interface CrawledLink {
  id: string;
  websiteId: string;
  websiteName: string;
  url: string;
  depth: number; // 递归深度
  extractedLinks: string[];
  isMalicious: boolean;
  maliciousFields?: MaliciousFieldDetection[];
  crawledAt: string;
  status: 'success' | 'error';
}
