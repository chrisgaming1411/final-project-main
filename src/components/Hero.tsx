import React from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <main className="relative text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/43bd/9102/b9f5173e8557076ba5e86bdbd5f466fd?Expires=1762732800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=nhV30YIjDPeKSlekGdxJxIdHMKF1mGFjnWLtupxlbhJpnnD94VH2KZFPEDPpoehr4p7CtwVBh4vD1fKW2aeR-ksRb8p3B8VgM5aXXBiRYd0SbWuQmkqWJxLv1OLwkYVaaYtnLXCkt9KotHP9YlKE~iuXbJF-sQrBoKZ0-QuFuhA1~RNyoJKCLgNq6vI5BfIUKgjJZ0dOdpnALSrHItg0l-KCMvplfx0AdTUbVOmAeve0cJ66jd889V8kJXYj2pD8VqZ7OT5dsSgd5P8u1f-mQ~SAtS-iiBti~K8p3Jnr4AfQxWoN-u0N28p70YjwVA9~j1~-DVBFo1hamZOwgWXixg__"
          alt="Comfortable and modern bedroom"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-24 md:py-48 flex flex-col items-center justify-center text-center">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-6">
          <span className="bg-gradient-to-b from-brand-blue to-white bg-clip-text text-transparent">
            Where Boarding House Seekers and Owners Meet
          </span>
        </h1>
        <p className="max-w-4xl text-lg md:text-xl lg:text-2xl font-light mb-12">
          This platform allows boarding house owners to register and list their properties with detailed information, making it easy for students, workers, and travelers to search, compare, and find the perfect place to stay based on their needs and location preferences.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Link to="/login">
            <button className="bg-gradient-button text-white font-semibold text-lg py-4 px-12 rounded-full shadow-lg hover:opacity-90 transition-opacity transform hover:scale-105">
              REGISTER YOUR BOARDINGHOUSE
            </button>
          </Link>
          <Link to="/find">
            <button className="bg-transparent border-2 border-white text-white font-semibold text-lg py-4 px-12 rounded-full hover:bg-white hover:text-brand-dark-navy transition-colors transform hover:scale-105">
              LOOK FOR YOUR BOARDINGHOUSE
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Hero;
