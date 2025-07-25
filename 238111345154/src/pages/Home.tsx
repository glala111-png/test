import MainLayout from '../components/MainLayout';

export default function Home() {
  const imagePrompt = encodeURIComponent('Secure website monitoring dashboard, modern UI design, clean interface, blue color scheme');
  const imageUrl = `https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=%24%7BimagePrompt%7D&sign=fe5f52000e3a388bcc4aa2a9660fe107`;
  
  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-16 p-8 md:p-12 text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/90 to-indigo-600/90 z-0"></div>
          <div className="relative z-10 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              网站安全监控平台
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              实时监控您的网站安全状态，及时发现并解决潜在威胁，保障业务稳定运行
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="rounded-999px bg-white text-blue-600 font-semibold px-8 py-3 hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                开始使用
              </button>
              <button className="rounded-999px bg-transparent border-2 border-white text-white font-semibold px-8 py-3 hover:bg-white/10 transition-all">
                了解更多
              </button>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-12 text-center">
              强大功能，全面保护
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature Card 1 */}
              <div className="rounded-16 bg-white dark:bg-slate-800 p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-12 flex items-center justify-center mb-5">
                  <i className="fa-solid fa-shield text-blue-600 dark:text-blue-400 text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">实时安全监控</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  持续监控您的网站，及时发现异常活动和潜在威胁，让您高枕无忧。
                </p>
              </div>
              
              {/* Feature Card 2 */}
              <div className="rounded-16 bg-white dark:bg-slate-800 p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-12 flex items-center justify-center mb-5">
                  <i className="fa-solid fa-file-alt text-blue-600 dark:text-blue-400 text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">详细安全报告</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  生成专业安全报告，提供风险评估和改进建议，助您提升网站安全性。
                </p>
              </div>
              
              {/* Feature Card 3 */}
              <div className="rounded-16 bg-white dark:bg-slate-800 p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-12 flex items-center justify-center mb-5">
                  <i className="fa-solid fa-bell text-blue-600 dark:text-blue-400 text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">即时告警通知</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  配置自定义告警规则，一旦发现安全问题，立即通过多种渠道通知您。
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Dashboard Preview */}
        <section className="py-16 px-4 bg-slate-50 dark:bg-slate-800/50">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">
              直观的监控仪表盘
            </h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10">
              一目了然的安全状态展示，关键指标实时更新，让您随时掌握网站安全状况
            </p>
            
            <div className="rounded-16 overflow-hidden shadow-2xl max-w-4xl mx-auto transform transition-all hover:scale-[1.01]">
              <img 
                src={imageUrl} 
                alt="安全监控仪表盘预览" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 rounded-16 p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">准备好开始保护您的网站了吗？</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              立即注册，获得7天免费试用，体验全方位的网站安全监控服务
            </p>
            <button className="rounded-999px bg-white text-blue-600 font-semibold px-8 py-3 hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg">
              免费试用 7 天
            </button>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}