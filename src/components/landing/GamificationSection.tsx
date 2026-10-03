'use client';

import { useState } from 'react';
import { useGsapEffect, gsap } from '@/hooks/useGsap';
import { 
  Gamepad2, 
  Trophy, 
  RotateCw, 
  Sparkles, 
  Flame,
  Check,
  Vote
} from 'lucide-react';

const wheelSlices = [
  { name: 'Minh béo', color: '#18181B', textColor: '#FAFAFA' },
  { name: 'Mai Linh', color: '#F95738', textColor: '#FFFFFF' },
  { name: 'Hoàng Nam', color: '#27272A', textColor: '#FAFAFA' },
  { name: 'Thanh Trúc', color: '#09090B', textColor: '#FAFAFA' },
  { name: 'Anh Tuấn', color: '#E4E4E7', textColor: '#09090B' },
  { name: 'Thảo An', color: '#3F3F46', textColor: '#FAFAFA' },
];

const quizOptions = [
  { id: 'minh', name: 'Minh béo', note: 'Chuyên gia lạc đường dù mở Google Maps', votes: 68, isPopular: true },
  { id: 'nam', name: 'Hoàng Nam', note: 'Cãi bản đồ bảo rẽ phải nhưng đi thẳng', votes: 18, isPopular: false },
  { id: 'linh', name: 'Mai Linh', note: 'Mải quay TikTok quên lối ra ngã tư', votes: 10, isPopular: false },
  { id: 'truc', name: 'Thanh Trúc', note: 'Đi theo linh tính vũ trụ mách bảo', votes: 4, isPopular: false },
];

const bingoTasks = [
  { id: 1, text: 'Dậy trước 05:30 săn mây', done: true },
  { id: 2, text: 'Thử món cay nhất chợ đêm', done: true },
  { id: 3, text: 'Nhờ người bản địa chụp ảnh hộ', done: false },
  { id: 4, text: 'Hát bài tủ trên xe ô tô', done: true },
  { id: 5, text: 'Lạc đường nhưng gặp quán ngon', done: true },
  { id: 6, text: 'Cả nhóm mặc đồ cùng tông màu', done: false },
  { id: 7, text: 'Check-in đủ 5 quán cafe', done: true },
  { id: 8, text: 'Không ai kêu mệt suốt buổi sáng', done: false },
  { id: 9, text: 'Quay vòng quay ai bao trà sữa', done: true },
];

export default function GamificationSection() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [wheelWinner, setWheelWinner] = useState<string | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>('minh');
  const [tasks, setTasks] = useState(bingoTasks);

  const containerRef = useGsapEffect<HTMLElement>((target, _ctx, isReduced) => {
    if (isReduced) return;

    gsap.from('.game-card-anim', {
      scrollTrigger: {
        trigger: target,
        start: 'top 75%',
      },
      y: 35,
      opacity: 0,
      stagger: 0.12,
      duration: 0.7,
      ease: 'power2.out',
    });
  }, []);

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWheelWinner(null);

    const randomSlice = Math.floor(Math.random() * wheelSlices.length);
    const sliceAngle = 360 / wheelSlices.length;
    const additionalDegrees = 360 * 5 + randomSlice * sliceAngle + sliceAngle / 2;
    const newRotation = wheelRotation + additionalDegrees;

    setWheelRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setWheelWinner(wheelSlices[randomSlice].name);
    }, 3200);
  };

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  return (
    <section
      id="gamification"
      ref={containerRef}
      className="py-20 md:py-32 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-700/80 mb-3.5">
            <Gamepad2 className="w-3.5 h-3.5 text-[#F95738]" />
            <span>03. GAME NHÓM & MINI THỬ THÁCH SQUAD</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white mb-4">
            Chuyến đi gắn kết. Không một giây nhàm chán.
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed">
            Hết cảnh mỗi người cắm mặt vào một chiếc điện thoại riêng. Với câu hỏi thử thách độ hiểu ý, Vòng quay ai trả tiền ngẫu nhiên, và Bảng nhiệm vụ Trip Bingo, tiếng cười luôn rộn rã suốt mọi chặng đường.
          </p>
        </div>

        {/* 3-Column Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Col 1: Interactive Squad Quiz Challenge (Who Knows The Squad Best?) */}
          <div className="lg:col-span-6 game-card-anim rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/30 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-700/80">
                  <Vote className="w-3.5 h-3.5 text-[#F95738]" />
                  <span>SQUAD VOTE • THỬ THÁCH ĐỘ HIỂU NHAU</span>
                </div>
                <span className="text-xs font-mono text-zinc-500">Câu 3 / 5</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white mb-2 leading-snug">
                &quot;Ai là người có nguy cơ lạc đường cao nhất dù đang cầm bản đồ?&quot;
              </h3>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mb-6 font-normal">
                Bấm chọn một người bạn để xem cả nhóm có cùng chung suy nghĩ không:
              </p>

              {/* Vote Choice Cards */}
              <div className="flex flex-col gap-2.5 mb-6">
                {quizOptions.map((opt) => {
                  const isSelected = selectedQuiz === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedQuiz(opt.id)}
                      className={`relative w-full p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer overflow-hidden ${
                        isSelected
                          ? 'border-[#F95738] bg-white dark:bg-zinc-900 shadow-sm'
                          : 'border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700'
                      }`}
                    >
                      {/* Live Vote Progress Bar Fill */}
                      {isSelected && (
                        <div 
                          className="absolute inset-y-0 left-0 bg-[#F95738]/10 dark:bg-[#F95738]/15 transition-all duration-500 rounded-2xl pointer-events-none"
                          style={{ width: `${opt.votes}%` }}
                        />
                      )}

                      <div className="relative z-10 flex items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold text-zinc-950 dark:text-white">
                              {opt.name}
                            </h4>
                            {opt.isPopular && isSelected && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F95738]/15 text-[#F95738]">
                                Đa số bình chọn
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                            {opt.note}
                          </p>
                        </div>

                        {isSelected ? (
                          <span className="text-sm font-mono font-bold text-[#F95738] shrink-0">
                            {opt.votes}%
                          </span>
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-zinc-300 dark:border-zinc-700 shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quiz Outcome Toast */}
            {selectedQuiz && (
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Chính xác! 4/6 thành viên cùng bình chọn cho đáp án này 🤣
                </span>
              </div>
            )}
          </div>

          {/* Col 2: Sleek Interactive Wheel (Who Pays) */}
          <div className="lg:col-span-6 game-card-anim rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/30 p-6 sm:p-8 shadow-sm flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-700/80 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#F95738]" />
              <span>VÒNG QUAY MAY RỦI</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white mb-1">
              Vòng quay &quot;Ai bao chầu này?&quot;
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mb-6">
              Không thể thống nhất ai bao trà sữa hay cafe? Bấm quay để thuật toán ngẫu nhiên phân định công bằng.
            </p>

            {/* Wheel Container */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-2 flex items-center justify-center">
              {/* Pointer at the top */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-x-[12px] border-x-transparent border-t-[20px] border-t-[#F95738] drop-shadow-md" />

              {/* The Spinning SVG Wheel */}
              <div
                className="w-full h-full rounded-full border border-zinc-300 dark:border-zinc-700 shadow-xl overflow-hidden bg-zinc-950"
                style={{
                  transform: `rotate(${wheelRotation}deg)`,
                  transition: isSpinning
                    ? 'transform 3.2s cubic-bezier(0.15, 0.9, 0.25, 1)'
                    : 'none',
                }}
              >
                <svg viewBox="0 0 200 200" className="w-full h-full select-none">
                  {wheelSlices.map((slice, i) => {
                    const angle = 360 / wheelSlices.length;
                    const startAngle = (i * angle * Math.PI) / 180;
                    const endAngle = (((i + 1) * angle) * Math.PI) / 180;
                    const x1 = (100 + 100 * Math.cos(startAngle)).toFixed(2);
                    const y1 = (100 + 100 * Math.sin(startAngle)).toFixed(2);
                    const x2 = (100 + 100 * Math.cos(endAngle)).toFixed(2);
                    const y2 = (100 + 100 * Math.sin(endAngle)).toFixed(2);

                    const textAngle = (i * angle + angle / 2).toFixed(2);
                    const textRad = (parseFloat(textAngle) * Math.PI) / 180;
                    const textX = (100 + 62 * Math.cos(textRad)).toFixed(2);
                    const textY = (100 + 62 * Math.sin(textRad)).toFixed(2);

                    return (
                      <g key={i}>
                        <path
                          d={`M100,100 L${x1},${y1} A100,100 0 0,1 ${x2},${y2} Z`}
                          fill={slice.color}
                          stroke="#27272A"
                          strokeWidth="1.5"
                        />
                        <text
                          x={textX}
                          y={textY}
                          fill={slice.textColor}
                          fontSize="9.5"
                          fontWeight="700"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          transform={`rotate(${parseFloat(textAngle) + 90}, ${textX}, ${textY})`}
                        >
                          {slice.name}
                        </text>
                      </g>
                    );
                  })}
                  {/* Center circle pin */}
                  <circle cx="100" cy="100" r="16" fill="#09090B" stroke="#3F3F46" strokeWidth="2" />
                  <circle cx="100" cy="100" r="8" fill="#F95738" />
                </svg>
              </div>
            </div>

            {/* Spin Trigger Button */}
            <div className="mt-6 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={spinWheel}
                disabled={isSpinning}
                className={`inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold transition-all cursor-pointer shadow-sm ${
                  isSpinning
                    ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                    : 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:opacity-90'
                }`}
              >
                <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
                <span>{isSpinning ? 'Đang quay số phận...' : 'Bấm để quay chầu này!'}</span>
              </button>

              {wheelWinner && (
                <div className="mt-2 px-4 py-2.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                  🎉 Chúc mừng <span className="underline font-bold">{wheelWinner}</span> đã trúng suất bao cả nhóm!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Secondary Row: Trip Bingo & End-Trip Awards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-8">
          {/* Trip Bingo Card */}
          <div className="lg:col-span-6 game-card-anim rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/30 p-6 sm:p-7 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-zinc-950 dark:text-white">Bảng nhiệm vụ Trip Bingo</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Hoàn thành đủ 1 hàng để nhận huy hiệu chuyến đi</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#F95738]">
                {tasks.filter((t) => t.done).length}/9 hoàn thành
              </span>
            </div>

            {/* 3x3 Bingo Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
              {tasks.map((task) => (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between min-h-[82px] transition-all cursor-pointer ${
                    task.done
                      ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 text-zinc-900 dark:text-emerald-300'
                      : 'border-zinc-200/70 dark:border-zinc-800/70 bg-white dark:bg-zinc-900/70 text-zinc-700 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <span className="text-xs font-medium leading-snug">
                    {task.text}
                  </span>
                  <div className="flex justify-end">
                    <span
                      className={`w-4 h-4 rounded-md border flex items-center justify-center text-[10px] ${
                        task.done 
                          ? 'bg-emerald-500 border-emerald-500 text-white' 
                          : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800'
                      }`}
                    >
                      {task.done && <Check className="w-3 h-3 stroke-[3]" />}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* End-Trip Squad Awards */}
          <div className="lg:col-span-6 game-card-anim rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/30 p-6 sm:p-7 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-4 h-4 text-[#F95738]" />
              <h4 className="text-base font-semibold text-zinc-950 dark:text-white">Giải thưởng tổng kết chuyến đi</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white dark:bg-zinc-900/70 text-center">
                <span className="text-2xl block mb-1">📸</span>
                <p className="text-xs font-semibold text-zinc-950 dark:text-white">Bậc Thầy Sống Ảo</p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Hoàng Nam (450 tấm)</p>
              </div>

              <div className="p-4 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white dark:bg-zinc-900/70 text-center">
                <span className="text-2xl block mb-1">👑</span>
                <p className="text-xs font-semibold text-zinc-950 dark:text-white">Thủ Quỹ Quyền Lực</p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Mai Linh (Chuẩn 100%)</p>
              </div>

              <div className="p-4 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white dark:bg-zinc-900/70 text-center">
                <span className="text-2xl block mb-1">😴</span>
                <p className="text-xs font-semibold text-zinc-950 dark:text-white">Chiến Thần Ngủ Nướng</p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Minh béo (+30 phút)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
