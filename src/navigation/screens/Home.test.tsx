import React from 'react';
import { render } from '@testing-library/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Home } from './Home';

describe('Home Component', () => {
  it('renders without crashing', () => {
    render(
      <DndProvider backend={HTML5Backend}>
        <Home />
      </DndProvider>
    );
    expect(true).toBe(true);
  });
});