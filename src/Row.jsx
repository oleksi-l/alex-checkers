import React from 'react';
import Cell from './Cell';

const Row = ({cells}) => {
  return (
    <ul className='row'>
      {cells.map((cell, num) => {
        return <Cell key={cell.name} />;
      })}
    </ul>
  );
};

export default Row;