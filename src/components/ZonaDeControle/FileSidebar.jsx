// src/components/ZonaDeControle/FileSidebar.jsx
import React from 'react';

export default function FileSidebar({ files, activeFile, onFileSelect, onUploadFiles }) {
  const handleFileChange = (e) => {
    const fileList = Array.from(e.target.files);
    const newFiles = {};

    fileList.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        newFiles[file.name] = reader.result;
        if (Object.keys(newFiles).length === fileList.length) {
          onUploadFiles(newFiles);
        }
      };
      reader.readAsText(file);
    });
  };

  return (
    <div className="w-64 p-4 border-r border-gray-700 space-y-4">
      <div>
        <h2 className="text-xl font-bold mb-2">Arquivos</h2>
        {Object.keys(files).map((file) => (
          <button
            key={file}
            className={`block w-full text-left px-2 py-1 rounded hover:bg-gray-700 ${activeFile === file ? 'bg-gray-800 font-bold' : ''}`}
            onClick={() => onFileSelect(file)}
          >
            {file}
          </button>
        ))}
      </div>

      <div>
        <label className="block mb-1 font-semibold">Adicionar Arquivos</label>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="text-sm file:mr-2 file:bg-gray-800 file:text-white file:px-3 file:py-1 file:border-0 file:rounded hover:file:bg-gray-700"
        />
      </div>
    </div>
  );
}
