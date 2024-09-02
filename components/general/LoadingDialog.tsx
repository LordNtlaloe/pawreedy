import React from 'react';

interface LoadingDialogProps {
  open: boolean;
  message: string;
}

const LoadingDialog: React.FC<LoadingDialogProps> = ({ open, message }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold">Loading</h2>
        <div className="flex flex-col items-center mt-4">
          <div className="w-6 h-6 border-4 border-t-4 border-gray-200 rounded-full animate-spin border-t-blue-500"></div>
          <div className="mt-4 text-center">{message}</div>
        </div>
      </div>
    </div>
  );
};

export default LoadingDialog;
