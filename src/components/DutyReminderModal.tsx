import React from 'react';
import { DutySchedule } from '../types';
import { Calendar, Users, CheckSquare, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface DutyReminderModalProps {
  onClose: () => void;
  dutySchedule?: DutySchedule;
}

const DutyReminderModal: React.FC<DutyReminderModalProps> = ({ onClose, dutySchedule }) => {
  if (!dutySchedule) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl w-full max-w-md animate-bounce-in">
        <div className="bg-gradient-to-r from-warning-500 to-warning-600 p-6 text-white rounded-t-2xl">
          <div className="flex items-center gap-3 mb-2">
            <Clock size={24} />
            <h2 className="text-xl font-bold">值日提醒</h2>
          </div>
          <p className="text-warning-100">您今天有值日安排</p>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-secondary-500" />
              <div>
                <p className="text-sm text-secondary-500">日期</p>
                <p className="font-medium text-secondary-800 dark:text-secondary-200">
                  {format(new Date(dutySchedule.date), 'yyyy年MM月dd日 EEEE', { locale: zhCN })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users size={16} className="text-secondary-500 mt-1" />
              <div>
                <p className="text-sm text-secondary-500 mb-1">值日人员</p>
                <div className="flex flex-wrap gap-1">
                  {dutySchedule.members.map((member, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg text-sm"
                    >
                      {member}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckSquare size={16} className="text-secondary-500 mt-1" />
              <div>
                <p className="text-sm text-secondary-500 mb-1">值日任务</p>
                <div className="space-y-1">
                  {dutySchedule.tasks.map((task, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-secondary-400 rounded-full"></div>
                      <span className="text-secondary-700 dark:text-secondary-300 text-sm">{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {dutySchedule.notes && (
              <div className="bg-secondary-50 dark:bg-secondary-700 p-3 rounded-lg">
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  <strong>备注：</strong>{dutySchedule.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-secondary-200 dark:border-secondary-700">
          <button
            onClick={onClose}
            className="w-full btn-primary"
          >
            我知道了
          </button>
        </div>
      </div>
    </div>
  );
};

export default DutyReminderModal;