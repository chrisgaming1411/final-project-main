import React from 'react';
import AccountSettingsForm from '../../components/AccountSettingsForm';

const SeekerAccountSettingsPage: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-4xl sm:text-5xl font-bold text-black mb-10">
        Account Settings
      </h1>
      <AccountSettingsForm />
    </div>
  );
};

export default SeekerAccountSettingsPage;
