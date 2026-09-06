'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  getConfigsAction,
  updateConfigAction,
  deleteConfigAction,
  testGeminiApiKeyAction,
  testSendgridApiKeyAction,
} from '@/app/actions';
import {
  Save,
  Sparkles,
  Mail,
  CreditCard,
  ToggleLeft,
  RefreshCw,
  Key,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Eye,
  EyeOff,
  Copy,
  Check,
  Plus,
  Trash2,
  Edit2,
  Download,
  Sliders,
  AlertTriangle,
  Activity,
  RotateCcw,
  XCircle,
  Settings,
  Search,
} from 'lucide-react';
import ErrorState from '@/components/ErrorState';
import ToastContainer, { ToastMessage } from '@/components/ui/Toast';
import ConfirmModal from '@/components/ui/ConfirmModal';
import {
  AdminCard,
  AdminCardHeader,
  AdminCardTitle,
  AdminCardDescription,
} from '@/components/admin/AdminCard';
import { AdminButton } from '@/components/admin/AdminButton';
import { AdminInput } from '@/components/admin/AdminInput';
import { AdminSwitch } from '@/components/admin/AdminSwitch';
import { AdminBadge } from '@/components/admin/AdminBadge';
import { AdminTabs } from '@/components/admin/AdminTabs';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatCard } from '@/components/admin/AdminStatCard';

interface SystemConfigRecord {
  id?: string;
  key: string;
  value: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

const FEATURE_FLAG_LABELS: Record<string, { label: string; desc: string; category: string }> = {
  ai_planning: {
    label: 'Trợ lý AI Planning',
    desc: 'Cho phép người dùng tạo lịch trình tự động bằng Gemini AI',
    category: 'Trí tuệ nhân tạo',
  },
  moments: {
    label: 'Khoảnh khắc Moments',
    desc: 'Chia sẻ ảnh, boomerang và vị trí check-in trong chuyến đi',
    category: 'Mạng xã hội',
  },
  payments: {
    label: 'Cổng thanh toán ví điện tử',
    desc: 'Kích hoạt thanh toán gói hội viên qua Momo và ZaloPay',
    category: 'Tài chính',
  },
  expenses: {
    label: 'Chia tiền & Chi tiêu nhóm',
    desc: 'Tính năng ghi nhận hoá đơn và chia đều hoặc theo phần trăm',
    category: 'Tài chính',
  },
  journal: {
    label: 'Nhật ký hành trình',
    desc: 'Ghi chép cảm xúc, tâm trạng và câu chuyện chuyến đi',
    category: 'Nội dung',
  },
  todos: {
    label: 'Chuẩn bị hành lý & Checklist',
    desc: 'Danh sách đồ dùng cần mang theo chia việc cho thành viên',
    category: 'Tiện ích',
  },
};

const DEFAULT_FEATURE_FLAGS: Record<string, boolean> = {
  ai_planning: true,
  moments: true,
  payments: true,
  expenses: true,
  journal: true,
  todos: true,
};

const DEFAULT_GENERAL_SETTINGS = {
  maintenanceMode: false,
  maintenanceMessage: 'Hệ thống TripMate đang bảo trì nâng cấp định kỳ. Vui lòng quay lại sau ít phút!',
  maxTripMembers: 50,
  maxUploadSizeMb: 15,
  defaultCurrency: 'VND',
  supportHotline: '1900 6868',
  supportEmail: 'support@tripmate.vn',
};

export default function AdminConfigsPage() {
  const [configs, setConfigs] = useState<SystemConfigRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'flags' | 'api' | 'payments' | 'general' | 'advanced'>('all');

  // Copy feedback state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Parsed Config States - Feature Flags
  const [featureFlags, setFeatureFlags] = useState<Record<string, boolean>>(DEFAULT_FEATURE_FLAGS);
  const [savedFeatureFlags, setSavedFeatureFlags] = useState<Record<string, boolean>>(DEFAULT_FEATURE_FLAGS);
  const [savingFlags, setSavingFlags] = useState(false);

  // Parsed Config States - API Keys
  const [geminiKey, setGeminiKey] = useState('');
  const [sendgridKey, setSendgridKey] = useState('');
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showSendgridKey, setShowSendgridKey] = useState(false);
  const [savingApi, setSavingApi] = useState(false);

  // Live Testing States
  const [testingGemini, setTestingGemini] = useState(false);
  const [geminiTestResult, setGeminiTestResult] = useState<{
    success: boolean;
    message?: string;
    error?: string;
    latency?: number;
  } | null>(null);

  const [testingSendgrid, setTestingSendgrid] = useState(false);
  const [sendgridTestResult, setSendgridTestResult] = useState<{
    success: boolean;
    message?: string;
    error?: string;
    latency?: number;
  } | null>(null);

  // Parsed Config States - Payment
  const [paymentEnv, setPaymentEnv] = useState<'sandbox' | 'production'>('sandbox');
  const [momoPartner, setMomoPartner] = useState('');
  const [momoAccess, setMomoAccess] = useState('');
  const [momoSecret, setMomoSecret] = useState('');
  const [showMomoAccess, setShowMomoAccess] = useState(false);
  const [showMomoSecret, setShowMomoSecret] = useState(false);

  const [zaloAppId, setZaloAppId] = useState('');
  const [zaloKey1, setZaloKey1] = useState('');
  const [zaloKey2, setZaloKey2] = useState('');
  const [showZaloKey1, setShowZaloKey1] = useState(false);
  const [showZaloKey2, setShowZaloKey2] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);

  // General Operational Settings
  const [generalSettings, setGeneralSettings] = useState(DEFAULT_GENERAL_SETTINGS);
  const [savedGeneralSettings, setSavedGeneralSettings] = useState(DEFAULT_GENERAL_SETTINGS);
  const [savingGeneral, setSavingGeneral] = useState(false);

  // Advanced / Custom Configs State
  const [customSearch, setCustomSearch] = useState('');
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    isEditing: boolean;
    key: string;
    value: string;
    description: string;
  }>({
    isOpen: false,
    isEditing: false,
    key: '',
    value: '',
    description: '',
  });
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    key: string;
  }>({
    isOpen: false,
    key: '',
  });
  const [savingCustom, setSavingCustom] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToasts((prev) => [...prev, { id: `${Date.now()}-${prev.length}`, message, type }]);
  };

  const handleCopy = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    showToast(`Đã sao chép ${label} vào bộ nhớ tạm`, 'info');
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const fetchConfigs = async () => {
    setLoading(true);
    setError(null);
    const res = await getConfigsAction();
    if (res.success && res.data) {
      const list: SystemConfigRecord[] = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setConfigs(list);

      list.forEach((c) => {
        if (c.key === 'feature_flags') {
          try {
            const parsed = JSON.parse(c.value);
            setFeatureFlags(parsed);
            setSavedFeatureFlags(parsed);
          } catch (e) {
            console.error('Failed to parse feature flags', e);
          }
        } else if (c.key === 'gemini_api_key') {
          setGeminiKey(c.value);
        } else if (c.key === 'sendgrid_api_key') {
          setSendgridKey(c.value);
        } else if (c.key === 'payment_config') {
          try {
            const payObj = JSON.parse(c.value);
            setPaymentEnv(payObj.environment || 'sandbox');
            setMomoPartner(payObj.momo?.partnerCode || '');
            setMomoAccess(payObj.momo?.accessKey || '');
            setMomoSecret(payObj.momo?.secretKey || '');
            setZaloAppId(payObj.zalopay?.appId || '');
            setZaloKey1(payObj.zalopay?.key1 || '');
            setZaloKey2(payObj.zalopay?.key2 || '');
          } catch (e) {
            console.error('Failed to parse payment configs', e);
          }
        } else if (c.key === 'general_settings') {
          try {
            const parsedGen = JSON.parse(c.value);
            setGeneralSettings((prev) => ({ ...prev, ...parsedGen }));
            setSavedGeneralSettings((prev) => ({ ...prev, ...parsedGen }));
          } catch (e) {
            console.error('Failed to parse general settings', e);
          }
        }
      });
    } else {
      setError(res.error || 'Không thể lấy cấu hình hệ thống');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  // --- FEATURE FLAGS HANDLERS ---
  const handleToggleFlag = (flagName: string) => {
    setFeatureFlags((prev) => ({
      ...prev,
      [flagName]: !prev[flagName],
    }));
  };

  const handleSetAllFlags = (enable: boolean) => {
    const updated: Record<string, boolean> = {};
    Object.keys(featureFlags).forEach((k) => {
      updated[k] = enable;
    });
    setFeatureFlags(updated);
  };

  const handleResetDefaultFlags = () => {
    setFeatureFlags(DEFAULT_FEATURE_FLAGS);
  };

  const hasUnsavedFlags = useMemo(() => {
    return JSON.stringify(featureFlags) !== JSON.stringify(savedFeatureFlags);
  }, [featureFlags, savedFeatureFlags]);

  const handleSaveFeatureFlags = async () => {
    setSavingFlags(true);
    const res = await updateConfigAction(
      'feature_flags',
      JSON.stringify(featureFlags),
      'Bật/tắt các tính năng chính của hệ thống TripMate'
    );
    setSavingFlags(false);
    if (res.success) {
      setSavedFeatureFlags(featureFlags);
      showToast('Đã lưu trạng thái các tính năng hệ thống thành công!', 'success');
      fetchConfigs();
    } else {
      showToast(res.error || 'Lưu cấu hình thất bại', 'error');
    }
  };

  // --- API KEYS HANDLERS ---
  const handleTestGemini = async () => {
    setTestingGemini(true);
    setGeminiTestResult(null);
    const res = await testGeminiApiKeyAction(geminiKey);
    setTestingGemini(false);
    setGeminiTestResult(res);
    if (res.success) {
      showToast(res.message || 'Kết nối Gemini API thành công!', 'success');
    } else {
      showToast(res.error || 'Kết nối Gemini API thất bại!', 'error');
    }
  };

  const handleTestSendgrid = async () => {
    setTestingSendgrid(true);
    setSendgridTestResult(null);
    const res = await testSendgridApiKeyAction(sendgridKey);
    setTestingSendgrid(false);
    setSendgridTestResult(res);
    if (res.success) {
      showToast(res.message || 'Kết nối SendGrid API thành công!', 'success');
    } else {
      showToast(res.error || 'Kết nối SendGrid API thất bại!', 'error');
    }
  };

  const handleSaveApiKeys = async () => {
    setSavingApi(true);
    const [resGemini, resSendgrid] = await Promise.all([
      updateConfigAction('gemini_api_key', geminiKey, 'API key cho Google Gemini AI Assistant'),
      updateConfigAction('sendgrid_api_key', sendgridKey, 'API key cho dịch vụ gửi mail SendGrid'),
    ]);
    setSavingApi(false);

    if (resGemini.success && resSendgrid.success) {
      showToast('Đã cập nhật khoá API Gemini và SendGrid thành công!', 'success');
      fetchConfigs();
    } else {
      showToast('Cập nhật một hoặc nhiều khoá API thất bại', 'error');
    }
  };

  // --- PAYMENT GATEWAY HANDLERS ---
  const handleSavePaymentConfig = async () => {
    setSavingPayment(true);
    const payload = {
      environment: paymentEnv,
      momo: {
        partnerCode: momoPartner,
        accessKey: momoAccess,
        secretKey: momoSecret,
      },
      zalopay: {
        appId: zaloAppId,
        key1: zaloKey1,
        key2: zaloKey2,
      },
    };

    const res = await updateConfigAction(
      'payment_config',
      JSON.stringify(payload),
      'Cấu hình tích hợp cổng thanh toán MoMo & ZaloPay'
    );
    setSavingPayment(false);

    if (res.success) {
      showToast('Đã lưu cấu hình ví thanh toán điện tử MoMo & ZaloPay!', 'success');
      fetchConfigs();
    } else {
      showToast(res.error || 'Cập nhật cấu hình thanh toán thất bại', 'error');
    }
  };

  // --- GENERAL SETTINGS HANDLERS ---
  const hasUnsavedGeneral = useMemo(() => {
    return JSON.stringify(generalSettings) !== JSON.stringify(savedGeneralSettings);
  }, [generalSettings, savedGeneralSettings]);

  const handleSaveGeneralSettings = async () => {
    setSavingGeneral(true);
    const res = await updateConfigAction(
      'general_settings',
      JSON.stringify(generalSettings),
      'Cấu hình tham số vận hành chung của ứng dụng TripMate'
    );
    setSavingGeneral(false);

    if (res.success) {
      setSavedGeneralSettings(generalSettings);
      showToast('Đã lưu cấu hình tham số vận hành chung thành công!', 'success');
      fetchConfigs();
    } else {
      showToast(res.error || 'Cập nhật cấu hình chung thất bại', 'error');
    }
  };

  // --- ADVANCED / CUSTOM CONFIGS HANDLERS ---
  const filteredConfigs = useMemo(() => {
    if (!customSearch.trim()) return configs;
    const q = customSearch.toLowerCase();
    return configs.filter(
      (c) =>
        c.key.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q)) ||
        c.value.toLowerCase().includes(q)
    );
  }, [configs, customSearch]);

  const handleOpenAddModal = () => {
    setModalConfig({
      isOpen: true,
      isEditing: false,
      key: '',
      value: '',
      description: '',
    });
  };

  const handleOpenEditModal = (rec: SystemConfigRecord) => {
    setModalConfig({
      isOpen: true,
      isEditing: true,
      key: rec.key,
      value: rec.value,
      description: rec.description || '',
    });
  };

  const handleSaveCustomModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalConfig.key.trim() || !modalConfig.value.trim()) {
      showToast('Key và Value không được để trống', 'error');
      return;
    }

    setSavingCustom(true);
    const res = await updateConfigAction(
      modalConfig.key.trim(),
      modalConfig.value.trim(),
      modalConfig.description.trim() || undefined
    );
    setSavingCustom(false);

    if (res.success) {
      showToast(
        modalConfig.isEditing
          ? `Đã cập nhật cấu hình @${modalConfig.key} thành công!`
          : `Đã thêm mới cấu hình @${modalConfig.key} thành công!`,
        'success'
      );
      setModalConfig((prev) => ({ ...prev, isOpen: false }));
      fetchConfigs();
    } else {
      showToast(res.error || 'Thao tác cấu hình thất bại', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete.key) return;
    const res = await deleteConfigAction(confirmDelete.key);
    if (res.success) {
      showToast(`Đã xoá cấu hình @${confirmDelete.key} thành công`, 'success');
      setConfirmDelete({ isOpen: false, key: '' });
      fetchConfigs();
    } else {
      showToast(res.error || 'Xoá cấu hình thất bại', 'error');
    }
  };

  const handleExportConfigs = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(configs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `tripmate_configs_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Đã xuất file cấu hình backup JSON thành công!', 'success');
  };

  const enabledFlagsCount = Object.values(featureFlags).filter(Boolean).length;
  const totalFlagsCount = Object.keys(featureFlags).length;

  const tabs = [
    { id: 'all', label: 'Tất Cả Cấu Hình', icon: <Layers className="w-3.5 h-3.5" /> },
    {
      id: 'flags',
      label: 'Tính Năng (Flags)',
      count: `${enabledFlagsCount}/${totalFlagsCount}`,
      icon: <ToggleLeft className="w-3.5 h-3.5" />,
    },
    { id: 'api', label: 'Khoá API Bên Thứ 3', icon: <Key className="w-3.5 h-3.5" /> },
    { id: 'payments', label: 'Cổng Thanh Toán', icon: <CreditCard className="w-3.5 h-3.5" /> },
    { id: 'general', label: 'Vận Hành Chung', icon: <Settings className="w-3.5 h-3.5" /> },
    {
      id: 'advanced',
      label: 'Tuỳ Chỉnh & Raw DB',
      count: `${configs.length}`,
      icon: <Sliders className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <ToastContainer
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />

      {/* Header */}
      <AdminPageHeader
        title="Cấu hình Hệ thống"
        description="Quản trị tham số môi trường, kiểm soát cờ tính năng (feature flags), khoá API ngoại vi và cổng thanh toán."
        badgeText="Production Ready"
        badgeVariant="neutral"
        actions={
          <div className="flex items-center gap-2">
            <AdminButton
              variant="outline"
              size="sm"
              onClick={handleExportConfigs}
              icon={<Download className="w-3.5 h-3.5" />}
            >
              Export JSON
            </AdminButton>
            <AdminButton
              variant="outline"
              size="sm"
              onClick={fetchConfigs}
              loading={loading}
              icon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Tải lại
            </AdminButton>
          </div>
        }
      />

      {/* Status Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard
          title="Trạng Thái Tính Năng"
          value={`${enabledFlagsCount} / ${totalFlagsCount} Đang Bật`}
          description="Cờ tính năng kiểm soát toàn bộ ứng dụng"
          icon={<ToggleLeft className="w-4 h-4" />}
          badgeText={hasUnsavedFlags ? 'Chưa Lưu' : 'Đồng Bộ'}
          badgeVariant={hasUnsavedFlags ? 'warning' : 'success'}
          variant={hasUnsavedFlags ? 'warning' : 'brand'}
        />

        <AdminStatCard
          title="Bảo Mật API Keys"
          value={geminiKey && sendgridKey ? 'Đã Cấu Hình Đầy Đủ' : 'Chưa Hoàn Tất'}
          description="Khoá Gemini AI & SendGrid Email API"
          icon={<ShieldCheck className="w-4 h-4" />}
          badgeText={geminiKey && sendgridKey ? 'Active' : 'Warning'}
          badgeVariant={geminiKey && sendgridKey ? 'success' : 'warning'}
          variant={geminiKey && sendgridKey ? 'success' : 'warning'}
        />

        <AdminStatCard
          title="Cổng Thanh Toán"
          value={momoPartner || zaloAppId ? 'MoMo & ZaloPay' : 'Chưa Kết Nối'}
          description={`Môi trường: ${paymentEnv.toUpperCase()}`}
          icon={<CreditCard className="w-4 h-4" />}
          badgeText={paymentEnv.toUpperCase()}
          badgeVariant={paymentEnv === 'production' ? 'success' : 'neutral'}
          variant="brand"
        />

        <AdminStatCard
          title="Bảo Trì Hệ Thống"
          value={generalSettings.maintenanceMode ? 'Đang BẢO TRÌ' : 'Hoạt Động Bình Thường'}
          description="Khóa truy cập người dùng phổ thông"
          icon={<Activity className="w-4 h-4" />}
          badgeText={generalSettings.maintenanceMode ? 'Bảo Trì' : 'Online'}
          badgeVariant={generalSettings.maintenanceMode ? 'danger' : 'success'}
          variant={generalSettings.maintenanceMode ? 'danger' : 'default'}
        />
      </div>

      {/* Unsaved Changes Warning Callout */}
      {(hasUnsavedFlags || hasUnsavedGeneral) && (
        <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-medium">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              Bạn có một số cấu hình đã được chỉnh sửa nhưng chưa được lưu lại vào hệ thống.
            </span>
          </div>
          <div className="flex items-center gap-2">
            {hasUnsavedFlags && (
              <AdminButton
                variant="primary"
                size="xs"
                onClick={handleSaveFeatureFlags}
                loading={savingFlags}
              >
                Lưu Cờ Tính Năng
              </AdminButton>
            )}
            {hasUnsavedGeneral && (
              <AdminButton
                variant="primary"
                size="xs"
                onClick={handleSaveGeneralSettings}
                loading={savingGeneral}
              >
                Lưu Vận Hành
              </AdminButton>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div>
        <AdminTabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={(id) => setActiveTab(id as any)}
        />
      </div>

      {error && !loading && configs.length === 0 ? (
        <ErrorState message={error} onRetry={fetchConfigs} />
      ) : loading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-64 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E293B] animate-pulse p-6"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. FEATURE FLAGS CARD */}
          {(activeTab === 'all' || activeTab === 'flags') && (
            <AdminCard className="flex flex-col justify-between">
              <div>
                <AdminCardHeader>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
                        <ToggleLeft className="w-4 h-4" />
                      </div>
                      <div>
                        <AdminCardTitle>Bật/tắt Tính năng (Feature Flags)</AdminCardTitle>
                        <AdminCardDescription>
                          Kiểm soát hiển thị và cấp quyền tính năng trên ứng dụng TripMate
                        </AdminCardDescription>
                      </div>
                    </div>
                  </div>
                </AdminCardHeader>

                {/* Quick actions bar */}
                <div className="flex items-center justify-between pb-3 pt-1 border-b border-slate-100 dark:border-[#1E293B] text-xs">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Thao tác nhanh:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSetAllFlags(true)}
                      className="px-2 py-1 rounded text-[11px] font-medium bg-slate-100 dark:bg-[#172238] hover:bg-slate-200 dark:hover:bg-[#1E293B] text-slate-700 dark:text-slate-300 transition"
                    >
                      Bật tất cả
                    </button>
                    <button
                      onClick={() => handleSetAllFlags(false)}
                      className="px-2 py-1 rounded text-[11px] font-medium bg-slate-100 dark:bg-[#172238] hover:bg-slate-200 dark:hover:bg-[#1E293B] text-slate-700 dark:text-slate-300 transition"
                    >
                      Tắt tất cả
                    </button>
                    <button
                      onClick={handleResetDefaultFlags}
                      className="px-2 py-1 rounded text-[11px] font-medium bg-slate-100 dark:bg-[#172238] hover:bg-slate-200 dark:hover:bg-[#1E293B] text-slate-700 dark:text-slate-300 transition flex items-center gap-1"
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                      Mặc định
                    </button>
                  </div>
                </div>

                <div className="flex flex-col divide-y divide-slate-100 dark:divide-[#1E293B] mt-2">
                  {Object.keys(featureFlags).map((flag) => {
                    const info = FEATURE_FLAG_LABELS[flag] || {
                      label: flag,
                      desc: `Cờ tính năng hệ thống @${flag}`,
                      category: 'Tuỳ biến',
                    };
                    const isEnabled = featureFlags[flag];

                    return (
                      <div
                        key={flag}
                        className="py-3.5 first:pt-1 last:pb-1 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                              {info.label}
                            </span>
                            <AdminBadge variant={isEnabled ? 'success' : 'neutral'} size="xs">
                              {isEnabled ? 'BẬT' : 'TẮT'}
                            </AdminBadge>
                            <span className="text-[10px] text-slate-400 font-mono">
                              @{flag}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                            {info.desc}
                          </p>
                        </div>
                        <AdminSwitch
                          checked={isEnabled}
                          onChange={() => handleToggleFlag(flag)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-slate-100 dark:border-[#1E293B] flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {hasUnsavedFlags ? '⚠️ Có thay đổi chưa lưu' : 'Đã đồng bộ với máy chủ'}
                </span>
                <AdminButton
                  variant="primary"
                  size="sm"
                  onClick={handleSaveFeatureFlags}
                  loading={savingFlags}
                  icon={<Save className="w-3.5 h-3.5" />}
                >
                  Lưu Cấu Hình Flags
                </AdminButton>
              </div>
            </AdminCard>
          )}

          {/* 2. API INTEGRATIONS CARD WITH LIVE TESTING */}
          {(activeTab === 'all' || activeTab === 'api') && (
            <AdminCard className="flex flex-col justify-between">
              <div>
                <AdminCardHeader>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-100 dark:border-sky-800/50">
                      <Key className="w-4 h-4" />
                    </div>
                    <div>
                      <AdminCardTitle>Khoá API Tích Hợp (API Keys)</AdminCardTitle>
                      <AdminCardDescription>
                        Kết nối dịch vụ ngoại vi Google Gemini AI và SendGrid Transactional Mail
                      </AdminCardDescription>
                    </div>
                  </div>
                </AdminCardHeader>

                <div className="flex flex-col gap-4">
                  {/* Google Gemini API */}
                  <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#0D1424] border border-slate-200 dark:border-[#1E293B] flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                          Google Gemini API
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <AdminButton
                          variant="outline"
                          size="xs"
                          onClick={handleTestGemini}
                          loading={testingGemini}
                          icon={<Activity className="w-3 h-3 text-amber-500" />}
                        >
                          Kiểm tra kết nối
                        </AdminButton>
                        <AdminBadge variant={geminiKey ? 'brand' : 'warning'} size="xs">
                          {geminiKey ? 'Đã Thiết Lập' : 'Chưa Cấu Hình'}
                        </AdminBadge>
                      </div>
                    </div>

                    <div className="relative">
                      <AdminInput
                        type={showGeminiKey ? 'text' : 'password'}
                        value={geminiKey}
                        onChange={(e) => setGeminiKey(e.target.value)}
                        placeholder="AIzaSy..."
                        hint="Dùng cho module Lập lịch trình tự động, phân loại chi tiêu và Quét hoá đơn OCR"
                      />
                      <div className="absolute right-2.5 top-2.5 flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setShowGeminiKey(!showGeminiKey)}
                          className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          title={showGeminiKey ? 'Ẩn khoá' : 'Hiện khoá'}
                        >
                          {showGeminiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopy(geminiKey, 'Gemini API Key')}
                          className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          title="Sao chép"
                        >
                          {copiedKey === 'Gemini API Key' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Test result feedback banner */}
                    {geminiTestResult && (
                      <div
                        className={`p-2.5 rounded-md text-[11px] flex items-center gap-2 ${
                          geminiTestResult.success
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-500/20'
                        }`}
                      >
                        {geminiTestResult.success ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        )}
                        <span className="flex-1">
                          {geminiTestResult.success ? geminiTestResult.message : geminiTestResult.error}
                        </span>
                        {geminiTestResult.latency && (
                          <span className="text-[10px] font-mono opacity-80">
                            {geminiTestResult.latency}ms
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* SendGrid Mailer API */}
                  <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#0D1424] border border-slate-200 dark:border-[#1E293B] flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                          SendGrid Mailer API
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <AdminButton
                          variant="outline"
                          size="xs"
                          onClick={handleTestSendgrid}
                          loading={testingSendgrid}
                          icon={<Activity className="w-3 h-3 text-emerald-500" />}
                        >
                          Kiểm tra kết nối
                        </AdminButton>
                        <AdminBadge variant={sendgridKey ? 'success' : 'warning'} size="xs">
                          {sendgridKey ? 'Đã Thiết Lập' : 'Chưa Cấu Hình'}
                        </AdminBadge>
                      </div>
                    </div>

                    <div className="relative">
                      <AdminInput
                        type={showSendgridKey ? 'text' : 'password'}
                        value={sendgridKey}
                        onChange={(e) => setSendgridKey(e.target.value)}
                        placeholder="SG...."
                        hint="Dùng gửi email xác thực mã OTP, kích hoạt gói và thông báo hoạt động chuyến đi"
                      />
                      <div className="absolute right-2.5 top-2.5 flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setShowSendgridKey(!showSendgridKey)}
                          className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          title={showSendgridKey ? 'Ẩn khoá' : 'Hiện khoá'}
                        >
                          {showSendgridKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopy(sendgridKey, 'SendGrid API Key')}
                          className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          title="Sao chép"
                        >
                          {copiedKey === 'SendGrid API Key' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Test result feedback banner */}
                    {sendgridTestResult && (
                      <div
                        className={`p-2.5 rounded-md text-[11px] flex items-center gap-2 ${
                          sendgridTestResult.success
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-500/20'
                        }`}
                      >
                        {sendgridTestResult.success ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        )}
                        <span className="flex-1">
                          {sendgridTestResult.success ? sendgridTestResult.message : sendgridTestResult.error}
                        </span>
                        {sendgridTestResult.latency && (
                          <span className="text-[10px] font-mono opacity-80">
                            {sendgridTestResult.latency}ms
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-slate-100 dark:border-[#1E293B] flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Chuỗi khoá được lưu trực tiếp vào cơ sở dữ liệu Supabase
                </span>
                <AdminButton
                  variant="primary"
                  size="sm"
                  onClick={handleSaveApiKeys}
                  loading={savingApi}
                  icon={<Save className="w-3.5 h-3.5" />}
                >
                  Lưu Khoá API
                </AdminButton>
              </div>
            </AdminCard>
          )}

          {/* 3. GENERAL OPERATIONAL SETTINGS CARD */}
          {(activeTab === 'all' || activeTab === 'general') && (
            <AdminCard className="flex flex-col justify-between">
              <div>
                <AdminCardHeader>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center border border-orange-100 dark:border-orange-800/50">
                      <Settings className="w-4 h-4" />
                    </div>
                    <div>
                      <AdminCardTitle>Vận Hành & Tham Số Ứng Dụng</AdminCardTitle>
                      <AdminCardDescription>
                        Cấu hình bảo trì hệ thống, giới hạn thành viên và cổng liên hệ CSKH
                      </AdminCardDescription>
                    </div>
                  </div>
                </AdminCardHeader>

                <div className="flex flex-col gap-4">
                  {/* Maintenance Mode */}
                  <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#0D1424] border border-slate-200 dark:border-[#1E293B] flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                          Chế Độ Bảo Trì Ứng Dụng
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Khi bật, chỉ tài khoản quản trị mới có thể đăng nhập vào ứng dụng
                        </p>
                      </div>
                      <AdminSwitch
                        checked={generalSettings.maintenanceMode}
                        onChange={() =>
                          setGeneralSettings((prev) => ({
                            ...prev,
                            maintenanceMode: !prev.maintenanceMode,
                          }))
                        }
                      />
                    </div>

                    {generalSettings.maintenanceMode && (
                      <AdminInput
                        label="Thông báo hiển thị tới người dùng"
                        value={generalSettings.maintenanceMessage}
                        onChange={(e) =>
                          setGeneralSettings((prev) => ({
                            ...prev,
                            maintenanceMessage: e.target.value,
                          }))
                        }
                        placeholder="Hệ thống đang bảo trì..."
                      />
                    )}
                  </div>

                  {/* Operational Limits */}
                  <div className="grid grid-cols-2 gap-3">
                    <AdminInput
                      label="Thành viên tối đa / chuyến"
                      type="number"
                      value={String(generalSettings.maxTripMembers)}
                      onChange={(e) =>
                        setGeneralSettings((prev) => ({
                          ...prev,
                          maxTripMembers: parseInt(e.target.value) || 50,
                        }))
                      }
                      hint="Mặc định: 50 người"
                    />

                    <AdminInput
                      label="Kích thước upload tối đa (MB)"
                      type="number"
                      value={String(generalSettings.maxUploadSizeMb)}
                      onChange={(e) =>
                        setGeneralSettings((prev) => ({
                          ...prev,
                          maxUploadSizeMb: parseInt(e.target.value) || 15,
                        }))
                      }
                      hint="Ảnh & tài liệu đính kèm"
                    />
                  </div>

                  {/* Support Contacts */}
                  <div className="grid grid-cols-2 gap-3">
                    <AdminInput
                      label="Hotline hỗ trợ CSKH"
                      value={generalSettings.supportHotline}
                      onChange={(e) =>
                        setGeneralSettings((prev) => ({
                          ...prev,
                          supportHotline: e.target.value,
                        }))
                      }
                      placeholder="1900 6868"
                    />

                    <AdminInput
                      label="Email tiếp nhận hỗ trợ"
                      value={generalSettings.supportEmail}
                      onChange={(e) =>
                        setGeneralSettings((prev) => ({
                          ...prev,
                          supportEmail: e.target.value,
                        }))
                      }
                      placeholder="support@tripmate.vn"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-slate-100 dark:border-[#1E293B] flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {hasUnsavedGeneral ? '⚠️ Có thay đổi chưa lưu' : 'Đã đồng bộ'}
                </span>
                <AdminButton
                  variant="primary"
                  size="sm"
                  onClick={handleSaveGeneralSettings}
                  loading={savingGeneral}
                  icon={<Save className="w-3.5 h-3.5" />}
                >
                  Lưu Cấu Hình Vận Hành
                </AdminButton>
              </div>
            </AdminCard>
          )}

          {/* 4. PAYMENT GATEWAY CONFIG CARD */}
          {(activeTab === 'all' || activeTab === 'payments') && (
            <AdminCard className="flex flex-col justify-between">
              <div>
                <AdminCardHeader>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-800/50">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <AdminCardTitle>Cổng Thanh Toán Điện Tử (MoMo & ZaloPay)</AdminCardTitle>
                        <AdminCardDescription>
                          Xử lý mua gói PLUS & SQUAD Pass tự động qua ví điện tử
                        </AdminCardDescription>
                      </div>
                    </div>

                    {/* Sandbox / Production selector */}
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#0D1424] p-1 rounded-lg border border-slate-200 dark:border-[#1E293B]">
                      <button
                        type="button"
                        onClick={() => setPaymentEnv('sandbox')}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition ${
                          paymentEnv === 'sandbox'
                            ? 'bg-white dark:bg-[#1E293B] text-amber-700 dark:text-amber-300 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                      >
                        Sandbox
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentEnv('production')}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition ${
                          paymentEnv === 'production'
                            ? 'bg-emerald-500 text-white shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                      >
                        Production
                      </button>
                    </div>
                  </div>
                </AdminCardHeader>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* MoMo Section */}
                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-[#1E293B] bg-slate-50 dark:bg-[#0D1424] flex flex-col gap-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#1E293B]">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          Cổng MoMo Payment
                        </h3>
                      </div>
                      <AdminBadge variant={momoPartner && momoAccess ? 'success' : 'neutral'} size="xs">
                        {momoPartner ? 'Configured' : 'Draft'}
                      </AdminBadge>
                    </div>

                    <AdminInput
                      label="Partner Code"
                      value={momoPartner}
                      onChange={(e) => setMomoPartner(e.target.value)}
                      placeholder="MOMOBK..."
                    />

                    <div className="relative">
                      <AdminInput
                        label="Access Key"
                        type={showMomoAccess ? 'text' : 'password'}
                        value={momoAccess}
                        onChange={(e) => setMomoAccess(e.target.value)}
                        placeholder="klensd8923..."
                      />
                      <button
                        type="button"
                        onClick={() => setShowMomoAccess(!showMomoAccess)}
                        className="absolute right-2.5 top-7 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {showMomoAccess ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="relative">
                      <AdminInput
                        label="Secret Key"
                        type={showMomoSecret ? 'text' : 'password'}
                        value={momoSecret}
                        onChange={(e) => setMomoSecret(e.target.value)}
                        placeholder="s98df723kjh..."
                      />
                      <button
                        type="button"
                        onClick={() => setShowMomoSecret(!showMomoSecret)}
                        className="absolute right-2.5 top-7 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {showMomoSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* ZaloPay Section */}
                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-[#1E293B] bg-slate-50 dark:bg-[#0D1424] flex flex-col gap-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#1E293B]">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          Cổng ZaloPay Payment
                        </h3>
                      </div>
                      <AdminBadge variant={zaloAppId && zaloKey1 ? 'success' : 'neutral'} size="xs">
                        {zaloAppId ? 'Configured' : 'Draft'}
                      </AdminBadge>
                    </div>

                    <AdminInput
                      label="App ID"
                      value={zaloAppId}
                      onChange={(e) => setZaloAppId(e.target.value)}
                      placeholder="2553"
                    />

                    <div className="relative">
                      <AdminInput
                        label="Key 1 (Mac Key)"
                        type={showZaloKey1 ? 'text' : 'password'}
                        value={zaloKey1}
                        onChange={(e) => setZaloKey1(e.target.value)}
                        placeholder="k98234kjhsdf..."
                      />
                      <button
                        type="button"
                        onClick={() => setShowZaloKey1(!showZaloKey1)}
                        className="absolute right-2.5 top-7 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {showZaloKey1 ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="relative">
                      <AdminInput
                        label="Key 2 (Callback Key)"
                        type={showZaloKey2 ? 'text' : 'password'}
                        value={zaloKey2}
                        onChange={(e) => setZaloKey2(e.target.value)}
                        placeholder="sdkjhf8723..."
                      />
                      <button
                        type="button"
                        onClick={() => setShowZaloKey2(!showZaloKey2)}
                        className="absolute right-2.5 top-7 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {showZaloKey2 ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Webhook IPN Box */}
                <div className="mt-4 p-3 rounded-lg border border-slate-200 dark:border-[#1E293B] bg-slate-100 dark:bg-[#0B101B] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="text-[11px] text-slate-600 dark:text-slate-400 truncate">
                      Webhook IPN URL:{' '}
                      <code className="font-mono text-slate-900 dark:text-slate-100">
                        http://localhost:3000/api/v1/payments/webhook
                      </code>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy('http://localhost:3000/api/v1/payments/webhook', 'Webhook IPN URL')
                    }
                    className="px-2 py-1 text-[10px] font-medium rounded bg-white dark:bg-[#1E293B] hover:bg-slate-200 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition flex items-center gap-1 shrink-0 ml-2"
                  >
                    <Copy className="w-2.5 h-2.5" />
                    Copy IPN
                  </button>
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-slate-100 dark:border-[#1E293B] flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Hỗ trợ định dạng JSON đối soát giao dịch
                </span>
                <AdminButton
                  variant="primary"
                  size="sm"
                  onClick={handleSavePaymentConfig}
                  loading={savingPayment}
                  icon={<Save className="w-3.5 h-3.5" />}
                >
                  Lưu Cổng Thanh Toán
                </AdminButton>
              </div>
            </AdminCard>
          )}

          {/* 5. ADVANCED / CUSTOM CONFIGS TABLE (Full-width on all or standalone) */}
          {(activeTab === 'all' || activeTab === 'advanced') && (
            <AdminCard className="md:col-span-2 flex flex-col justify-between">
              <div>
                <AdminCardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
                        <Sliders className="w-4 h-4" />
                      </div>
                      <div>
                        <AdminCardTitle>Cấu Hình Tuỳ Chỉnh & Cơ Sở Dữ Liệu Raw</AdminCardTitle>
                        <AdminCardDescription>
                          Tra cứu, thêm mới và quản lý toàn bộ các bản ghi trong bảng SystemConfig
                        </AdminCardDescription>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative w-48 sm:w-64">
                        <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                        <input
                          type="text"
                          value={customSearch}
                          onChange={(e) => setCustomSearch(e.target.value)}
                          placeholder="Tìm theo key hoặc mô tả..."
                          className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-[#1E293B] bg-white dark:bg-[#0D1424] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <AdminButton
                        variant="primary"
                        size="sm"
                        onClick={handleOpenAddModal}
                        icon={<Plus className="w-3.5 h-3.5" />}
                      >
                        Thêm Cấu Hình
                      </AdminButton>
                    </div>
                  </div>
                </AdminCardHeader>

                {/* Table of all system configs */}
                <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-[#1E293B]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-[#0D1424] border-b border-slate-200 dark:border-[#1E293B] text-slate-600 dark:text-slate-400 font-semibold">
                      <tr>
                        <th className="py-2.5 px-3.5">Khóa Cấu Hình (Key)</th>
                        <th className="py-2.5 px-3.5">Giá Trị (Value Preview)</th>
                        <th className="py-2.5 px-3.5">Mô Tả Chức Năng</th>
                        <th className="py-2.5 px-3.5">Cập Nhật</th>
                        <th className="py-2.5 px-3.5 text-right">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
                      {filteredConfigs.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-400">
                            Không tìm thấy cấu hình phù hợp với từ khoá
                          </td>
                        </tr>
                      ) : (
                        filteredConfigs.map((cfg) => {
                          const isCore = ['feature_flags', 'gemini_api_key', 'sendgrid_api_key', 'payment_config', 'general_settings'].includes(cfg.key);

                          return (
                            <tr
                              key={cfg.key}
                              className="hover:bg-slate-50/50 dark:hover:bg-[#172238]/50 transition group"
                            >
                              <td className="py-2.5 px-3.5 font-mono font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                <span className="text-amber-600 dark:text-amber-400">@</span>
                                <span>{cfg.key}</span>
                                {isCore && (
                                  <AdminBadge variant="brand" size="xs">
                                    Core
                                  </AdminBadge>
                                )}
                              </td>
                              <td className="py-2.5 px-3.5 max-w-xs truncate font-mono text-[11px] text-slate-600 dark:text-slate-300">
                                {cfg.value.length > 50 ? `${cfg.value.slice(0, 50)}...` : cfg.value}
                              </td>
                              <td className="py-2.5 px-3.5 text-slate-600 dark:text-slate-400 max-w-sm truncate">
                                {cfg.description || 'Chưa có mô tả'}
                              </td>
                              <td className="py-2.5 px-3.5 text-slate-400 text-[11px]">
                                {cfg.updatedAt ? new Date(cfg.updatedAt).toLocaleDateString('vi-VN') : 'Mặc định'}
                              </td>
                              <td className="py-2.5 px-3.5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleCopy(cfg.value, `Giá trị @${cfg.key}`)}
                                    className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                    title="Copy Value"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleOpenEditModal(cfg)}
                                    className="p-1 rounded text-amber-600 hover:text-amber-700 dark:text-amber-400"
                                    title="Chỉnh sửa"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  {!isCore && (
                                    <button
                                      onClick={() => setConfirmDelete({ isOpen: true, key: cfg.key })}
                                      className="p-1 rounded text-rose-500 hover:text-rose-700"
                                      title="Xoá cấu hình"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-slate-100 dark:border-[#1E293B] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Tổng cộng: {configs.length} bản ghi cấu hình trong bảng SystemConfig</span>
                <span className="font-mono text-[11px]">Database: PostgreSQL (Supabase Tokyo AWS-1)</span>
              </div>
            </AdminCard>
          )}
        </div>
      )}

      {/* MODAL: ADD / EDIT CUSTOM CONFIG */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E293B] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 dark:border-[#1E293B] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
                  <Sliders className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {modalConfig.isEditing ? `Chỉnh Sửa Cấu Hình @${modalConfig.key}` : 'Thêm Cấu Hình Tuỳ Chỉnh Mới'}
                </h3>
              </div>
              <button
                onClick={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCustomModal} className="p-5 flex flex-col gap-4">
              <AdminInput
                label="Khóa Cấu Hình (Key Name)"
                value={modalConfig.key}
                onChange={(e) =>
                  setModalConfig((prev) => ({
                    ...prev,
                    key: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
                  }))
                }
                placeholder="vd: custom_feature_name"
                disabled={modalConfig.isEditing}
                hint="Dùng chữ cái thường, số và dấu gạch dưới (_)"
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Giá Trị (Value / JSON Text)
                </label>
                <textarea
                  value={modalConfig.value}
                  onChange={(e) => setModalConfig((prev) => ({ ...prev, value: e.target.value }))}
                  placeholder='vd: true, 100, hoặc {"enabled": true}'
                  rows={4}
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-[#1E293B] bg-white dark:bg-[#0D1424] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <AdminInput
                label="Mô Tả Ý Nghĩa & Phạm Vi Sử Dụng"
                value={modalConfig.description}
                onChange={(e) => setModalConfig((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Mục đích sử dụng của biến cấu hình này..."
              />

              <div className="pt-3 border-t border-slate-100 dark:border-[#1E293B] flex items-center justify-end gap-2">
                <AdminButton
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
                >
                  Huỷ Bỏ
                </AdminButton>
                <AdminButton
                  variant="primary"
                  size="sm"
                  type="submit"
                  loading={savingCustom}
                  icon={<Save className="w-3.5 h-3.5" />}
                >
                  {modalConfig.isEditing ? 'Lưu Thay Đổi' : 'Tạo Cấu Hình'}
                </AdminButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        title="Xác Nhận Xoá Cấu Hình"
        message={`Bạn có chắc chắn muốn xoá cấu hình @${confirmDelete.key}? Hành động này sẽ xoá bản ghi vĩnh viễn khỏi cơ sở dữ liệu.`}
        confirmLabel="Xác Nhận Xoá"
        cancelLabel="Huỷ Bỏ"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete({ isOpen: false, key: '' })}
      />
    </div>
  );
}
