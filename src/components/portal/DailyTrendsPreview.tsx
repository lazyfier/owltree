import { useState, useEffect } from 'react'
import { RefreshCw, ExternalLink } from 'lucide-react'

interface TrendItem {
  id: string
  title: string
  source: string
  hot?: boolean
}

export function DailyTrendsPreview() {
  const [trends, setTrends] = useState<TrendItem[]>([])
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setTrends([
        { id: '1', title: 'AI技术突破：新模型发布', source: '知乎', hot: true },
        { id: '2', title: '全球开发者大会即将开幕', source: '微博' },
        { id: '3', title: '前端框架新特性解析', source: '技术' },
        { id: '4', title: '开源项目本周热门榜单', source: 'GitHub' },
      ])
      setLastUpdate(new Date())
      setLoading(false)
    }, 800)
  }, [])

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => {
      setTrends([
        { id: '1', title: 'AI技术突破：新模型发布', source: '知乎', hot: true },
        { id: '2', title: '全球开发者大会即将开幕', source: '微博' },
        { id: '3', title: '前端框架新特性解析', source: '技术' },
        { id: '4', title: '开源项目本周热门榜单', source: 'GitHub' },
      ])
      setLastUpdate(new Date())
      setLoading(false)
    }, 800)
  }

  return (
    <section className="vn-window p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="vn-meta">System Log</p>
          <h2 className="mt-2 text-2xl font-semibold text-[rgb(71,48,88)]">今日趋势</h2>
          <p className="mt-1 text-xs text-[rgb(128,99,128)]">
            上次更新: {lastUpdate.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="vn-button h-9 px-3 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <a
            href="#/trends"
            className="vn-button h-9 px-3 text-xs font-medium text-[rgb(131,59,105)]"
          >
            查看全部
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        </div>
      </div>

      <div className="space-y-3">
        {trends.length === 0 && !loading ? (
          <div className="py-8 text-center text-sm text-slate-500">
            暂无数据，点击刷新获取
          </div>
        ) : (
          trends.map((trend, index) => (
            <div
              key={trend.id}
              className="vn-slot group flex cursor-pointer items-center gap-4 p-4 transition-colors hover:-translate-y-0.5"
            >
              <span className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-semibold ${
                index < 3
                  ? 'bg-[rgba(220,107,141,0.14)] text-coral'
                  : 'bg-[rgba(187,123,197,0.12)] text-[rgb(128,99,128)]'
              }`}>
                {index + 1}
              </span>
              <div className="vn-rail flex-1 min-w-0 pl-4">
                <p className="vn-meta mb-1">feed / {trend.source}</p>
                <p className="truncate text-sm font-medium text-[rgb(71,48,88)] transition-colors group-hover:text-[rgb(53,34,68)]">
                  {trend.title}
                </p>
              </div>
              {trend.hot && (
                <span className="vn-chip text-coral">
                  热
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  )
}
