import React from "react";

type Props = {
  onConfirm: () => void;
  onCancel: () => void;
};

const SaveExpenseModal = ({ onConfirm, onCancel }: Props) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 font-inter">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Confirm Expense Entries
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          These expenses will be saved permanently and cannot be edited. Are you
          sure you want to proceed?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 hover:underline"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-sunPurple text-white rounded hover:bg-sunPurple/90"
          >
            Save Expenses
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveExpenseModal;
