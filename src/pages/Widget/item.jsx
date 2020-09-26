import React from 'react';

const Item = ({ description, id, content }) => (
  <div className="lineWidget">
    <span>{description}</span>
    <strong id={id}>{content}</strong>
  </div>
);

export default Item;
