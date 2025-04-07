import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemTypes = {
  CHESS_PIECE: 'chess_piece',
};

function ChessPiece({
  piece,
  position, // position added for future chess tracking functionality 
  onRemove
  }: { 
    piece: string;
    position: number;
    onRemove: (position: number) => void; //make position void upon removal (piece take in future)
  }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CHESS_PIECE,
    item: { piece, sourcePosition: position },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
        padding: '10px',
        margin: '10px',
        backgroundColor: 'lightblue',
        border: '1px solid black',
        width: '100px',
        textAlign: 'center',
      }}
    >
      {piece}
    </div>
  );
}

function DropZone({
  zoneId, //zoneId will be phased out by future position tracker (was replaced)
  position,
  widgets,
  onDrop,
  onRemove,
}: {
  zoneId: number;
  position: number;
  widgets: string[];
  onDrop: (widgetType: string, zoneId: number) => void;
  onRemove: (position: number) => void; //make position void upon removal (piece take in future)
}) {
  const [{ isOver}, drop] = useDrop(() => ({
    accept: ItemTypes.WIDGET,
    drop: (item: { widgetType: string; sourcePosition: number}) => {
      onDrop(item.widgetType, zoneId);
      return {position}; // return position to be used in future chess tracking 
    },
    collect: (monitor) => ({
      // double exclamation point converts to bollean regardless of value type 
      isOver: !!monitor.isOver(),
      // canDrop: !!monitor.canDrop(),
    }),
  }));

  return (
    <div
      ref={drop}
      style={{
        height: '200px',
        border: '2px dashed gray',
        backgroundColor: isOver ? 'lightgreen' : 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '20px',
        marginRight: '10px',
        width: '200px',
      }}
    >
      {isOver ? 'Release to drop' : `Drop Zone ${zoneId}`}
      <div style={{ marginTop: '10px' }}>
        {widgets.map((widget, index) => (
          <div
            key={index}
            style={{
              padding: '10px',
              margin: '5px',
              backgroundColor: 'lightgray',
              border: '1px solid black',
              width: '100px',
              textAlign: 'center',
            }}
          >
            {widget}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Home() {
  const [zoneWidgets, setZoneWidgets] = useState<{ [key: number]: string[] }>({
    1: [],
    2: [],
    3: [],
  });
  // Drop zones with array's that store the widgets dropped in them (Data for future Ai responses (stock fish and GPT))

  // Handle widget drop specifying type of widget and ZoneId (box dropped into)
  const handleDrop = (widgetType: string, zoneId: number) => {
    setZoneWidgets((prev) => ({
      ...prev,
      [zoneId]: [...prev[zoneId], widgetType],
    }));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App" style={{ padding: '20px' }}>
        <div className="widgets" style={{ display: 'flex', gap: '10px' }}>
          <DraggableWidget widgetType="Im a pawn" />
          <DraggableWidget widgetType="Im also a pawn (for now)" />
          <DraggableWidget widgetType="My name is David and I'm different" />
          <DraggableWidget widgetType="I'm a queen" />
        </div>
        <div
          className="drop-zones"
          style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}
        >
          <DropZone
            zoneId={1}
            widgets={zoneWidgets[1]}
            onDrop={handleDrop}
          />
          <DropZone
            zoneId={2}
            widgets={zoneWidgets[2]}
            onDrop={handleDrop}
          />
          <DropZone
            zoneId={3}
            widgets={zoneWidgets[3]}
            onDrop={handleDrop}
          />
        </div>
      </div>
    </DndProvider>
  );
}
