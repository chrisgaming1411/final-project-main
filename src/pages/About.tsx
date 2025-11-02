import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-brand-light-gray py-16 md:py-24">
      <div className="container mx-auto px-6 text-center text-brand-dark-navy">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">About Homebase Finder</h1>
        <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-gray-700 leading-relaxed">
          Homebase Finder is a dedicated platform designed to bridge the gap between boarding house owners and individuals seeking accommodation. Our mission is to simplify the process of finding and listing boarding houses, making it a seamless, secure, and efficient experience for everyone involved.
        </p>
        <p className="mt-8 text-lg md:text-xl max-w-3xl mx-auto text-gray-700 leading-relaxed">
          Whether you're a student moving to a new city, a professional on a temporary assignment, or a traveler looking for a comfortable stay, Homebase Finder provides you with detailed listings, verified properties, and easy comparison tools to find your perfect home away from home.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
