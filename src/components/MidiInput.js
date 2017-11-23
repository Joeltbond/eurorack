import React from "react";
import Module from "./Module";

export default ({ notes }) => (
  <Module>
    <div>Notes: {Object.keys(notes).join(", ")}</div>
  </Module>
);
