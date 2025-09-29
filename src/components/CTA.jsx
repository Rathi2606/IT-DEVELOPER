import React from 'react';
import { Button } from '@/components/ui/button';

const CTA = () => (
  <section className="py-20 bg-gradient-to-r from-indigo-500 to-purple-600 text-white relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>
    <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
      <h2 className="text-3xl md:text-4xl font-bold mb-6">
        Ready to Transform Your Workflow?
      </h2>
      <p className="text-lg mb-8 opacity-90">
        Join thousands of teams already using TaskLane to streamline their projects and boost productivity.
      </p>
      <Button className="bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold text-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2">
        Get Started Today <span>→</span>
      </Button>
    </div>
  </section>
);

export default CTA;