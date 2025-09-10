import React from 'react'
import { useDispatch } from 'react-redux'
import { saveBudget } from '../store/budgetSlice'


type Props = {
    // onClick: React.MouseEventHandler<HTMLButtonElement>;
    onClick: () => void;
}
const SaveModal = ({onClick}:Props) => {
    const dispatch = useDispatch();

  return (
     <div className="fixed inset-0 bg-black/70 bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirm Save</h3>
      <p className="text-sm text-gray-600">
        Once saved, your budget cannot be edited. To make changes, you&apos;ll need to reset budget.
      </p>

      <div className="mt-6 flex justify-end space-x-4">
        <button
          onClick={onClick}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            dispatch(saveBudget());
            onClick();
          }}
          className="px-4 py-2 bg-sunPurple text-white rounded hover:bg-sunPurple/90"
        >
          Save Budget
        </button>
      </div>
    </div>
</div>
  )
}

export default SaveModal