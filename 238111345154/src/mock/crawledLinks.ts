import { CrawledLink } from '@/types';

/**
 * 模拟爬取链接数据 - 根据递归外链爬取模块生成
 */
export const mockCrawledLinks: CrawledLink[] = [
  {
    id: 'cl-001',
    websiteId: '6',
    websiteName: 'Cacts网站',
    url: 'https://cacts.cn',
    depth: 0,  // 起始页面，深度为0
    extractedLinks: [
      'https://cacts.cn/',
      'https://cacts.cn/about',
      'https://cacts.cn/products',
      'https://cacts.cn/contact',
      'https://cacts.cn/footer',
      'https://api.cacts.cn/data',
      'https://admin.cacts.cn/login',
      'https://third-party-analytics.com/track',
      'https://external-resource.com/lib/jquery',
      'https://cdn.cacts.cn/images/logo.png',
      'https://partner-site.com/promo',
      'https://social-share.com/share?url=https://cacts.cn'
    ],
    isMalicious: false,
    crawledAt: '2025-07-24T10:15:30',
    status: 'success'
  },
  {
    id: 'cl-002',
    websiteId: '6',
    websiteName: 'Cacts网站',
    url: 'https://cacts.cn/footer',
    depth: 1,  // 从起始页跳转，深度为1
    extractedLinks: [
      'https://malicious-example.com',
      'https://suspicious-domain.net',
      'https://cacts.cn/home',
      'https://phishing-site.org/login',
      'https://malicious-example.com/analytics.js',
      'https://malicious-example.com/tracking',
      'https://unknown-service.net/api/data',
      'https://suspicious-domain.net/redirect'
    ],
    isMalicious: true,
    maliciousFields: [
      {
        field: '恶意域名引用',
        pattern: '(https?:\\/\\/)?(www\\.)?(malicious|phishing|hack|attack)[^.]*\\.[a-z]{2,}',
        position: { line: 45, column: 12 },
        filePath: 'https://cacts.cn/footer',
        confidence: 0.92
      },
      {
        field: '隐藏链接',
        pattern: '<a[^>]*style\\s*=\\s*["\']?display:\\s*none["\']?[^>]*>',
        position: { line: 87, column: 8 },
        filePath: 'https://cacts.cn/footer',
        confidence: 0.88
      },
      {
        field: '恶意JavaScript',
        pattern: '<script[^>]*src\\s*=\\s*["\']https?:\\/\\/[^"\']*malicious[^"\']*["\']',
        position: { line: 56, column: 4 },
        filePath: 'https://cacts.cn/footer',
        confidence: 0.95
      }
    ],
    crawledAt: '2025-07-24T19:22:02',
    status: 'success'
  },
  {
    id: 'cl-006',
    websiteId: '6',
    websiteName: 'Cacts网站',
    url: 'https://third-party-analytics.com/track',
    depth: 1,  // 从起始页跳转，深度为1
    extractedLinks: [
      'https://third-party-analytics.com/script.js',
      'https://tracking-service.com/pixel',
      'https://advertising-network.com/ads',
      'https://unknown-domain.example/traffic'
    ],
    isMalicious: true,
    maliciousFields: [
      {
        field: '未授权跟踪代码',
        pattern: 'track\\(user_id|session_id|personal_data\\)',
        position: { line: 22, column: 15 },
        filePath: 'https://third-party-analytics.com/track',
        confidence: 0.85
      }
    ],
    crawledAt: '2025-07-24T19:23:15',
    status: 'success'
  },
  {
    id: 'cl-007',
    websiteId: '6',
    websiteName: 'Cacts网站',
    url: 'https://partner-site.com/promo',
    depth: 1,  // 从起始页跳转，深度为1
    extractedLinks: [
      'https://partner-site.com/offers',
      'https://affiliate-network.com/click',
      'https://cacts.cn/special-deal',
      'https://tracking.partner-site.com/conversion'
    ],
    isMalicious: false,
    crawledAt: '2025-07-24T19:24:30',
    status: 'success'
  },
  {
    id: 'cl-008',
    websiteId: '6',
    websiteName: 'Cacts网站',
    url: 'https://malicious-example.com',
    depth: 2,  // 从深度1的页面跳转，深度为2
    extractedLinks: [
      'https://malicious-example.com/login',
      'https://malicious-example.com/dashboard',
      'https://malicious-example.com/downloads/cryptonight.js',
      'https://another-malicious.com'
    ],
    isMalicious: true,
    maliciousFields: [
      {
        field: '注入攻击特征',
        pattern: '<script>[^<]*eval\\(.*\\)',
        position: 1562,
        filePath: 'https://malicious-example.com#inline-script',
        confidence: 0.98
      },
      {
        field: '挖矿脚本特征',
        pattern: 'cryptonight\\.js',
        position: 2045,
        filePath: 'https://malicious-example.com/downloads/cryptonight.js',
        confidence: 0.96
      }
    ],
    crawledAt: '2025-07-24T19:25:45',
    status: 'success'
  },
  {
    id: 'cl-009',
    websiteId: '6',
    websiteName: 'Cacts网站',
    url: 'https://another-malicious.com',
    depth: 3,  // 最大深度3，达到递归限制
    extractedLinks: [
      'https://another-malicious.com/phishing',
      'https://another-malicious.com/keylogger',
      'https://another-malicious.com/iframe'
    ],
    isMalicious: true,
    maliciousFields: [
      {
        field: '钓鱼特征',
        pattern: 'password\\s*=\\s*prompt\\(',
        position: 876,
        filePath: 'https://another-malicious.com#inline-script',
        confidence: 0.94
      },
      {
        field: '键盘记录特征',
        pattern: 'new\\s+Image\\(\\)\\.src\\s*=\\s*[^;]+keylogger',
        position: 1243,
        filePath: 'https://another-malicious.com#inline-script',
        confidence: 0.97
      },
      {
        field: '恶意iframe',
        pattern: '<iframe[^>]+src\\s*=\\s*["\']?http:\\/\\/malicious',
        position: 1892,
        filePath: 'https://another-malicious.com',
        confidence: 0.93
      }
    ],
    crawledAt: '2025-07-24T19:27:12',
    status: 'success'
  }
];