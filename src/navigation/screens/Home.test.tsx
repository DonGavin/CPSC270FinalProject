import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Home } from './Home';



jest.mock('./useStockfish', () => ({
  useStockfish: () => ({
    isReady: true,
    isThinking: false,
    evaluation: 0.5,
    bestMove: 'e2e4',
    bestMovePositions: { source: 12, target: 28 },
    moveHistory: [],
    analyzePosition: jest.fn(),
    getBestMove: jest.fn(),
    stopAnalysis: jest.fn(),
    setOption: jest.fn(),
    recordMove: jest.fn(),
  }),
}));

describe('Home Component', () => {
  it('renders the chessboard with initial pieces', () => {
    render(
      <DndProvider backend={HTML5Backend}>
        <Home />
      </DndProvider>
    );

    // Check that all 64 squares are rendered
    const squares = screen.getAllByRole('button');
    expect(squares).toHaveLength(64);

    // Check that specific pieces are in their initial positions
    expect(squares[0]).toHaveTextContent('BRook');
    expect(squares[60]).toHaveTextContent('WKing');
  });

  it('allows a valid move and updates the board state', () => {
    render(
      <DndProvider backend={HTML5Backend}>
        <Home />
      </DndProvider>
    );

    // Simulate dragging a white pawn from position 48 to 40
    const sourceSquare = screen.getAllByRole('button')[48];
    const targetSquare = screen.getAllByRole('button')[40];

    fireEvent.dragStart(sourceSquare);
    fireEvent.drop(targetSquare);

    // Verify the piece moved
    expect(sourceSquare).not.toHaveTextContent('WPawn');
    expect(targetSquare).toHaveTextContent('WPawn');
  });

  it('prevents an invalid move', () => {
    render(
      <DndProvider backend={HTML5Backend}>
        <Home />
      </DndProvider>
    );

    // Simulate dragging a white pawn to an invalid position
    const sourceSquare = screen.getAllByRole('button')[48];
    const targetSquare = screen.getAllByRole('button')[10];

    fireEvent.dragStart(sourceSquare);
    fireEvent.drop(targetSquare);

    // Verify the piece did not move
    expect(sourceSquare).toHaveTextContent('WPawn');
    expect(targetSquare).not.toHaveTextContent('WPawn');
  });

  it('displays the move history', () => {
    render(
      <DndProvider backend={HTML5Backend}>
        <Home />
      </DndProvider>
    );

    // Simulate a move to populate the move history
    const sourceSquare = screen.getAllByRole('button')[48];
    const targetSquare = screen.getAllByRole('button')[40];

    fireEvent.dragStart(sourceSquare);
    fireEvent.drop(targetSquare);

    // Check that the move history is updated
    const moveHistory = screen.getByText(/WPawn: e2 → e3/i);
    expect(moveHistory).toBeInTheDocument();
  });

  it('displays evaluation and thinking status', () => {
    render(
      <DndProvider backend={HTML5Backend}>
        <Home />
      </DndProvider>
    );

    // Check evaluation display
    const evaluation = screen.getByText(/Evaluation: 0.5/i);
    expect(evaluation).toBeInTheDocument();

    // Check thinking status
    const thinkingStatus = screen.queryByText(/Thinking.../i);
    expect(thinkingStatus).not.toBeInTheDocument();
  });
});