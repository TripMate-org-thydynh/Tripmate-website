'use client';

import { useEffect, useState } from 'react';
import { getConfigsAction, updateConfigAction } from '@/app/actions';
import {
  Save,
  Check,
  Sparkles,
  Mail,
  CreditCard,
  ToggleLeft,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';

export default function AdminConfigsPage() {
  const [configs, setConfigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Parsed Config States
  const [featureFlags, setFeatureFlags] = useState<Record<string, boolean>>({
    ai_planning: true,
    moments: true,
    payments: true,
    expenses: true,
    journal: true,
    todos: true,
  });

  const [geminiKey, setGeminiKey] = useState('');
  const [sendgridKey, setSendgridKey] = useState('');

  const [momoPartner, setMomoPartner] = useState('');
  const [momoAccess, setMomoAccess] = useState('');
  const [momoSecret, setMomoSecret] = useState('');

  const [zaloAppId, setZaloAppId] = useState('');
  const [zaloKey1, setZaloKey1] = useState('');
  const [zaloKey2, setZaloKey2] = useState('');

  const fetchConfigs = async () => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    const res = await getConfigsAction();
    if (res.success && res.data) {
      setConfigs(res.data);
      
      // Parse configs
      res.data.forEach((c: any) => {
        if (c.key === 'feature_flags') {
          try {
            setFeatureFlags(JSON.parse(c.value));
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
            setMomoPartner(payObj.momo?.partnerCode || '');
            setMomoAccess(payObj.momo?.accessKey || '');
            setMomoSecret(payObj.momo?.secretKey || '');
            setZaloAppId(payObj.zalopay?.appId || '');
            setZaloKey1(payObj.zalopay?.key1 || '');
            setZaloKey2(payObj.zalopay?.key2 || '');
          } catch (e) {
            console.error('Failed to parse payment configs', e);
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

  const handleToggleFlag = (flagName: string) => {
    setFeatureFlags(prev => ({
      ...prev,
      [flagName]: !prev[flagName]
    }));
  };

  const handleSaveFeatureFlags = async () => {
    setError(null);
    setSuccessMsg(null);
    const res = await updateConfigAction('feature_flags', JSON.stringify(featureFlags));
    if (res.success) {
      setSuccessMsg('Đã lưu trạng thái các tính năng hệ thống!');
    } else {
      setError(res.error || 'Lưu cấu hình thất bại');
    }
  };

  const handleSaveApiKeys = async () => {
    setError(null);
    setSuccessMsg(null);
    const [resGemini, resSendgrid] = await Promise.all([
      updateConfigAction('gemini_api_key', geminiKey),
      updateConfigAction('sendgrid_api_key', sendgridKey)
    ]);

    if (resGemini.success && resSendgrid.success) {
      setSuccessMsg('Đã cập nhật khoá API Gemini và SendGrid thành công!');
    } else {
      setError('Cập nhật một hoặc nhiều khoá API thất bại');
    }
  };

  const handleSavePaymentConfig = async () => {
    setError(null);
    setSuccessMsg(null);
    
    const payload = {
      momo: {
        partnerCode: momoPartner,
        accessKey: momoAccess,
        secretKey: momoSecret,
      },
      zalopay: {
        appId: zaloAppId,
        key1: zaloKey1,
        key2: zaloKey2,
      }
    };

    const res = await updateConfigAction('payment_config', JSON.stringify(payload));
    if (res.success) {
      setSuccessMsg('Đã lưu cấu hình ví thanh toán điện tử Momo & ZaloPay!');
    } else {
      setError(res.error || 'Cập nhật cấu hình thanh toán thất bại');
    }
  };

  return (
    <div className="flex flex-col gap-6 text-black">
      {/* Title Header */}
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase text-black dark:text-white tracking-tight">Cấu hình Hệ thống</h1>
          <p className="text-[10px] font-black uppercase text-muted-foreground mt-1">Cài đặt tham số hoạt động tích hợp của ứng dụng.</p>
        </div>
        <button
          onClick={fetchConfigs}
          disabled={loading}
          className="p-2.5 rounded-xl bg-white border-2 border-black hover:bg-secondary text-black shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[-1px] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-destructive/10 border-2 border-destructive text-destructive text-xs font-bold flex items-center gap-2.5 shadow-[2px_2px_0px_0px_#000000]">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500 text-emerald-600 text-xs font-bold flex items-center gap-2.5 shadow-[2px_2px_0px_0px_#000000]">
          <Check className="w-5 h-5" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && !loading && configs.length === 0 ? (
        <ErrorState message={error} onRetry={fetchConfigs} />
      ) : loading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 rounded-3xl bg-white border-2 border-black animate-pulse"></div>
          ))}
        </div>
      ) : configs.length === 0 ? (
        <EmptyState message="Chưa có cấu hình nào trong hệ thống" />
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* FEATURE FLAGS CARD */}
          <div className="p-6 rounded-[32px] bg-white dark:bg-[#252322] border-[3px] border-black dark:border-white shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#ffffff] flex flex-col gap-6 text-black dark:text-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFD043] border-2 border-black text-black flex items-center justify-center shadow-[1px_1px_0px_0px_#000000]">
                <ToggleLeft className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-black text-xs uppercase">Bật/tắt Tính năng (Feature Flags)</h2>
                <p className="text-[9px] font-bold text-muted-foreground uppercase">Bật tắt các module chính hiển thị trên di động.</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {Object.keys(featureFlags).map(flag => (
                <div key={flag} className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FEFADC] dark:bg-[#1C1A19] border-2 border-black dark:border-white text-black dark:text-white shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#ffffff]">
                  <span className="text-xs font-black font-mono">@{flag}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={featureFlags[flag]} 
                      onChange={() => handleToggleFlag(flag)}
                      className="sr-only peer" 
                    />
                    <div className="w-9 h-5 bg-white border-2 border-black rounded-full peer peer-focus:outline-none after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-black after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#FFD043] peer-checked:after:translate-x-4"></div>
                  </label>
                </div>
              ))}
            </div>

            <button
              onClick={handleSaveFeatureFlags}
              className="mt-auto py-3 px-4 bg-[#FFD043] border-2 border-black text-black text-xs font-black uppercase rounded-xl hover:bg-[#FFD043]/90 shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[-1px] transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              Lưu cấu hình tính năng
            </button>
          </div>

          {/* API KEYS CARD */}
          <div className="p-6 rounded-[32px] bg-white dark:bg-[#252322] border-[3px] border-black dark:border-white shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#ffffff] flex flex-col gap-6 text-black dark:text-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#C5B4FA] border-2 border-black text-black flex items-center justify-center shadow-[1px_1px_0px_0px_#000000]">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-black text-xs uppercase">Khoá liên kết API (API Keys)</h2>
                <p className="text-[9px] font-bold text-muted-foreground uppercase">Cấu hình kết nối API cho AI Assistant và Email.</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[9px] font-black text-muted-foreground uppercase block mb-1">Google Gemini API Key</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted-foreground">
                    <Sparkles className="w-4 h-4 text-black dark:text-white" />
                  </span>
                  <input
                    type="password"
                    value={geminiKey}
                    onChange={e => setGeminiKey(e.target.value)}
                    placeholder="Nhập API Key hoặc để trống"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border-2 border-black bg-background focus:outline-none focus:border-primary font-bold text-black"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black text-muted-foreground uppercase block mb-1">SendGrid API Key</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted-foreground">
                    <Mail className="w-4 h-4 text-black dark:text-white" />
                  </span>
                  <input
                    type="password"
                    value={sendgridKey}
                    onChange={e => setSendgridKey(e.target.value)}
                    placeholder="SG.xxxx"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border-2 border-black bg-background focus:outline-none focus:border-primary font-bold text-black"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveApiKeys}
              className="mt-auto py-3 px-4 bg-[#C5B4FA] border-2 border-black text-black text-xs font-black uppercase rounded-xl hover:bg-[#C5B4FA]/90 shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[-1px] transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              Lưu khoá API
            </button>
          </div>

          {/* PAYMENT PLATFORM CONFIG */}
          <div className="p-6 rounded-[32px] bg-white dark:bg-[#252322] border-[3px] border-black dark:border-white shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#ffffff] flex flex-col gap-6 md:col-span-2 text-black dark:text-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FF9FCE] border-2 border-black text-black flex items-center justify-center shadow-[1px_1px_0px_0px_#000000]">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-black text-xs uppercase">Cổng thanh toán liên kết (Momo / ZaloPay)</h2>
                <p className="text-[9px] font-bold text-muted-foreground uppercase">Cấu hình API kết nối môi trường sandbox phục vụ thanh toán nợ chi tiêu.</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              {/* Momo */}
              <div className="flex flex-col gap-4 border-r-0 sm:border-r-[2px] border-black dark:border-white pr-0 sm:pr-8">
                <h3 className="text-xs font-black uppercase border-b border-black dark:border-white pb-2 text-primary">Ví điện tử MoMo</h3>
                <div>
                  <label className="text-[9px] font-black text-muted-foreground uppercase block mb-1">Momo Partner Code</label>
                  <input
                    type="text"
                    value={momoPartner}
                    onChange={e => setMomoPartner(e.target.value)}
                    placeholder="MOMO"
                    className="w-full px-3 py-2 text-xs rounded-xl border-2 border-black bg-background focus:outline-none focus:border-primary font-bold text-black"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-muted-foreground uppercase block mb-1">Momo Access Key</label>
                  <input
                    type="text"
                    value={momoAccess}
                    onChange={e => setMomoAccess(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border-2 border-black bg-background focus:outline-none focus:border-primary font-bold text-black"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-muted-foreground uppercase block mb-1">Momo Secret Key</label>
                  <input
                    type="password"
                    value={momoSecret}
                    onChange={e => setMomoSecret(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border-2 border-black bg-background focus:outline-none focus:border-primary font-bold text-black"
                  />
                </div>
              </div>

              {/* ZaloPay */}
              <div className="flex flex-col gap-4">
                <h3 className="text-xs font-black uppercase border-b border-black dark:border-white pb-2 text-primary">Ví điện tử ZaloPay</h3>
                <div>
                  <label className="text-[9px] font-black text-muted-foreground uppercase block mb-1">ZaloPay App ID</label>
                  <input
                    type="text"
                    value={zaloAppId}
                    onChange={e => setZaloAppId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border-2 border-black bg-background focus:outline-none focus:border-primary font-bold text-black"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-muted-foreground uppercase block mb-1">ZaloPay Key 1</label>
                  <input
                    type="password"
                    value={zaloKey1}
                    onChange={e => setZaloKey1(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border-2 border-black bg-background focus:outline-none focus:border-primary font-bold text-black"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-muted-foreground uppercase block mb-1">ZaloPay Key 2</label>
                  <input
                    type="password"
                    value={zaloKey2}
                    onChange={e => setZaloKey2(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border-2 border-black bg-background focus:outline-none focus:border-primary font-bold text-black"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSavePaymentConfig}
              className="py-3 px-6 bg-[#FF9FCE] border-2 border-black text-black text-xs font-black uppercase rounded-xl hover:bg-[#FF9FCE]/90 shadow-[3px_3px_0px_0px_#000000] hover:translate-y-[-1px] transition flex items-center justify-center gap-1.5 cursor-pointer self-end"
            >
              <Save className="w-3.5 h-3.5" />
              Lưu cấu hình thanh toán
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
