import { describe, it, beforeEach } from 'mocha';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Dashboard from '../../components/ui/Dashboard';
import { AIAssistant } from '../../components/ui/modules';

describe('Interface Tests', () => {
  describe('Dashboard Component', () => {
    let component;

    beforeEach(() => {
      component = render(<Dashboard />);
    });

    it('should render all main components', () => {
      expect(component.getByTestId('sidebar')).to.exist;
      expect(component.getByTestId('main-content')).to.exist;
      expect(component.getByTestId('ai-assistant')).to.exist;
    });

    it('should handle navigation correctly', async () => {
      const inventoryButton = component.getByText('Inventaire');
      await fireEvent.click(inventoryButton);
      
      await waitFor(() => {
        expect(component.getByTestId('inventory-view')).to.be.visible;
      });
    });

    it('should handle AI Assistant interactions', async () => {
      const aiInput = component.getByTestId('ai-input');
      await fireEvent.change(aiInput, {
        target: { value: 'Comment optimiser mes prix ?' }
      });
      
      const submitButton = component.getByTestId('ai-submit');
      await fireEvent.click(submitButton);

      await waitFor(() => {
        expect(component.getByTestId('ai-response')).to.exist;
      });
    });
  });
}); 