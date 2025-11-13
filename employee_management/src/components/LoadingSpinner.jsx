import React from "react";

export default function LoadingSpinner({ size = 36 }) {
  const style = { width: size, height: size, borderWidth: 4, borderStyle: "solid", borderColor: "rgba(0,0,0,0.15)", borderTopColor: "rgba(0,0,0,0.7)", borderRadius: "50%" };
  return (
    <div className="flex items-center justify-center p-4">
      <div style={style} className="animate-spin" />
    </div>
  );
}
