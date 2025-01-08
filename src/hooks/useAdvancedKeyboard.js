import { useEffect } from 'react';

export function useAdvancedKeyboard(handlers) {
  useEffect(() => {
    const keySequences = {
      currentSequence: [],
      timeout: null
    };

    const handleKeyPress = (event) => {
      // Séquences de touches
      clearTimeout(keySequences.timeout);
      keySequences.currentSequence.push(event.key);
      keySequences.timeout = setTimeout(() => {
        keySequences.currentSequence = [];
      }, 1000);

      // Vérifier les combinaisons spéciales
      const sequence = keySequences.currentSequence.join('');
      if (sequence === 'vinted') {
        handlers.secretCommand?.();
        keySequences.currentSequence = [];
        return;
      }

      // Raccourcis standards
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 'f':
            event.preventDefault();
            handlers.search?.();
            break;
          case 'p':
            event.preventDefault();
            handlers.print?.();
            break;
          case 'b':
            event.preventDefault();
            handlers.toggleSidebar?.();
            break;
          default:
            break;
        }
      }

      // Navigation au clavier
      if (event.altKey) {
        switch (event.key) {
          case 'ArrowUp':
            event.preventDefault();
            handlers.previousSection?.();
            break;
          case 'ArrowDown':
            event.preventDefault();
            handlers.nextSection?.();
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handlers]);
} 