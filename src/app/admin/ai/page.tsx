'use client';

import { useEffect, useState } from 'react';
import { getAiAnalyticsAction } from '@/app/actions';
import {
  Sparkles,
  Bot,
  Cpu,
  RefreshCw,
  BarChart2,
  Activity,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Search,
} from 'lucide-react';
import ErrorState from '@/components/ErrorState';
import { AdminCard, AdminCardHeader, AdminCardTitle, AdminCardDescription } from '@/components/admin/AdminCard';
import { AdminButton } from '@/components/admin/AdminButton';
import { AdminBadge } from '@/components/admin/AdminBadge';
import { AdminTable, AdminTableHeader, AdminTableBody, AdminTableRow, AdminTableHead, AdminTableCell } from '@/components/admin/AdminTable';
import { AdminDrawer } from '@/components/admin/AdminDrawer';
import { AdminInput } from '@/components/admin/AdminInput';
import { AdminDonutChart } from '@/components/admin/charts/AdminDonutChart';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatCard } from '@/components/admin/AdminStatCard';

interface AiLog {
  id: string;
  type: string;
  prompt: string;
  status: string;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
  } | null;
}

interface AiData {
  totalRequests: number;
  recentRequestsCount: number;
  typeBreakdown: Record<string, number>;
  recentLogs?: AiLog[];
}

const AI_FEATURE_LABELS: Record<string, string> = {
  ITINERARY_GENERATION: 'Lập lịch trình tự động',
  RECEIPT_SCANNING: 'Quét hoá đơn (OCR)',
  CHAT_ASSISTANT: 'Trợ lý ảo du lịch',
  PACKING_RECOMMENDATION: 'Gợi ý hành lý thông minh',
  EXPENSE_CATEGORIZATION: 'Phân loại chi tiêu',
  GENERAL: 'Chung & Tiện ích khác',
};

const AI_FEATURE_COLORS: Record<string, string> = {
  ITINERARY_GENERATION: '#F59E0B', // Brand amber
  RECEIPT_SCANNING: '#22C55E', // Emerald
  CHAT_ASSISTANT: '#38BDF8', // Sky
  PACKING_RECOMMENDATION: '#F97316', // Orange
  EXPENSE_CATEGORIZATION: '#EC4899', // Pink
  GENERAL: '#94A3B8', // Slate
};

const PALETTE = ['#F59E0B', '#38BDF8', '#22C55E', '#F97316', '#EC4899', '#0EA5E9', '#14B8A6'];

export default function AdminAiPage() {
  const [data, setData] = useState<AiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchLog, setSearchLog] = useState('');
  const [selectedLog, setSelectedLog] = useState<AiLog | null>(null);

  const fetchAi = async () => {
    setLoading(true);
    setError(null);
    const res = await getAiAnalyticsAction();
    if (res.success && res.data) {
      setData(res.data.data || res.data);
    } else {
      setError(res.error || 'Không thể lấy dữ liệu AI Analytics');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAi();
  }, []);

  const donutData = Object.entries(data?.typeBreakdown || {}).map(([type, count], idx) => ({
    label: AI_FEATURE_LABELS[type] || type,
    value: count,
    color: AI_FEATURE_COLORS[type] || PALETTE[idx % PALETTE.length],
  }));

  const filteredLogs = (data?.recentLogs || []).filter((log) => {
    if (!searchLog.trim()) return true;
    const q = searchLog.toLowerCase();
    return (
      log.prompt.toLowerCase().includes(q) ||
      log.type.toLowerCase().includes(q) ||
      (log.user?.email && log.user.email.toLowerCase().includes(q)) ||
      (log.user?.name && log.user.name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <AdminPageHeader
        title="AI Assistant & Gemini Analytics"
        description="Giám sát khối lượng prompt, phân bổ tính năng thông minh và nhật ký truy vấn trí tuệ nhân tạo."
        badgeText="Gemini 1.5 Flash"
        badgeVariant="brand"
        actions={
          <AdminButton
            variant="outline"
            size="sm"
            onClick={fetchAi}
            loading={loading}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Làm mới
          </AdminButton>
        }
      />

      {error && !data && !loading ? (
        <ErrorState message={error} onRetry={fetchAi} />
      ) : loading && !data ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E293B] animate-pulse p-4 shadow-xs"
            />
          ))}
        </div>
      ) : (
        <>
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <AdminStatCard
              title="Tổng Lượt Yêu Cầu AI"
              value={(data?.totalRequests ?? 0).toLocaleString('vi-VN')}
              description="Tất cả prompts hệ thống đã ghi nhận"
              icon={<Bot className="w-4 h-4" />}
              variant="success"
            />
            <AdminStatCard
              title="Lượt Prompt Gần Đây"
              value={(data?.recentRequestsCount ?? 0).toLocaleString('vi-VN')}
              description="Snapshot gần nhất trong telemetry"
              icon={<Sparkles className="w-4 h-4" />}
              variant="brand"
            />
            <AdminStatCard
              title="Mô Hình & Engine"
              value="Gemini 1.5 Flash"
              description="Tốc độ xử lý cao & Multimodal"
              icon={<Cpu className="w-4 h-4" />}
              badgeText="Live"
              variant="default"
            />
            <AdminStatCard
              title="Trạng Thái Tích Hợp API"
              value="Sẵn sàng"
              description="Google Generative AI SDK v0.24+"
              icon={<CheckCircle2 className="w-4 h-4" />}
              badgeText="Online"
              variant="success"
            />
          </div>

          {/* Visualization Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Donut Chart */}
            <AdminCard className="lg:col-span-6">
              <AdminCardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
                    <BarChart2 className="w-4 h-4" />
                  </div>
                  <div>
                    <AdminCardTitle>Tỷ Lệ Phân Bổ Tính Năng AI</AdminCardTitle>
                    <AdminCardDescription>Phần trăm sử dụng theo từng loại tác vụ thông minh</AdminCardDescription>
                  </div>
                </div>
              </AdminCardHeader>

              {donutData.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                  <Bot className="w-8 h-8 mb-2 opacity-40" />
                  <p className="text-xs">Chưa có dữ liệu biểu đồ AI.</p>
                </div>
              ) : (
                <AdminDonutChart
                  data={donutData}
                  totalLabel="Tổng Prompt"
                  valueSuffix=" lượt"
                  size={160}
                />
              )}
            </AdminCard>

            {/* Prompt Type Breakdown List */}
            <AdminCard className="lg:col-span-6">
              <AdminCardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-800/50">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <AdminCardTitle>Chi Tiết Lượt Gọi Theo Module</AdminCardTitle>
                    <AdminCardDescription>Tần suất và thị phần prompt của các dịch vụ</AdminCardDescription>
                  </div>
                </div>
              </AdminCardHeader>

              {Object.keys(data?.typeBreakdown || {}).length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                  <p className="text-xs">Chưa có dữ liệu phân loại tính năng AI.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {Object.entries(data?.typeBreakdown || {}).map(([type, count]) => {
                    const label = AI_FEATURE_LABELS[type] || type;
                    const color = AI_FEATURE_COLORS[type] || '#F59E0B';
                    const totalReqs = data?.totalRequests || 1;
                    const percent = Math.min(100, (count / totalReqs) * 100);

                    return (
                      <div
                        key={type}
                        className="p-3 rounded-lg border border-slate-100 dark:border-[#1E293B] bg-slate-50/50 dark:bg-[#0D1424]/60 flex flex-col gap-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className="w-2.5 h-2.5 rounded-xs shrink-0"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                              {label}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                              ({type})
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                              {count.toLocaleString('vi-VN')}
                            </span>
                            <AdminBadge variant="neutral" size="xs">
                              {percent.toFixed(1)}%
                            </AdminBadge>
                          </div>
                        </div>

                        {/* Visual progress bar */}
                        <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-[#1E293B] overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${percent}%`, backgroundColor: color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </AdminCard>
          </div>

          {/* Recent Prompt Logs Table */}
          <AdminCard className="overflow-hidden">
            <AdminCardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <AdminCardTitle>Nhật Ký Yêu Cầu AI Gần Nhất (Prompt Telemetry)</AdminCardTitle>
                    <AdminCardDescription>
                      Danh sách {filteredLogs.length} yêu cầu được ghi lại gần đây nhất trong cơ sở dữ liệu
                    </AdminCardDescription>
                  </div>
                </div>

                <div className="w-full sm:w-64">
                  <AdminInput
                    placeholder="Tìm kiếm nội dung prompt, user..."
                    value={searchLog}
                    onChange={(e) => setSearchLog(e.target.value)}
                    leftIcon={<Search className="w-3.5 h-3.5 text-slate-400" />}
                  />
                </div>
              </div>
            </AdminCardHeader>

            {filteredLogs.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                <AlertCircle className="w-8 h-8 mb-2 opacity-40" />
                <p className="text-xs font-medium">Không tìm thấy yêu cầu AI nào</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {searchLog ? 'Thử tìm kiếm với từ khóa khác.' : 'Hệ thống chưa phát sinh bản ghi prompt nào.'}
                </p>
              </div>
            ) : (
              <AdminTable>
                <AdminTableHeader>
                  <AdminTableRow>
                    <AdminTableHead>Thời Gian</AdminTableHead>
                    <AdminTableHead>Người Dùng</AdminTableHead>
                    <AdminTableHead>Tính Năng</AdminTableHead>
                    <AdminTableHead>Nội Dung Prompt</AdminTableHead>
                    <AdminTableHead>Trạng Thái</AdminTableHead>
                    <AdminTableHead className="text-right">Thao Tác</AdminTableHead>
                  </AdminTableRow>
                </AdminTableHeader>
                <AdminTableBody>
                  {filteredLogs.map((log) => (
                    <AdminTableRow key={log.id}>
                      <AdminTableCell className="text-xs text-slate-500 dark:text-slate-400 font-mono whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString('vi-VN', {
                          month: 'numeric',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </AdminTableCell>

                      <AdminTableCell>
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                            {log.user?.name || 'Khách / Ẩn danh'}
                          </span>
                          <span className="text-[11px] text-slate-400 truncate max-w-[140px]">
                            {log.user?.email || 'N/A'}
                          </span>
                        </div>
                      </AdminTableCell>

                      <AdminTableCell>
                        <AdminBadge
                          variant={
                            log.type === 'ITINERARY_GENERATION'
                              ? 'brand'
                              : log.type === 'RECEIPT_SCANNING'
                              ? 'success'
                              : log.type === 'CHAT_ASSISTANT'
                              ? 'info'
                              : 'neutral'
                          }
                          size="xs"
                        >
                          {AI_FEATURE_LABELS[log.type] || log.type}
                        </AdminBadge>
                      </AdminTableCell>

                      <AdminTableCell className="max-w-[280px]">
                        <p className="text-xs text-slate-700 dark:text-slate-300 truncate font-mono">
                          {log.prompt}
                        </p>
                      </AdminTableCell>

                      <AdminTableCell>
                        <AdminBadge
                          variant={
                            log.status === 'COMPLETED' || log.status === 'SUCCESS'
                              ? 'success'
                              : log.status === 'FAILED'
                              ? 'danger'
                              : 'warning'
                          }
                          size="xs"
                        >
                          {log.status}
                        </AdminBadge>
                      </AdminTableCell>

                      <AdminTableCell className="text-right">
                        <AdminButton
                          variant="ghost"
                          size="xs"
                          onClick={() => setSelectedLog(log)}
                          icon={<Eye className="w-3.5 h-3.5" />}
                        >
                          Chi tiết
                        </AdminButton>
                      </AdminTableCell>
                    </AdminTableRow>
                  ))}
                </AdminTableBody>
              </AdminTable>
            )}
          </AdminCard>
        </>
      )}

      {/* Drawer inspect prompt detail */}
      <AdminDrawer
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        title="Chi Tiết Truy Vấn AI"
        description={selectedLog ? `Request ID: ${selectedLog.id}` : undefined}
        size="lg"
      >
        {selectedLog && (
          <div className="flex flex-col gap-5 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-lg bg-slate-50 dark:bg-[#0D1424] border border-slate-200 dark:border-[#1E293B]">
              <div>
                <span className="text-[11px] text-slate-400 block">Thời gian tạo</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {new Date(selectedLog.createdAt).toLocaleString('vi-VN')}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Trạng thái</span>
                <div className="mt-0.5">
                  <AdminBadge
                    variant={
                      selectedLog.status === 'COMPLETED' || selectedLog.status === 'SUCCESS'
                        ? 'success'
                        : selectedLog.status === 'FAILED'
                        ? 'danger'
                        : 'warning'
                    }
                    size="xs"
                  >
                    {selectedLog.status}
                  </AdminBadge>
                </div>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Người dùng</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedLog.user?.name || 'Ẩn danh'} ({selectedLog.user?.email || 'N/A'})
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Module thực thi</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {AI_FEATURE_LABELS[selectedLog.type] || selectedLog.type}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">
                Nội dung Prompt gửi lên mô hình:
              </span>
              <div className="p-3.5 rounded-lg bg-slate-100 dark:bg-[#070B16] border border-slate-200 dark:border-[#1E293B] font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap break-words max-h-72 overflow-y-auto leading-relaxed">
                {selectedLog.prompt}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal">
                Các bản ghi AI telemetry được lưu trữ phục vụ mục đích kiểm toán chất lượng đầu ra, phát hiện prompt injection và tối ưu hóa chi phí token.
              </div>
            </div>
          </div>
        )}
      </AdminDrawer>
    </div>
  );
}
