const ImagePreviewEdit = ({ files, onRemove }) => {
  return (
    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
      {files.map((file, index) => (
        <div key={index} className="relative">
          <img
            src={file}
            alt={`Product ${index + 1}`}
            className="w-20 h-20 object-cover rounded border"
          />
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

export default ImagePreviewEdit;
