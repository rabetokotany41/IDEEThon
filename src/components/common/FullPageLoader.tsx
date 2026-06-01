import React from 'react';
import { Spinner } from './Spinner';

export const FullPageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-primary-600 font-medium">Chargement...</p>
      </div>
    </div>
  );
};