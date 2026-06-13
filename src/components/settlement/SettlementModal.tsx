import { CheckCircle, XCircle, AlertTriangle, TrendingUp, TrendingDown, Coins, Star, Package, X, Crown, Building2, Shield, Lock } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import type { TripSettlement } from '../../utils/settlement';

interface SettlementModalProps {
  settlement: TripSettlement;
  onClose: () => void;
}

const SettlementModal = ({ settlement, onClose }: SettlementModalProps) => {
  const { closeSettlement } = useGameStore();

  const handleClose = () => {
    closeSettlement();
    onClose();
  };

  const getProfitColor = (profit: number) => {
    return profit >= 0 ? 'text-emerald-600' : 'text-red-600';
  };

  const getProfitIcon = (profit: number) => {
    return profit >= 0 
      ? <TrendingUp className="w-5 h-5 text-emerald-500" />
      : <TrendingDown className="w-5 h-5 text-red-500" />;
  };

  const getSealInfo = (sealLevel?: 'royal' | 'official' | 'normal') => {
    switch (sealLevel) {
      case 'royal':
        return { label: '皇家封签', icon: Crown, color: 'from-yellow-500 to-amber-600', textColor: 'text-yellow-700', bgColor: 'bg-yellow-100' };
      case 'official':
        return { label: '官府封签', icon: Building2, color: 'from-blue-500 to-indigo-600', textColor: 'text-blue-700', bgColor: 'bg-blue-100' };
      case 'normal':
        return { label: '普通封签', icon: Shield, color: 'from-emerald-500 to-teal-600', textColor: 'text-emerald-700', bgColor: 'bg-emerald-100' };
      default:
        return null;
    }
  };

  const sealedCount = settlement.commissions.filter(c => c.isSealed).length;
  const royalSealedSuccess = settlement.commissions.filter(c => c.sealLevel === 'royal' && !c.isLate && c.damaged === 0).length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
        <div className={`p-6 text-white ${
          settlement.unlocksRoyalRoute
            ? 'bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500'
            : settlement.totalProfit >= 0 
            ? 'bg-gradient-to-r from-emerald-500 to-teal-600'
            : 'bg-gradient-to-r from-red-500 to-rose-600'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settlement.unlocksRoyalRoute ? (
                <div className="relative">
                  <Crown className="w-12 h-12 animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                    <Lock className="w-2.5 h-2.5 text-amber-600" />
                  </div>
                </div>
              ) : settlement.totalProfit >= 0 
                ? <CheckCircle className="w-10 h-10" />
                : <XCircle className="w-10 h-10" />
              }
              <div>
                <h3 className="text-2xl font-bold">
                  {settlement.unlocksRoyalRoute ? '🎉 皇家路线解锁！' : '运输结算'}
                </h3>
                <p className="text-white/80">
                  {settlement.unlocksRoyalRoute 
                    ? '成功送达皇家贡品，皇家官道现已开放！' 
                    : '本次运输任务已完成'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {settlement.unlocksRoyalRoute && (
            <div className="mt-4 p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-2 text-sm">
                <Crown className="w-4 h-4" />
                <span className="font-medium">
                  已解锁「月港 → 北京」皇家官道与「南京 → 北京」皇家官道！
                </span>
              </div>
              <div className="text-xs text-white/80 mt-1 ml-6">
                皇家官道路况极佳、直达帝都，可在路线规划中查看使用
              </div>
            </div>
          )}
        </div>

        <div className="p-6 space-y-6">
          {sealedCount > 0 && (
            <div className={`p-4 rounded-xl border-2 ${
              royalSealedSuccess > 0
                ? 'bg-yellow-50 border-yellow-300'
                : 'bg-amber-50 border-amber-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {royalSealedSuccess > 0 ? (
                  <Crown className="w-5 h-5 text-yellow-600" />
                ) : (
                  <Shield className="w-5 h-5 text-amber-600" />
                )}
                <span className={`font-semibold ${royalSealedSuccess > 0 ? 'text-yellow-800' : 'text-amber-800'}`}>
                  封签运输统计
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="text-center">
                  <div className="text-slate-500 text-xs">封签单数</div>
                  <div className={`font-bold ${royalSealedSuccess > 0 ? 'text-yellow-700' : 'text-amber-700'}`}>
                    {sealedCount} 单
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-slate-500 text-xs">完好送达</div>
                  <div className="font-bold text-emerald-700">
                    {settlement.commissions.filter(c => c.isSealed && !c.isLate && c.damaged === 0).length} 单
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-slate-500 text-xs">出现问题</div>
                  <div className="font-bold text-red-700">
                    {settlement.commissions.filter(c => c.isSealed && (c.isLate || c.damaged > 0)).length} 单
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-emerald-50 rounded-xl p-4 text-center">
              <div className="text-sm text-emerald-600 mb-1">总收入</div>
              <div className="text-2xl font-bold text-emerald-700">¥{settlement.totalIncome}</div>
            </div>
            <div className="bg-red-50 rounded-xl p-4 text-center">
              <div className="text-sm text-red-600 mb-1">总支出</div>
              <div className="text-2xl font-bold text-red-700">¥{settlement.totalExpense}</div>
            </div>
            <div className="bg-indigo-50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-sm text-indigo-600 mb-1">
                {getProfitIcon(settlement.totalProfit)}
                净利润
              </div>
              <div className={`text-2xl font-bold ${getProfitColor(settlement.totalProfit)}`}>
                ¥{settlement.totalProfit}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 py-3 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-2">
              <Star className={`w-5 h-5 ${settlement.reputationChange >= 0 ? 'text-amber-500' : 'text-slate-400'}`} />
              <span className="text-slate-600">声望变化:</span>
              <span className={`font-bold text-lg ${
                settlement.reputationChange >= 50 
                  ? 'text-yellow-600' 
                  : settlement.reputationChange >= 0 
                  ? 'text-emerald-600' 
                  : 'text-red-600'
              }`}>
                {settlement.reputationChange >= 0 ? '+' : ''}{settlement.reputationChange}
              </span>
            </div>
            <div className="w-px h-6 bg-slate-300" />
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-500" />
              <span className="text-slate-600">货损:</span>
              <span className="font-bold text-red-600">{settlement.damageCount} 件</span>
            </div>
            <div className="w-px h-6 bg-slate-300" />
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span className="text-slate-600">迟到:</span>
              <span className={`font-bold ${settlement.lateCount > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {settlement.lateCount} 单
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-500" />
              货物明细
            </h4>
            <div className="space-y-3">
              {settlement.commissions.map((item, index) => {
                const sealInfo = item.isSealed ? getSealInfo(item.sealLevel) : null;
                return (
                  <div key={index} className={`rounded-xl p-4 ${
                    sealInfo 
                      ? `${sealInfo.bgColor} border-2 border-dashed border-${item.sealLevel === 'royal' ? 'yellow' : item.sealLevel === 'official' ? 'blue' : 'emerald'}-300`
                      : 'bg-slate-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-slate-800">{item.goodsName}</span>
                        <span className="text-sm text-slate-500">x{item.quantity}</span>
                        {sealInfo && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${sealInfo.color} flex items-center gap-1`}>
                            <sealInfo.icon className="w-3 h-3" />
                            {sealInfo.label}
                          </span>
                        )}
                        {item.unlocksRoyalRoute && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-400 to-amber-500 text-white flex items-center gap-1 animate-pulse">
                            <Crown className="w-3 h-3" />
                            解锁路线
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-500">
                          基础 ¥{item.baseReward}
                        </div>
                        <div className={`font-bold ${sealInfo ? sealInfo.textColor : 'text-indigo-600'}`}>
                          实际 ¥{item.actualReward}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className={`px-2 py-1 rounded-full ${
                        item.delivered > 0 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        送达 {item.delivered} 件
                      </span>
                      {item.damaged > 0 && (
                        <span className={`px-2 py-1 rounded-full ${
                          item.isSealed ? 'bg-red-200 text-red-800 font-semibold' : 'bg-red-100 text-red-700'
                        }`}>
                          损坏 {item.damaged} 件
                          {item.isSealed && '（封签重罚）'}
                        </span>
                      )}
                      {item.isLate && (
                        <span className={`px-2 py-1 rounded-full ${
                          item.isSealed ? 'bg-amber-200 text-amber-800 font-semibold' : 'bg-amber-100 text-amber-700'
                        }`}>
                          迟到 罚款 ¥{item.latePenalty}
                          {item.isSealed && '（封签重罚）'}
                        </span>
                      )}
                      {!item.isLate && item.damaged === 0 && (
                        <span className={`px-2 py-1 rounded-full ${
                          item.isSealed 
                            ? 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 font-semibold' 
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {item.isSealed ? '✨ 封签完好准时' : '完好准时'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {settlement.events.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                途中事件
              </h4>
              <div className="space-y-2">
                {settlement.events.map((event, index) => (
                  <div key={index} className={`flex items-start gap-2 p-3 rounded-lg border ${
                    event.includes('封签') 
                      ? 'bg-blue-50 border-blue-200' 
                      : event.includes('皇家') || event.includes('官府')
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-amber-50 border-amber-200'
                  }`}>
                    <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                      event.includes('封签') ? 'text-blue-500' 
                        : event.includes('皇家') || event.includes('官府')
                        ? 'text-yellow-600' 
                        : 'text-amber-500'
                    }`} />
                    <span className={`text-sm ${
                      event.includes('封签') ? 'text-blue-800' 
                        : event.includes('皇家') || event.includes('官府')
                        ? 'text-yellow-800'
                        : 'text-amber-800'
                    }`}>{event}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className={`flex-1 py-3 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                settlement.unlocksRoyalRoute
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              <Coins className="w-5 h-5" />
              {settlement.unlocksRoyalRoute ? '太棒了！' : '确认结算'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettlementModal;
