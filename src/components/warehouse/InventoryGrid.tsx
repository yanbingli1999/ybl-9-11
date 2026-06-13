import { Package, AlertCircle, Crown, Building2, Shield, Lock, Eye } from 'lucide-react';
import type { Commission, Goods } from '../../../shared/types';

interface InventoryGridProps {
  commissions: Commission[];
  goodsList: Goods[];
}

const InventoryGrid = ({ commissions, goodsList }: InventoryGridProps) => {
  const acceptedCommissions = commissions.filter(c => c.isAccepted && !c.isCompleted);

  const getGoodsInfo = (goodsId: string) => {
    return goodsList.find(g => g.id === goodsId);
  };

  const getFragilityColor = (fragility: number) => {
    if (fragility >= 8) return 'text-red-600';
    if (fragility >= 5) return 'text-amber-600';
    return 'text-green-600';
  };

  const getFragilityLabel = (fragility: number) => {
    if (fragility >= 8) return '极易碎';
    if (fragility >= 5) return '易碎';
    return '普通';
  };

  const getSealInfo = (commission: Commission) => {
    if (!commission.isSealed) return null;
    switch (commission.sealLevel) {
      case 'royal':
        return { label: '皇家封签', icon: Crown, color: 'from-yellow-500 to-amber-600', borderColor: 'border-yellow-400', bgColor: 'bg-yellow-50', textColor: 'text-yellow-800' };
      case 'official':
        return { label: '官府封签', icon: Building2, color: 'from-blue-500 to-indigo-600', borderColor: 'border-blue-400', bgColor: 'bg-blue-50', textColor: 'text-blue-800' };
      case 'normal':
        return { label: '普通封签', icon: Shield, color: 'from-emerald-500 to-teal-600', borderColor: 'border-emerald-400', bgColor: 'bg-emerald-50', textColor: 'text-emerald-800' };
      default:
        return { label: '封签货物', icon: Lock, color: 'from-slate-500 to-slate-600', borderColor: 'border-slate-400', bgColor: 'bg-slate-50', textColor: 'text-slate-800' };
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5">
      <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
        <Package className="w-5 h-5 text-indigo-500" />
        库存货物 ({acceptedCommissions.length})
        {acceptedCommissions.some(c => c.isSealed) && (
          <span className="ml-2 text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full flex items-center gap-1">
            <Lock className="w-3 h-3" />
            含封签货物 · 不可查看
          </span>
        )}
      </h3>

      {acceptedCommissions.length === 0 ? (
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">仓库暂无货物</p>
          <p className="text-sm text-slate-400 mt-1">去港口大厅承接委托吧</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {acceptedCommissions.map(commission => {
            const goods = getGoodsInfo(commission.goodsId);
            const sealInfo = getSealInfo(commission);
            return (
              <div
                key={commission.id}
                className={`relative border-2 rounded-lg p-4 transition-all ${
                  sealInfo
                    ? `${sealInfo.bgColor} ${sealInfo.borderColor} border-dashed`
                    : 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'
                }`}
              >
                {sealInfo && (
                  <div className={`absolute -top-2 left-2 px-2 py-0.5 bg-gradient-to-r ${sealInfo.color} text-white text-xs font-bold rounded-full shadow flex items-center gap-1`}>
                    <sealInfo.icon className="w-3 h-3" />
                    {sealInfo.label}
                  </div>
                )}
                
                <div className={`flex items-start justify-between mb-2 ${sealInfo ? 'mt-3' : ''}`}>
                  {sealInfo ? (
                    <div className="flex items-center gap-2">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${sealInfo.color} flex items-center justify-center shadow-inner`}>
                        <Lock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className={`font-semibold ${sealInfo.textColor} flex items-center gap-1`}>
                          <Eye className="w-3.5 h-3.5" />
                          封装箱 · 内容保密
                        </div>
                        <div className="text-xs text-slate-500">
                          件数: {commission.quantity}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{goods?.icon || '📦'}</span>
                      <div>
                        <div className="font-medium text-slate-800">
                          {commission.goodsName}
                        </div>
                        <div className="text-xs text-slate-500">
                          数量: {commission.quantity}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="text-right">
                    {sealInfo ? (
                      <>
                        <div className={`text-sm font-semibold ${sealInfo.textColor}`}>
                          送达后结算
                        </div>
                        <div className={`text-xs flex items-center gap-1 justify-end ${sealInfo.textColor} opacity-80`}>
                          <Lock className="w-3 h-3" />
                          封签未拆
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-sm font-medium text-amber-600">
                          ¥{commission.reward}
                        </div>
                        <div className={`text-xs flex items-center gap-1 justify-end ${getFragilityColor(goods?.fragility || 1)}`}>
                          <AlertCircle className="w-3 h-3" />
                          {getFragilityLabel(goods?.fragility || 1)}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {sealInfo ? (
                  <div className={`text-xs ${sealInfo.textColor} opacity-90 space-y-1`}>
                    <div className="flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      目的地: {commission.destinationName}
                    </div>
                    {commission.deadlineHours && (
                      <div className="flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3" />
                        期限: {commission.deadlineHours} 小时 · 超时重罚
                      </div>
                    )}
                    <div className="mt-2 pt-2 border-t border-dashed opacity-60 flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      封签期间无法查看货物详情、调仓或折价处理
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-xs text-slate-500">
                      目的地: {commission.destinationName}
                    </div>
                    {commission.deadlineHours && (
                      <div className="text-xs text-slate-400 mt-1">
                        期限: {commission.deadlineHours} 小时
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InventoryGrid;
