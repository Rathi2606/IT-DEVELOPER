import React from 'react';
import { Button } from '@/components/ui/button';

const KanbanBoard = () => (
  <div className="relative perspective-[1000px] [transform-style:preserve-3d]">
    <div className="bg-white rounded-2xl p-6 shadow-2xl transform [rotateX(1deg)] [-rotateY(1deg)] hover:[rotateX(0deg)] hover:[-rotateY(0deg)] transition-transform duration-300">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-xl font-bold text-gray-800">Project Alpha</h3>
        <div className="text-indigo-600 text-xl">⚙</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'To Do', tasks: ['Design new dashboard', 'User research', 'API documentation'] },
          { title: 'In Progress', tasks: ['Frontend development', 'Database optimization'] },
          { title: 'Done', tasks: ['Initial wireframes', 'Logo design', 'Project setup'] }
        ].map(column => (
          <div key={column.title} className="bg-gray-50 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
              {column.title}
            </h4>
            <div className="space-y-2">
              {column.tasks.map(task => (
                <div
                  key={task}
                  className="bg-white rounded-lg p-3 shadow-sm text-sm"
                >
                  {task}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Hero = () => (
  <section className="pt-20 min-h-screen flex items-center bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
    {/* background glow */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(99,102,241,0.1),transparent_70%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(147,51,234,0.1),transparent_70%)]" />

    <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          <span className="bg-gradient-to-r from-gray-800 to-indigo-600 bg-clip-text text-transparent">
            Organize Tasks with Visual Kanban Boards
          </span>
        </h1>

        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Transform your workflow with TaskLane's intuitive Kanban system.
          Visualize progress, collaborate seamlessly, and boost productivity
          with boards that adapt to your team's needs.
        </p>

        {/* SINGLE CTA ONLY */}
        <div className="flex">
          <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex items-center gap-2">
            Start Now <span>→</span>
          </Button>
        </div>
      </div>

      <div className="relative">
        <KanbanBoard />
      </div>
    </div>
  </section>
);

export default Hero;
