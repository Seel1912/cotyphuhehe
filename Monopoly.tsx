import React, { useState, useEffect, useRef } from 'react';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { 
  getDatabase, 
  ref, 
  set, 
  onValue, 
  update, 
  push 
} from 'firebase/database';
import { 
  Send, 
  Zap, 
  Home, 
  TrendingUp, 
  DollarSign, 
  RefreshCw, 
  Plane,
  Sparkles,
  UsersRound,
  Sun,
  Moon,
  Flag,
  Receipt,
  Lock,
  ShieldAlert,
  Bus,
  Train,
  Droplets
} from 'lucide-react';

// ==========================================
// FIREBASE CONFIGURATION (PRE-CONFIGURED)
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyA2bLx7wTWULpeajMiX41ypiucz80jQMtg",
  authDomain: "cotyphuvn-d56a9.firebaseapp.com",
  projectId: "cotyphuvn-d56a9",
  storageBucket: "cotyphuvn-d56a9.firebasestorage.app",
  messagingSenderId: "691573644997",
  appId: "1:691573644997:web:111b37e4bea069a54bdaac",
  measurementId: "G-P1M3N0LGCE"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getDatabase(app);

// MAP MÀU CHUẨN TAILWIND CHO DẢI MÀU & BORDER Ô ĐẤT
const TILE_COLOR_CLASSES: Record<string, string> = {
  pink: 'bg-pink-500',
  orange: 'bg-orange-500',
  yellow: 'bg-amber-400',
  lime: 'bg-lime-500',
  green: 'bg-emerald-500',
  blue: 'bg-blue-600',
  purple: 'bg-purple-500',
  red: 'bg-rose-600',
  cyan: 'bg-cyan-500',
  gray: 'bg-slate-400'
};

const TILE_BORDER_CLASSES: Record<string, string> = {
  pink: 'border-pink-500 dark:border-pink-400',
  orange: 'border-orange-500 dark:border-orange-400',
  yellow: 'border-amber-500 dark:border-amber-400',
  lime: 'border-lime-500 dark:border-lime-400',
  green: 'border-emerald-500 dark:border-emerald-400',
  blue: 'border-blue-500 dark:border-blue-400',
  purple: 'border-purple-500 dark:border-purple-400',
  red: 'border-rose-500 dark:border-rose-400',
  cyan: 'border-cyan-500 dark:border-cyan-400',
  gray: 'border-slate-400 dark:border-slate-500'
};

// ==========================================
// GAME CONSTANTS & DATA
// ==========================================
const INITIAL_MONEY = 3000000;
const START_BONUS = 300000;
const JAIL_FINE = 100000;
const JAIL_TILE_ID = 8;

const INITIAL_TILES = [
  { id: 0, name: "XUẤT PHÁT", type: "start", price: 0, rent: 0, color: "gray" },
  { id: 1, name: "Phú Yên", type: "property", price: 120000, rent: 15000, color: "pink", group: 1 },
  { id: 2, name: "Khí Vận", type: "chance", price: 0, rent: 0, color: "purple" },
  { id: 3, name: "Mũi Né", type: "property", price: 140000, rent: 18000, color: "pink", group: 1 },
  { id: 4, name: "Quy Nhơn", type: "property", price: 160000, rent: 20000, color: "orange", group: 2 },
  { id: 5, name: "Thuế Thu Nhập", type: "tax", price: 0, rent: 100000, color: "gray" },
  { id: 6, name: "Phan Thiết", type: "property", price: 180000, rent: 22000, color: "orange", group: 2 },
  { id: 7, name: "Măng Đen", type: "property", price: 240000, rent: 30000, color: "orange", group: 2 },
  { id: 8, name: "NHÀ TÙ", type: "jail_visit", price: 0, rent: 0, color: "gray" },
  { id: 9, name: "Đà Lạt", type: "property", price: 260000, rent: 32000, color: "yellow", group: 3 },
  { id: 10, name: "Bến Xe Miền Tây", type: "bus", price: 200000, rent: 25000, color: "cyan" },
  { id: 11, name: "Sa Pa", type: "property", price: 280000, rent: 35000, color: "yellow", group: 3 },
  { id: 12, name: "Hà Giang", type: "property", price: 300000, rent: 38000, color: "yellow", group: 3 },
  { id: 13, name: "Cơ Hội", type: "community", price: 0, rent: 0, color: "purple" },
  { id: 14, name: "Mộc Châu", type: "property", price: 320000, rent: 40000, color: "lime", group: 4 },
  { id: 15, name: "Phong Nha", type: "property", price: 400000, rent: 50000, color: "lime", group: 4 },
  { id: 16, name: "DU LỊCH", type: "travel", price: 0, rent: 0, color: "gray" },
  { id: 17, name: "Cô Tô", type: "property", price: 420000, rent: 52000, color: "green", group: 5 },
  { id: 18, name: "Trạm Thu Phí VIP", type: "tax", price: 0, rent: 150000, color: "gray" },
  { id: 19, name: "Nha Trang", type: "property", price: 450000, rent: 55000, color: "green", group: 5 },
  { id: 20, name: "Ga Hà Nội", type: "bus", price: 200000, rent: 25000, color: "cyan" },
  { id: 21, name: "Đảo Phú Quốc", type: "property", price: 480000, rent: 60000, color: "blue", group: 6 },
  { id: 22, name: "Công Ty Điện EVN", type: "utility", price: 150000, rent: 20000, color: "yellow" },
  { id: 23, name: "Lý Sơn", type: "property", price: 500000, rent: 65000, color: "blue", group: 6 },
  { id: 24, name: "VÀO TÙ", type: "go_to_jail", price: 0, rent: 0, color: "gray" },
  { id: 25, name: "Hội An", type: "property", price: 600000, rent: 80000, color: "purple", group: 7 },
  { id: 26, name: "Ga Đà Nẵng", type: "bus", price: 200000, rent: 25000, color: "cyan" },
  { id: 27, name: "Hạ Long", type: "property", price: 650000, rent: 85000, color: "purple", group: 7 },
  { id: 28, name: "Công Ty Nước Sạch", type: "utility", price: 150000, rent: 20000, color: "yellow" },
  { id: 29, name: "ĐÀ NẴNG", type: "property", price: 900000, rent: 120000, color: "red", group: 8 },
  { id: 30, name: "Bến Xe Miền Đông", type: "bus", price: 200000, rent: 25000, color: "cyan" },
  { id: 31, name: "HUẾ (ĐẮT NHẤT)", type: "property", price: 1000000, rent: 150000, color: "red", group: 8 }
];

const scaleBoardAmount = (amount: number, factor: number, step: number) => Math.round(amount * factor / step) * step;
const BOARD_TILES = INITIAL_TILES.map(tile => ({
  ...tile,
  price: tile.price ? scaleBoardAmount(tile.price, 0.7, 10000) : 0,
  rent: tile.rent ? scaleBoardAmount(tile.rent, 0.75, 1000) : 0
}));
const BOARD_VERSION = 7;
const MARKET_STATES = ['STABLE', 'BOOMING', 'TOURISM', 'RECESSION', 'STORM'] as const;

const WINNING_PROPERTY_SETS = [
  [1, 3, 4, 6, 7],
  [9, 11, 12, 14, 15],
  [17, 19, 21, 23],
  [25, 27, 29, 31]
];

const createGameNotice = (message: string, type: 'info' | 'receive' | 'spend' | 'turn' = 'info') => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  message,
  type
});

const createInitialGame = () => ({
  boardVersion: BOARD_VERSION,
  turn: 'p1',
  roundCount: 1,
  marketState: 'STABLE',
  jackpot: 100000,
  pendingPurchase: null,
  pendingTravel: null,
  pendingDebt: null,
  pendingBuyout: null,
  pendingCard: null,
  winner: null,
  notice: createGameNotice('🔔 Đến lượt Anh Yêu (P1 - 🦈).', 'turn'),
  p1: { name: "Anh Yêu", money: INITIAL_MONEY, pos: 0, inJail: false, jailTurns: 0, hasPass: false, hasInsurance: false, hasCompletedFirstLap: false, bankrupt: false },
  p2: { name: "Em Yêu", money: INITIAL_MONEY, pos: 0, inJail: false, jailTurns: 0, hasPass: false, hasInsurance: false, hasCompletedFirstLap: false, bankrupt: false },
  tiles: BOARD_TILES.map(tile => ({
    ...tile,
    owner: null,
    level: 0,
    protected: false,
    mortgaged: false,
    unvisitedTurns: 0
  }))
});

const getBuildingCost = (tile: any) => scaleBoardAmount(tile.price, 0.25, 5000);

const CHANCE_CARDS = [
  { money: 150000, message: "Dự án du lịch sinh lời! Nhận +150.000 VNĐ." },
  { money: -80000, message: "Nộp phí dịch vụ đường bộ −80.000 VNĐ." },
  { collectJackpot: true, message: "Trúng vé số độc đắc! Nhận toàn bộ tiền Hũ thưởng!" },
  { money: 60000, message: "Bán đặc sản địa phương thành công! Nhận +60.000 VNĐ." }
];

const COMMUNITY_CARDS = [
  { money: 100000, message: "Người thân gửi quà! Nhận +100.000 VNĐ." },
  { money: -50000, jackpotContribution: 50000, message: "Đóng góp −50.000 VNĐ vào Hũ thưởng." },
  { money: 200000, message: "Nhận được học bổng du lịch! Nhận +200.000 VNĐ." },
  { money: -75000, jackpotContribution: 75000, message: "Ủng hộ quỹ cộng đồng −75.000 VNĐ vào Hũ thưởng." },
  { jailPass: true, message: "Nhận được 1 thẻ Miễn Tù! Dùng thẻ này để ra tù miễn phí." }
];

const DICE_PIPS: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8]
};

const getDiceFaces = (value: number) => {
  const opposite = 7 - value;
  const remaining = [1, 2, 3, 4, 5, 6].filter(face => face !== value && face !== opposite);

  return [
    { side: 'front', value },
    { side: 'back', value: opposite },
    { side: 'right', value: remaining[0] },
    { side: 'left', value: 7 - remaining[0] },
    { side: 'top', value: remaining[1] },
    { side: 'bottom', value: 7 - remaining[1] }
  ];
};

export default function CoTyPhuVietnam() {
  const [roomId] = useState('couple_room_travel_jail');
  const [playerRole, setPlayerRole] = useState<'p1' | 'p2'>('p1');
  const [gameState, setGameState] = useState<any>(null);
  const [diceRoll, setDiceRoll] = useState<[number, number]>([1, 1]);
  const [isRolling, setIsRolling] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatList, setChatList] = useState<any[]>([]);
  const [selectedTile, setSelectedTile] = useState<any>(null);
  const [drawnCard, setDrawnCard] = useState<{ title: string; message: string; type: 'chance' | 'community' } | null>(null);
  const [isCardRevealed, setIsCardRevealed] = useState(false);
  const [dismissedNoticeId, setDismissedNoticeId] = useState<string | null>(null);
  const [isAnimatingStep, setIsAnimatingStep] = useState(false);
  
  // Theme Toggle Mode
  const [isDarkMode, setIsDarkMode] = useState(true);

  const audioContextRef = useRef<AudioContext | null>(null);

  // Multi-Action Synthesizer (Web Audio API)
  const playGameSound = (kind: 'dice' | 'receive' | 'spend' | 'build' | 'jail' | 'card' | 'pop') => {
    if (typeof window === 'undefined') return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const startTime = ctx.currentTime;

      if (kind === 'dice') {
        [220, 340, 260, 400, 310].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const t = startTime + idx * 0.055;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.12, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.05);
        });
      } else if (kind === 'receive') {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const t = startTime + idx * 0.075;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.15, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.18);
        });
      } else if (kind === 'spend') {
        const notes = [392.00, 329.63, 261.63];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const t = startTime + idx * 0.09;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.12, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.16);
        });
      } else if (kind === 'build') {
        [320, 450, 580].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const t = startTime + idx * 0.08;
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, t);
          osc.frequency.exponentialRampToValueAtTime(120, t + 0.06);
          gain.gain.setValueAtTime(0.15, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.06);
        });
      } else if (kind === 'jail') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(280, startTime);
        osc.frequency.linearRampToValueAtTime(80, startTime + 0.35);
        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.35);
      } else if (kind === 'card') {
        [880, 1318.5].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const t = startTime + idx * 0.06;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.1, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.1);
        });
      } else if (kind === 'pop') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, startTime);
        osc.frequency.exponentialRampToValueAtTime(800, startTime + 0.05);
        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.05);
      }
    } catch {
      // Fallback
    }
  };

  const toggleThemeMode = () => {
    playGameSound('pop');
    setIsDarkMode(prev => !prev);
  };

  // Initialize Game on Firebase
  useEffect(() => {
    const roomRef = ref(db, `rooms/${roomId}`);
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data?.gameState) {
        // Do not write boardVersion from this realtime listener. An older tab
        // and a newer tab otherwise overwrite each other forever (e.g. 6 ↔ 7).
        // The current client only normalizes board metadata in memory.
        const normalizedGameState = {
          ...data.gameState,
          tiles: data.gameState.tiles.map((tile: any) => {
            const definition = BOARD_TILES[tile.id];
            return definition
              ? { ...tile, color: definition.color, ...(definition.group ? { group: definition.group } : {}) }
              : tile;
          })
        };
        const legacyDebtor = (['p1', 'p2'] as const).find(role =>
          data.gameState[role]?.money < 0 && !data.gameState.pendingDebt && !data.gameState.winner
        );

        if (legacyDebtor) {
          const debtAmount = Math.abs(data.gameState[legacyDebtor].money);
          const liquidationValue = data.gameState.tiles
            .filter((tile: any) => tile.owner === legacyDebtor)
            .reduce((total: number, tile: any) => total + Math.floor(tile.price * 0.5) + tile.level * Math.floor(getBuildingCost(tile) * 0.5), 0);

          if (liquidationValue < debtAmount) {
            const winner = legacyDebtor === 'p1' ? 'p2' : 'p1';
            update(ref(db, `rooms/${roomId}/gameState`), {
              [`${legacyDebtor}/money`]: 0,
              [`${legacyDebtor}/bankrupt`]: true,
              winner,
              turn: winner,
              pendingPurchase: null,
              pendingTravel: null,
              tiles: data.gameState.tiles.map((tile: any) => tile.owner === legacyDebtor
                ? { ...tile, owner: null, level: 0, protected: false, mortgaged: false }
                : tile
              ),
              notice: createGameNotice(`🏳 ${data.gameState[legacyDebtor].name} phá sản. ${data.gameState[winner].name} chiến thắng!`, 'spend')
            });
          } else {
            update(ref(db, `rooms/${roomId}/gameState`), {
              [`${legacyDebtor}/money`]: 0,
              turn: legacyDebtor,
              pendingPurchase: null,
              pendingTravel: null,
              pendingDebt: {
                player: legacyDebtor,
                amount: debtAmount,
                reason: 'khoản nợ còn lại từ lượt trước',
                creditor: null,
                keepTurn: false,
                position: data.gameState[legacyDebtor].pos,
                jackpotContribution: false
              },
              notice: createGameNotice(`⚠️ ${data.gameState[legacyDebtor].name} có số dư âm. Hãy thanh lý tài sản để trả nợ.`, 'spend')
            });
          }
          return;
        }
        setGameState(normalizedGameState);
        if (data.chat) {
          setChatList(Object.values(data.chat));
        }
      } else {
        const initial = createInitialGame();
        set(roomRef, { gameState: initial, chat: data?.chat || {} });
      }
    });

    return () => unsubscribe();
  }, [roomId]);

  useEffect(() => {
    const noticeId = gameState?.notice?.id;
    if (!noticeId) return;

    if (gameState.notice.type === 'receive') playGameSound('receive');
    if (gameState.notice.type === 'spend') playGameSound('spend');

    const timeoutId = setTimeout(() => setDismissedNoticeId(noticeId), 6000);
    return () => clearTimeout(timeoutId);
  }, [gameState?.notice?.id]);

  if (!gameState) {
    return (
      <div className={`w-screen h-screen flex flex-col items-center justify-center font-sans ${
        isDarkMode ? 'bg-slate-950 text-white' : 'bg-gradient-to-br from-emerald-200 via-sky-200 to-pink-200 text-slate-900'
      }`}>
        <div className={`p-8 rounded-2xl border text-center shadow-2xl backdrop-blur-md ${
          isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-gradient-to-br from-emerald-100 via-sky-100 to-pink-100 border-emerald-300'
        }`}>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-pink-600 to-indigo-600 mb-4">
            CỜ TỶ PHÚ VIỆT NAM 💕
          </h1>
          <p className="text-sm mb-6 opacity-70">Đang kết nối Realtime Database...</p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => setPlayerRole('p1')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${playerRole === 'p1' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'bg-slate-800 text-slate-400'}`}
            >
              Vào vai P1 (Anh Yêu 🦈)
            </button>
            <button 
              onClick={() => setPlayerRole('p2')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${playerRole === 'p2' ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/30' : 'bg-slate-800 text-slate-400'}`}
            >
              Vào vai P2 (Em Yêu 🐬)
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isMyTurn = gameState.turn === playerRole && !gameState.winner && !gameState[playerRole].bankrupt;
  const me = gameState[playerRole];
  const opponentRole = playerRole === 'p1' ? 'p2' : 'p1';
  const opponent = gameState[opponentRole];
  const p1OwnedTiles = gameState.tiles.filter((tile: any) => tile.owner === 'p1');
  const p2OwnedTiles = gameState.tiles.filter((tile: any) => tile.owner === 'p2');
  const isLargePaymentNotice = gameState.notice?.type === 'spend' && /(trả|Nộp|mua|xây|đóng)/i.test(gameState.notice.message || '');

  const getTurnUpdate = (keepTurn: boolean, message: string | null = null, type: 'info' | 'receive' | 'spend' | 'turn' = 'turn') => {
    const nextRole = keepTurn ? playerRole : opponentRole;
    const nextPlayer = gameState[nextRole];
    const completesRound = !keepTurn && playerRole === 'p2';
    const nextRound = completesRound ? (gameState.roundCount || 1) + 1 : gameState.roundCount;
    const shouldChangeMarket = completesRound && nextRound % 5 === 0;
    const nextMarket = shouldChangeMarket
      ? MARKET_STATES.filter(state => state !== gameState.marketState)[Math.floor(Math.random() * (MARKET_STATES.length - 1))]
      : gameState.marketState;
    const turnMessage = keepTurn
      ? `🎲 Xúc xắc đôi! ${nextPlayer.name} được đi tiếp 1 lượt.`
      : `🔔 Đến lượt ${nextPlayer.name} (${nextRole === 'p1' ? '🦈' : '🐬'}).`;
    const marketMessage = shouldChangeMarket ? `📈 Thị trường chuyển sang ${nextMarket}.` : null;

    return {
      turn: nextRole,
      marketState: nextMarket,
      notice: createGameNotice([message, marketMessage, turnMessage].filter(Boolean).join('\n'), type),
      ...(completesRound ? { roundCount: nextRound } : {})
    };
  };

  const hasPendingPurchase = gameState.pendingPurchase?.player === playerRole;
  const hasPendingTravel = Boolean(gameState.pendingTravel);

  const checkColorSetOwned = (group: number) => {
    if (!group) return false;
    const groupTiles = gameState.tiles.filter((t: any) => t.group === group);
    const firstOwner = groupTiles[0]?.owner;
    if (!firstOwner) return false;
    return groupTiles.every((t: any) => t.owner === firstOwner);
  };

  // KIỂM TRA SỞ HỮU ĐỘC QUYỀN ĐIỆN & NƯỚC
  const ownsAllUtilities = (role: 'p1' | 'p2', tiles = gameState.tiles) =>
    tiles.filter((t: any) => t.type === 'utility').length > 0 &&
    tiles.filter((t: any) => t.type === 'utility').every((t: any) => t.owner === role);

  // KIỂM TRA SỞ HỮU ĐỘC QUYỀN BẾN XE & GA TÀU
  const ownsAllTransit = (role: 'p1' | 'p2', tiles = gameState.tiles) =>
    tiles.filter((t: any) => t.type === 'bus').length > 0 &&
    tiles.filter((t: any) => t.type === 'bus').every((t: any) => t.owner === role);

  // CẬP NHẬT CÔNG THỨC TÍNH TIỀN THUÊ THEO YÊU CẦU:
  // - Đất trống chưa xây nhà (level 0): 50% giá sở hữu
  // - Mỗi lần xây thêm (level 1..4): +50% giá sở hữu per level (L1: 100%, L2: 150%, L3: 200%, L4: 250%)
  const calculateCurrentRent = (tile: any) => {
    if (!tile.owner || tile.mortgaged || gameState.marketState === 'STORM') return 0;

    if (tile.type !== 'property' || !tile.price) {
      let baseRent = tile.rent || 0;
      if (gameState.marketState === 'BOOMING') baseRent *= 1.3;
      if (gameState.marketState === 'RECESSION') baseRent *= 0.8;
      return Math.floor(baseRent);
    }

    // Mốc đầu là 50% giá sở hữu, mỗi cấp nhà cộng thêm 50%
    let rent = Math.floor(tile.price * (0.5 + 0.5 * tile.level));

    if (checkColorSetOwned(tile.group)) {
      rent = tile.level === 0 ? rent * 2 : Math.floor(rent * 1.25);
    }

    if (gameState.marketState === 'BOOMING') rent *= 1.3;
    if (gameState.marketState === 'RECESSION') rent *= 0.8;
    if (gameState.marketState === 'TOURISM') rent *= 2;

    // SỞ HỮU CẢ CÔNG TY ĐIỆN & NƯỚC: GIẢM 20% GIÁ THUÊ CỦA ĐỐI THỦ
    const opponentOfOwner = tile.owner === 'p1' ? 'p2' : 'p1';
    if (ownsAllUtilities(opponentOfOwner)) {
      rent *= 0.8;
    }

    return Math.floor(rent);
  };

  const ownsWinningSet = (role: 'p1' | 'p2', tiles = gameState.tiles) =>
    WINNING_PROPERTY_SETS.some(set => set.every(tileId => tiles[tileId]?.owner === role));

  const getSaleValue = (tile: any, sellBuilding: boolean) =>
    Math.floor((sellBuilding ? getBuildingCost(tile) : tile.price) * 0.5);

  const getLiquidationValue = (role: 'p1' | 'p2') => gameState.tiles
    .filter((tile: any) => tile.owner === role)
    .reduce((total: number, tile: any) => total + getSaleValue(tile, false) + tile.level * getSaleValue(tile, true), 0);

  const declareBankruptcy = (debt: any) => {
    const updatedTiles = gameState.tiles.map((tile: any) => tile.owner === playerRole
      ? { ...tile, owner: null, level: 0, protected: false, mortgaged: false }
      : tile
    );

    update(ref(db, `rooms/${roomId}/gameState`), {
      [`${playerRole}/money`]: 0,
      [`${playerRole}/bankrupt`]: true,
      winner: opponentRole,
      turn: opponentRole,
      tiles: updatedTiles,
      pendingDebt: null,
      pendingPurchase: null,
      pendingTravel: null,
      notice: createGameNotice(`🏳️️ ${me.name} phá sản. ${opponent.name} chiến thắng!`, 'spend')
    });
    setSelectedTile(null);
  };

  const openDebtResolution = (amount: number, reason: string, creditor: 'p1' | 'p2' | null, keepTurn: boolean, position: number, options: { jackpotContribution?: boolean; hasCompletedFirstLap: boolean; hasPass: boolean; money: number }) => {
    const pendingDebt = { player: playerRole, amount, reason, creditor, keepTurn, position, jackpotContribution: Boolean(options.jackpotContribution) };
    const totalAvailable = options.money + getLiquidationValue(playerRole);

    if (totalAvailable < amount) {
      declareBankruptcy(pendingDebt);
      return;
    }

    update(ref(db, `rooms/${roomId}/gameState`), {
      [`${playerRole}/pos`]: position,
      [`${playerRole}/money`]: options.money,
      [`${playerRole}/hasPass`]: options.hasPass,
      [`${playerRole}/hasCompletedFirstLap`]: options.hasCompletedFirstLap,
      pendingDebt,
      pendingPurchase: null,
      pendingTravel: null,
      notice: createGameNotice(`⚠️ ${me.name} cần thanh toán ${amount.toLocaleString()} VNĐ: ${reason}. Hãy bán tài sản để trả nợ.`, 'spend')
    });
  };

  // Step-by-step Pawn Hopping Movement
  const movePawnStepByStep = async (startPos: number, steps: number) => {
    setIsAnimatingStep(true);
    let currentPos = startPos;
    let passedStartInHop = false;
    
    for (let i = 1; i <= steps; i++) {
      currentPos = (startPos + i) % BOARD_TILES.length;
      if (currentPos === 0) {
        passedStartInHop = true;
      }

      const updatedState = { ...gameState };
      updatedState[playerRole].pos = currentPos;
      if (passedStartInHop) {
        updatedState[playerRole].hasCompletedFirstLap = true;
      }
      
      setGameState(updatedState);
      await new Promise(res => setTimeout(res, 200));
    }

    setIsAnimatingStep(false);
    return { finalPos: currentPos, passedStart: passedStartInHop };
  };

  // Roll Dice & Execute
  const handleRollDice = async () => {
    if (!isMyTurn || isRolling || isAnimatingStep) return;
    setIsRolling(true);
    playGameSound('dice');

    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const totalSteps = d1 + d2;
    const isDouble = d1 === d2;

    setDiceRoll([d1, d2]);

    setTimeout(async () => {
      setIsRolling(false);

      if (me.inJail) {
        const jailTurnsCount = (me.jailTurns || 0) + 1;

        if (!isDouble) {
          if (jailTurnsCount >= 3) {
            const { finalPos, passedStart } = await movePawnStepByStep(me.pos, totalSteps);

            update(ref(db, `rooms/${roomId}/gameState`), {
              [`${playerRole}/inJail`]: false,
              [`${playerRole}/jailTurns`]: 0,
              notice: createGameNotice(`🔓 ${me.name} đã ở tù đủ 3 lượt! Ra tù miễn phí và di chuyển ${totalSteps} bước.`, 'receive')
            });
            handleLandingEvent(finalPos, false, passedStart, `🔓 ${me.name} ra tù miễn phí sau 3 lượt và di chuyển ${totalSteps} bước.`);
            return;
          } else {
            update(ref(db, `rooms/${roomId}/gameState`), {
              [`${playerRole}/jailTurns`]: jailTurnsCount,
              ...getTurnUpdate(false, `❌ ${me.name} gieo [${d1}-${d2}] (lần ${jailTurnsCount}/3 không phải đôi), chưa ra được tù!`, 'spend'),
              pendingTravel: null
            });
            return;
          }
        } else {
          const { finalPos, passedStart } = await movePawnStepByStep(me.pos, totalSteps);
          update(ref(db, `rooms/${roomId}/gameState`), {
            [`${playerRole}/inJail`]: false,
            [`${playerRole}/jailTurns`]: 0,
            notice: createGameNotice(`🎉 ${me.name} gieo đôi [${d1}-${d2}], ra tù thành công!`, 'receive')
          });
          handleLandingEvent(finalPos, isDouble, passedStart, `🎉 ${me.name} gieo đôi [${d1}-${d2}] ra tù!`);
          return;
        }
      }

      const doubleNoticeMsg = isDouble ? `🎲 ĐỔ ĐÔI [${d1}-${d2}]! Bạn được thêm 1 lượt nữa.\n` : '';
      const { finalPos, passedStart } = await movePawnStepByStep(me.pos, totalSteps);
      handleLandingEvent(finalPos, isDouble, passedStart, doubleNoticeMsg);
    }, 850);
  };

  // Handle Tile Landing Event
  const handleLandingEvent = (pos: number, isDouble: boolean, passedStart: boolean, extraMsg: string = '') => {
    const tile = gameState.tiles[pos];
    const hasCompletedFirstLap = me.hasCompletedFirstLap || passedStart || pos === 0;
    let newMoney = me.money + (passedStart ? START_BONUS : 0);
    let newJackpot = gameState.jackpot;
    let newHasPass = me.hasPass;
    const eventMessages: string[] = extraMsg ? [extraMsg] : [];

    if (passedStart) {
      eventMessages.push(`💰 ${me.name} đi qua Xuất Phát, nhận +${START_BONUS.toLocaleString()} VNĐ!`);
      playGameSound('receive');
    }

    const releaseJailFields = me.inJail ? {
      [`${playerRole}/inJail`]: false,
      [`${playerRole}/jailTurns`]: 0
    } : {};

    if (tile.type === 'tax') {
      if (newMoney < tile.rent) {
        openDebtResolution(
          tile.rent,
          `thuế tại ${tile.name}`,
          null,
          isDouble,
          pos,
          { jackpotContribution: true, hasCompletedFirstLap, hasPass: newHasPass, money: newMoney }
        );
        return;
      }
      newMoney -= tile.rent;
      newJackpot += tile.rent;
      eventMessages.push(`💸 ${me.name} vào ${tile.name}: Nộp thuế −${tile.rent.toLocaleString()} VNĐ!`);
      playGameSound('spend');
    }

    if (tile.type === 'chance' || tile.type === 'community') {
      const cards = tile.type === 'chance' ? CHANCE_CARDS : COMMUNITY_CARDS;
      const card = cards[Math.floor(Math.random() * cards.length)];

      playGameSound('card');
      setDrawnCard({
        title: tile.type === 'chance' ? 'Thẻ Khí Vận' : 'Thẻ Cơ Hội',
        message: card.message,
        type: tile.type
      });
      setIsCardRevealed(false);

      newMoney += card.money || 0;
      if (card.collectJackpot) {
        newMoney += newJackpot;
        newJackpot = 0;
      }
      if (card.jackpotContribution) {
        newJackpot += card.jackpotContribution;
      }
      if (card.jailPass) {
        newHasPass = true;
      }

      eventMessages.push(`📢 ${me.name} vào ô ${tile.name}: ${card.message}`);
      if ((card.money && card.money > 0) || card.collectJackpot) playGameSound('receive');
      if (card.money && card.money < 0) playGameSound('spend');
    }

    // ĐỘC QUYỀN BẾN XE + GA TÀU KHÓA DU LỊCH ĐỐI THỦ
    if (tile.type === 'travel' || tile.type === 'parking') {
      const opponentOwnsAllTransit = ownsAllTransit(opponentRole);
      if (opponentOwnsAllTransit) {
        eventMessages.push(`🚫 ${me.name} không thể dùng Du Lịch do ${opponent.name} đã độc quyền toàn bộ Bến Xe & Ga Tàu!`);
        playGameSound('spend');
        update(ref(db, `rooms/${roomId}/gameState`), {
          [`${playerRole}/pos`]: pos,
          [`${playerRole}/money`]: newMoney,
          [`${playerRole}/hasPass`]: newHasPass,
          [`${playerRole}/hasCompletedFirstLap`]: hasCompletedFirstLap,
          ...releaseJailFields,
          jackpot: newJackpot,
          ...getTurnUpdate(isDouble, eventMessages.join('\n'), 'spend'),
          pendingPurchase: null,
          pendingTravel: null
        });
        return;
      }

      setSelectedTile(null);
      update(ref(db, `rooms/${roomId}/gameState`), {
        [`${playerRole}/pos`]: pos,
        [`${playerRole}/money`]: newMoney,
        [`${playerRole}/hasPass`]: newHasPass,
        [`${playerRole}/hasCompletedFirstLap`]: hasCompletedFirstLap,
        jackpot: newJackpot,
        ...getTurnUpdate(true, eventMessages.join('\n') || `✈️ ${me.name} tới ô Du Lịch. Chọn điểm đến!`, eventMessages.length ? 'receive' : 'turn'),
        pendingPurchase: null,
        pendingTravel: { player: playerRole, from: pos, keepTurn: isDouble }
      });
      return;
    }

    if (tile.type === 'go_to_jail') {
      eventMessages.push(`🚨 ${me.name} bị đưa vào Tù!`);
      playGameSound('jail');
      update(ref(db, `rooms/${roomId}/gameState`), {
        ...releaseJailFields,
        [`${playerRole}/pos`]: JAIL_TILE_ID,
        [`${playerRole}/money`]: newMoney,
        [`${playerRole}/inJail`]: true,
        [`${playerRole}/jailTurns`]: 0,
        [`${playerRole}/hasPass`]: newHasPass,
        [`${playerRole}/hasCompletedFirstLap`]: hasCompletedFirstLap,
        jackpot: newJackpot,
        ...getTurnUpdate(false, eventMessages.join('\n'), 'spend'),
        pendingPurchase: null,
        pendingTravel: null
      });
      return;
    }

    if (tile.owner && tile.owner !== playerRole && !tile.mortgaged) {
      const calculatedRent = calculateCurrentRent(tile);
      if (newMoney >= calculatedRent) {
        newMoney -= calculatedRent;
        const opponentMoney = opponent.money + calculatedRent;
        eventMessages.push(`💸 ${me.name} trả ${calculatedRent.toLocaleString()} VNĐ tiền thuê tại ${tile.name} cho ${opponent.name}!`);
        playGameSound('spend');
        const buyoutCost = tile.type === 'property' ? tile.price + tile.level * getBuildingCost(tile) : 0;
        const canBuyout = buyoutCost > 0 && newMoney >= buyoutCost;

        update(ref(db, `rooms/${roomId}/gameState`), {
          [`${playerRole}/pos`]: pos,
          [`${playerRole}/money`]: newMoney,
          [`${playerRole}/hasPass`]: newHasPass,
          [`${playerRole}/hasCompletedFirstLap`]: hasCompletedFirstLap,
          [`${opponentRole}/money`]: opponentMoney,
          ...releaseJailFields,
          jackpot: newJackpot,
          ...(canBuyout
            ? {
                turn: playerRole,
                notice: createGameNotice(`${eventMessages.join('\n')}\n🏠 Bạn có thể mua lại ${tile.name} với giá ${buyoutCost.toLocaleString()} VNĐ.`, 'spend')
              }
            : getTurnUpdate(isDouble, eventMessages.join('\n'), 'spend')
          ),
          pendingPurchase: null,
          pendingTravel: null,
          pendingBuyout: canBuyout ? { player: playerRole, tileId: tile.id, cost: buyoutCost, keepTurn: isDouble } : null
        });
      } else {
        openDebtResolution(
          calculatedRent,
          `tiền thuê tại ${tile.name} cho ${opponent.name}`,
          opponentRole,
          isDouble,
          pos,
          { hasCompletedFirstLap, hasPass: newHasPass, money: newMoney }
        );
      }
      return;
    }

    const isOwnProperty = tile.owner === playerRole && tile.type === 'property';
    const buildingCost = isOwnProperty ? getBuildingCost(tile) : 0;
    const canBuildOnOwn = isOwnProperty && tile.level < 4 && newMoney >= buildingCost && !(tile.level === 3 && !hasCompletedFirstLap);
    const canBuyTile = !tile.owner && tile.price > 0;

    if (canBuyTile) {
      setSelectedTile(tile);
      eventMessages.push(`🏡 ${me.name} tới ${tile.name}. Hãy quyết định mua đất.`);
    } else if (isOwnProperty) {
      setSelectedTile(tile);
      if (canBuildOnOwn) {
        eventMessages.push(`🏠 ${me.name} tới ô đất của mình (${tile.name}). Bạn có thể xây nhà/khách sạn!`);
      } else if (tile.level >= 4) {
        eventMessages.push(`🏰 ${me.name} tới ô đất của mình (${tile.name}) - Đã đạt cấp Khách sạn tối đa.`);
      } else {
        eventMessages.push(`🏠 ${me.name} tới ô đất của mình (${tile.name}) - Không đủ tiền xây thêm.`);
      }
    }

    update(ref(db, `rooms/${roomId}/gameState`), {
      [`${playerRole}/pos`]: pos,
      [`${playerRole}/money`]: newMoney,
      [`${playerRole}/hasPass`]: newHasPass,
      [`${playerRole}/hasCompletedFirstLap`]: hasCompletedFirstLap,
      ...releaseJailFields,
      jackpot: newJackpot,
      ...getTurnUpdate(canBuyTile || isOwnProperty || isDouble, eventMessages.join('\n'), passedStart ? 'receive' : 'turn'),
      pendingPurchase: (canBuyTile || isOwnProperty) ? { player: playerRole, tileId: pos, keepTurn: isDouble, isOwn: isOwnProperty } : null,
      pendingTravel: null,
      pendingBuyout: null
    });
  };

  const handleBuyProperty = (tileId: number) => {
    const tile = gameState.tiles[tileId];
    const pendingPurchase = gameState.pendingPurchase;
    if (!isMyTurn || pendingPurchase?.player !== playerRole || pendingPurchase.tileId !== tileId || tile.owner) return;
    if (me.money < tile.price) return alert("Không đủ tiền mặt!");

    playGameSound('spend');
    const updatedTiles = [...gameState.tiles];
    updatedTiles[tileId].owner = playerRole;
    const winsGame = ownsWinningSet(playerRole, updatedTiles);

    const moneyAfterBuy = me.money - tile.price;
    const buildingCost = getBuildingCost(tile);
    const canBuildHouseNow = tile.type === 'property' && moneyAfterBuy >= buildingCost;
    const keepTurnAfterBuy = pendingPurchase.keepTurn || canBuildHouseNow;

    update(ref(db, `rooms/${roomId}/gameState`), {
      [`${playerRole}/money`]: moneyAfterBuy,
      tiles: updatedTiles,
      winner: winsGame ? playerRole : null,
      pendingPurchase: null,
      ...(winsGame
        ? { notice: createGameNotice(`🏆 ${me.name} đã sở hữu trọn một dãy đất và chiến thắng!`, 'receive') }
        : getTurnUpdate(
            keepTurnAfterBuy,
            `🏡 ${me.name} đã mua thành công ${tile.name} (−${tile.price.toLocaleString()} VNĐ)!${canBuildHouseNow ? ' Bạn có thể xây nhà ngay.' : ''}`,
            'spend'
          )
      )
    });

    if (canBuildHouseNow) {
      setSelectedTile(updatedTiles[tileId]);
    } else {
      setSelectedTile(null);
    }
  };

  const handleBuildHouseDirect = (tileId: number) => {
    const tile = gameState.tiles[tileId];
    const buildingCost = getBuildingCost(tile);
    const isBuildingHotel = tile.level === 3;
    const pendingPurchase = gameState.pendingPurchase;
    const keepTurnFromDouble = Boolean(pendingPurchase?.keepTurn);

    if (!isMyTurn || tile.owner !== playerRole || tile.type !== 'property' || tile.level >= 4) return;
    
    if (isBuildingHotel && !me.hasCompletedFirstLap) {
      return alert("Bạn cần chạy hoàn thành ít nhất 1 vòng đầu tiên (qua ô Xuất Phát) mới được phép xây Khách sạn!");
    }
    if (me.money < buildingCost) return alert("Không đủ tiền xây công trình!");

    playGameSound('build');
    const newLevel = tile.level + 1;
    const moneyAfterBuild = me.money - buildingCost;
    const updatedTiles = gameState.tiles.map((currentTile: any) =>
      currentTile.id === tileId ? { ...currentTile, level: newLevel } : currentTile
    );

    const buildText = newLevel === 4 ? "Khách sạn 🏨" : `Nhà cấp ${newLevel} 🏠`;
    const canBuildMore = newLevel < 4 && moneyAfterBuild >= buildingCost && !(newLevel === 3 && !me.hasCompletedFirstLap);
    const continueTurn = canBuildMore || keepTurnFromDouble;

    update(ref(db, `rooms/${roomId}/gameState`), {
      [`${playerRole}/money`]: moneyAfterBuild,
      tiles: updatedTiles,
      ...(continueTurn
        ? {
            notice: createGameNotice(`🏗️ ${me.name} đã xây ${buildText} tại ${tile.name} (−${buildingCost.toLocaleString()} VNĐ)!${keepTurnFromDouble ? ' (Đổ đôi: Được đi tiếp)' : ''}`, 'spend')
          }
        : getTurnUpdate(
            false,
            `🏗 ${me.name} đã xây ${buildText} tại ${tile.name} (−${buildingCost.toLocaleString()} VNĐ)!`,
            'spend'
          )
      )
    });

    if (canBuildMore) {
      setSelectedTile(updatedTiles[tileId]);
    } else {
      setSelectedTile(null);
    }
  };

  const handleFinishTurnOnOwnProperty = () => {
    if (!isMyTurn) return;
    const pendingPurchase = gameState.pendingPurchase;
    const keepTurnFromDouble = Boolean(pendingPurchase?.keepTurn);

    update(ref(db, `rooms/${roomId}/gameState`), {
      ...getTurnUpdate(keepTurnFromDouble, `↪️ ${me.name} hoàn tất thao tác tại ô nhà mình.`),
      pendingPurchase: null
    });
    setSelectedTile(null);
  };

  const handleSkipPurchase = () => {
    const pendingPurchase = gameState.pendingPurchase;
    if (pendingPurchase?.player !== playerRole) return;

    update(ref(db, `rooms/${roomId}/gameState`), {
      ...getTurnUpdate(pendingPurchase.keepTurn),
      pendingPurchase: null
    });
    setSelectedTile(null);
  };

  const handleBuyoutProperty = () => {
    const buyout = gameState.pendingBuyout;
    const tile = buyout ? gameState.tiles[buyout.tileId] : null;
    if (!buyout || buyout.player !== playerRole || !tile || tile.owner !== opponentRole || me.money < buyout.cost) return;

    const updatedTiles = gameState.tiles.map((currentTile: any) => currentTile.id === tile.id
      ? { ...currentTile, owner: playerRole, protected: false }
      : currentTile
    );
    const winsGame = ownsWinningSet(playerRole, updatedTiles);
    update(ref(db, `rooms/${roomId}/gameState`), {
      [`${playerRole}/money`]: me.money - buyout.cost,
      [`${opponentRole}/money`]: opponent.money + buyout.cost,
      tiles: updatedTiles,
      pendingBuyout: null,
      winner: winsGame ? playerRole : null,
      ...(winsGame
        ? { notice: createGameNotice(`🏆 ${me.name} mua lại ${tile.name}, hoàn tất một dãy đất và chiến thắng!`, 'receive') }
        : getTurnUpdate(buyout.keepTurn, `🏠 ${me.name} đã mua lại ${tile.name} cùng công trình hiện có (−${buyout.cost.toLocaleString()} VNĐ).`, 'spend')
      )
    });
  };

  const handleSkipBuyout = () => {
    const buyout = gameState.pendingBuyout;
    if (buyout?.player !== playerRole) return;
    update(ref(db, `rooms/${roomId}/gameState`), {
      pendingBuyout: null,
      ...getTurnUpdate(buyout.keepTurn, `↪️ ${me.name} không mua lại ô đất này.`)
    });
  };

  // BÁN TÀI SẢN TRONG MODAL TRẢ NỢ (CHỈ DÙNG KHI THIẾU TIỀN THUÊ / THUẾ)
  const handleSellAsset = (tileId: number, sellBuilding: boolean) => {
    const debt = gameState.pendingDebt;
    const tile = gameState.tiles[tileId];
    if (debt?.player !== playerRole || tile?.owner !== playerRole) return;
    if (sellBuilding && tile.level <= 0) return;
    if (!sellBuilding && tile.level > 0) return alert("Cần bán hết nhà trước khi bán đất!");

    playGameSound('receive');
    const saleValue = getSaleValue(tile, sellBuilding);
    const updatedTiles = gameState.tiles.map((currentTile: any) => {
      if (currentTile.id !== tileId) return currentTile;
      if (sellBuilding) return { ...currentTile, level: currentTile.level - 1 };
      return { ...currentTile, owner: null, level: 0, protected: false, mortgaged: false };
    });

    update(ref(db, `rooms/${roomId}/gameState`), {
      [`${playerRole}/money`]: me.money + saleValue,
      tiles: updatedTiles,
      notice: createGameNotice(`💰 ${me.name} đã bán ${sellBuilding ? '1 căn nhà' : tile.name} (+${saleValue.toLocaleString()} VNĐ) để trả nợ.`, 'receive')
    });
    setSelectedTile(null);
  };

  const handleSettleDebt = () => {
    const debt = gameState.pendingDebt;
    if (debt?.player !== playerRole || me.money < debt.amount) return;

    const updates: Record<string, any> = {
      [`${playerRole}/money`]: me.money - debt.amount,
      pendingDebt: null,
      pendingPurchase: null,
      pendingTravel: null,
      ...getTurnUpdate(debt.keepTurn, `💸 ${me.name} đã thanh toán ${debt.amount.toLocaleString()} VNĐ ${debt.reason}.`, 'spend')
    };
    if (debt.creditor) updates[`${debt.creditor}/money`] = gameState[debt.creditor].money + debt.amount;
    if (debt.jackpotContribution) updates.jackpot = gameState.jackpot + debt.amount;

    playGameSound('spend');
    update(ref(db, `rooms/${roomId}/gameState`), updates);
  };

  const handlePayJailFine = () => {
    if (!isMyTurn || !me.inJail) return;
    if (me.money < JAIL_FINE) return alert("Không đủ tiền nộp phạt!");

    playGameSound('spend');
    update(ref(db, `rooms/${roomId}/gameState`), {
      [`${playerRole}/money`]: me.money - JAIL_FINE,
      [`${playerRole}/inJail`]: false,
      [`${playerRole}/jailTurns`]: 0,
      notice: createGameNotice(`🔓 ${me.name} đóng ${JAIL_FINE.toLocaleString()} VNĐ tiền phạt và ra tù thành công!`, 'spend')
    });
  };

  const handleUseJailPass = () => {
    if (!isMyTurn || !me.inJail || !me.hasPass) return;

    playGameSound('receive');
    update(ref(db, `rooms/${roomId}/gameState`), {
      [`${playerRole}/hasPass`]: false,
      [`${playerRole}/inJail`]: false,
      [`${playerRole}/jailTurns`]: 0,
      notice: createGameNotice(`🎟️ ${me.name} dùng thẻ Miễn Tù và ra tù thành công!`, 'receive')
    });
  };

  const handleTravelToDestination = async (destinationId: number) => {
    const pendingTravel = gameState.pendingTravel;

    if (isAnimatingStep || pendingTravel?.player !== playerRole || !Number.isInteger(destinationId) || destinationId < 0 || destinationId >= BOARD_TILES.length || destinationId === pendingTravel.from) return;

    const steps = (destinationId - pendingTravel.from + BOARD_TILES.length) % BOARD_TILES.length;
    const { finalPos, passedStart } = await movePawnStepByStep(pendingTravel.from, steps);
    handleLandingEvent(finalPos, pendingTravel.keepTurn, passedStart, `✈️ ${me.name} đáp xuống ${gameState.tiles[destinationId].name}`);
  };

  const handleResetGame = async () => {
    if (!window.confirm("Đặt lại bàn cờ và tiền của cả hai người chơi?")) return;

    try {
      await set(ref(db, `rooms/${roomId}/gameState`), createInitialGame());
      setSelectedTile(null);
      setDrawnCard(null);
      setDiceRoll([1, 1]);
    } catch {
      alert("Không thể đặt lại bàn cờ.");
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    push(ref(db, `rooms/${roomId}/chat`), {
      sender: playerRole,
      text: chatMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    setChatMessage('');
  };

  return (
    <div className={`w-screen h-screen flex flex-col font-sans overflow-hidden select-none transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-slate-950 text-slate-100' 
        : 'bg-gradient-to-br from-emerald-200 via-teal-100 via-sky-200 to-pink-200 text-slate-900'
    }`}>
      
      {/* ========================================================= */}
      {/* REALTIME TOP FLOATING NOTICE BANNER */}
      {/* ========================================================= */}
      {gameState?.notice?.message && !gameState.pendingTravel && dismissedNoticeId !== gameState.notice.id && (
        <div className="fixed left-1/2 top-1/4 z-[80] w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-xl transition-all ${
            gameState.notice.type === 'receive'
              ? isDarkMode ? 'bg-emerald-950/95 border-emerald-500/70 text-emerald-100' : 'bg-emerald-100/95 border-emerald-400 text-emerald-950 shadow-emerald-500/20'
              : gameState.notice.type === 'spend'
              ? isDarkMode ? 'bg-rose-950/95 border-rose-500/70 text-rose-100' : 'bg-rose-100/95 border-rose-400 text-rose-950 shadow-rose-500/20'
              : gameState.notice.type === 'turn'
              ? isDarkMode ? 'bg-indigo-950/95 border-indigo-500/70 text-indigo-100' : 'bg-indigo-100/95 border-indigo-400 text-indigo-950 shadow-indigo-500/20'
              : isDarkMode ? 'bg-slate-900/95 border-slate-700 text-slate-100' : 'bg-gradient-to-r from-emerald-100 via-cyan-100 to-pink-100 border-emerald-300 text-slate-900 shadow-xl'
          }`}>
            <div className="text-xl shrink-0">
              {gameState.notice.type === 'receive' ? '💰' : gameState.notice.type === 'spend' ? '💸' : gameState.notice.type === 'turn' ? '🎲' : '📢'}
            </div>
            <div className={`${isLargePaymentNotice ? 'text-base sm:text-lg font-black' : 'text-xs sm:text-sm'} whitespace-pre-line font-bold flex-1 leading-relaxed`}>
              {gameState.notice.message}
            </div>
            <button 
              onClick={() => setDismissedNoticeId(gameState.notice.id)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs px-1 font-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TOP LANDSCAPE BOARD SECTION (82% HEIGHT) */}
      {/* ========================================================= */}
      <div className={`game-board-area h-[82%] w-full p-2 flex items-center justify-center relative transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950' 
          : 'bg-gradient-to-br from-emerald-300/40 via-cyan-200/50 to-pink-300/40'
      }`}>
        
        {/* LANDSCAPE BOARD CONTAINER */}
        <div className={`w-full h-full max-w-7xl relative grid grid-cols-9 grid-rows-9 gap-0.5 border rounded-2xl p-1 backdrop-blur-xl transition-all duration-300 ${
          isDarkMode 
            ? 'bg-slate-900/90 border-slate-800/80 shadow-2xl' 
            : 'bg-gradient-to-br from-emerald-100/90 via-cyan-100/90 to-pink-100/90 border-emerald-300/80 shadow-2xl shadow-cyan-500/20'
        }`}>
          
          {/* CENTER BOARD PANEL */}
          <div className={`center-board-panel col-start-2 col-end-9 row-start-2 row-end-9 border rounded-xl flex flex-col items-center justify-between p-3 relative overflow-hidden transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-slate-950/85 border-slate-800/50' 
              : 'bg-gradient-to-br from-emerald-100/95 via-sky-100/95 to-pink-100/95 border-emerald-300/80 shadow-inner'
          }`}>
            
            <div className={`absolute -top-20 -left-20 w-72 h-72 rounded-full blur-3xl pointer-events-none ${isDarkMode ? 'bg-purple-500/10' : 'bg-emerald-400/20'}`}></div>
            <div className={`absolute -bottom-20 -right-20 w-72 h-72 rounded-full blur-3xl pointer-events-none ${isDarkMode ? 'bg-pink-500/10' : 'bg-pink-400/20'}`}></div>

            {/* Top Info Bar inside Center */}
            <div className="center-info-bar w-full flex justify-between items-center z-10">
              <div className={`center-info-chip flex items-center gap-2 border px-3 py-1.5 rounded-xl text-xs transition-colors ${
                isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-emerald-200 shadow-sm text-slate-800'
              }`}>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Thị trường:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {gameState.marketState === 'STABLE' && "Thị trường ổn định"}
                  {gameState.marketState === 'BOOMING' && "Sốt Đất (+30% Tiền Thuê)"}
                  {gameState.marketState === 'TOURISM' && "Mùa Du Lịch (x2 Dãy Du Lịch)"}
                  {gameState.marketState === 'RECESSION' && "Khủng Hoảng (-20% Tiền Thuê)"}
                  {gameState.marketState === 'STORM' && "Mùa Mưa Bão (Tạm Ngưng Thuê)"}
                </span>
              </div>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleThemeMode}
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all shadow-md ${
                  isDarkMode 
                    ? 'bg-slate-900 border-amber-500/40 text-amber-300 hover:bg-slate-800' 
                    : 'bg-gradient-to-r from-amber-400 to-pink-400 border-amber-300 text-slate-900 hover:opacity-90 shadow-pink-500/20'
                }`}
                title="Đổi giao diện Dark / Light Mode"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" /> : <Moon className="w-4 h-4 text-purple-900" />}
                <span>{isDarkMode ? 'Chế độ Sáng' : 'Chế độ Tối'}</span>
              </button>

              <div className={`center-info-chip flex items-center gap-2 border px-3 py-1.5 rounded-xl text-xs transition-colors ${
                isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-cyan-200 shadow-sm text-slate-800'
              }`}>
                <DollarSign className="w-4 h-4 text-amber-500" />
                <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Hũ thưởng:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">{gameState.jackpot.toLocaleString()} VNĐ</span>
              </div>
            </div>

            {/* Center Interactive Control / Action Display */}
            <div className="z-10 text-center flex flex-col items-center gap-3 my-auto w-full max-w-md">
              <h1 className={`center-board-title text-xl sm:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r ${
                isDarkMode 
                  ? 'from-purple-400 via-pink-300 to-indigo-400' 
                  : 'from-emerald-600 via-pink-600 to-indigo-600'
              } tracking-wider`}>
                CỜ TỶ PHÚ VIỆT NAM
              </h1>

              {/* Dice Display & Roll Button */}
              <div className="center-dice-controls flex items-center justify-center gap-8 my-2">
                <div className="flex items-center gap-6" aria-live="polite">
                  {diceRoll.map((value, index) => (
                    <div
                      key={index}
                      className={`dice-stage ${index === 0 ? 'dice-stage--purple' : 'dice-stage--pink'}`}
                    >
                      <div className={`dice-cube ${isRolling ? `dice-cube--rolling-${index + 1}` : ''}`}>
                        {getDiceFaces(value).map(face => (
                          <div key={face.side} className={`dice-face dice-face--${face.side}`} aria-hidden="true">
                            <div className="dice-pips">
                              {Array.from({ length: 9 }, (_, pipIndex) => (
                                <span
                                  key={pipIndex}
                                  className={`dice-pip ${DICE_PIPS[face.value].includes(pipIndex) ? 'dice-pip--active' : ''}`}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleRollDice}
                  disabled={!isMyTurn || isRolling || isAnimatingStep || hasPendingTravel || Boolean(gameState.pendingDebt) || Boolean(gameState.pendingBuyout) || hasPendingPurchase}
                  className={`center-roll-button px-6 py-3 rounded-xl font-bold text-xs tracking-wide shadow-xl transition-all flex items-center gap-2 ${
                    isMyTurn && !isRolling && !hasPendingTravel && !gameState.pendingDebt && !gameState.pendingBuyout && !hasPendingPurchase
                      ? playerRole === 'p1'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-purple-500/25 scale-105 active:scale-95'
                        : 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-pink-500/25 scale-105 active:scale-95'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-300 dark:border-slate-700'
                  }`}
                >
                  <Zap className="w-4 h-4 fill-current" />
                  {hasPendingTravel
                      ? gameState.pendingTravel.player === playerRole ? 'ĐANG CHỌN ĐÍCH DU LỊCH' : 'ĐỐI THỦ ĐANG DU LỊCH'
                    : gameState.pendingDebt
                      ? gameState.pendingDebt.player === playerRole ? 'CẦN THANH TOÁN NỢ' : 'ĐỢI ĐỐI THỦ TRẢ NỢ'
                    : gameState.pendingBuyout
                      ? gameState.pendingBuyout.player === playerRole ? 'QUYẾT ĐỊNH MUA LẠI ĐẤT' : 'ĐỢI ĐỐI THỦ QUYẾT ĐỊNH'
                    : hasPendingPurchase
                      ? 'QUYẾT ĐỊNH MUA ĐẤT'
                      : me.inJail ? '🎲 GIEO XÚC XẮC THỬ ĐÔI' : isMyTurn ? 'GIEO XÚC XẮC' : 'ĐỢI LƯỢT ĐỐI THỦ'}
                </button>
              </div>

              {/* 3 JAIL OPTIONS CONTROL PANEL */}
              {me.inJail && isMyTurn && (
                <div className={`w-full border rounded-2xl p-3 my-1 flex flex-col gap-2 shadow-xl animate-fade-in ${
                  isDarkMode ? 'bg-slate-900/90 border-amber-500/40' : 'bg-amber-100/90 border-amber-300'
                }`}>
                  <div className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center justify-center gap-1">
                    <span>🚨 BẠN ĐANG Ở TÙ (Lần thử {me.jailTurns || 0}) — Chọn 1 trong 3 cách:</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={handleRollDice}
                      disabled={isRolling || isAnimatingStep}
                      className="p-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition shadow"
                    >
                      <span className="text-base">🎲</span>
                      <span>Đổ Đôi Ra Tù</span>
                    </button>

                    <button
                      onClick={handlePayJailFine}
                      disabled={me.money < JAIL_FINE}
                      className="p-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition shadow disabled:opacity-50"
                    >
                      <span className="text-base">💰</span>
                      <span>Nộp 100k VNĐ</span>
                    </button>

                    <button
                      onClick={handleUseJailPass}
                      disabled={!me.hasPass}
                      className="p-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition shadow disabled:opacity-50"
                    >
                      <span className="text-base">🎟</span>
                      <span>Thẻ Miễn Tù</span>
                    </button>
                  </div>
                </div>
              )}

              <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>
                {isMyTurn ? "🔥 Đến lượt bạn hành động!" : `⏳ Đang chờ ${opponent.name} đi bước...`}
              </p>
            </div>

            {/* Bottom Quick Controls inside Center */}
            <div className="w-full flex justify-center gap-3 z-10">
              <button
                onClick={handleResetGame}
                title="Đặt lại bàn cờ"
                className={`px-4 py-2 border rounded-xl text-xs flex items-center gap-2 transition font-semibold shadow-sm ${
                  isDarkMode 
                    ? 'bg-slate-900 border-slate-700 text-slate-300 hover:border-amber-500/60' 
                    : 'bg-gradient-to-r from-emerald-100 to-cyan-100 border-emerald-300 text-slate-900 hover:border-amber-500'
                }`}
              >
                <RefreshCw className="w-4 h-4" />
                Đặt lại bàn cờ
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RENDER 32 TILES AROUND THE PERIMETER */}
          {/* ========================================================= */}
          {gameState.tiles.map((tile: any) => {
            let col = 1, row = 1;
            if (tile.id <= 8) { row = 9; col = 9 - tile.id; }
            else if (tile.id <= 16) { col = 1; row = 9 - (tile.id - 8); }
            else if (tile.id <= 24) { row = 1; col = tile.id - 15; }
            else { col = 9; row = tile.id - 23; }

            const isColorSet = checkColorSetOwned(tile.group);
            const isP1Here = gameState.p1.pos === tile.id;
            const isP2Here = gameState.p2.pos === tile.id;

            const stripColorClass = TILE_COLOR_CLASSES[tile.color] || 'bg-slate-400';
            const tileBorderClass = TILE_BORDER_CLASSES[tile.color] || 'border-slate-400';

            let tileBgStyle = '';
            if (isColorSet) {
              tileBgStyle = `rainbow-border border-2 ${
                isDarkMode ? 'bg-slate-900/90' : 'bg-gradient-to-br from-purple-100/90 via-pink-100/90 to-amber-100/90 text-slate-900 shadow-md'
              }`;
            } else if (tile.owner === 'p1') {
              tileBgStyle = isDarkMode 
                ? 'border-2 border-purple-500/80 bg-purple-950/70 text-purple-100 shadow-purple-900/30' 
                : 'border-2 border-purple-600 bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-950 shadow-md font-bold';
            } else if (tile.owner === 'p2') {
              tileBgStyle = isDarkMode 
                ? 'border-2 border-pink-500/80 bg-pink-950/70 text-pink-100 shadow-pink-900/30' 
                : 'border-2 border-pink-600 bg-gradient-to-br from-pink-100 to-rose-100 text-pink-950 shadow-md font-bold';
            } else {
              tileBgStyle = `border-2 ${tileBorderClass} ${
                isDarkMode 
                  ? 'bg-slate-900/60 hover:bg-slate-800/80' 
                  : 'bg-gradient-to-br from-white via-emerald-50/80 to-cyan-50/80 text-slate-900 hover:bg-white shadow-sm'
              }`;
            }

            return (
              <div
                key={tile.id}
                onClick={() => {
                  if (gameState.pendingTravel?.player === playerRole) {
                    handleTravelToDestination(tile.id);
                    return;
                  }
                  setSelectedTile(tile);
                }}
                style={{ gridColumn: col, gridRow: row }}
                className={`game-tile relative flex flex-col justify-between p-1.5 sm:p-2 rounded-lg text-[10px] cursor-pointer transition-all overflow-hidden ${tileBgStyle} ${
                  gameState.pendingTravel?.player === playerRole && tile.id !== gameState.pendingTravel.from
                    ? 'ring-2 ring-emerald-400/80 hover:bg-emerald-900/30 hover:scale-105'
                    : ''
                }`}
              >
                {/* ICON CHỦ SỞ HỮU MỜ NỀN */}
                {tile.owner && (
                  <div className={`absolute inset-0 flex items-center justify-center text-5xl opacity-[0.15] pointer-events-none ${tile.owner === 'p1' ? 'bg-purple-500/10' : 'bg-pink-500/10'}`} aria-hidden="true">
                    {tile.owner === 'p1' ? '🦈' : '🐬'}
                  </div>
                )}

                {/* DẢI MÀU Ô ĐẤT & ICON NHÀ */}
                {tile.color !== 'gray' && tile.type !== 'chance' && tile.type !== 'community' && (
                  <div className={`game-tile-strip w-full h-4 rounded-sm ${stripColorClass} mb-0.5 shadow-sm flex items-center justify-center overflow-hidden`}>
                    {tile.level > 0 && (
                      tile.level === 4 ? (
                        <span className="text-[10px] sm:text-xs font-black text-amber-300 drop-shadow-md flex items-center gap-0.5 leading-none animate-pulse">
                          🏨 HOTEL
                        </span>
                      ) : (
                        <span className="text-[10px] sm:text-xs font-black text-white drop-shadow flex items-center gap-0.5 leading-none">
                          {Array.from({ length: tile.level }).map((_, idx) => (
                            <span key={idx}>🏠</span>
                          ))}
                        </span>
                      )
                    )}
                  </div>
                )}

                {/* TÊN Ô ĐẤT */}
                <div className={`game-tile-name font-extrabold line-clamp-2 leading-tight text-[10px] sm:text-xs drop-shadow-sm ${
                  isDarkMode 
                    ? 'text-white' 
                    : tile.owner === 'p1' 
                    ? 'text-purple-950' 
                    : tile.owner === 'p2' 
                    ? 'text-pink-950' 
                    : 'text-slate-900'
                }`}>
                  {tile.name}
                </div>

                {/* ICON CÁC Ô CHỨC NĂNG */}
                {tile.type === 'start' && (
                  <div className="game-tile-center-icon text-rose-500" aria-hidden="true">
                    <Flag className="h-7 w-7 sm:h-9 sm:w-9 fill-rose-500/20" />
                  </div>
                )}
                {tile.type === 'chance' && (
                  <div className="game-tile-center-icon text-amber-500" aria-hidden="true">
                    <Sparkles className="h-7 w-7 sm:h-9 sm:w-9" />
                  </div>
                )}
                {tile.type === 'community' && (
                  <div className="game-tile-center-icon text-sky-500" aria-hidden="true">
                    <UsersRound className="h-7 w-7 sm:h-9 sm:w-9" />
                  </div>
                )}
                {tile.type === 'tax' && (
                  <div className="game-tile-center-icon text-rose-500" aria-hidden="true">
                    <Receipt className="h-7 w-7 sm:h-9 sm:w-9" />
                  </div>
                )}
                {tile.type === 'travel' && (
                  <div className="game-tile-center-icon text-emerald-500" aria-hidden="true">
                    <Plane className="h-7 w-7 sm:h-9 sm:w-9" />
                  </div>
                )}
                {tile.type === 'jail_visit' && (
                  <div className="game-tile-center-icon text-slate-500 dark:text-slate-400" aria-hidden="true">
                    <Lock className="h-7 w-7 sm:h-9 sm:w-9" />
                  </div>
                )}
                {tile.type === 'go_to_jail' && (
                  <div className="game-tile-center-icon text-red-600 animate-pulse" aria-hidden="true">
                    <ShieldAlert className="h-7 w-7 sm:h-9 sm:w-9" />
                  </div>
                )}
                {tile.type === 'bus' && (
                  <div className="game-tile-center-icon text-cyan-600" aria-hidden="true">
                    {tile.name.includes('Ga') ? <Train className="h-7 w-7 sm:h-9 sm:w-9" /> : <Bus className="h-7 w-7 sm:h-9 sm:w-9" />}
                  </div>
                )}
                {tile.type === 'utility' && (
                  <div className="game-tile-center-icon text-amber-500" aria-hidden="true">
                    {tile.name.includes('Điện') ? <Zap className="h-7 w-7 sm:h-9 sm:w-9 fill-amber-500" /> : <Droplets className="h-7 w-7 sm:h-9 sm:w-9 text-blue-500 fill-blue-500/20" />}
                  </div>
                )}

                {/* Price / Owner Meta */}
                <div className={`game-tile-meta mt-auto flex justify-between items-center w-full ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-800'
                }`}>
                  {tile.price > 0 && (
                    <span
                      title={tile.owner ? `Tiền thuê: ${calculateCurrentRent(tile).toLocaleString()} VNĐ` : `Giá mua: ${tile.price.toLocaleString()} VNĐ`}
                      className={`font-black tracking-tight ${
                        tile.owner 
                          ? 'text-xs sm:text-sm text-emerald-700 dark:text-emerald-300 bg-emerald-500/25 dark:bg-emerald-500/35 px-1 py-0.5 rounded border border-emerald-400/60 shadow-sm' 
                          : 'text-[10px] sm:text-xs text-slate-700 dark:text-slate-300 font-bold'
                      }`}
                    >
                      {tile.owner ? `Thuê:${Math.floor(calculateCurrentRent(tile) / 1000)}k` : `${Math.floor(tile.price / 1000)}k`}
                    </span>
                  )}
                </div>

                {/* Pawns Hopping Render */}
                <div className="absolute inset-0 z-10 flex items-center justify-center -space-x-2 pointer-events-none">
                  {isP1Here && (
                    <div className="game-pawn-token w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-purple-600 border-2 border-white shadow-lg flex items-center justify-center text-white animate-bounce" title="P1 · Cá mập" aria-label="P1 · Cá mập">
                      <span aria-hidden="true" className="game-pawn-icon text-lg sm:text-2xl leading-none">🦈</span>
                    </div>
                  )}
                  {isP2Here && (
                    <div className="game-pawn-token w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-pink-500 border-2 border-white shadow-lg flex items-center justify-center text-white animate-bounce" title="P2 · Cá heo" aria-label="P2 · Cá heo">
                      <span aria-hidden="true" className="game-pawn-icon text-lg sm:text-2xl leading-none">🐬</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

        </div>
      </div>

      {/* ========================================================= */}
      {/* BOTTOM CONTROL & CHAT BAR (18% HEIGHT) */}
      {/* ========================================================= */}
      <div className={`player-status-bar h-[18%] w-full border-t px-4 py-2 flex items-center justify-between gap-4 backdrop-blur-md transition-colors ${
        isDarkMode 
          ? 'bg-slate-900/90 border-slate-800/80' 
          : 'bg-gradient-to-r from-emerald-200/95 via-cyan-200/95 to-pink-200/95 border-emerald-300 shadow-xl'
      }`}>
        
        {/* LEFT: P1 & P2 USER BADGES */}
        <div className="flex items-center gap-3">
          {/* Player 1 Badge (Anh Yêu 🦈) */}
          <button type="button" aria-pressed={playerRole === 'p1'} onClick={() => setPlayerRole('p1')} className={`player-badge-card w-40 min-w-0 p-2 rounded-xl border flex flex-col gap-1 text-left transition ${
            gameState.turn === 'p1' 
              ? isDarkMode ? 'bg-purple-950/40 border-purple-500/50 shadow-md shadow-purple-500/10' : 'bg-gradient-to-br from-purple-100 to-indigo-200 border-purple-500 shadow-md shadow-purple-500/20'
              : isDarkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-white/80 border-slate-300'
          } ${playerRole === 'p1' ? 'ring-2 ring-purple-500' : ''}`}>
            <div className="flex items-center gap-2">
              <div className="player-badge-avatar w-9 h-9 shrink-0 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-xl text-white shadow">
                🦈
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1 truncate">
                  {gameState.p1.name}
                  {gameState.turn === 'p1' && <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-purple-500 animate-ping" />}
                </div>
                <div className={`text-xs font-black truncate ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                  {gameState.p1.money.toLocaleString()} <span className="text-[10px] text-slate-500 font-normal">VNĐ</span>
                </div>
              </div>
            </div>
            <div className="player-badge-count flex items-center gap-1 text-[9px] font-bold text-purple-700 dark:text-purple-300">
              <Home className="w-3 h-3" />
              Sở hữu ({p1OwnedTiles.length})
            </div>
            <div className="player-badge-properties grid max-h-12 min-h-3 grid-cols-2 gap-x-1.5 gap-y-0.5 overflow-y-auto text-[9px] leading-3 font-semibold text-slate-700 dark:text-slate-300">
              {p1OwnedTiles.length > 0
                ? p1OwnedTiles.map((tile: any) => (
                    <div key={tile.id} className="truncate rounded bg-purple-200/80 dark:bg-purple-900/60 dark:text-purple-100 px-1 font-bold flex items-center gap-1">
                      {tile.color && tile.color !== 'gray' && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${TILE_COLOR_CLASSES[tile.color]}`} />}
                      <span className="truncate">{tile.name}</span>
                    </div>
                  ))
                : <span className="text-slate-400">Chưa có đất</span>}
            </div>
          </button>

          {/* Player 2 Badge (Em Yêu 🐬) */}
          <button type="button" aria-pressed={playerRole === 'p2'} onClick={() => setPlayerRole('p2')} className={`player-badge-card w-40 min-w-0 p-2 rounded-xl border flex flex-col gap-1 text-left transition ${
            gameState.turn === 'p2' 
              ? isDarkMode ? 'bg-pink-950/40 border-pink-500/50 shadow-md shadow-pink-500/10' : 'bg-gradient-to-br from-pink-100 to-rose-200 border-pink-500 shadow-md shadow-pink-500/20'
              : isDarkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-white/80 border-slate-300'
          } ${playerRole === 'p2' ? 'ring-2 ring-pink-500' : ''}`}>
            <div className="flex items-center gap-2">
              <div className="player-badge-avatar w-9 h-9 shrink-0 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-xl text-white shadow">
                🐬
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-pink-700 dark:text-pink-300 flex items-center gap-1 truncate">
                  {gameState.p2.name}
                  {gameState.turn === 'p2' && <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-pink-500 animate-ping" />}
                </div>
                <div className={`text-xs font-black truncate ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                  {gameState.p2.money.toLocaleString()} <span className="text-[10px] text-slate-500 font-normal">VNĐ</span>
                </div>
              </div>
            </div>
            <div className="player-badge-count flex items-center gap-1 text-[9px] font-bold text-pink-700 dark:text-pink-300">
              <Home className="w-3 h-3" />
              Sở hữu ({p2OwnedTiles.length})
            </div>
            <div className="player-badge-properties grid max-h-12 min-h-3 grid-cols-2 gap-x-1.5 gap-y-0.5 overflow-y-auto text-[9px] leading-3 font-semibold text-slate-700 dark:text-slate-300">
              {p2OwnedTiles.length > 0
                ? p2OwnedTiles.map((tile: any) => (
                    <div key={tile.id} className="truncate rounded bg-pink-200/80 dark:bg-pink-900/60 dark:text-pink-100 px-1 font-bold flex items-center gap-1">
                      {tile.color && tile.color !== 'gray' && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${TILE_COLOR_CLASSES[tile.color]}`} />}
                      <span className="truncate">{tile.name}</span>
                    </div>
                  ))
                : <span className="text-slate-400">Chưa có đất</span>}
            </div>
          </button>
        </div>

        {/* RIGHT: REALTIME MINI CHAT BAR */}
        <div className="flex-1 max-w-md flex flex-col justify-between h-full py-0.5">
          <div className="flex-1 overflow-y-auto px-2 flex flex-col-reverse gap-1 text-xs">
            {chatList.slice(-2).reverse().map((msg, idx) => (
              <div key={idx} className={`flex items-center gap-1.5 ${msg.sender === playerRole ? 'justify-end' : 'justify-start'}`}>
                <span className={`px-2 py-0.5 rounded-lg max-w-[80%] truncate font-semibold ${
                  msg.sender === 'p1' 
                    ? isDarkMode ? 'bg-purple-950/60 border border-purple-800/40 text-purple-200' : 'bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-300 text-purple-950'
                    : isDarkMode ? 'bg-pink-950/60 border border-pink-800/40 text-pink-200' : 'bg-gradient-to-r from-pink-100 to-rose-100 border border-pink-300 text-pink-950'
                }`}>
                  <strong className="text-[10px] opacity-75 mr-1">{msg.sender.toUpperCase()}:</strong>
                  {msg.text}
                </span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="flex gap-2 mt-1">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Nhắn tin với người yêu..."
              className={`flex-1 border rounded-xl px-3 py-1 text-xs focus:outline-none transition ${
                isDarkMode 
                  ? 'bg-slate-950/80 border-slate-800 text-slate-200 placeholder-slate-500 focus:border-purple-500/50' 
                  : 'bg-gradient-to-r from-emerald-50 to-cyan-50 border-emerald-300 text-slate-900 placeholder-slate-500 focus:border-purple-500 shadow-sm'
              }`}
            />
            <button
              type="submit"
              className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center transition shadow-lg shadow-purple-600/20"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>

      {/* ========================================================= */}
      {/* TILE DETAILS MODAL (MUA ĐẤT / XÂY NHÀ TRỰC TIẾP) */}
      {/* ========================================================= */}
      {selectedTile && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center z-[70] p-4 animate-fade-in">
          <div className={`border rounded-2xl max-w-sm w-full p-5 shadow-2xl relative ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-gradient-to-br from-emerald-50 via-cyan-50 to-pink-50 border-emerald-300 text-slate-900'
          }`}>
            <button 
              onClick={() => setSelectedTile(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 dark:hover:text-white text-sm font-bold"
            >
              ✕
            </button>

            {/* CHẤM MÀU NHÓM ĐẤT TƯƠNG PHẢN */}
            <div className="flex items-center gap-2 mb-1">
              {selectedTile.color && selectedTile.color !== 'gray' && (
                <span className={`w-3.5 h-3.5 rounded-full shrink-0 ${TILE_COLOR_CLASSES[selectedTile.color] || 'bg-slate-400'} border border-white/30`} />
              )}
              <h3 className="text-lg font-black text-slate-900 dark:text-white">{selectedTile.name}</h3>
            </div>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 opacity-80 mb-4">Loại ô: {selectedTile.type.toUpperCase()}</p>

            <div className={`space-y-2 text-xs mb-5 p-3 rounded-xl border ${
              isDarkMode ? 'bg-slate-950/50 border-slate-800 text-slate-300' : 'bg-white/80 border-emerald-200 text-slate-800 shadow-sm'
            }`}>
              <div className="flex justify-between">
                <span>Giá sở hữu:</span>
                <span className="font-bold text-amber-500">{selectedTile.price.toLocaleString()} VNĐ</span>
              </div>
              <div className="flex justify-between">
                <span>{selectedTile.owner ? 'Tiền thuê hiện tại:' : 'Tiền thuê cơ bản (Chưa xây nhà):'}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {(selectedTile.owner ? calculateCurrentRent(selectedTile) : Math.floor(selectedTile.price * 0.5)).toLocaleString()} VNĐ
                </span>
              </div>
              {selectedTile.type === 'property' && (
                <div className="flex justify-between">
                  <span>Công trình:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedTile.level === 4 ? 'Khách sạn 🏨' : `${selectedTile.level}/4 căn nhà 🏠`}
                  </span>
                </div>
              )}
            </div>

            {/* Direct Actions */}
            <div className="flex flex-col gap-2.5">
              {!selectedTile.owner && selectedTile.price > 0 && isMyTurn && me.pos === selectedTile.id && gameState.pendingPurchase?.tileId === selectedTile.id && (
                <>
                  <div className={`p-3 rounded-xl space-y-1.5 text-xs border ${
                    isDarkMode ? 'bg-emerald-950/40 border-emerald-500/40 text-slate-200' : 'bg-emerald-100/80 border-emerald-300 text-emerald-950'
                  }`}>
                    <div className="flex justify-between">
                      <span>Tiền hiện có:</span>
                      <span className="font-bold">{me.money.toLocaleString()} VNĐ</span>
                    </div>
                    <div className="flex justify-between text-rose-500">
                      <span>Giá đất:</span>
                      <span>−{selectedTile.price.toLocaleString()} VNĐ</span>
                    </div>
                    <div className="flex justify-between font-bold text-emerald-600 dark:text-emerald-300 border-t pt-1">
                      <span>Còn lại sau mua:</span>
                      <span>{(me.money - selectedTile.price).toLocaleString()} VNĐ</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleBuyProperty(selectedTile.id)}
                    disabled={me.money < selectedTile.price}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 dark:disabled:bg-slate-800 font-bold text-xs rounded-xl transition text-white shadow"
                  >
                    Mua Ô Đất Này
                  </button>
                  <button
                    onClick={handleSkipPurchase}
                    className="w-full py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 font-bold text-xs rounded-xl transition text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700"
                  >
                    Bỏ qua không mua
                  </button>
                </>
              )}

              {/* DIRECT 1-CLICK HOUSE & HOTEL BUILDING ON OWNED PROPERTY */}
              {selectedTile.type === 'property' && selectedTile.owner === playerRole && isMyTurn && (
                <div className={`p-3 border rounded-xl space-y-2 ${
                  isDarkMode ? 'bg-slate-950/60 border-emerald-600/40' : 'bg-emerald-50/90 border-emerald-300'
                }`}>
                  {selectedTile.level < 4 && (
                    <>
                      <div className="text-xs font-bold text-emerald-600 dark:text-emerald-300 flex items-center gap-1">
                        <Home className="w-4 h-4" />
                        <span>{selectedTile.level === 3 ? "Xây Khách sạn" : `Xây nhà cấp ${selectedTile.level + 1}`}</span>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>Giá xây:</span>
                          <span className="font-bold text-amber-500">{getBuildingCost(selectedTile).toLocaleString()} VNĐ</span>
                        </div>
                        <div className="flex justify-between font-bold text-emerald-600 dark:text-emerald-400">
                          <span>Tiền còn lại:</span>
                          <span>{(me.money - getBuildingCost(selectedTile)).toLocaleString()} VNĐ</span>
                        </div>
                      </div>

                      {selectedTile.level === 3 && !me.hasCompletedFirstLap ? (
                        <p className="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-lg border border-amber-300 dark:border-amber-500/30 text-center">
                          ⚠️ Cần hoàn thành 1 vòng (qua ô Xuất Phát) mới được phép xây Khách sạn!
                        </p>
                      ) : (
                        <button
                          onClick={() => handleBuildHouseDirect(selectedTile.id)}
                          disabled={me.money < getBuildingCost(selectedTile)}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 dark:disabled:bg-slate-800 font-bold text-xs rounded-xl transition text-white shadow"
                        >
                          Xây Ngay ({getBuildingCost(selectedTile).toLocaleString()} VNĐ)
                        </button>
                      )}
                    </>
                  )}

                  <button
                    onClick={handleFinishTurnOnOwnProperty}
                    className="w-full py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 font-bold text-xs rounded-xl transition text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 mt-1"
                  >
                    Bỏ qua / Xong lượt
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {gameState.pendingBuyout && (
        <div className="fixed inset-0 z-[92] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
          <div className={`w-full max-w-sm rounded-3xl border p-6 text-center shadow-2xl ${
            isDarkMode ? 'bg-slate-900 border-amber-400/70' : 'bg-gradient-to-br from-amber-50 via-sky-50 to-emerald-50 border-amber-300'
          }`}>
            {gameState.pendingBuyout.player === playerRole ? (
              <>
                <div className="mb-3 text-4xl">🏠</div>
                <h2 className="text-xl font-black text-amber-500">Mua lại đất đối thủ</h2>
                <p className="mt-2 text-sm opacity-80">Bạn đã trả tiền thuê. Có thể mua lại <strong>{gameState.tiles[gameState.pendingBuyout.tileId].name}</strong>, bao gồm toàn bộ nhà/khách sạn hiện có.</p>
                <div className="my-4 rounded-2xl bg-amber-500/10 p-3 text-2xl font-black text-amber-600 dark:text-amber-400">{gameState.pendingBuyout.cost.toLocaleString()} VNĐ</div>
                <div className="flex gap-2">
                  <button onClick={handleSkipBuyout} className="flex-1 rounded-xl bg-slate-200 dark:bg-slate-700 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-100 transition">Không mua</button>
                  <button onClick={handleBuyoutProperty} className="flex-1 rounded-xl bg-amber-500 py-2.5 text-sm font-black text-white transition hover:bg-amber-600">Mua lại</button>
                </div>
              </>
            ) : (
              <p className="py-5 text-center text-sm">{gameState[gameState.pendingBuyout.player].name} đang quyết định có mua lại ô đất này hay không.</p>
            )}
          </div>
        </div>
      )}

      {/* DEBT RESOLUTION - BẢNG DUY NHẤT CHO PHÉP BÁN NHÀ / BÁN ĐẤT KHI THIẾU TIỀN THUÊ KHÔNG ĐỦ TRẢ */}
      {gameState.pendingDebt && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className={`w-full max-w-lg rounded-3xl border p-5 shadow-2xl ${
            isDarkMode ? 'bg-slate-900 border-rose-500/70' : 'bg-gradient-to-br from-rose-50 via-sky-50 to-pink-50 border-rose-300'
          }`}>
            {gameState.pendingDebt.player === playerRole ? (
              <>
                <div className="mb-4 text-center">
                  <div className="mb-2 text-4xl">💸</div>
                  <h2 className="text-xl font-black text-rose-500">Cần thanh toán nợ</h2>
                  <p className="mt-1 text-sm opacity-80">{gameState.pendingDebt.reason}</p>
                  <div className="mt-3 rounded-2xl bg-rose-500/10 p-3 text-2xl font-black text-rose-600 dark:text-rose-400">
                    {gameState.pendingDebt.amount.toLocaleString()} VNĐ
                  </div>
                  <p className="mt-2 text-xs opacity-70">Tiền mặt: <strong className="text-emerald-500">{me.money.toLocaleString()} VNĐ</strong> · Giá trị có thể thanh lý: <strong className="text-amber-500">{getLiquidationValue(playerRole).toLocaleString()} VNĐ</strong></p>
                </div>

                <div className="mb-4 max-h-56 space-y-2 overflow-y-auto pr-1">
                  {gameState.tiles.filter((tile: any) => tile.owner === playerRole).map((tile: any) => (
                    <div key={tile.id} className="rounded-xl border p-3 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/80 shadow-sm">
                      <div className="mb-2 flex items-center justify-between gap-2 text-sm font-bold">
                        <div className="flex items-center gap-2 min-w-0">
                          {tile.color && tile.color !== 'gray' && (
                            <span className={`w-3 h-3 rounded-full shrink-0 ${TILE_COLOR_CLASSES[tile.color] || 'bg-slate-400'} border border-white/20`} />
                          )}
                          <span className="truncate text-slate-900 dark:text-white font-black">{tile.name}</span>
                        </div>
                        <span className="shrink-0 text-xs opacity-80 font-semibold text-slate-700 dark:text-slate-300">
                          {tile.level === 4 ? '🏨 Khách sạn' : tile.level > 0 ? `🏠 ×${tile.level}` : 'Đất trống'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {tile.level > 0 ? (
                          <button onClick={() => handleSellAsset(tile.id, true)} className="flex-1 rounded-lg bg-amber-600 px-2 py-2 text-xs font-bold text-white transition hover:bg-amber-500">
                            Bán 1 {tile.level === 4 ? 'khách sạn' : 'nhà'} (+{getSaleValue(tile, true).toLocaleString()} VNĐ)
                          </button>
                        ) : (
                          <button onClick={() => handleSellAsset(tile.id, false)} className="flex-1 rounded-lg bg-rose-700 px-2 py-2 text-xs font-bold text-white transition hover:bg-rose-600">
                            Bán đất (+{getSaleValue(tile, false).toLocaleString()} VNĐ)
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSettleDebt}
                  disabled={me.money < gameState.pendingDebt.amount}
                  className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-black text-white transition hover:bg-emerald-500 disabled:bg-slate-300 dark:disabled:bg-slate-800"
                >
                  Thanh toán {gameState.pendingDebt.amount.toLocaleString()} VNĐ
                </button>
              </>
            ) : (
              <div className="py-6 text-center">
                <div className="mb-3 text-4xl">⏳</div>
                <h2 className="text-lg font-black">{gameState[gameState.pendingDebt.player].name} đang thanh lý tài sản</h2>
                <p className="mt-2 text-sm opacity-70">Đang xử lý khoản nợ {gameState.pendingDebt.amount.toLocaleString()} VNĐ.</p>
                <button
                  onClick={() => setPlayerRole(gameState.pendingDebt.player)}
                  className="mt-5 rounded-xl bg-pink-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-pink-500"
                >
                  Vào vai {gameState[gameState.pendingDebt.player].name} để xử lý nợ
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TRAVEL DESTINATION NOTICE */}
      {gameState.pendingTravel && (
        <div className="pointer-events-none fixed inset-0 z-[75] flex items-center justify-center p-4">
          <div className={`w-full max-w-sm rounded-2xl border p-5 text-center shadow-2xl ${
            isDarkMode ? 'bg-slate-950/95 border-emerald-400/70' : 'bg-gradient-to-br from-emerald-100 via-cyan-100 to-pink-100 border-emerald-400'
          }`}>
            <h2 className="mb-1 flex items-center gap-2 text-lg font-bold">
              <Plane className="h-5 w-5 text-emerald-500" />Du Lịch Toàn Quốc
            </h2>
            {gameState.pendingTravel.player === playerRole ? (
              <p className="text-sm leading-relaxed text-emerald-700 dark:text-emerald-300 font-semibold">Chọn trực tiếp một ô được viền xanh trên bàn cờ để bay tới đó. Nếu đi qua ô Xuất Phát, bạn nhận +300.000 VNĐ.</p>
            ) : (
              <p className="text-sm opacity-80">{gameState[gameState.pendingTravel.player].name} đang lựa chọn điểm đến...</p>
            )}
          </div>
        </div>
      )}

      {/* CARD DRAW MODAL */}
      {drawnCard && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className={`w-full max-w-sm rounded-3xl border p-6 text-center shadow-2xl ${
            drawnCard.type === 'chance' 
              ? isDarkMode ? 'border-amber-400/70 bg-amber-950/95 text-white' : 'border-amber-300 bg-gradient-to-br from-amber-100 to-orange-100 text-amber-950'
              : isDarkMode ? 'border-sky-400/70 bg-sky-950/95 text-white' : 'border-sky-300 bg-gradient-to-br from-sky-100 to-cyan-100 text-sky-950'
          }`}>
            <div className={`mx-auto mb-5 flex h-44 w-28 items-center justify-center rounded-2xl border-2 shadow-xl transition-all duration-500 ${
              isCardRevealed ? 'rotate-0 bg-white text-slate-950' : '-rotate-6 cursor-pointer bg-gradient-to-br from-indigo-600 to-purple-950 text-white hover:-translate-y-2 hover:rotate-0'
            }`} onClick={() => setIsCardRevealed(true)}>
              {isCardRevealed ? <span className="px-2 text-xs font-black">{drawnCard.type === 'chance' ? 'KHÍ VẬN' : 'CƠ HỘI'}</span> : <span className="text-4xl">🂠</span>}
            </div>
            <h2 className="mb-3 text-xl font-black">{drawnCard.title}</h2>
            {isCardRevealed ? (
              <>
                <p className="mb-6 text-sm leading-relaxed font-semibold">{drawnCard.message}</p>
                <button onClick={() => { setDrawnCard(null); setIsCardRevealed(false); }} className="w-full rounded-xl bg-slate-800 text-white dark:bg-white/20 px-4 py-2.5 text-sm font-bold transition hover:opacity-90">Đã hiểu</button>
              </>
            ) : (
              <button onClick={() => setIsCardRevealed(true)} className="w-full rounded-xl bg-slate-800 text-white dark:bg-white/20 px-4 py-2.5 text-sm font-bold transition hover:opacity-90">Rút thẻ</button>
            )}
          </div>
        </div>
      )}

      {/* STYLES & ANIMATIONS */}
      <style>{`
        .rainbow-border {
          position: relative;
          z-index: 5;
        }
        .rainbow-border::before {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 12px;
          padding: 3px;
          background: linear-gradient(45deg, #f43f5e, #8b5cf6, #06b6d4, #10b981, #f59e0b, #f43f5e);
          background-size: 300% 300%;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          animation: rainbow-glow 3s ease infinite;
        }
        @keyframes rainbow-glow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .game-tile-strip,
        .game-tile-name,
        .game-tile-meta { position: relative; z-index: 1; }
        
        .game-tile-center-icon {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.28;
          pointer-events: none;
          transform: translateY(10%);
        }
        .center-board-panel { margin: -1px; }
        .game-tile { margin: -1px; }

        .dice-stage {
          width: 90px;
          height: 90px;
          perspective: 600px;
          filter: drop-shadow(0 8px 6px rgba(0, 0, 0, 0.3));
        }
        .dice-cube {
          position: relative;
          width: 84px;
          height: 84px;
          transform-style: preserve-3d;
          transform: translateZ(-42px);
        }
        .dice-face {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          border: 2px solid rgba(0, 0, 0, 0.2);
          border-radius: 16px;
          background: linear-gradient(145deg, #ffffff 0%, #f8fafc 70%, #e2e8f0 100%);
          box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.95), inset 0 -4px 6px rgba(15, 23, 42, 0.15);
          backface-visibility: hidden;
        }
        .dice-stage--purple .dice-face { --pip-color: #7c3aed; }
        .dice-stage--pink .dice-face { --pip-color: #db2777; }
        .dice-face--front { transform: rotateY(0deg) translateZ(42px); }
        .dice-face--back { transform: rotateY(180deg) translateZ(42px); }
        .dice-face--right { transform: rotateY(90deg) translateZ(42px); }
        .dice-face--left { transform: rotateY(-90deg) translateZ(42px); }
        .dice-face--top { transform: rotateX(90deg) translateZ(42px); }
        .dice-face--bottom { transform: rotateX(-90deg) translateZ(42px); }
        .dice-pips {
          width: 100%;
          height: 100%;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(3, 1fr);
          place-items: center;
          padding: 10px;
        }
        .dice-pip--active {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--pip-color);
          box-shadow: inset 0 2px 2px rgba(255, 255, 255, 0.6), 0 2px 3px rgba(15, 23, 42, 0.3);
        }
        .dice-cube--rolling-1 { animation: dice-tumble-one 820ms cubic-bezier(0.2, 0.75, 0.25, 1) both; }
        .dice-cube--rolling-2 { animation: dice-tumble-two 880ms cubic-bezier(0.2, 0.75, 0.25, 1) both; }
        @keyframes dice-tumble-one {
          0% { transform: translateZ(-42px) rotateX(0) rotateY(0) rotateZ(0) translateY(0); }
          18% { transform: translateZ(-42px) rotateX(150deg) rotateY(115deg) rotateZ(14deg) translateY(-18px); }
          42% { transform: translateZ(-42px) rotateX(325deg) rotateY(275deg) rotateZ(-11deg) translateY(4px); }
          68% { transform: translateZ(-42px) rotateX(535deg) rotateY(445deg) rotateZ(8deg) translateY(-12px); }
          88% { transform: translateZ(-42px) rotateX(675deg) rotateY(630deg) rotateZ(-3deg) translateY(4px); }
          100% { transform: translateZ(-42px) rotateX(720deg) rotateY(720deg) rotateZ(0) translateY(0); }
        }
        @keyframes dice-tumble-two {
          0% { transform: translateZ(-42px) rotateX(0) rotateY(0) rotateZ(0) translateY(0); }
          15% { transform: translateZ(-42px) rotateX(-125deg) rotateY(155deg) rotateZ(-16deg) translateY(-14px); }
          39% { transform: translateZ(-42px) rotateX(-315deg) rotateY(330deg) rotateZ(12deg) translateY(6px); }
          67% { transform: translateZ(-42px) rotateX(-520deg) rotateY(505deg) rotateZ(-8deg) translateY(-16px); }
          88% { transform: translateZ(-42px) rotateX(-675deg) rotateY(650deg) rotateZ(4deg) translateY(4px); }
          100% { transform: translateZ(-42px) rotateX(-720deg) rotateY(720deg) rotateZ(0) translateY(0); }
        }
      `}</style>

    </div>
  );
}
