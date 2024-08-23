import React, {useState, useEffect} from "react"
import api from "../api"
import '../App.css'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {DndContext} from '@dnd-kit/core'

import DragItem from '../Components/DragItem';
import DropZone from '../Components/DropZone';

const Home = () => {
  const [droppedItems, setDroppedItems] = useState([]);

  const handleDrop = (item) => {
      setDroppedItems((prevItems) => [...prevItems, item]);
  };

  const handleRemoveItem = (index) => {
      const updatedItems = [...droppedItems];
      updatedItems.splice(index, 1);
      setDroppedItems(updatedItems);
  };

  return (
      <DndProvider backend={HTML5Backend}>
          <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh'
          }}>
              <div style={{
                  border: '1px solid #ccc',
                  padding: '20px',
                  borderRadius: '5px'
              }}>
                  <h1>Drag and Drop Example</h1>
                  <div style={{
                      display: 'flex',
                      justifyContent: 'space-around'
                  }}>
                      <div style={{
                          border: '1px solid #ccc',
                          padding: '10px', borderRadius: '5px'
                      }}>
                          <h2>Drag Items</h2>
                          <DragItem name="Item 1" />
                          <DragItem name="Item 2" />
                          <DragItem name="Item 3" />
                      </div>
                      <div style={{
                          border: '1px solid #ccc',
                          padding: '10px', borderRadius: '5px'
                      }}>
                          <h2>Drop Zone</h2>
                          <DropZone onDrop={handleDrop} />
                          {droppedItems.map((item, index) => (
                              <div
                                  key={index}
                                  style={{
                                      border: '1px solid #ccc',
                                      padding: '10px',
                                      borderRadius: '5px',
                                      marginTop: '10px',
                                      backgroundColor: 'lightblue',
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                  }}>
                                  <p>{item.name}</p>
                                  <button onClick={
                                      () => handleRemoveItem(index)}>
                                      Remove
                                  </button>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      </DndProvider>
  );
};

export default Home;