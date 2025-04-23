import React, { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Home } from './Home';

// Mock react-dnd hooks and components
jest.mock('react-dnd', () => {
  const original = jest.requireActual('react-dnd');
  return {
    ...original,
    useDrag: () => [{ isDragging: false }, jest.fn()],
    useDrop: () => [{ isOver: false }, jest.fn()],
    DndProvider: ({ children }: { children: ReactNode }) => children,
  };
});

// Mock react-dnd-html5-backend
jest.mock('react-dnd-html5-backend', () => ({
  HTML5Backend: {},
}));

// Mock chess.js
jest.mock('chess.js', () => ({
  Chess: jest.fn().mockImplementation(() => ({
    moves: () => [],
    in_check: () => false,
    game_over: () => false,
    turn: () => 'w',
  })),
}));

describe('Home Component', () => {
  it('renders without crashing', () => {
    render(<Home />);
    expect(document.body).toBeTruthy();
  });
});