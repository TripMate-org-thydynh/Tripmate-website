'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useGsapEffect, gsap } from '@/hooks/useGsap';
import EnvironmentalEffects from '@/components/effects/EnvironmentalEffects';
import { 
  Wind, 
  Trophy, 
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

export default function SeasonAutumnChapter() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [wheelWinner, setWheelWinner] = useState<string | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>('minh');
  const [tasks, setTasks] = useState(bingoTasks);

  const containerRef = useGsapEffect<HTMLElement>((target, _ctx, isReduced) => {
    if (isReduced) return;

    gsap.from('.autumn-reveal', {
      scrollTrigger: {
        trigger: target,
        start: 'top 75%',
      },
      y: 35,
      opacity: 0,
      stagger: 0.12,
      duration: 0.75,
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
      id="season-autumn"
      ref={containerRef}
      className="relative py-20 md:py-28 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 transition-colors duration-200 overflow-hidden"
    >
      {/* Dynamic Autumn Falling Leaves Canvas Layer */}
      <EnvironmentalEffects effect="autumn" intensity="medium" className="z-10" />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Seasonal Chapter Master Banner */}
        <div className="autumn-reveal relative rounded-[2.5rem] overflow-hidden border border-zinc-200/80 dark:border-zinc-800 bg-zinc-950 text-white p-8 sm:p-12 mb-16 shadow-2xl">
          <div className="absolute inset-0 z-0">
            <Image
              src="/destinations/season_autumn.jpg"
              alt="Mùa thu lá vàng rực rỡ lãng mạn"
              fill
              priority
              sizes="100vw"
              className="object-cover filter brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
          </div>

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/20 backdrop-blur-md text-orange-300 border border-orange-400/30 text-xs font-semibold mb-4">
              <Wind className="w-3.5 h-3.5 text-orange-400" />
              <span>CHẶNG 03: MÙA THU • RỪNG THÔNG SE LẠNH & MINI-GAME SQUAD</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4 leading-[1.15]">
              Thu Vàng Lãng Mạn. Tiếng Cười Gắn Kết Suốt Chặng Đường.
            </h2>
            <p className="text-base sm:text-lg text-zinc-200 font-normal leading-relaxed mb-6">
              Mùa lãng mạn nhất của thanh xuân: dạo phố ngửi hương hoa sữa Hà Nội, vi vu đồi thông Đà Lạt se lạnh nhâm nhi ly cà phê vợt. Không còn cảnh mỗi người cắm mặt vào một chiếc smartphone riêng — loạt mini-game tương tác của TripMate biến mọi chặng xe hay quán xá thành tràng cười rộn rã.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white">
                📍 Hà Nội - Đà Lạt - Ninh Bình
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-amber-300 font-mono">
                🍂 22°C · Gió heo may se lạnh
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-emerald-300">
                ✓ Game nhóm không cần cài app riêng
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column Interactive Game Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Squad Vote & Bingo Checklist */}
          <div className="lg:col-span-6 autumn-reveal flex flex-col gap-6">
            {/* Squad Vote Challenge */}
            <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/40 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-700/80">
                  <Vote className="w-3.5 h-3.5 text-[#F95738]" />
                  <span>SQUAD VOTE • THỬ THÁCH ĐỘ HIỂU NHAU</span>
                </div>
                <span className="text-xs font-mono text-zinc-500">Câu 3 / 5</span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-zinc-950 dark:text-white mb-2 leading-snug">
                &quot;Ai là người có nguy cơ lạc đường cao nhất dù đang cầm bản đồ?&quot;
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-5 font-normal">
                Bấm chọn một người bạn để xem cả nhóm có cùng chung suy nghĩ không:
              </p>

              {/* Vote Choices */}
              <div className="flex flex-col gap-2.5 mb-5">
                {quizOptions.map((opt) => {
                  const isSelected = selectedQuiz === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedQuiz(opt.id)}
                      className={`relative w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer overflow-hidden ${
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
                            <h4 className="text-xs sm:text-sm font-semibold text-zinc-950 dark:text-white">
                              {opt.name}
                            </h4>
                            {opt.isPopular && isSelected && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F95738]/15 text-[#F95738]">
                                Đa số bình chọn
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                            {opt.note}
                          </p>
                        </div>

                        {isSelected ? (
                          <span className="text-xs sm:text-sm font-mono font-bold text-[#F95738] shrink-0">
                            {opt.votes}%
                          </span>
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-zinc-300 dark:border-zinc-700 shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedQuiz && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Chính xác! 4/6 thành viên cùng vote Minh béo 🤣</span>
                </div>
              )}
            </div>

            {/* Trip Bingo Tasks */}
            <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/40 p-6 sm:p-7 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <h4 className="text-sm sm:text-base font-semibold text-zinc-950 dark:text-white">
                    Trip Bingo • Thử Thách Mùa Thu
                  </h4>
                </div>
                <span className="text-xs font-mono font-semibold text-zinc-500">
                  {tasks.filter((t) => t.done).length}/{tasks.length} Đã xong
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {tasks.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                      task.done
                        ? 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700/80'
                        : 'bg-white/60 dark:bg-zinc-900/40 border-dashed border-zinc-300 dark:border-zinc-700'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center text-white shrink-0 ${
                      task.done ? 'bg-emerald-500' : 'border border-zinc-300 dark:border-zinc-600'
                    }`}>
                      {task.done && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className={`text-xs ${
                      task.done ? 'line-through text-zinc-400' : 'text-zinc-800 dark:text-zinc-200 font-medium'
                    }`}>
                      {task.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sleek Interactive Wheel (Who Pays) */}
          <div className="lg:col-span-6 autumn-reveal rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/40 p-6 sm:p-8 shadow-sm flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-700/80 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#F95738]" />
              <span>VÒNG QUAY MAY RỦI</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white mb-1">
              Vòng quay &quot;Ai bao chầu cà phê này?&quot;
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mb-6">
              Ngồi quán cafe ngắm lá thu rơi, bấm quay để phân định công bằng xem ai may mắn được bao cả hội:
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
                          fontSize="9"
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="central"
                          transform={`rotate(${parseFloat(textAngle) + 90}, ${textX}, ${textY})`}
                        >
                          {slice.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Center Hub Button */}
              <button
                type="button"
                onClick={spinWheel}
                disabled={isSpinning}
                className={`absolute z-20 w-16 h-16 rounded-full bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 shadow-lg flex flex-col items-center justify-center font-bold text-xs cursor-pointer select-none transition-transform active:scale-95 ${
                  isSpinning ? 'opacity-80' : 'hover:scale-105'
                }`}
              >
                <Flame className="w-4 h-4 text-[#F95738] mb-0.5" />
                <span className="text-[10px] text-zinc-900 dark:text-white">QUAY</span>
              </button>
            </div>

            {/* Winner Announcement Banner */}
            <div className="mt-4 min-h-[52px] flex items-center justify-center">
              {wheelWinner ? (
                <div className="p-3 px-6 rounded-2xl bg-[#F95738]/15 border border-[#F95738]/30 text-[#F95738] text-xs sm:text-sm font-bold animate-in zoom-in-95 duration-200">
                  🎉 Người bao chầu này chính là: <span className="underline">{wheelWinner}</span>!
                </div>
              ) : (
                <span className="text-xs text-zinc-400">
                  {isSpinning ? 'Đang quay số ngẫu nhiên...' : 'Bấm nút "QUAY" ở giữa bánh xe để bắt đầu'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
