'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  getSloStatusAction,
  createSloTargetAction,
  updateSloTargetAction,
  deleteSloTargetAction,
  CreateSloTargetPayload,
  UpdateSloTargetPayload,
} from '@/app/actions';
import {
  Target,
  ShieldCheck,
  Plus,
  Pencil,
  Trash2,
  HelpCircle,
  AlertTriangle,
  AlertCircle,
  RefreshCw,
  Clock,
  Gauge,
  Info,
} from 'lucide-react';
import ErrorState from '@/components/ErrorState';
import {
  AdminCard,
  AdminCardHeader,
  AdminCardTitle,
  AdminCardDescription,
} from '@/components/admin/AdminCard';
import { AdminButton } from '@/components/admin/AdminButton';
import { AdminBadge } from '@/components/admin/AdminBadge';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminModal } from '@/components/admin/AdminModal';
import { AdminInput, AdminSelect } from '@/components/admin/AdminInput';
import { AdminTooltip } from '@/components/admin/AdminTooltip';

export interface SloEvaluation {
  id: string;
  key: string;
  name: string;
  sliType: 'AVAILABILITY' | 'LATENCY';
  objective: number;
  windowDays: number;
  latencyThresholdMs: number | null;
  routePrefix: string | null;
  totalEvents: number;
  goodEvents: number;
  badEvents: number;
  currentSliPercent: number | null;
  isMeetingObjective: boolean;
  errorBudgetTotal: number;
  errorBudgetConsumed: number;
  errorBudgetRemainingPercent: number;
  burnRate: number;
}

export interface SloTarget {
  id: string;
  key: string;
  name: string;
  sliType: 'AVAILABILITY' | 'LATENCY';
  objective: number;
  windowDays: number;
  latencyThresholdMs: number | null;
  routePrefix: string | null;
  isActive: boolean;
}

interface FormState {
  key: string;
  name: string;
  sliType: 'AVAILABILITY' | 'LATENCY';
  objective: string;
  windowDays: string;
  latencyThresholdMs: string;
  routePrefix: string;
  isActive: boolean;
}

const INITIAL_FORM: FormState = {
  key: '',
  name: '',
  sliType: 'AVAILABILITY',
  objective: '99.9',
  windowDays: '30',
  latencyThresholdMs: '500',
  routePrefix: '',
  isActive: true,
};

export default function SloDashboardPage() {
  const [evaluations, setEvaluations] = useState<SloEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlo, setEditingSlo] = useState<SloEvaluation | null>(null);
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete confirmation modal state
  const [deletingSlo, setDeletingSlo] = useState<SloEvaluation | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSloData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getSloStatusAction();
      if (res.success && res.data) {
        setEvaluations(res.data);
      } else {
        setError(res.error || 'Không thể tải dữ liệu đánh giá SLO');
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối khi tải danh sách SLO');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSloData();
  }, [fetchSloData]);

  // Mở modal tạo mới
  const handleOpenCreateModal = () => {
    setEditingSlo(null);
    setFormData(INITIAL_FORM);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Mở modal sửa
  const handleOpenEditModal = (item: SloEvaluation) => {
    setEditingSlo(item);
    setFormData({
      key: item.key,
      name: item.name,
      sliType: item.sliType,
      objective: String(item.objective),
      windowDays: String(item.windowDays || 30),
      latencyThresholdMs: item.latencyThresholdMs ? String(item.latencyThresholdMs) : '500',
      routePrefix: item.routePrefix || '',
      isActive: true,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  // Submit form tạo/sửa
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setFormError(null);

    // Validation cơ bản
    if (!formData.key.trim()) {
      setFormError('Vui lòng nhập mã định danh (Key)');
      return;
    }
    if (!formData.name.trim()) {
      setFormError('Vui lòng nhập tên mục tiêu SLO');
      return;
    }

    const objNum = parseFloat(formData.objective);
    if (isNaN(objNum) || objNum <= 0 || objNum > 100) {
      setFormError('Mục tiêu SLO phải là số từ 0.001 đến 100%');
      return;
    }

    const winDays = parseInt(formData.windowDays, 10);
    if (isNaN(winDays) || winDays < 1) {
      setFormError('Cửa sổ đánh giá phải ít nhất 1 ngày');
      return;
    }

    let latMs: number | null = null;
    if (formData.sliType === 'LATENCY') {
      latMs = parseInt(formData.latencyThresholdMs, 10);
      if (isNaN(latMs) || latMs < 1) {
        setFormError('Ngưỡng độ trễ (latencyThresholdMs) là bắt buộc và phải lớn hơn 0');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (editingSlo) {
        // Cập nhật
        const payload: UpdateSloTargetPayload = {
          key: formData.key.trim(),
          name: formData.name.trim(),
          sliType: formData.sliType,
          objective: objNum,
          windowDays: winDays,
          latencyThresholdMs: formData.sliType === 'LATENCY' ? latMs : null,
          routePrefix: formData.routePrefix.trim() || null,
          isActive: formData.isActive,
        };

        const res = await updateSloTargetAction(editingSlo.id, payload);
        if (res.success) {
          setIsModalOpen(false);
          await fetchSloData();
        } else {
          setFormError(res.error || 'Cập nhật mục tiêu SLO thất bại');
        }
      } else {
        // Tạo mới
        const payload: CreateSloTargetPayload = {
          key: formData.key.trim(),
          name: formData.name.trim(),
          sliType: formData.sliType,
          objective: objNum,
          windowDays: winDays,
          latencyThresholdMs: formData.sliType === 'LATENCY' ? latMs : null,
          routePrefix: formData.routePrefix.trim() || null,
          isActive: formData.isActive,
        };

        const res = await createSloTargetAction(payload);
        if (res.success) {
          setIsModalOpen(false);
          await fetchSloData();
        } else {
          setFormError(res.error || 'Tạo mục tiêu SLO thất bại');
        }
      }
    } catch (err: any) {
      setFormError(err.message || 'Lỗi hệ thống khi gửi dữ liệu');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xoá SLO
  const handleConfirmDelete = async () => {
    if (!deletingSlo || isDeleting) return;

    setIsDeleting(true);
    try {
      const res = await deleteSloTargetAction(deletingSlo.id);
      if (res.success) {
        setDeletingSlo(null);
        await fetchSloData();
      } else {
        alert(res.error || 'Xoá mục tiêu SLO thất bại');
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xoá mục tiêu SLO');
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper tính style màu thanh Error Budget
  const getBudgetBarStyle = (percent: number) => {
    if (percent > 50) {
      return {
        bg: 'bg-emerald-500 dark:bg-emerald-400',
        text: 'text-emerald-700 dark:text-emerald-400',
        track: 'bg-emerald-100 dark:bg-emerald-950/50',
      };
    }
    if (percent >= 20) {
      return {
        bg: 'bg-amber-500 dark:bg-amber-400',
        text: 'text-amber-700 dark:text-amber-400',
        track: 'bg-amber-100 dark:bg-amber-950/50',
      };
    }
    return {
      bg: 'bg-rose-500 dark:bg-rose-400',
      text: 'text-rose-700 dark:text-rose-400',
      track: 'bg-rose-100 dark:bg-rose-950/50',
    };
  };

  // Helper tính Burn Rate badge và diễn giải
  const getBurnRateInfo = (burnRate: number, totalEvents: number) => {
    if (totalEvents === 0) {
      return {
        label: '0x',
        desc: 'Chưa có sự kiện để tính',
        badgeVariant: 'neutral' as const,
        colorClass: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-[#172238]',
      };
    }
    if (burnRate <= 1) {
      return {
        label: `${burnRate.toFixed(2)}x`,
        desc: 'Trong mức cho phép',
        badgeVariant: 'success' as const,
        colorClass: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/50',
      };
    }
    if (burnRate <= 2) {
      return {
        label: `${burnRate.toFixed(2)}x`,
        desc: 'Đang đốt nhanh hơn cho phép',
        badgeVariant: 'warning' as const,
        colorClass: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/50',
      };
    }
    return {
      label: `${burnRate.toFixed(2)}x`,
      desc: 'Đốt rất nhanh — cần xử lý',
      badgeVariant: 'danger' as const,
      colorClass: 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/50',
    };
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header trang */}
      <AdminPageHeader
        title="SLO & Ngân Sách Lỗi (Error Budget)"
        description="Quản lý cam kết mức dịch vụ (SLO), theo dõi tỷ lệ tiêu hao ngân sách lỗi (Error Budget) và tốc độ đốt (Burn Rate) theo chuẩn SRE."
        badge={
          <AdminBadge variant="brand" size="xs">
            SRE Framework
          </AdminBadge>
        }
      >
        <div className="flex items-center gap-2">
          <AdminButton
            variant="outline"
            size="sm"
            onClick={fetchSloData}
            loading={loading}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Làm mới
          </AdminButton>

          <AdminButton
            variant="primary"
            size="sm"
            onClick={handleOpenCreateModal}
            icon={<Plus className="w-4 h-4" />}
          >
            Thêm mục tiêu SLO
          </AdminButton>
        </div>
      </AdminPageHeader>

      {/* Banner diễn giải chuẩn SRE */}
      <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-800/40 flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 dark:text-[#F8FAFC] leading-relaxed">
          <span className="font-semibold text-amber-800 dark:text-amber-300">
            Nguyên lý quản lý ngân sách lỗi (Google SRE Standard):
          </span>{' '}
          Mỗi mục tiêu SLO được cấp một ngân sách lỗi tương ứng với phần trăm không hoàn hảo cho phép (100% - Mục tiêu).
          Lỗi client (4xx) không bị trừ vào ngân sách. Khi tốc độ đốt (Burn Rate) vượt quá 1x, hệ thống đang mất ngân sách nhanh hơn dự kiến.
        </div>
      </div>

      {error && !loading && evaluations.length === 0 ? (
        <ErrorState message={error} onRetry={fetchSloData} />
      ) : loading && evaluations.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-80 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E293B] animate-pulse p-6 shadow-xs"
            />
          ))}
        </div>
      ) : evaluations.length === 0 ? (
        <AdminCard className="text-center py-16">
          <div className="max-w-md mx-auto flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-[#F8FAFC]">
              Chưa có mục tiêu SLO nào được cấu hình
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
              Thiết lập mục tiêu độ tin cậy hệ thống (SLO) cho Độ sẵn sàng (Availability) hoặc Độ trễ (Latency) để bảo vệ trải nghiệm người dùng.
            </p>
            <AdminButton
              variant="primary"
              size="sm"
              onClick={handleOpenCreateModal}
              icon={<Plus className="w-4 h-4" />}
              className="mt-2"
            >
              Tạo mục tiêu đầu tiên
            </AdminButton>
          </div>
        </AdminCard>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {evaluations.map((item) => {
            const hasNoData = item.currentSliPercent === null || item.totalEvents === 0;
            const burnInfo = getBurnRateInfo(item.burnRate, item.totalEvents);
            const budgetStyle = getBudgetBarStyle(item.errorBudgetRemainingPercent);

            return (
              <AdminCard key={item.id} className="flex flex-col justify-between gap-5">
                <div>
                  {/* Header thẻ SLO */}
                  <AdminCardHeader className="pb-3 mb-3">
                    <div className="flex items-start justify-between gap-3 w-full">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
                          {item.sliType === 'AVAILABILITY' ? (
                            <ShieldCheck className="w-5 h-5" />
                          ) : (
                            <Gauge className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <AdminCardTitle className="text-base font-bold">
                            {item.name}
                          </AdminCardTitle>
                          <AdminCardDescription className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                              {item.key}
                            </span>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1 font-medium text-slate-600 dark:text-slate-400">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {item.windowDays} ngày
                            </span>
                            {item.routePrefix && (
                              <>
                                <span>•</span>
                                <span className="font-mono text-slate-600 dark:text-[#94A3B8]">
                                  prefix: {item.routePrefix}
                                </span>
                              </>
                            )}
                          </AdminCardDescription>
                        </div>
                      </div>

                      {/* Hành động sửa/xoá */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#172238] transition-colors cursor-pointer"
                          title="Chỉnh sửa SLO"
                          aria-label="Chỉnh sửa mục tiêu SLO"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingSlo(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                          title="Xoá SLO"
                          aria-label="Xoá mục tiêu SLO"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </AdminCardHeader>

                  {/* Thông số cốt lõi: SLI Thực Tế vs Mục Tiêu */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-[#0D1424] border border-slate-200/80 dark:border-[#1E293B] mb-4">
                    {/* Loại SLI */}
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] text-slate-500 dark:text-[#94A3B8]">
                        Loại chỉ số
                      </span>
                      <div className="font-semibold text-xs text-slate-800 dark:text-[#F8FAFC] flex items-center gap-1.5 mt-0.5">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white dark:bg-[#172238] border border-slate-200 dark:border-[#1E293B]">
                          {item.sliType}
                        </span>
                        {item.sliType === 'LATENCY' && item.latencyThresholdMs && (
                          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-mono">
                            ≤ {item.latencyThresholdMs}ms
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Mục tiêu cam kết */}
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] text-slate-500 dark:text-[#94A3B8]">
                        Mục tiêu cam kết
                      </span>
                      <span className="text-sm font-bold font-mono text-slate-900 dark:text-[#F8FAFC]">
                        {item.objective}%
                      </span>
                    </div>

                    {/* SLI hiện tại + Huy hiệu */}
                    <div className="col-span-2 sm:col-span-1 flex flex-col gap-0.5">
                      <span className="text-[11px] text-slate-500 dark:text-[#94A3B8]">
                        SLI hiện tại
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        {hasNoData ? (
                          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                            Chưa đủ dữ liệu
                          </span>
                        ) : (
                          <span
                            className={`text-sm font-bold font-mono ${
                              item.isMeetingObjective
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            {item.currentSliPercent?.toFixed(2)}%
                          </span>
                        )}

                        {hasNoData ? (
                          <AdminBadge variant="neutral" size="xs">
                            Chờ đo
                          </AdminBadge>
                        ) : item.isMeetingObjective ? (
                          <AdminBadge variant="success" size="xs" dot>
                            ĐẠT
                          </AdminBadge>
                        ) : (
                          <AdminBadge variant="danger" size="xs" dot pulse>
                            KHÔNG ĐẠT
                          </AdminBadge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Thanh hiển thị Ngân Sách Lỗi (Error Budget) */}
                  <div className="flex flex-col gap-2 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <span>Ngân sách lỗi (Error Budget)</span>
                        <AdminTooltip
                          position="top"
                          content="Phần trăm lỗi hệ thống được phép xảy ra mà không vi phạm cam kết SLO"
                        >
                          <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                        </AdminTooltip>
                      </span>

                      <span className={`font-mono font-bold ${budgetStyle.text}`}>
                        {hasNoData ? '100%' : `${item.errorBudgetRemainingPercent}% còn lại`}
                      </span>
                    </div>

                    {/* Thanh tiến trình ngân sách */}
                    <div className={`w-full h-3 rounded-full overflow-hidden ${budgetStyle.track} p-0.5`}>
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${budgetStyle.bg}`}
                        style={{
                          width: `${Math.max(0, Math.min(100, hasNoData ? 100 : item.errorBudgetRemainingPercent))}%`,
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-[#94A3B8]">
                      <span>
                        Đã dùng:{' '}
                        <strong className="text-slate-700 dark:text-slate-200 font-mono">
                          {item.errorBudgetConsumed.toLocaleString('vi-VN')}
                        </strong>{' '}
                        / {item.errorBudgetTotal.toLocaleString('vi-VN')} sự kiện
                      </span>
                      <span>
                        Tổng đo:{' '}
                        <span className="font-mono">
                          {item.totalEvents.toLocaleString('vi-VN')}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Thẻ Burn Rate & Diễn giải */}
                  <div className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${burnInfo.colorClass}`}>
                    <div className="flex items-center gap-2">
                      <AdminTooltip
                        position="top"
                        content="Tỉ lệ đốt ngân sách lỗi: 1x là tốc độ chuẩn; >1x là đốt nhanh hơn cho phép và có nguy cơ cạn ngân sách."
                      >
                        <span className="font-bold text-xs font-mono cursor-help flex items-center gap-1">
                          Burn Rate: {burnInfo.label}
                          <HelpCircle className="w-3.5 h-3.5 opacity-70" />
                        </span>
                      </AdminTooltip>
                      <span className="text-xs font-medium">
                        — {burnInfo.desc}
                      </span>
                    </div>

                    <AdminBadge variant={burnInfo.badgeVariant} size="xs">
                      {burnInfo.label}
                    </AdminBadge>
                  </div>
                </div>

                {/* Footer thông tin sự kiện tốt / xấu */}
                <div className="pt-3 border-t border-slate-100 dark:border-[#1E293B] flex items-center justify-between text-[11px] text-slate-500 dark:text-[#94A3B8]">
                  <span>
                    Sự kiện đạt:{' '}
                    <strong className="text-emerald-600 dark:text-emerald-400 font-mono">
                      {item.goodEvents.toLocaleString('vi-VN')}
                    </strong>
                  </span>
                  <span>
                    Sự kiện lỗi/chậm:{' '}
                    <strong className="text-rose-600 dark:text-rose-400 font-mono">
                      {item.badEvents.toLocaleString('vi-VN')}
                    </strong>
                  </span>
                </div>
              </AdminCard>
            );
          })}
        </div>
      )}

      {/* MODAL TẠO MỚI / CHỈNH SỬA SLO */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => !isSubmitting && setIsModalOpen(false)}
        title={editingSlo ? 'Chỉnh Sửa Mục Tiêu SLO' : 'Thêm Mục Tiêu SLO Mới'}
        description="Định cấu hình chỉ số mức dịch vụ và mục tiêu phần trăm độ tin cậy"
        size="md"
        footer={
          <>
            <AdminButton
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              Huỷ
            </AdminButton>
            <AdminButton
              variant="primary"
              size="sm"
              onClick={handleSubmitForm}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {editingSlo ? 'Lưu thay đổi' : 'Tạo mục tiêu'}
            </AdminButton>
          </>
        }
      >
        <form onSubmit={handleSubmitForm} className="flex flex-col gap-4">
          {formError && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Key (mã định danh máy đọc) */}
          <AdminInput
            label="Mã định danh (Key)"
            required
            value={formData.key}
            onChange={(e) => setFormData({ ...formData, key: e.target.value })}
            placeholder="vd: api-availability, trips-latency-500"
            hint="Mã duy nhất viết thường, phân tách bằng dấu gạch ngang"
            disabled={isSubmitting}
          />

          {/* Tên hiển thị */}
          <AdminInput
            label="Tên hiển thị mục tiêu"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="vd: API Availability 99.9% (30d)"
            hint="Tên dễ đọc hiển thị trên dashboard giám sát"
            disabled={isSubmitting}
          />

          {/* Loại SLI */}
          <AdminSelect
            label="Loại chỉ số (SLI Type)"
            required
            value={formData.sliType}
            onChange={(e) =>
              setFormData({
                ...formData,
                sliType: e.target.value as 'AVAILABILITY' | 'LATENCY',
              })
            }
            disabled={isSubmitting}
          >
            <option value="AVAILABILITY">
              AVAILABILITY — Độ sẵn sàng (Tỉ lệ request không lỗi 5xx)
            </option>
            <option value="LATENCY">
              LATENCY — Độ trễ phản hồi (Tỉ lệ request dưới ngưỡng thời gian)
            </option>
          </AdminSelect>

          {/* Ngưỡng độ trễ ms — CHỈ HIỂN THỊ KHI sliType === LATENCY */}
          {formData.sliType === 'LATENCY' && (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex flex-col gap-2">
              <AdminInput
                label="Ngưỡng độ trễ tối đa (ms)"
                required
                type="number"
                min={1}
                step={10}
                value={formData.latencyThresholdMs}
                onChange={(e) =>
                  setFormData({ ...formData, latencyThresholdMs: e.target.value })
                }
                placeholder="500"
                hint="Mốc mili-giây coi là nhanh (các mốc tiêu chuẩn: 50, 100, 250, 500, 1000, 2500, 5000)"
                disabled={isSubmitting}
              />
            </div>
          )}

          {/* Mục tiêu % & Cửa sổ ngày */}
          <div className="grid grid-cols-2 gap-3">
            <AdminInput
              label="Mục tiêu (%)"
              required
              type="number"
              min={0.001}
              max={100}
              step={0.01}
              value={formData.objective}
              onChange={(e) =>
                setFormData({ ...formData, objective: e.target.value })
              }
              placeholder="99.9"
              hint="vd: 99.9 hoặc 95"
              disabled={isSubmitting}
            />

            <AdminInput
              label="Cửa sổ đánh giá (Ngày)"
              required
              type="number"
              min={1}
              max={365}
              value={formData.windowDays}
              onChange={(e) =>
                setFormData({ ...formData, windowDays: e.target.value })
              }
              placeholder="30"
              hint="Mặc định 30 ngày theo chuẩn SRE"
              disabled={isSubmitting}
            />
          </div>

          {/* Tiền tố route lọc */}
          <AdminInput
            label="Tiền tố route lọc (Route Prefix)"
            value={formData.routePrefix}
            onChange={(e) =>
              setFormData({ ...formData, routePrefix: e.target.value })
            }
            placeholder="vd: /trips hoặc /auth (để trống = toàn bộ hệ thống)"
            hint="Để trống nếu muốn áp dụng cho toàn bộ các API route"
            disabled={isSubmitting}
          />
        </form>
      </AdminModal>

      {/* MODAL XÁC NHẬN XOÁ SLO */}
      <AdminModal
        isOpen={Boolean(deletingSlo)}
        onClose={() => !isDeleting && setDeletingSlo(null)}
        title="Xác Nhận Xoá Mục Tiêu SLO"
        size="sm"
        footer={
          <>
            <AdminButton
              variant="outline"
              size="sm"
              onClick={() => setDeletingSlo(null)}
              disabled={isDeleting}
            >
              Huỷ
            </AdminButton>
            <AdminButton
              variant="danger"
              size="sm"
              onClick={handleConfirmDelete}
              loading={isDeleting}
              disabled={isDeleting}
              icon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Xác nhận xoá
            </AdminButton>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <p className="text-xs font-semibold text-slate-900 dark:text-[#F8FAFC]">
              Bạn có chắc chắn muốn xoá mục tiêu SLO này không?
            </p>
          </div>
          <p className="text-xs text-slate-600 dark:text-[#94A3B8] leading-relaxed">
            Mục tiêu <strong>{deletingSlo?.name}</strong> (<code>{deletingSlo?.key}</code>) sẽ bị xoá vĩnh viễn khỏi hệ thống giám sát. Toàn bộ lịch sử ngân sách lỗi liên kết sẽ không còn được tính toán.
          </p>
        </div>
      </AdminModal>
    </div>
  );
}
