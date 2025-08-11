import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import SearchBar from '../../components/Common/SearchBar';
import FloatingActionButton from '../../components/Common/FloatingActionButton';
import ImportExportButtons from '../../components/Common/ImportExportButtons';
import MemberForm from './MemberForm';
import MemberDetail from './MemberDetail';
import { Users, Phone, Mail } from 'lucide-react';
import { format } from 'date-fns';

const MembersList: React.FC = () => {
  const { members } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.group.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddMember = () => {
    setEditingMember(null);
    setShowForm(true);
  };

  const handleEditMember = (member: any) => {
    setEditingMember(member);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-paper-100 pb-20 safe-area-padding">
      {/* Header */}
      <div className="bg-ink-800 text-paper-50 p-3 sm:p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-3">
              <Users size={20} className="sm:w-6 sm:h-6" />
              <h1 className="responsive-text-lg font-bold">成员名单</h1>
            </div>
            <ImportExportButtons module="members" />
          </div>
          
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="搜索成员姓名、组别..."
          />
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-md mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="modern-card mb-3 sm:mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="responsive-text-xl font-bold text-ink-900">{filteredMembers.length}</p>
              <p className="text-ink-600 text-sm sm:text-base">团队成员</p>
            </div>
            <div className="text-right">
              <p className="text-xs sm:text-sm text-ink-600">最新加入</p>
              <p className="font-medium text-ink-800 text-sm sm:text-base">
                {members.length > 0 ? 
                  members.sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime())[0].name :
                  '暂无数据'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Members List */}
        <div className="space-y-2 sm:space-y-3">
          {filteredMembers.map((member, index) => (
            <div 
              key={member.id} 
              className="modern-card cursor-pointer hover:shadow-lg transition-all duration-200 
                       animate-fade-in card-hover-effect touch-target"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => setSelectedMember(member)}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-ink-600 to-ink-700 
                               rounded-full flex items-center justify-center text-paper-50 font-bold
                               text-sm sm:text-base">
                  {member.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm sm:text-base text-ink-900">{member.name}</h3>
                  <p className="text-ink-600 text-xs sm:text-sm">{member.group}</p>
                  {member.grade && member.class && (
                    <p className="text-ink-500 text-xs leading-tight">{member.grade} {member.class}</p>
                  )}
                </div>
                <div className="text-right">
                  <div className="flex flex-col gap-1">
                    {member.phone && (
                      <div className="flex items-center gap-1 text-ink-500 text-xs">
                        <Phone size={10} className="sm:w-3 sm:h-3" />
                        <span>{member.phone.slice(-4)}</span>
                      </div>
                    )}
                    {member.email && (
                      <div className="flex items-center gap-1 text-ink-500 text-xs">
                        <Mail size={10} className="sm:w-3 sm:h-3" />
                        <span>邮箱</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-ink-100">
                <p className="text-xs text-ink-500">
                  加入时间：{format(new Date(member.joinedAt), 'yyyy年MM月dd日')}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <Users size={40} className="sm:w-12 sm:h-12 mx-auto text-ink-300 mb-4" />
            <p className="text-ink-500">暂无成员数据</p>
            <p className="text-ink-400 text-xs sm:text-sm">点击右下角按钮添加成员</p>
          </div>
        )}
      </div>

      <FloatingActionButton onClick={handleAddMember} />

      {showForm && (
        <MemberForm
          member={editingMember}
          onClose={() => setShowForm(false)}
        />
      )}

      {selectedMember && (
        <MemberDetail
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
          onEdit={handleEditMember}
        />
      )}
    </div>
  );
};

export default MembersList;