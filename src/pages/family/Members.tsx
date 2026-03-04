import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  Users, 
  Settings,
  Plus,
  Edit2,
  Trash2,
  Key,
  Mail,
  Phone,
  Search,
  X,
  Check,
  AlertCircle
} from 'lucide-react';

// Define types
interface Member {
  id: number;
  name: string;
  relationship: string;
  pin: string;
  lastActive: string;
  status: 'active' | 'inactive';
  avatar: string;
  language: 'English' | 'Kiswahili';
  phone?: string;
  email?: string;
}

const Members: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [newPin, setNewPin] = useState('');

  // Mock data - family members
  const [members, setMembers] = useState<Member[]>([
    {
      id: 1,
      name: 'Kofi',
      relationship: 'Father',
      pin: '1234',
      lastActive: 'Today, 9:30 AM',
      status: 'active',
      avatar: 'K',
      language: 'English',
      phone: '+254 712 345 678',
      email: 'kofi@family.com'
    },
    {
      id: 2,
      name: 'Grace',
      relationship: 'Mother',
      pin: '5678',
      lastActive: 'Today, 8:15 AM',
      status: 'active',
      avatar: 'G',
      language: 'Kiswahili',
      phone: '+254 723 456 789'
    },
    {
      id: 3,
      name: 'Auntie Mercy',
      relationship: 'Aunt',
      pin: '9012',
      lastActive: 'Yesterday, 10:00 AM',
      status: 'active',
      avatar: 'M',
      language: 'English'
    },
    {
      id: 4,
      name: 'Uncle John',
      relationship: 'Uncle',
      pin: '3456',
      lastActive: '3 days ago',
      status: 'inactive',
      avatar: 'J',
      language: 'English'
    }
  ]);

  // Form state for new member
  const [newMember, setNewMember] = useState({
    name: '',
    relationship: '',
    language: 'English' as 'English' | 'Kiswahili',
    phone: '',
    email: ''
  });

  // Filter members based on search
  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.relationship.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate random PIN
  const generatePin = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  // Handle add member
  const handleAddMember = () => {
    const newId = Math.max(...members.map(m => m.id)) + 1;
    const member: Member = {
      id: newId,
      name: newMember.name,
      relationship: newMember.relationship,
      pin: generatePin(),
      lastActive: 'Never',
      status: 'active',
      avatar: newMember.name.charAt(0).toUpperCase(),
      language: newMember.language,
      phone: newMember.phone || undefined,
      email: newMember.email || undefined
    };
    
    setMembers([...members, member]);
    setShowAddModal(false);
    setNewMember({ name: '', relationship: '', language: 'English', phone: '', email: '' });
  };

  // Handle reset PIN
  const handleResetPin = () => {
    if (selectedMember) {
      const updatedMembers = members.map(m => 
        m.id === selectedMember.id ? { ...m, pin: newPin || generatePin() } : m
      );
      setMembers(updatedMembers);
      setShowResetModal(false);
      setSelectedMember(null);
      setNewPin('');
    }
  };

  // Handle delete member
  const handleDeleteMember = () => {
    if (selectedMember) {
      setMembers(members.filter(m => m.id !== selectedMember.id));
      setShowDeleteModal(false);
      setSelectedMember(null);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      
      {/* ===== SIDEBAR ===== */}
      <div className="w-64 bg-card shadow-lg flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-light text-primary">Family Connect</h1>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {/* Dashboard */}
            <button 
              onClick={() => navigate('/family/dashboard')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-secondary hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </button>

            {/* Question Bank */}
            <button 
              onClick={() => navigate('/family/question-bank')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-secondary hover:bg-gray-50 rounded-lg transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              <span>Question Bank</span>
            </button>

            {/* Schedule */}
            <button 
              onClick={() => navigate('/family/schedule')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-secondary hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Calendar className="w-5 h-5" />
              <span>Schedule</span>
            </button>

            {/* Responses */}
            <button 
              onClick={() => navigate('/family/responses')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-secondary hover:bg-gray-50 rounded-lg transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Responses</span>
            </button>

            {/* Members (active) */}
            <button 
              onClick={() => navigate('/family/members')}
              className="w-full flex items-center space-x-3 px-4 py-3 bg-primary/10 text-primary rounded-lg font-medium"
            >
              <Users className="w-5 h-5" />
              <span>Members</span>
            </button>

            {/* Settings */}
            <button 
              onClick={() => navigate('/family/settings')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-secondary hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-primary font-semibold">S</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-primary">Sarah Williams</p>
              <p className="text-xs text-secondary">Family Organizer</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-light text-primary mb-2">
                Family Members
              </h1>
              <p className="text-secondary">
                Manage your elderly family members and their access
              </p>
            </div>
            
            {/* Add Member Button */}
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-button hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add Member</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search members by name or relationship..."
                className="w-full pl-12 pr-4 py-3 bg-card border border-gray-200 rounded-input focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Members List */}
          <div className="space-y-4">
            {filteredMembers.map((member) => (
              <div 
                key={member.id}
                className="bg-card rounded-card p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  {/* Member Info */}
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-2xl text-primary font-semibold">{member.avatar}</span>
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-primary">{member.name}</h3>
                        <span className="text-secondary">({member.relationship})</span>
                        {member.status === 'active' ? (
                          <span className="flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                            <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="flex items-center space-x-1 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                            <span>Inactive</span>
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                        <div>
                          <p className="text-xs text-secondary">PIN Code</p>
                          <p className="text-primary font-mono text-lg">{member.pin}</p>
                        </div>
                        <div>
                          <p className="text-xs text-secondary">Language</p>
                          <p className="text-primary">{member.language}</p>
                        </div>
                        <div>
                          <p className="text-xs text-secondary">Last Active</p>
                          <p className="text-primary">{member.lastActive}</p>
                        </div>
                        {member.phone && (
                          <div>
                            <p className="text-xs text-secondary">Phone</p>
                            <p className="text-primary flex items-center space-x-1">
                              <Phone className="w-3 h-3" />
                              <span>{member.phone}</span>
                            </p>
                          </div>
                        )}
                        {member.email && (
                          <div>
                            <p className="text-xs text-secondary">Email</p>
                            <p className="text-primary flex items-center space-x-1">
                              <Mail className="w-3 h-3" />
                              <span>{member.email}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => {
                        setSelectedMember(member);
                        setShowResetModal(true);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Reset PIN"
                    >
                      <Key className="w-5 h-5 text-primary" />
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedMember(member);
                        setShowEditModal(true);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit Member"
                    >
                      <Edit2 className="w-5 h-5 text-secondary" />
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedMember(member);
                        setShowDeleteModal(true);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Remove Member"
                    >
                      <Trash2 className="w-5 h-5 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredMembers.length === 0 && (
            <div className="text-center py-12 bg-card rounded-card">
              <p className="text-secondary text-lg">No members found</p>
              <p className="text-secondary text-sm mt-2">Try a different search or add a new member</p>
            </div>
          )}
        </div>
      </div>

      {/* ===== ADD MEMBER MODAL ===== */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-card max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-light text-primary">Add New Member</h2>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-6 h-6 text-secondary hover:text-primary" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Name *</label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  className="w-full bg-background border border-gray-200 rounded-input px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="e.g., Kofi"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Relationship *</label>
                <input
                  type="text"
                  value={newMember.relationship}
                  onChange={(e) => setNewMember({...newMember, relationship: e.target.value})}
                  className="w-full bg-background border border-gray-200 rounded-input px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="e.g., Father, Mother, Aunt"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Preferred Language</label>
                <select
                  value={newMember.language}
                  onChange={(e) => setNewMember({...newMember, language: e.target.value as 'English' | 'Kiswahili'})}
                  className="w-full bg-background border border-gray-200 rounded-input px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="English">English</option>
                  <option value="Kiswahili">Kiswahili</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Phone (optional)</label>
                <input
                  type="tel"
                  value={newMember.phone}
                  onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                  className="w-full bg-background border border-gray-200 rounded-input px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="+254 712 345 678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Email (optional)</label>
                <input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                  className="w-full bg-background border border-gray-200 rounded-input px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="email@example.com"
                />
              </div>

              <p className="text-xs text-secondary">* Required fields</p>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleAddMember}
                  disabled={!newMember.name || !newMember.relationship}
                  className="flex-1 bg-primary text-white py-2 rounded-button hover:bg-primary/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Add Member
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-100 text-secondary py-2 rounded-button hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== RESET PIN MODAL ===== */}
      {showResetModal && selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-card max-w-md w-full p-6">
            <div className="flex items-center space-x-2 text-orange-500 mb-4">
              <Key className="w-6 h-6" />
              <h2 className="text-2xl font-light">Reset PIN</h2>
            </div>

            <p className="text-secondary mb-4">
              Reset PIN for <span className="font-semibold text-primary">{selectedMember.name}</span>
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">New PIN (4 digits)</label>
                <input
                  type="text"
                  maxLength={4}
                  pattern="\d*"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-background border border-gray-200 rounded-input px-4 py-2 text-center text-2xl font-mono focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="••••"
                />
              </div>

              <button
                onClick={() => setNewPin(generatePin())}
                className="text-primary text-sm hover:underline"
              >
                Generate random PIN
              </button>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleResetPin}
                  disabled={newPin.length !== 4}
                  className="flex-1 bg-primary text-white py-2 rounded-button hover:bg-primary/90 transition-colors disabled:bg-gray-300"
                >
                  Reset PIN
                </button>
                <button
                  onClick={() => {
                    setShowResetModal(false);
                    setSelectedMember(null);
                    setNewPin('');
                  }}
                  className="flex-1 bg-gray-100 text-secondary py-2 rounded-button hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== DELETE MEMBER MODAL ===== */}
      {showDeleteModal && selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-card max-w-md w-full p-6">
            <div className="flex items-center space-x-2 text-red-500 mb-4">
              <AlertCircle className="w-6 h-6" />
              <h2 className="text-2xl font-light">Remove Member</h2>
            </div>

            <p className="text-secondary mb-2">
              Are you sure you want to remove <span className="font-semibold text-primary">{selectedMember.name}</span>?
            </p>
            <p className="text-sm text-red-500 mb-6">
              This action cannot be undone. All responses and history will be deleted.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={handleDeleteMember}
                className="flex-1 bg-red-500 text-white py-2 rounded-button hover:bg-red-600 transition-colors"
              >
                Remove
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedMember(null);
                }}
                className="flex-1 bg-gray-100 text-secondary py-2 rounded-button hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;