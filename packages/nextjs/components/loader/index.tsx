import React from "react";

export default function Loader() {
  return (
    <div className="w-full flex flex-col items-center py-16 space-y-4">
      <span className="loading loading-spinner loading-lg text-accent" />
      <h4 className="text-lg">Cargando...</h4>
    </div>
  );
}
