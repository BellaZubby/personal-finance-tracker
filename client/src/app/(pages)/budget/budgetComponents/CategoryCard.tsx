"use client";
import React from "react";

type Props = {
  name: string;
  amount: number;
  onDelete?: () => void;
  isEditable?: boolean;
};

const CategoryCard = ({ name, amount, onDelete, isEditable = true }: Props) => {
  return (
    <div className="bg-white shadow-md rounded p-4 flex justify-between items-center">
      <div className="flex items-center gap-6">
        <p className="font-semibold">{name}</p>
        <p className="text-sunPurple font-bold">₦{amount}</p>
      </div>
      {isEditable && (
        <button
          onClick={onDelete}
          className="text-red-500 text-sm hover:underline ml-4"
        >
          {" "}
          Remove
        </button>
      )}
    </div>
  );
};

export default CategoryCard;
