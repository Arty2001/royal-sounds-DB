import React from "react"; // we need this to make JSX compile

type ChipSelectProps = {
  options: string[];
};

export function ChipSelect({ options }: ChipSelectProps) {
  return (
    <select
      style={{
        appearance: "none",
        width: 20,
        height: 20,
        borderRadius: "100%",
        textAlign: "center",
        textAlignLast: "center",
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <option value="1"> 1</option>
      <option value="2"> 2</option>
      <option value="3"> 3</option>
    </select>
  );
}
