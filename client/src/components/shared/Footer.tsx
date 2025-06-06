import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0A142F] text-white pt-10 mt-15 py-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Tekoffo</h3>
            <p className="text-gray-400">
              The #1 platform for freelancers and businesses to connect and collaborate.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">For Freelancers</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Browse Jobs</li>
              <li>Submit Proposals</li>
              <li>Profile Settings</li>
              <li>Payment Methods</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">For Clients</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Post a Job</li>
              <li>Find Freelancers</li>
              <li>Payment Methods</li>
              <li>How it Works</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Help Center</li>
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
              <li>Contact Us</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Tekoffo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
