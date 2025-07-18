// src/hooks/useAbaEditor.js
import { useState } from 'react';

export default function useAbaEditor(initialFiles, defaultActive) {
  const [files, setFiles] = useState(initialFiles);
  const [activeFile, setActiveFile] = useState(defaultActive);
  const [openTabs, setOpenTabs] = useState([defaultActive]);

  const openTab = (filename) => {
    // Se a aba já está aberta, apenas a torna ativa
    if (!openTabs.includes(filename)) {
      setOpenTabs((prevTabs) => [...prevTabs, filename]);
    }
    setActiveFile(filename);
  };

  const closeTab = (filename) => {
    const newTabs = openTabs.filter((tab) => tab !== filename);
    setOpenTabs(newTabs);
    // Se o arquivo ativo foi fechado, ativa a primeira aba restante
    if (activeFile === filename && newTabs.length > 0) {
      setActiveFile(newTabs[0]);
    } else if (newTabs.length === 0) {
      // Se não há mais abas, limpa o arquivo ativo
      setActiveFile(null);
    }
  };

  const updateFileContent = (filename, content) => {
    setFiles((prev) => ({ ...prev, [filename]: content }));
  };

  const addFiles = (newFiles) => {
    setFiles((prev) => ({ ...prev, ...newFiles })); // Primeiro, mescla os novos arquivos com os existentes

    // Em seguida, atualiza as abas abertas, garantindo que não haja duplicatas
    setOpenTabs((prevOpenTabs) => {
      const updatedOpenTabs = [...prevOpenTabs];
      let newActiveFile = activeFile; // Mantém o arquivo ativo atual, a menos que um novo seja definido

      Object.keys(newFiles).forEach((filename) => {
        // Adiciona o arquivo à lista de abas abertas apenas se ele ainda não estiver lá
        if (!updatedOpenTabs.includes(filename)) {
          updatedOpenTabs.push(filename);
          // Se for o primeiro novo arquivo adicionado, o torna ativo
          if (newActiveFile === activeFile) { // Só define como ativo se nenhum novo arquivo foi definido ainda
            newActiveFile = filename;
          }
        }
      });

      // Se um novo arquivo foi definido como ativo durante o processo, atualiza o estado
      if (newActiveFile !== activeFile) {
        setActiveFile(newActiveFile);
      }
      return updatedOpenTabs;
    });
  };

  return {
    files,
    activeFile,
    openTabs,
    openTab,
    closeTab,
    setActiveFile,
    updateFileContent,
    addFiles,
  };
}
