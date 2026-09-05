'use client';

import { useEffect, useState } from 'react';
import { getAiAnalyticsAction } from '@/app/actions';
import { Sparkles, Bot, Cpu, RefreshCw, BarChart2 } from 'lucide-react';
import ErrorState from '@/components/ErrorState';

interface AiData {
  totalRequests: number;
  recentRequestsCount: number;
  typeBreakdown: Record<string, number>;
}

export default function AdminAiPage() {
  const [data, setData] = useState<AiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAi = async () => {
    setLoading(true);
    setError(null);
    const res = await getAiAnalyticsAction();
    if (res.success && res.data) {
      setData(res.data);
    } else {
      setError(res.error || 'Không thể lấy dữ liệu AI Analytics');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAi();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase text-black dark:text-white tracking-tight">
            AI Assistant & Gemini Usage Analytics
          </h1>
          <p className="text-[10px] font-black uppercase text-muted-foreground mt-1">
            Thống kê lượt sử dụng Trợ lý AI Gemini, AI Receipt Scanner & Itinerary Generator.
          </p>
        </div>
        <button
          onClick={fetchAi}
          disabled={loading}
          className="p-2.5 rounded-xl bg-white border-2 border-black hover:bg-secondary text-black shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[-1px] active:translate-y-[1px] transition-all cursor-pointer flex items-center justify-center disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && !data && !loading ? (
        <ErrorState message={error} onRetry={fetchAi} />
      ) : loading && !data ? (
        <div className="h-64 rounded-3xl bg-white border-2 border-black animate-pulse p-6 shadow-[2px_2px_0px_0px_#000000]"></div>
      ) : (
        <>
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-[28px] border-[3px] border-black bg-[#18A058] text-white shadow-[4px_4px_0px_0px_#000000] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider opacity-85">
                  Tổng Lượt Yêu Cầu AI
                </span>
                <h3 className="text-3xl font-black mt-1">{data?.totalRequests ?? 0}</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_0px_#000000]">
                <Bot className="w-6 h-6" />
              </div>
            </div>

            <div className="p-6 rounded-[28px] border-[3px] border-black bg-[#FFD043] text-black shadow-[4px_4px_0px_0px_#000000] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider opacity-85">
                  Lượt Prompt Gần Đây
                </span>
                <h3 className="text-3xl font-black mt-1">{data?.recentRequestsCount ?? 0}</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_0px_#000000]">
                <Sparkles className="w-6 h-6" />
              </div>
            </div>

            <div className="p-6 rounded-[28px] border-[3px] border-black bg-[#C5B4FA] text-black shadow-[4px_4px_0px_0px_#000000] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider opacity-85">
                  Mô Hình AI Đang Dùng
                </span>
                <h3 className="text-lg font-black mt-1">Google Gemini 1.5 Flash</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_0px_#000000]">
                <Cpu className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Prompt Type Breakdown */}
          <div className="p-6 rounded-[32px] bg-white border-[3px] border-black dark:bg-[#252322] dark:border-white shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#ffffff]">
            <div className="flex items-center gap-3 border-b border-black dark:border-white pb-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-primary/10 border-2 border-primary text-primary flex items-center justify-center">
                <BarChart2 className="w-5 h-5" />
              </div>
              <h2 className="text-sm font-black uppercase">Phân Loại Tính Năng AI Sử Dụng</h2>
            </div>

            {Object.keys(data?.typeBreakdown || {}).length === 0 ? (
              <p className="text-xs text-muted-foreground py-8 text-center font-bold uppercase">
                Chưa có dữ liệu phân loại tính năng AI.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(data?.typeBreakdown || {}).map(([type, count]) => (
                  <div key={type} className="p-4 rounded-2xl border-2 border-black bg-[#FEFADC] dark:bg-[#1C1A19] flex justify-between items-center shadow-[2px_2px_0px_0px_#000000]">
                    <div>
                      <span className="text-xs font-black uppercase block">{type}</span>
                      <span className="text-[9px] font-bold text-muted-foreground">Tính năng AI</span>
                    </div>
                    <span className="text-lg font-black bg-primary text-white px-3 py-1 rounded-xl border border-black shadow-[1px_1px_0px_0px_#000000]">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
