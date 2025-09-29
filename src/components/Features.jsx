import React from 'react';

const FeatureCard = ({ icon, title, description }) => (
  <div className="text-center p-8 rounded-2xl border border-gray-280 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl text-white">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const Features = () => (
  <section id="features" className="py-20">
    <div className="max-w-6xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          Why Choose TaskLane?
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Powerful features designed to streamline your workflow and enhance team collaboration
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { icon: '📊', title: 'Visual Workflow', description: 'See your project’s progress at a glance with intuitive Kanban boards that make workflow visualization effortless.' },
          { icon: '👥', title: 'Team Collaboration', description: 'Work together seamlessly with real-time updates, comments, and notifications that keep everyone in sync.' },
          { icon: '🎯', title: 'Smart Organization', description: 'Organize tasks with custom labels, due dates, and priority levels that adapt to your unique workflow needs.' },
          { icon: '📱', title: 'Mobile Ready', description: 'Access your boards anywhere with responsive design that works perfectly on desktop, tablet, and mobile devices.' },
          { icon: '⚡', title: 'Lightning Fast', description: 'Experience blazing-fast performance with instant updates and smooth interactions that never slow you down.' },
          { icon: '🔒', title: 'Secure & Private', description: 'Keep your data safe with enterprise-grade security and privacy controls you can trust.' }
        ].map(feature => (
          <FeatureCard
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  </section>
);

export default Features;