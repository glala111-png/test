/**
 * 网站安全监测逻辑说明
 * 包含网站篡改监测、暗链监测和反动内容监测的检查逻辑
 */

import { AnomalyType } from '@/types';

/**
 * 网站篡改监测逻辑
 * 检查网站内容是否被未授权修改
 */
export const tamperingDetectionLogic = {
  type: AnomalyType.TAMPERING,
  name: '网站篡改监测',
  description: '通过基线快照对比机制检测网站内容和结构是否被未授权修改',
  implementation: '基线快照对比机制',
  coreFeatures: [
    '多维度特征提取：内容哈希值、页面结构特征、关键元素特征和视觉指纹',
    '双层检测机制：快速哈希比对与深度多维度对比结合',
    '智能阈值判断：各维度变化置信度评估与阈值判定'
  ],
  workflow: [
    '1. 生成网站基线快照并提取多维度特征',
    '2. 检测时获取最新快照与基线对比',
    '3. 首先通过哈希值快速判断是否有变化',
    '4. 若有差异则进行深度对比分析',
    '5. 达到预设阈值时判定为篡改并记录细节'
  ],
  deepComparisonDimensions: [
    '结构变化检测：HTML节点树结构比对',
    '关键元素变化检测：重要区域内容与属性验证',
    '交互功能变化检测：JS事件与交互逻辑校验',
    '视觉变化验证：页面渲染结果比对分析'
  ],
  responseActions: [
    '立即生成异常报告',
    '触发告警通知',
    '记录篡改前后的差异快照',
    '提供一键恢复建议'
  ]
};

/**
 * 暗链监测逻辑
 * 检测网站中隐藏的恶意链接
 */
export const hiddenLinkDetectionLogic = {
  type: AnomalyType.HIDDEN_LINK,
  name: '暗链监测',
  description: '采用深度优先爬取策略检测网站中可能存在的隐藏恶意链接',
  implementation: '深度优先爬取与多维度链接分析',
  coreFeatures: [
    '深度优先爬取：默认3层递归爬取所有链接',
    '内链外链区分：基于网站域名智能识别',
    '隐藏链接检测：多维度隐藏技术识别',
    '关键词风险评分：基于恶意关键词库的匹配分析',
    '综合风险评估：多因素加权评分机制'
  ],
  crawlingStrategy: [
    '起始URL开始，按预设深度限制递归爬取',
    '默认深度限制为3层',
    '区分内链与外链并分别记录分析',
    '对每个链接进行独立分析与风险评估'
  ],
  hiddenLinkIdentification: [
    'CSS隐藏技术检测：display:none、visibility:hidden等',
    '尺寸异常检测：宽度或高度为零的链接元素',
    '透明度检测：opacity:0或完全透明的链接',
    '定位异常检测：位于可视区域外的链接',
    '覆盖隐藏检测：被其他元素完全覆盖的链接'
  ],
  riskAssessment: [
    '恶意关键词库匹配：URL路径与参数分析',
    '内容风险评分：可疑链接目标内容分析',
    '综合得分计算：关键词匹配得分+内容风险评分',
    '阈值判断：总得分超过70分判定为恶意链接',
    '置信度评估：基于匹配程度和风险等级'
  ],
  responseActions: [
    '标记可疑链接位置与隐藏方式',
    '记录匹配关键词与风险得分',
    '分析链接目标网站安全性',
    '生成链接风险评估报告',
    '提供移除建议与修复方案'
  ]
};

/**
 * 反动内容监测逻辑
 * 识别网页中的不当文字内容
 */
export const reactionaryContentDetectionLogic = {
  type: AnomalyType.REACTIONARY_CONTENT,
  name: '反动内容监测',
  description: '通过图片识别与文本分析相结合的方式检测网页中的不当内容',
  implementation: '图片与文本双维度内容分析',
  coreFeatures: [
    '图片内容识别：OCR文字提取与分析',
    '文本内容检测：正文提取与敏感词匹配',
    '关键词库匹配：多维度敏感内容识别',
    '风险得分计算：基于匹配程度的量化评估',
    '结果合并排序：综合风险等级评定'
  ],
  imageContentRecognition: [
    '页面图片提取：获取所有<img>元素及背景图片',
    'URL补全处理：将相对URL转换为绝对URL',
    '图片下载与预处理：统一格式与尺寸调整',
    'OCR文字识别：提取图片中的文字内容',
    '关键词匹配：与敏感关键词库比对分析',
    '风险评分：基于匹配关键词数量与风险等级'
  ],
  textContentDetection: [
    '正文提取：智能识别并提取页面主要文本内容',
    '噪声过滤：排除脚本、样式等非正文内容',
    '短文本过滤：忽略无意义的短文本片段',
    '关键词匹配：多模式匹配算法快速检测',
    '语义分析：上下文关联判断内容风险',
    '风险得分：基于关键词权重与出现频率'
  ],
  resultProcessing: [
    '图片与文字检测结果合并',
    '按风险得分降序排序',
    '高风险项目优先标记',
    '完整结果记录：类型、URL、关键词、得分、置信度',
    '生成综合风险评估报告'
  ],
  responseActions: [
    '标记违规内容位置与类型',
    '提供内容替换建议',
    '生成内容风险评估报告',
    '触发高级审核流程',
    '支持一键屏蔽违规内容'
  ]
};

/**
 * 核心技术组件集成逻辑
 * 系统通过关键词库管理、任务调度和结果分析实现完整监测流程
 */
export const coreTechnologyIntegration = {
  keywordLibrary: [
    '从数据库加载各类恶意关键词配置',
    '编译为高效正则表达式供检测使用',
    '支持关键词分类与权重配置',
    '定期自动更新关键词库',
    '支持自定义关键词添加'
  ],
  scanningTaskManagement: [
    '每个网站扫描作为独立任务处理',
    '支持失败自动重试，最多3次尝试',
    '智能任务调度，避免资源冲突',
    '优先级管理，支持紧急扫描插队',
    '任务执行状态实时监控'
  ],
  scanningProcess: [
    '获取网站最新配置信息',
    '生成当前网站完整快照',
    '依次执行三项核心检测功能：',
    '  1. 网站篡改监测',
    '  2. 暗链监测',
    '  3. 反动内容监测',
    '综合分析各项检测结果',
    '判定网站整体安全状态'
  ],
  resultHandling: [
    '异常详情记录与分类存储',
    '网站状态更新（正常/异常）',
    '触发相应级别告警通知',
    '生成详细安全报告',
    '提供修复建议与操作指南'
  ]
};

// 汇总所有监测逻辑
export const monitoringLogics = {
  [AnomalyType.TAMPERING]: tamperingDetectionLogic,
  [AnomalyType.HIDDEN_LINK]: hiddenLinkDetectionLogic,
  [AnomalyType.REACTIONARY_CONTENT]: reactionaryContentDetectionLogic,
  core: coreTechnologyIntegration,
  crawling: {
    workflow: [
      "1. 启动爬虫并开始主站爬取",
      "2. 区分内链与外链并加入相应队列",
      "3. 内链队列用于网站结构分析",
      "4. 外链队列启动递归爬取流程",
      "5. 对每个外链页面进行内容获取与分析",
      "6. 执行恶意字段检测并记录结果",
      "7. 从外链页面提取新的外部链接",
      "8. 持续递归爬取直到完成所有外链"
    ],
    linkClassification: [
      "内链判定：与主站域名一致或为子域名",
      "外链判定：此字段表示非主站域名的链接，将被纳入递归爬取范围",
      `特殊链接处理：邮件链接(mailto:)忽略、电话链接(tel:)忽略、锚点链接(#)忽略`
    ],
    recursiveCrawling: [
      "递归深度控制：默认3层，可配置 MAX_RECURSION_DEPTH",
      "去重机制：使用Set存储已访问URL，避免重复爬取",
      "爬取策略：广度优先搜索(BFS)，使用队列管理待爬取URL",
      "深度控制：每个URL记录当前爬取深度，超过阈值则停止递归",
      "异常处理：捕获请求异常，记录错误日志但不中断整体爬取"
    ],
    maliciousPatterns: [
      "注入攻击特征：<script>[^<]*eval\\(.*\\)",
      "注入攻击特征：document\\.write\\([^)]*\\)",
      "钓鱼特征：login\\.php\\?redirect=http",
      "钓鱼特征：password\\s*=\\s*prompt\\(",
      "挖矿脚本特征：coin\\-hive\\.com",
      "挖矿脚本特征：cryptonight\\.js",
      "键盘记录特征：new\\s+Image\\(\\)\\.src\\s*=\\s*[^;]+keylogger",
      "恶意iframe：<iframe[^>]+src\\s*=\\s*[\"']?http://malicious"
    ],
    sourcePathExtraction: [
      "优先检测外部JS文件：分析<script>标签的src属性",
      "其次检测内联脚本：分析无src属性的<script>标签内容",
      "最后检测CSS文件：分析<link>标签引入的样式表"
    ]
  }
};
