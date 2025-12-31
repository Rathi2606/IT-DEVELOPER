import React from "react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">About TaskLane</h1>
          <p className="text-xl opacity-90">
            Empowering teams to work smarter, not harder
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Our Story */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Our Story
          </h2>
          <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
            <p>
              TaskLane was born from a simple observation: teams waste countless
              hours juggling multiple tools, losing track of tasks, and
              struggling with outdated project management systems.
            </p>
            <p>
              Founded in 2025, TaskLane combines the visual clarity of Kanban
              boards with intelligent automation and seamless collaboration
              features to help teams focus on delivering great work.
            </p>
          </div>
        </section>

        {/* Our Mission */}
        <section className="mb-20 bg-white rounded-2xl shadow-lg p-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Our Mission
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            To revolutionize how teams organize, collaborate, and accomplish
            their goals by providing an intuitive, powerful task management
            platform that adapts to your workflow — not the other way around.
          </p>
        </section>

        {/* Why TaskLane */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-10 text-center">
            Why TaskLane?
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Visual Clarity
              </h3>
              <p className="text-gray-700">
                See your entire project at a glance with intuitive Kanban boards.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Lightning Fast
              </h3>
              <p className="text-gray-700">
                Built for speed and efficiency, without unnecessary complexity.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Seamless Collaboration
              </h3>
              <p className="text-gray-700">
                Real-time updates and notifications keep everyone aligned.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Data-Driven Insights
              </h3>
              <p className="text-gray-700">
                Identify bottlenecks and track progress with clear analytics.
              </p>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-10">
            Our Values
          </h2>

          <div className="space-y-4">
            <div className="bg-purple-50 rounded-xl p-6 border-l-4 border-purple-600">
              <h3 className="text-xl font-bold mb-2">Simplicity First</h3>
              <p className="text-gray-700">
                Elegant solutions for complex problems.
              </p>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-600">
              <h3 className="text-xl font-bold mb-2">User-Centric</h3>
              <p className="text-gray-700">
                Designed around real workflows and real people.
              </p>
            </div>

            <div className="bg-green-50 rounded-xl p-6 border-l-4 border-green-600">
              <h3 className="text-xl font-bold mb-2">
                Continuous Improvement
              </h3>
              <p className="text-gray-700">
                Constantly evolving based on feedback.
              </p>
            </div>

            <div className="bg-yellow-50 rounded-xl p-6 border-l-4 border-yellow-600">
              <h3 className="text-xl font-bold mb-2">Transparency</h3>
              <p className="text-gray-700">
                Honest communication, no surprises.
              </p>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="mb-20 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Meet the Team
          </h2>
          <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
            <p>
              TaskLane is built by designers, developers, and product thinkers
              who believe great tools change how work gets done.
            </p>
            <p>
              We are a remote-first team united by a shared mission to simplify
              productivity.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default AboutPage;
