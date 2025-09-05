import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import FloatingActionButton from '../../components/Common/FloatingActionButton';
import DutyForm from './DutyForm';
import DutyDetail from './DutyDetail';
import { Calendar, ChevronLeft, ChevronRight, CheckCircle, Clock, XCircle } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const DutySchedule: React.FC = () => {
  const { dutySchedules, members } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [editingDuty, setEditingDuty] = useState(null);
  const [selectedDuty, setSelectedDuty] = useState(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getDutyForDate = (date: Date) => {
    return dutySchedules.find(duty => 
      isSameDay(new Date(duty.date), date)
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'skipped':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-orange-600 bg-orange-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={12} />;
      case 'skipped':
        return <XCircle size={12} />;
      default:
        return <Clock size={12} />;
    }
  };

  const handleAddDuty = () => {
    setEditingDuty(null);
    setShowForm(true);
  };

  const handleEditDuty = (duty: any) => {
    setEditingDuty(duty);
    setSelectedDuty(null); // 关闭详情页面
    setShowForm(true);
  };

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  return (
    <div className="min-h-screen bg-paper-100 pb-20">
      {/* Header */}
      <div className="bg-ink-800 text-paper-50 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Calendar size={24} />
              <h1 className="text-xl font-bold">卫生值日</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={prevMonth}
                className="p-2 rounded-lg hover:bg-ink-700 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-lg font-medium min-w-[120px] text-center">
                {format(currentDate, 'yyyy年MM月', { locale: zhCN })}
              </h2>
              <button
                onClick={nextMonth}
                className="p-2 rounded-lg hover:bg-ink-700 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="ink-card p-3 text-center">
            <p className="text-lg font-bold text-green-600">
              {dutySchedules.filter(d => d.status === 'completed').length}
            </p>
            <p className="text-xs text-ink-600">已完成</p>
          </div>
          <div className="ink-card p-3 text-center">
            <p className="text-lg font-bold text-orange-600">
              {dutySchedules.filter(d => d.status === 'pending').length}
            </p>
            <p className="text-xs text-ink-600">待执行</p>
          </div>
          <div className="ink-card p-3 text-center">
            <p className="text-lg font-bold text-red-600">
              {dutySchedules.filter(d => d.status === 'skipped').length}
            </p>
            <p className="text-xs text-ink-600">已跳过</p>
          </div>
        </div>

        {/* Calendar */}
        <div className="ink-card p-4 mb-4">
          {/* Week Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-ink-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {monthDays.map((day) => {
              const duty = getDutyForDate(day);
              const isToday = isSameDay(day, new Date());
              
              return (
                <div
                  key={day.toString()}
                  className={`
                    relative aspect-square p-1 rounded-lg cursor-pointer
                    transition-colors duration-200 hover:bg-ink-50
                    ${isToday ? 'bg-ink-100 ring-2 ring-ink-300' : ''}
                    ${duty ? 'bg-gradient-to-br from-blue-50 to-blue-100' : ''}
                  `}
                  onClick={() => duty && setSelectedDuty(duty)}
                >
                  <div className="flex flex-col h-full">
                    <span className={`text-xs font-medium ${isToday ? 'text-ink-900' : 'text-ink-700'}`}>
                      {format(day, 'd')}
                    </span>
                    {duty && (
                      <div className="flex-1 flex flex-col justify-end">
                        <div className={`
                          text-xs px-1 py-0.5 rounded text-center truncate
                          ${getStatusColor(duty.status)}
                        `}>
                          <div className="flex items-center justify-center gap-1">
                            {getStatusIcon(duty.status)}
                            <span className="truncate">
                              {duty.members.length > 0 ? duty.members[0] : '值日'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Today's Duty */}
        {(() => {
          const todayDuty = getDutyForDate(new Date());
          if (todayDuty) {
            return (
              <div className="ink-card p-4 mb-4 bg-gradient-to-r from-blue-50 to-blue-100">
                <h3 className="font-semibold text-ink-900 mb-2 flex items-center gap-2">
                  <Calendar size={16} />
                  今日值日
                </h3>
                <div className="space-y-2">
                  <p className="text-ink-700">
                    值日人员：{todayDuty.members.join(', ')}
                  </p>
                  <p className="text-ink-600 text-sm">
                    任务：{todayDuty.tasks.join(', ')}
                  </p>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(todayDuty.status)}`}>
                    {getStatusIcon(todayDuty.status)}
                    <span>
                      {todayDuty.status === 'completed' ? '已完成' : 
                       todayDuty.status === 'skipped' ? '已跳过' : '待执行'}
                    </span>
                  </div>
                </div>
              </div>
            );
          }
          return null;
        })()}

        {/* Recent Schedules */}
        <div className="space-y-3">
          <h3 className="font-semibold text-ink-900">最近安排</h3>
          {dutySchedules
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5)
            .map((duty, index) => (
              <div 
                key={duty.id} 
                className="ink-card p-3 cursor-pointer hover:shadow-lg transition-all duration-200 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => setSelectedDuty(duty)}
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium text-ink-900">
                    {format(new Date(duty.date), 'MM月dd日 EEEE', { locale: zhCN })}
                  </p>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(duty.status)}`}>
                    {getStatusIcon(duty.status)}
                    <span>
                      {duty.status === 'completed' ? '已完成' : 
                       duty.status === 'skipped' ? '已跳过' : '待执行'}
                    </span>
                  </div>
                </div>
                <p className="text-ink-600 text-sm">
                  值日人员：{duty.members.join(', ')}
                </p>
                <p className="text-ink-500 text-xs mt-1">
                  任务：{duty.tasks.join(', ')}
                </p>
              </div>
            ))}
        </div>

        {dutySchedules.length === 0 && (
          <div className="text-center py-12">
            <Calendar size={48} className="mx-auto text-ink-300 mb-4" />
            <p className="text-ink-500">暂无值日安排</p>
            <p className="text-ink-400 text-sm">点击右下角按钮添加值日安排</p>
          </div>
        )}
      </div>

      <FloatingActionButton onClick={handleAddDuty} />

      {showForm && (
        <DutyForm
          duty={editingDuty}
          onClose={() => setShowForm(false)}
        />
      )}

      {selectedDuty && (
        <DutyDetail
          duty={selectedDuty}
          onClose={() => setSelectedDuty(null)}
          onEdit={handleEditDuty}
        />
      )}
    </div>
  );
};

export default DutySchedule;