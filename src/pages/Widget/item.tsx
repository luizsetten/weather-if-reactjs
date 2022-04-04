import React from "react";

interface IItem {
  description: string;
  id: string;
  content: string | number;
}

function Item({ description, id, content }: IItem) {
  return (
    <div className="lineWidget">
      <span>{description}</span>
      <strong id={id}>{content}</strong>
    </div>
  );
}

export default Item;
