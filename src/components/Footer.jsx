import React from 'react';
import { Separator } from '@/components/ui/separator';

const Footer = () => (
  <footer className="bg-gray-900 text-white py-16">
    <div className="max-w-6xl mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-sm">
              📋
            </div>
            <span className="text-xl font-bold">TaskLane</span>
          </div>
          <p className="text-gray-400">
            The modern Kanban solution for teams who want to work smarter, not harder.
          </p>
        </div>
        {[
          { title: 'Product', links: ['Features', 'Pricing', 'Integrations', 'API'] },
          { title: 'Company', links: ['About Us', 'Careers', 'Contact', 'Blog'] },
          { title: 'Support', links: ['Help Center', 'Documentation', 'Status', 'Community'] }
        ].map(section => (
          <div key={section.title}>
            <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
            <div className="space-y-2">
              {section.links.map(link => (
                <a
                  key={link}
                  href="#"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Separator className="border-gray-800" />
      <div className="pt-8 text-center text-gray-400">
        <p>&copy; 2025 TaskLane. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;