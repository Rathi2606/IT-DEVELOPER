import React, { useState } from 'react';
import { Plus, Search, Filter, Settings, MoreVertical, Calendar, User, X } from 'lucide-react';

const KanbanBoard = () => {
  const [lanes, setLanes] = useState([
    {
      id: 'todo',
      title: 'TO DO',
      cards: [
        { id: 1, title: 'Design new dashboard', labels: ['Design', 'High'], assignee: 'JD', dueDate: '2025-10-05' },
        { id: 2, title: 'User research', labels: ['Research'], assignee: 'SM', dueDate: '2025-10-08' },
        { id: 3, title: 'API documentation', labels: ['Docs', 'Medium'], assignee: 'AK', dueDate: '2025-10-12' }
      ]
    },
    {
      id: 'inprogress',
      title: 'IN PROGRESS',
      cards: [
        { id: 4, title: 'Frontend development', labels: ['Dev', 'High'], assignee: 'RK', dueDate: '2025-10-03' },
        { id: 5, title: 'Database optimization', labels: ['Backend'], assignee: 'PL', dueDate: '2025-10-06' }
      ]
    },
    {
      id: 'done',
      title: 'DONE',
      cards: [
        { id: 6, title: 'Initial wireframes', labels: ['Design'], assignee: 'JD', dueDate: '2025-09-25' },
        { id: 7, title: 'Logo design', labels: ['Design'], assignee: 'SM', dueDate: '2025-09-28' },
        { id: 8, title: 'Project setup', labels: ['Dev'], assignee: 'AK', dueDate: '2025-09-20' }
      ]
    }
  ]);

  const [draggedCard, setDraggedCard] = useState(null);
  const [draggedOverLane, setDraggedOverLane] = useState(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddCard, setShowAddCard] = useState({});

  const labelColors = {
    'Design': 'bg-purple-100 text-purple-700',
    'Dev': 'bg-blue-100 text-blue-700',
    'Research': 'bg-green-100 text-green-700',
    'Docs': 'bg-yellow-100 text-yellow-700',
    'Backend': 'bg-indigo-100 text-indigo-700',
    'High': 'bg-red-100 text-red-700',
    'Medium': 'bg-orange-100 text-orange-700'
  };

  const handleDragStart = (e, card, laneId) => {
    setDraggedCard({ card, sourceLaneId: laneId });
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    setDraggedCard(null);
    setDraggedOverLane(null);
  };

  const handleDragOver = (e, laneId) => {
    e.preventDefault();
    setDraggedOverLane(laneId);
  };

  const handleDrop = (e, targetLaneId) => {
    e.preventDefault();
    
    if (!draggedCard) return;

    const { card, sourceLaneId } = draggedCard;

    if (sourceLaneId === targetLaneId) {
      setDraggedOverLane(null);
      return;
    }

    setLanes(prevLanes => {
      const newLanes = prevLanes.map(lane => {
        if (lane.id === sourceLaneId) {
          return {
            ...lane,
            cards: lane.cards.filter(c => c.id !== card.id)
          };
        }
        if (lane.id === targetLaneId) {
          return {
            ...lane,
            cards: [...lane.cards, card]
          };
        }
        return lane;
      });
      return newLanes;
    });

    setDraggedOverLane(null);
  };

  const addCard = (laneId, title) => {
    if (!title.trim()) return;

    const newCard = {
      id: Date.now(),
      title: title.trim(),
      labels: [],
      assignee: 'U',
      dueDate: null
    };

    setLanes(prevLanes => prevLanes.map(lane => {
      if (lane.id === laneId) {
        return { ...lane, cards: [...lane.cards, newCard] };
      }
      return lane;
    }));

    setShowAddCard({ ...showAddCard, [laneId]: false });
  };

  const deleteCard = (laneId, cardId) => {
    setLanes(prevLanes => prevLanes.map(lane => {
      if (lane.id === laneId) {
        return { ...lane, cards: lane.cards.filter(c => c.id !== cardId) };
      }
      return lane;
    }));
    setShowCardModal(false);
  };

  const filteredLanes = lanes.map(lane => ({
    ...lane,
    cards: lane.cards.filter(card => 
      card.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F9FE] to-[#EEEEFF]">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#6C5CE7] to-[#7B68EE] rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="12" height="16" rx="2" stroke="white" strokeWidth="2" fill="none"/>
                    <line x1="9" y1="8" x2="15" y2="8" stroke="white" strokeWidth="2"/>
                    <line x1="9" y1="12" x2="15" y2="12" stroke="white" strokeWidth="2"/>
                  </svg>
                </div>
                <span className="text-xl font-semibold text-[#2D3748]">TaskLane</span>
              </div>
              <nav className="hidden md:flex space-x-6 text-sm text-[#4A5568]">
                <a href="#" className="hover:text-[#6C5CE7]">Features</a>
                <a href="#" className="hover:text-[#6C5CE7]">Pricing</a>
                <a href="#" className="hover:text-[#6C5CE7]">About</a>
                <a href="#" className="hover:text-[#6C5CE7]">Contact</a>
              </nav>
            </div>
            <button className="bg-gradient-to-r from-[#6C5CE7] to-[#7B68EE] text-white px-6 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-shadow">
              Get Started Free
            </button>
          </div>
        </div>
      </header>

      {/* Board Header */}
      <div className="max-w-full px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-[#2D3748]">Project Alpha</h1>
            <button className="p-1 hover:bg-gray-100 rounded">
              <Settings className="w-5 h-5 text-[#718096]" />
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#A0AEC0] absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] focus:border-transparent"
              />
            </div>
            <button className="p-2 hover:bg-white rounded-lg border border-[#E2E8F0]">
              <Filter className="w-4 h-4 text-[#718096]" />
            </button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex space-x-6 overflow-x-auto pb-6">
          {filteredLanes.map(lane => (
            <div
              key={lane.id}
              onDragOver={(e) => handleDragOver(e, lane.id)}
              onDrop={(e) => handleDrop(e, lane.id)}
              className={`flex-shrink-0 w-80 bg-white rounded-xl shadow-sm transition-all ${
                draggedOverLane === lane.id ? 'ring-2 ring-[#6C5CE7] ring-opacity-50' : ''
              }`}
            >
              {/* Lane Header */}
              <div className="px-4 py-4 border-b border-[#E2E8F0]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-sm font-semibold text-[#4A5568] uppercase tracking-wide">
                      {lane.title}
                    </h2>
                    <span className="bg-[#F7FAFC] text-[#718096] text-xs font-medium px-2 py-1 rounded">
                      {lane.cards.length}
                    </span>
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical className="w-4 h-4 text-[#718096]" />
                  </button>
                </div>
              </div>

              {/* Cards Container */}
              <div className="p-3 space-y-3 min-h-[400px] max-h-[600px] overflow-y-auto">
                {lane.cards.map(card => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, card, lane.id)}
                    onDragEnd={handleDragEnd}
                    onClick={() => {
                      setSelectedCard({ ...card, laneId: lane.id });
                      setShowCardModal(true);
                    }}
                    className="bg-white border border-[#E2E8F0] rounded-lg p-4 cursor-move hover:shadow-md hover:-translate-y-0.5 transition-all group"
                  >
                    <h3 className="text-[15px] font-medium text-[#2D3748] mb-3">
                      {card.title}
                    </h3>
                    
                    {card.labels.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {card.labels.slice(0, 3).map((label, idx) => (
                          <span
                            key={idx}
                            className={`text-xs font-medium px-2 py-1 rounded ${labelColors[label] || 'bg-gray-100 text-gray-700'}`}
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-[#A0AEC0]">
                      {card.dueDate && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(card.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2 ml-auto">
                        <div className="w-6 h-6 bg-gradient-to-br from-[#6C5CE7] to-[#7B68EE] rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {card.assignee}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Card */}
                {showAddCard[lane.id] ? (
                  <div className="bg-white border-2 border-[#6C5CE7] rounded-lg p-3">
                    <input
                      type="text"
                      placeholder="Enter task title..."
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addCard(lane.id, e.target.value);
                          e.target.value = '';
                        }
                        if (e.key === 'Escape') {
                          setShowAddCard({ ...showAddCard, [lane.id]: false });
                        }
                      }}
                      onBlur={(e) => {
                        if (e.target.value.trim()) {
                          addCard(lane.id, e.target.value);
                        }
                        setShowAddCard({ ...showAddCard, [lane.id]: false });
                      }}
                      className="w-full text-sm focus:outline-none"
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddCard({ ...showAddCard, [lane.id]: true })}
                    className="w-full bg-gradient-to-r from-[#6C5CE7] to-[#7B68EE] text-white rounded-lg py-2 flex items-center justify-center space-x-2 hover:shadow-lg transition-shadow"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">Add Card</span>
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Add Lane */}
          <div className="flex-shrink-0 w-80">
            <button className="w-full h-full min-h-[200px] border-2 border-dashed border-[#E2E8F0] rounded-xl flex flex-col items-center justify-center space-y-2 hover:border-[#6C5CE7] hover:bg-white transition-all group">
              <Plus className="w-8 h-8 text-[#A0AEC0] group-hover:text-[#6C5CE7]" />
              <span className="text-sm font-medium text-[#718096] group-hover:text-[#6C5CE7]">Add Lane</span>
            </button>
          </div>
        </div>
      </div>

      {/* Card Modal */}
      {showCardModal && selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#2D3748]">{selectedCard.title}</h2>
                <button
                  onClick={() => setShowCardModal(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5 text-[#718096]" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-[#4A5568] mb-2 block">Labels</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedCard.labels.map((label, idx) => (
                      <span
                        key={idx}
                        className={`text-xs font-medium px-3 py-1.5 rounded ${labelColors[label] || 'bg-gray-100 text-gray-700'}`}
                      >
                        {label}
                      </span>
                    ))}
                    <button className="text-xs font-medium px-3 py-1.5 rounded border border-dashed border-[#E2E8F0] text-[#718096] hover:border-[#6C5CE7] hover:text-[#6C5CE7]">
                      + Add Label
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-[#4A5568] mb-2 block">Description</label>
                  <textarea
                    placeholder="Add a description..."
                    className="w-full border border-[#E2E8F0] rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] focus:border-transparent"
                    rows="4"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[#4A5568] mb-2 block">Due Date</label>
                    <div className="flex items-center space-x-2 border border-[#E2E8F0] rounded-lg p-3">
                      <Calendar className="w-4 h-4 text-[#718096]" />
                      <span className="text-sm text-[#718096]">
                        {selectedCard.dueDate ? new Date(selectedCard.dueDate).toLocaleDateString() : 'Set date'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#4A5568] mb-2 block">Assignee</label>
                    <div className="flex items-center space-x-2 border border-[#E2E8F0] rounded-lg p-3">
                      <User className="w-4 h-4 text-[#718096]" />
                      <span className="text-sm text-[#718096]">Assigned to {selectedCard.assignee}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4 border-t border-[#E2E8F0]">
                  <button
                    onClick={() => deleteCard(selectedCard.laneId, selectedCard.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                  >
                    Delete Card
                  </button>
                  <button
                    onClick={() => setShowCardModal(false)}
                    className="px-4 py-2 bg-[#F7FAFC] text-[#4A5568] rounded-lg text-sm font-medium hover:bg-[#EDF2F7] transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;