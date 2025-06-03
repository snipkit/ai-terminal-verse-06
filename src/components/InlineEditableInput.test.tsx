import { render, screen, fireEvent } from '@testing-library/react';
import { InlineEditableInput } from './InlineEditableInput';
import React from 'react';

test('renders input when clicked', () => {
  render(<InlineEditableInput onSubmit={() => {}} />);
  
  // Find the initial element that triggers editing mode (the div with placeholder text)
  const initialElement = screen.getByText('Enter your AI prompt...');
  
  // Simulate a click on the element to enter editing mode
  fireEvent.click(initialElement);
  
  // Now, the input (textbox) should be visible
  expect(screen.getByRole('textbox')).toBeInTheDocument();
}); 