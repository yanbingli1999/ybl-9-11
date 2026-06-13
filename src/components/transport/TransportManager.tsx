import { Truck, Clock, MapPin, AlertTriangle, Lock, Crown, Building2, Shield, Eye } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';

const TransportManager = () => {
  const { trips, vehicles, routes, cities, commissions, goodsList, currentWeather, player } = useGameStore();
  
  const inProgressTrips = trips.filter(t => t.status === 'in_progress');
  const completedTrips = trips.filter(t => t.status === 'completed').slice(-5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in_progress': return '运输中';
      case 'completed': return '已完成';
      case 'failed': return '失败';
      default: return '待处理';
    }
  };

  const getSealInfo = (sealLevel?: string) => {
    switch (sealLevel) {
      case 'royal':
        return { label: '皇家封签', icon: Crown, color: 'text-yellow-700', bgColor: 'bg-yellow-100' };
      case 'official':
        return { label: '官府封签', icon: Building2, color: 'text-blue-700', bgColor: 'bg-blue-100' };
      case 'normal':
        return { label: '普通封签', icon: Shield, color: 'text-emerald-700', bgColor: 'bg-emerald-100' };
      default:
        return null;
    }
  };

  const getTripInfo = (trip: any) => {
    const vehicle = vehicles.find(v => v.id === trip.vehicleId);
    const route = routes.find(r => r.id === trip.routeId);
    const destCity = cities.find(c => 
      c.id === route?.toCityId || c.id === route?.fromCityId
    );
    const tripCommissions = commissions.filter(c => 
      trip.commissionIds.includes(c.id)
    );
    
    return { vehicle, route, destCity, tripCommissions };
  };

  const getSealsSummary = (tripCommissions: any[]) => {
    const sealed = tripCommissions.filter(c => c.isSealed);
    if (sealed.length === 0) return null;
    const royalCount = sealed.filter(c => c.sealLevel === 'royal').length;
    const officialCount = sealed.filter(c => c.sealLevel === 'official').length;
    const normalCount = sealed.filter(c => c.sealLevel === 'normal').length;
    return { royalCount, officialCount, normalCount, totalSealed: sealed.length, totalNormal: tripCommissions.length - sealed.length };
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">运输管理</h2>
          <p className="text-slate-500">查看和管理正在进行的运输任务</p>
          {player.royalRoutesUnlocked && (
            <span className="inline-block mt-2 text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full flex items-center gap-1 w-fit">
              <Crown className="w-3 h-3" />
              皇家官道已解锁
            </span>
          )}
        </div>
        
        {currentWeather && (
          <div className="mb-6 p-4 bg-sky-50 border border-sky-200 rounded-xl flex items-center gap-3">
            <span className="text-3xl">{currentWeather.icon}</span>
            <div>
              <p className="font-medium text-sky-800">当前天气: {currentWeather.name}</p>
              <p className="text-sm text-sky-600">{currentWeather.description}</p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-500" />
              进行中 ({inProgressTrips.length})
            </h3>
            
            {inProgressTrips.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">暂无进行中的运输任务</p>
                <p className="text-sm text-slate-400 mt-1">请在路线规划中安排运输</p>
              </div>
            ) : (
              <div className="space-y-4">
                {inProgressTrips.map(trip => {
                  const { vehicle, route, destCity, tripCommissions } = getTripInfo(trip);
                  const totalWeight = tripCommissions.reduce((sum, c) => {
                    const goods = goodsList.find(g => g.id === c.goodsId);
                    return sum + (c.quantity * (goods?.weight || 1));
                  }, 0);
                  
                  const sealsSummary = getSealsSummary(tripCommissions);
                  const isRoyalRoute = route?.isRoyal;
                  
                  return (
                    <div key={trip.id} className={`bg-white rounded-xl shadow-md p-5 relative overflow-hidden ${
                      isRoyalRoute ? 'ring-2 ring-yellow-400/40' : ''
                    }`}>
                      {isRoyalRoute && (
                        <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-l from-yellow-500 to-amber-500 text-white text-xs font-bold flex items-center gap-1 rounded-bl-lg">
                          <Crown className="w-3 h-3" />
                          皇家官道
                        </div>
                      )}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{vehicle?.icon || '🚚'}</span>
                          <div>
                            <div className="font-medium text-slate-800">
                              {vehicle?.name || '未知车辆'}
                            </div>
                            <div className="text-sm text-slate-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              前往 {destCity?.name || '未知目的地'}
                            </div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                          {getStatusLabel(trip.status)}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-600">运输进度</span>
                            <span className="font-medium text-slate-800">
                              {trip.progress}%
                            </span>
                          </div>
                          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isRoyalRoute 
                                  ? 'bg-gradient-to-r from-yellow-500 to-amber-500' 
                                  : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                              }`}
                              style={{ width: `${trip.progress}%` }}
                            />
                          </div>
                        </div>
                        
                        {sealsSummary && sealsSummary.totalSealed > 0 ? (
                          <div className={`rounded-lg p-3 border-dashed border-2 ${
                            sealsSummary.royalCount > 0 ? 'bg-yellow-50 border-yellow-300' 
                              : sealsSummary.officialCount > 0 ? 'bg-blue-50 border-blue-300' 
                              : 'bg-emerald-50 border-emerald-300'
                          }`}>
                            <div className="flex items-center gap-2 mb-2">
                              <Lock className={`w-4 h-4 ${
                                sealsSummary.royalCount > 0 ? 'text-yellow-600' 
                                  : sealsSummary.officialCount > 0 ? 'text-blue-600' 
                                  : 'text-emerald-600'
                              }`} />
                              <span className={`text-sm font-semibold ${
                                sealsSummary.royalCount > 0 ? 'text-yellow-800' 
                                  : sealsSummary.officialCount > 0 ? 'text-blue-800' 
                                  : 'text-emerald-800'
                              }`}>
                                本批含 {sealsSummary.totalSealed} 单封签货物
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs">
                              {sealsSummary.royalCount > 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-yellow-200 text-yellow-800 font-medium flex items-center gap-1">
                                  <Crown className="w-3 h-3" />
                                  皇家 × {sealsSummary.royalCount}
                                </span>
                              )}
                              {sealsSummary.officialCount > 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-blue-200 text-blue-800 font-medium flex items-center gap-1">
                                  <Building2 className="w-3 h-3" />
                                  官府 × {sealsSummary.officialCount}
                                </span>
                              )}
                              {sealsSummary.normalCount > 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 font-medium flex items-center gap-1">
                                  <Shield className="w-3 h-3" />
                                  普通 × {sealsSummary.normalCount}
                                </span>
                              )}
                              {sealsSummary.totalNormal > 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                                  普通货物 × {sealsSummary.totalNormal}
                                </span>
                              )}
                            </div>
                            <div className={`mt-2 text-xs flex items-center gap-1 ${
                              sealsSummary.royalCount > 0 ? 'text-yellow-700' 
                                : sealsSummary.officialCount > 0 ? 'text-blue-700' 
                                : 'text-emerald-700'
                            }`}>
                              <Eye className="w-3 h-3" />
                              封签货物详情已加密，途中无法查看
                            </div>
                          </div>
                        ) : (
                          <div className="bg-slate-50 rounded-lg p-2">
                            <div className="text-xs text-slate-500 mb-1">运输货物明细</div>
                            <div className="flex flex-wrap gap-1.5">
                              {tripCommissions.map(c => (
                                <span key={c.id} className="text-xs px-2 py-0.5 bg-white rounded-full text-slate-700 border border-slate-200">
                                  {c.goodsName} × {c.quantity}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div className="bg-slate-50 rounded-lg p-2 text-center">
                            <div className="text-slate-400 text-xs">订单</div>
                            <div className="font-medium text-slate-800">
                              {tripCommissions.length} 单
                            </div>
                          </div>
                          <div className="bg-slate-50 rounded-lg p-2 text-center">
                            <div className="text-slate-400 text-xs">载重</div>
                            <div className="font-medium text-slate-800">
                              {totalWeight}
                            </div>
                          </div>
                          <div className="bg-slate-50 rounded-lg p-2 text-center">
                            <div className="text-slate-400 text-xs">费用</div>
                            <div className="font-medium text-amber-600">
                              {trip.totalCost}
                            </div>
                          </div>
                        </div>
                        
                        {trip.events.length > 0 && (
                          <div className="pt-3 border-t border-slate-100">
                            <div className="text-xs text-slate-500 mb-2">途中事件</div>
                            <div className="space-y-1">
                              {trip.events.map((event, index) => (
                                <div key={index} className={`text-xs flex items-start gap-1 rounded p-1.5 ${
                                  event.includes('封签') || event.includes('皇家') || event.includes('官府')
                                    ? event.includes('皇家') ? 'bg-yellow-50 text-yellow-700' 
                                      : event.includes('官府') ? 'bg-blue-50 text-blue-700'
                                      : 'bg-emerald-50 text-emerald-700'
                                    : 'text-slate-600'
                                }`}>
                                  <AlertTriangle className={`w-3 h-3 mt-0.5 flex-shrink-0 ${
                                    event.includes('封签') || event.includes('皇家') || event.includes('官府')
                                      ? ''
                                      : 'text-amber-500'
                                  }`} />
                                  {event}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-500" />
              历史记录 ({completedTrips.length})
            </h3>
            
            {completedTrips.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">暂无历史记录</p>
              </div>
            ) : (
              <div className="space-y-3">
                {completedTrips.map(trip => {
                  const { vehicle, route, destCity, tripCommissions } = getTripInfo(trip);
                  const hasSealed = tripCommissions.some(c => c.isSealed);
                  const isRoyalRoute = route?.isRoyal;
                  
                  return (
                    <div key={trip.id} className={`bg-white rounded-xl shadow-md p-4 ${
                      isRoyalRoute ? 'ring-1 ring-yellow-300' : ''
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xl">{vehicle?.icon || '🚚'}</span>
                          <span className="font-medium text-slate-800">
                            {vehicle?.name} → {destCity?.name}
                          </span>
                          {isRoyalRoute && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700 font-medium flex items-center gap-0.5">
                              <Crown className="w-3 h-3" />
                              皇家
                            </span>
                          )}
                          {hasSealed && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-medium flex items-center gap-0.5">
                              <Lock className="w-3 h-3" />
                              含封签
                            </span>
                          )}
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(trip.status)}`}>
                          {getStatusLabel(trip.status)}
                        </span>
                      </div>
                      <div className="text-sm text-slate-500">
                        {tripCommissions.map(c => (
                          c.isSealed ? (
                            <span key={c.id} className="inline-flex items-center gap-0.5 mr-2 text-slate-600">
                              <Lock className="w-3 h-3" />
                              [封装箱] × {c.quantity}
                            </span>
                          ) : (
                            <span key={c.id} className="mr-2">
                              {c.goodsName} × {c.quantity}
                            </span>
                          )
                        ))}
                      </div>
                      {trip.actualArrivalTime && (
                        <div className="text-xs text-slate-400 mt-1">
                          完成时间: {new Date(trip.actualArrivalTime).toLocaleString()}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportManager;
