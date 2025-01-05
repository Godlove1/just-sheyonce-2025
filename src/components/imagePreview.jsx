"use client"
import React from "react";

const ImagePreview = ({ files, onRemove }) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      {files.map((file, index) => (
        <div key={index} className="relative">
          <img
            src={URL.createObjectURL(file)}
            alt={`Preview ${index + 1}`}
            className="w-full h-32 object-cover rounded"
          />
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="absolute top-0 right-0 px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-bl hover:bg-red-700"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default ImagePreview;
