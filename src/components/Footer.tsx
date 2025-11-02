import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-primary text-white text-sm">
      <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        <div className="mb-4 md:mb-0">
          <p>Contact us: <a href="mailto:info@homebase.com" className="hover:underline">info@homebase.com</a> | Follow us : Facebook, Twitter</p>
        </div>
        <div>
          <a href="#" className="hover:underline">Privacy Policy</a> | <a href="#" className="hover:underline">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
