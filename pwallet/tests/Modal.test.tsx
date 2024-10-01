import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import Modal from '../src/components/Modal';
import '@testing-library/jest-dom';

describe('Modal', () => {
  const mockOnClose = vi.fn();
  const testContent = 'Test Modal Content';
  const closeIcon = screen.getByLabelText('close-icon');
  const modalElement = screen.getByText(testContent).closest('.modal');

  it('renders nothing when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose}>
        {testContent}
      </Modal>
    );
    expect(screen.queryByText(testContent)).not.toBeInTheDocument();
  });

  it('renders content when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        {testContent}
      </Modal>
    );
    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  it('applies custom animation class', () => {
    const animationClass = 'custom-animation';
    render(
      <Modal isOpen={true} onClose={mockOnClose} animationClass={animationClass}>
        {testContent}
      </Modal>
    );
    expect(modalElement).toHaveClass(animationClass);
  });

  it('calls onClose when close icon is clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        {testContent}
      </Modal>
    );
    fireEvent.click(closeIcon);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('renders close icon with correct styles', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        {testContent}
      </Modal>
    );
    expect(closeIcon).toHaveClass('z-10 absolute top-4 left-4 h-6 w-6 text-lightgrey');
    expect(closeIcon).toHaveStyle('cursor: pointer');
  });

  it('renders modal with correct base classes', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        {testContent}
      </Modal>
    );
    expect(modalElement).toHaveClass('fixed z-10 modal bg-blacker border-lightgrey border border-t-0');
  });
});
