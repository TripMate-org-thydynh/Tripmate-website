'use client';

import Link from 'next/link';
import { useState } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import { 
  ArrowLeft, 
  Compass, 
  DollarSign, 
  CheckSquare, 
  Camera, 
  Sparkles, 
  Plus, 
  Check, 
  Heart, 
  MessageCircle, 
  Send,
  User,
  MapPin,
  Smile
} from 'lucide-react';

export default function PreviewPage() {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'expenses' | 'packing' | 'moments' | 'ai'>('itinerary');

  // --- ITINERARY STATE ---
  const [itinerary, setItinerary] = useState([
    { id: 1, day: 1, time: '08:00', place: 'Hồ Tuyền Lâm', note: 'Chèo thuyền SUP ngắm sương mù buổi sáng sớm siêu chill!', category: 'Vui chơi', color: 'bg-[#FF9FCE]' },
    { id: 2, day: 1, time: '12:30', place: 'Lẩu GÀ Lá É Tao Ngộ', note: 'Ăn trưa nạp năng lượng sau khi chèo SUP.', category: 'Ăn uống', color: 'bg-[#FFD043]' },
    { id: 3, day: 1, time: '15:00', place: 'Tiệm Cà Phê Túi Mơ To', note: 'Check-in vườn cúc họa mi huyền thoại.', category: 'Cà phê', color: 'bg-[#C5B4FA]' },
    { id: 4, day: 2, time: '04:30', place: 'Đồi Săn Mây Trại Mát', note: 'Dậy sớm ngắm bình minh và săn mây ngập lối.', category: 'Check-in', color: 'bg-[#A2D2FF]' },
  ]);
  const [newTime, setNewTime] = useState('09:00');
  const [newPlace, setNewPlace] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newDay, setNewDay] = useState(1);

  const addItinerary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlace) return;
    setItinerary([
      ...itinerary,
      {
        id: Date.now(),
        day: newDay,
        time: newTime,
        place: newPlace,
        note: newNote,
        category: 'Tự chọn',
        color: 'bg-white',
      },
    ].sort((a, b) => a.time.localeCompare(b.time)));
    setNewPlace('');
    setNewNote('');
  };

  // --- EXPENSE STATE ---
  const [expenses, setExpenses] = useState([
    { id: 1, desc: 'Thuê Homestay Gỗ 3 đêm', amount: 1500000, paidBy: 'Alex', splits: 'Tất cả (3 người)', color: 'bg-[#FFD043]' },
    { id: 2, desc: 'Lẩu gà lá é ngày 1', amount: 450000, paidBy: 'Linh', splits: 'Tất cả (3 người)', color: 'bg-[#C5B4FA]' },
    { id: 3, desc: 'Xăng xe máy + Thuê xe', amount: 300000, paidBy: 'Minh', splits: 'Minh & Alex', color: 'bg-[#FF9FCE]' },
  ]);
  const [newExpenseDesc, setNewExpenseDesc] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpensePaidBy, setNewExpensePaidBy] = useState('Alex');

  const addExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpenseDesc || !newExpenseAmount) return;
    setExpenses([
      ...expenses,
      {
        id: Date.now(),
        desc: newExpenseDesc,
        amount: parseFloat(newExpenseAmount),
        paidBy: newExpensePaidBy,
        splits: 'Tất cả (3 người)',
        color: 'bg-white',
      },
    ]);
    setNewExpenseDesc('');
    setNewExpenseAmount('');
  };

  // --- PACKING STATE ---
  const [packing, setPacking] = useState([
    { id: 1, name: 'Căn cước công dân / Hộ chiếu', category: 'Giấy tờ', packed: true },
    { id: 2, name: 'Áo khoác ấm (Đà Lạt lạnh)', category: 'Quần áo', packed: false },
    { id: 3, name: 'Máy ảnh + Pin dự phòng', category: 'Thiết bị', packed: false },
    { id: 4, name: 'Kem chống nắng', category: 'Mỹ phẩm', packed: true },
    { id: 5, name: 'Thuốc chống say xe', category: 'Thuốc men', packed: false },
  ]);
  const [newPackingName, setNewPackingName] = useState('');
  const [newPackingCat, setNewPackingCat] = useState('Quần áo');

  const togglePacking = (id: number) => {
    setPacking(packing.map(item => item.id === id ? { ...item, packed: !item.packed } : item));
  };

  const addPacking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPackingName) return;
    setPacking([
      ...packing,
      {
        id: Date.now(),
        name: newPackingName,
        category: newPackingCat,
        packed: false,
      },
    ]);
    setNewPackingName('');
  };

  // --- MOMENTS STATE ---
  const [moments, setMoments] = useState([
    {
      id: 1,
      user: 'Alex Nguyễn',
      avatar: 'AN',
      image: 'https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?auto=format&fit=crop&w=400&q=80',
      caption: 'Bình minh rực rỡ trên đỉnh đồi săn mây Trại Mát! Lạnh buốt nhưng xứng đáng 💯',
      location: 'Đồi Săn Mây Trại Mát',
      likes: 12,
      hasLiked: false,
    },
    {
      id: 2,
      user: 'Linh Trương',
      avatar: 'LT',
      image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=400&q=80',
      caption: 'Góc vườn cúc hoạ mi xinh xắn tại cafe Túi Mơ To 🌼',
      location: 'Tiệm Cà Phê Túi Mơ To',
      likes: 8,
      hasLiked: false,
    },
  ]);

  const likeMoment = (id: number) => {
    setMoments(moments.map(m => {
      if (m.id === id) {
        return {
          ...m,
          likes: m.hasLiked ? m.likes - 1 : m.likes + 1,
          hasLiked: !m.hasLiked,
        };
      }
      return m;
    }));
  };

  // --- AI CHAT STATE ---
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { sender: 'ai', text: 'Chào cậu! Tớ là trợ lý TripMate AI. Cậu muốn tớ gợi ý lịch trình, chia tiền hay chuẩn bị đồ đạc gì cho chuyến đi sắp tới nè?' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponse = 'Tớ đã nhận được thông tin. Để tớ nghiên cứu rồi gợi ý lịch trình tối ưu nhất cho nhóm cậu nhé!';
      const promptLower = userText.toLowerCase();

      if (promptLower.includes('cà phê') || promptLower.includes('cafe')) {
        aiResponse = '☕ Gợi ý 3 quán cà phê view thung lũng đỉnh nhất Đà Lạt cho nhóm cậu:\n1. Tiệm cà phê Túi Mơ To (Vườn cúc họa mi hoài cổ)\n2. Lulababy Coffee (Ngắm hoàng hôn thung lũng đèn cực đẹp)\n3. Cheo Veooo (Yên bình gỗ mộc ngắm thông reo).';
      } else if (promptLower.includes('ăn gì') || promptLower.includes('lẩu')) {
        aiResponse = '🍲 Món ngon Đà Lạt không nên bỏ lỡ:\n- Lẩu gà lá é Tao Ngộ (ấm bụng chiều mưa)\n- Bánh ướt lòng gà Long\n- Bánh tráng nướng quảng trường Lâm Viên\n- Lẩu bò Ba Toa.';
      } else if (promptLower.includes('lịch trình') || promptLower.includes('đi đâu')) {
        aiResponse = '🗺️ Lịch trình Đà Lạt 3N2Đ chill chill:\n- Ngày 1: Chèo SUP hồ Tuyền Lâm -> Thác Datanla -> Check-in Túi Mơ To.\n- Ngày 2: Săn mây Trại Mát -> Chùa Linh Phước -> Nướng BBQ tối.\n- Ngày 3: Chợ Đà Lạt -> Mua quà lưu niệm -> Tạm biệt thành phố ngàn hoa.';
      }

      setChatMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#FEFADC] text-black dark:bg-[#1C1A19] dark:text-white flex flex-col font-quicksand">
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full border-b-[3px] border-black bg-white dark:bg-[#252322] dark:border-white">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 rounded-xl bg-secondary border-2 border-black hover:bg-secondary/80 transition-colors flex items-center justify-center shadow-[2px_2px_0px_0px_#000000]">
              <ArrowLeft className="w-5 h-5 text-black" />
            </Link>
            <span className="font-extrabold text-sm uppercase hidden sm:inline text-black dark:text-white">Thử bản Demo</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-black text-xl lowercase text-black dark:text-white">
              trip<span className="text-primary">.</span>mate
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/admin/login"
              className="px-4 py-2 text-xs font-black uppercase rounded-xl bg-[#C5B4FA] hover:bg-[#C5B4FA]/90 text-black border-2 border-black shadow-[2px_2px_0px_0px_#000000]"
            >
              Vào Admin
            </Link>
          </div>
        </div>
      </header>

      {/* TABS SELECTOR */}
      <div className="bg-[#FEFADC] dark:bg-[#1C1A19] border-b-[3px] border-black dark:border-white py-4 px-6 overflow-x-auto">
        <div className="max-w-4xl mx-auto flex gap-3 justify-between min-w-[620px]">
          {[
            { id: 'itinerary', label: '📅 Lịch trình', icon: Compass },
            { id: 'expenses', label: '💸 Chia tiền', icon: DollarSign },
            { id: 'packing', label: '🎒 Hành lý', icon: CheckSquare },
            { id: 'moments', label: '📸 Moments', icon: Camera },
            { id: 'ai', label: '✨ Trợ lý AI', icon: Sparkles },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase border-[3px] border-black transition-all cursor-pointer ${
                  active 
                    ? 'bg-[#FFD043] text-black shadow-[3px_3px_0px_0px_#000000] translate-y-[-1px]' 
                    : 'bg-white text-black hover:bg-secondary/40 shadow-[2px_2px_0px_0px_#000000]'
                }`}
              >
                <Icon className="w-4.5 h-4.5 shrink-0 text-primary" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* CONTENT AREA */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-6 md:p-8 flex flex-col">
        {/* ITINERARY PREVIEW */}
        {activeTab === 'itinerary' && (
          <div className="flex-1 flex flex-col gap-6 md:grid md:grid-cols-12 md:gap-8">
            <div className="md:col-span-8 flex flex-col gap-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-black uppercase text-black dark:text-white">Lịch trình chuyến đi</h2>
                <div className="flex gap-2">
                  <button onClick={() => setNewDay(1)} className={`px-4 py-1.5 rounded-full text-xs font-extrabold border-2 border-black shadow-[2px_2px_0px_0px_#000000] cursor-pointer ${newDay === 1 ? 'bg-[#FFD043] text-black' : 'bg-white text-black'}`}>Day 1</button>
                  <button onClick={() => setNewDay(2)} className={`px-4 py-1.5 rounded-full text-xs font-extrabold border-2 border-black shadow-[2px_2px_0px_0px_#000000] cursor-pointer ${newDay === 2 ? 'bg-[#FFD043] text-black' : 'bg-white text-black'}`}>Day 2</button>
                </div>
              </div>

              <div className="relative border-l-[3px] border-black dark:border-white pl-6 ml-3 flex flex-col gap-6">
                {itinerary
                  .filter(item => item.day === newDay)
                  .map((item) => (
                    <div key={item.id} className="relative">
                      {/* Timeline dot */}
                      <div className="absolute -left-[32px] top-2.5 w-4 h-4 rounded-full border-[3px] border-black bg-white dark:border-white dark:bg-[#1C1A19] flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white"></div>
                      </div>

                      <div className={`p-5 rounded-3xl border-[3px] border-black shadow-[4px_4px_0px_0px_#000000] text-black ${item.color}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-black uppercase">{item.time}</span>
                          <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-white border border-black font-extrabold uppercase">{item.category}</span>
                        </div>
                        <h4 className="font-black text-sm mb-1 uppercase">{item.place}</h4>
                        <p className="text-xs font-bold leading-relaxed">{item.note}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col gap-4">
              <div className="p-6 rounded-3xl border-[3px] border-black bg-white dark:bg-[#252322] dark:border-white shadow-[4px_4px_0px_0px_#000000]">
                <h3 className="font-black text-xs text-foreground uppercase mb-4">📍 Thêm lịch hoạt động</h3>
                <form onSubmit={addItinerary} className="flex flex-col gap-3">
                  <div>
                    <label className="text-[9px] font-black text-muted-foreground uppercase">Giờ khởi hành</label>
                    <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} className="w-full mt-1 neo-input" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-muted-foreground uppercase">Địa điểm</label>
                    <input type="text" value={newPlace} onChange={e => setNewPlace(e.target.value)} placeholder="VD: Hồ Xuân Hương" className="w-full mt-1 neo-input" required />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-muted-foreground uppercase">Ghi chú</label>
                    <textarea value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="VD: Ngắm cảnh chụp ảnh..." rows={3} className="w-full mt-1 neo-input" />
                  </div>
                  <button type="submit" className="w-full py-3 bg-[#FFD043] text-black text-xs font-black uppercase rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[-1px] cursor-pointer">
                    Thêm hoạt động
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* EXPENSES PREVIEW */}
        {activeTab === 'expenses' && (
          <div className="flex-1 flex flex-col gap-6 md:grid md:grid-cols-12 md:gap-8">
            <div className="md:col-span-8 flex flex-col gap-4">
              <div className="p-6 rounded-3xl border-[3px] border-black bg-[#C5B4FA] text-black shadow-[4px_4px_0px_0px_#000000] flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-black/60">Tổng chi tiêu quỹ nhóm</span>
                  <h3 className="text-2xl font-black">{(expenses.reduce((acc, curr) => acc + curr.amount, 0)).toLocaleString('vi-VN')} VND</h3>
                </div>
                <div className="text-left sm:text-right text-xs font-extrabold">
                  <div>Alex đã chi: {(expenses.filter(e => e.paidBy === 'Alex').reduce((acc, curr) => acc + curr.amount, 0)).toLocaleString('vi-VN')} đ</div>
                  <div>Linh đã chi: {(expenses.filter(e => e.paidBy === 'Linh').reduce((acc, curr) => acc + curr.amount, 0)).toLocaleString('vi-VN')} đ</div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="font-black text-xs uppercase text-black dark:text-white">Danh Sách Hoá Đơn Chi Tiêu</h4>
                {expenses.map(exp => (
                  <div key={exp.id} className={`p-4 rounded-2xl border-[3px] border-black shadow-[3px_3px_0px_0px_#000000] text-black flex items-center justify-between ${exp.color}`}>
                    <div>
                      <h5 className="text-xs font-black uppercase">{exp.desc}</h5>
                      <span className="text-[9px] font-bold text-black/70">Người trả: {exp.paidBy} · Chia cho: {exp.splits}</span>
                    </div>
                    <span className="text-xs font-black">{exp.amount.toLocaleString('vi-VN')} đ</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col gap-4">
              <div className="p-6 rounded-3xl border-[3px] border-black bg-white dark:bg-[#252322] dark:border-white shadow-[4px_4px_0px_0px_#000000]">
                <h3 className="font-black text-xs text-foreground uppercase mb-4">💰 Thêm khoản chi mới</h3>
                <form onSubmit={addExpense} className="flex flex-col gap-3">
                  <div>
                    <label className="text-[9px] font-black text-muted-foreground uppercase">Nội dung</label>
                    <input type="text" value={newExpenseDesc} onChange={e => setNewExpenseDesc(e.target.value)} placeholder="VD: Ăn lẩu gà lá é" className="w-full mt-1 neo-input" required />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-muted-foreground uppercase">Số tiền (đ)</label>
                    <input type="number" value={newExpenseAmount} onChange={e => setNewExpenseAmount(e.target.value)} placeholder="VD: 450000" className="w-full mt-1 neo-input" required />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-muted-foreground uppercase">Người chi</label>
                    <select value={newExpensePaidBy} onChange={e => setNewExpensePaidBy(e.target.value)} className="w-full mt-1 neo-input bg-transparent">
                      <option value="Alex">Alex</option>
                      <option value="Linh">Linh</option>
                      <option value="Minh">Minh</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full py-3 bg-[#FF9FCE] text-black text-xs font-black uppercase rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[-1px] cursor-pointer">
                    Nhập chi tiêu
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* PACKING PREVIEW */}
        {activeTab === 'packing' && (
          <div className="flex-1 flex flex-col gap-6 md:grid md:grid-cols-12 md:gap-8">
            <div className="md:col-span-8 flex flex-col gap-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="font-black text-black dark:text-white uppercase">Hành lý mang theo</h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Xếp được: {packing.filter(i => i.packed).length}/{packing.length} món</p>
                </div>
                <div className="w-24 bg-white dark:bg-card border-2 border-black h-3.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#18A058] h-full transition-all duration-300"
                    style={{ width: `${(packing.filter(i => i.packed).length / packing.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                {packing.map(item => (
                  <div 
                    key={item.id} 
                    onClick={() => togglePacking(item.id)}
                    className={`p-4 rounded-2xl border-[3px] border-black transition-all flex items-center justify-between cursor-pointer shadow-[2px_2px_0px_0px_#000000] ${
                      item.packed 
                        ? 'bg-secondary/15 text-black/60 dark:text-white/60 dark:border-white' 
                        : 'bg-white dark:bg-card hover:translate-y-[-1px] text-black dark:text-white dark:border-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md border-2 border-black flex items-center justify-center transition-all ${
                        item.packed ? 'bg-[#18A058] text-white' : 'bg-white'
                      }`}>
                        {item.packed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className={`text-xs font-black uppercase ${item.packed ? 'line-through text-black/50 dark:text-white/40' : ''}`}>{item.name}</span>
                    </div>
                    <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-secondary border border-black text-black font-extrabold uppercase">{item.category}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col gap-4">
              <div className="p-6 rounded-3xl border-[3px] border-black bg-white dark:bg-[#252322] dark:border-white shadow-[4px_4px_0px_0px_#000000]">
                <h3 className="font-black text-xs text-foreground uppercase mb-4">🎒 Thêm đồ cần chuẩn bị</h3>
                <form onSubmit={addPacking} className="flex flex-col gap-3">
                  <div>
                    <label className="text-[9px] font-black text-muted-foreground uppercase">Tên đồ dùng</label>
                    <input type="text" value={newPackingName} onChange={e => setNewPackingName(e.target.value)} placeholder="VD: Sạc dự phòng" className="w-full mt-1 neo-input" required />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-muted-foreground uppercase">Phân loại</label>
                    <select value={newPackingCat} onChange={e => setNewPackingCat(e.target.value)} className="w-full mt-1 neo-input bg-transparent">
                      <option value="Quần áo">Quần áo</option>
                      <option value="Giấy tờ">Giấy tờ</option>
                      <option value="Thiết bị">Thiết bị</option>
                      <option value="Mỹ phẩm">Mỹ phẩm</option>
                      <option value="Thuốc men">Thuốc men</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full py-3 bg-[#18A058] text-white text-xs font-black uppercase rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[-1px] cursor-pointer">
                    Thêm vào hành lý
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* MOMENTS PREVIEW */}
        {activeTab === 'moments' && (
          <div className="flex-1 flex flex-col gap-6 max-w-md mx-auto w-full">
            <h3 className="font-black text-black dark:text-white text-center uppercase">Khoảnh khắc Moments của Squad</h3>
            {moments.map(m => (
              <div key={m.id} className="rounded-3xl border-[3px] border-black bg-white dark:bg-card shadow-[4px_4px_0px_0px_#000000] overflow-hidden text-black">
                {/* Header */}
                <div className="p-4 flex items-center justify-between border-b border-black">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#C5B4FA] border-2 border-black flex items-center justify-center text-xs font-black text-black">
                      {m.avatar}
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase">{m.user}</h4>
                      <div className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground">
                        <MapPin className="w-2.5 h-2.5 text-primary shrink-0" />
                        {m.location}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image */}
                <div className="relative w-full aspect-square bg-[#FEFADC] flex items-center justify-center overflow-hidden border-b border-black">
                  <img src={m.image} alt={m.caption} className="w-full h-full object-cover" />
                </div>

                {/* Actions */}
                <div className="p-4 flex flex-col gap-3 bg-white">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => likeMoment(m.id)}
                      className={`flex items-center gap-1.5 text-xs font-black cursor-pointer transition ${
                        m.hasLiked ? 'text-primary' : 'text-black hover:text-primary'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${m.hasLiked ? 'fill-primary text-primary' : ''}`} />
                      {m.likes}
                    </button>
                    <span className="flex items-center gap-1.5 text-xs font-black text-black">
                      <MessageCircle className="w-5 h-5" />
                      2 bình luận
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed font-semibold">
                    <b className="font-black uppercase mr-1">{m.user}</b>
                    {m.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI PREVIEW */}
        {activeTab === 'ai' && (
          <div className="flex-1 flex flex-col bg-white border-[3px] border-black rounded-[32px] overflow-hidden shadow-[5px_5px_0px_0px_#000000] max-w-xl mx-auto w-full aspect-[4/5] text-black">
            {/* Header */}
            <div className="p-4 bg-primary text-white flex items-center gap-3 border-b-2 border-black">
              <div className="w-9 h-9 rounded-2xl bg-white/20 border-2 border-white flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase">Trợ lý AI Planner</h4>
                <p className="text-[9px] text-white/80 uppercase font-bold animate-pulse">Online · Powered by Gemini</p>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-[#FEFADC]">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : ''}`}>
                  <div className={`w-7 h-7 rounded-xl border-2 border-black flex items-center justify-center shrink-0 text-xs font-black ${
                    msg.sender === 'user' ? 'bg-[#FFD043] text-black' : 'bg-[#C5B4FA] text-black'
                  }`}>
                    {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-primary" />}
                  </div>
                  <div className={`p-3 rounded-2xl text-xs font-bold leading-relaxed whitespace-pre-line shadow-[2px_2px_0px_0px_#000000] border-2 border-black ${
                    msg.sender === 'user' 
                      ? 'bg-white rounded-tr-none' 
                      : 'bg-white rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3 max-w-[80%]">
                  <div className="w-7 h-7 rounded-xl border-2 border-black bg-[#C5B4FA] flex items-center justify-center text-xs shrink-0">
                    <Sparkles className="w-4 h-4 text-primary animate-spin" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border-2 border-black rounded-tl-none flex items-center gap-1 shadow-[2px_2px_0px_0px_#000000]">
                    <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={sendChatMessage} className="p-4 border-t-2 border-black flex gap-2 bg-white">
              <input 
                type="text" 
                value={chatInput} 
                onChange={e => setChatInput(e.target.value)}
                placeholder="VD: gợi ý 3 quán cà phê view đẹp..." 
                className="flex-1 px-4 py-3 text-xs rounded-xl border-2 border-black bg-background focus:outline-none focus:border-primary font-bold"
              />
              <button type="submit" className="px-4 py-3 bg-[#FFD043] border-2 border-black rounded-xl hover:bg-[#FFD043]/90 transition-colors cursor-pointer flex items-center justify-center shadow-[2px_2px_0px_0px_#000000]">
                <Send className="w-4.5 h-4.5 text-black" />
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
