import { useEffect } from 'react';

export function useKeyboardShortcuts(shortcuts) {
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Ctrl/Cmd + Shift + ...
      if ((event.ctrlKey || event.metaKey) && event.shiftKey) {
        switch (event.key.toLowerCase()) {
          case 'f': // Recherche
            event.preventDefault();
            shortcuts.search();
            break;
          case 'e': // Export
            event.preventDefault();
            shortcuts.export();
            break;
          case 'd': // Mode sombre/clair
            event.preventDefault();
            shortcuts.toggleTheme();
            break;
          case 'r': // Rafraîchir
            event.preventDefault();
            shortcuts.refresh();
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [shortcuts]);
} 