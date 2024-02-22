"use client";

import React, { FormEvent, useState } from "react";
import { useAccount } from "wagmi";

const reactionsArray = [
  { id: "like", value: "like", label: "👍" },
  { id: "care", value: "care", label: "🔥" },
  { id: "surprise", value: "surprise", label: "😮" },
  { id: "fun", value: "fun", label: "😂" },
  { id: "learning", value: "learning", label: "🤓" },
  { id: "dislike", value: "dislike", label: "👎" },
  { id: "sad", value: "sad", label: "😢" },
  { id: "angry", value: "angry", label: "😠" },
  { id: "uncomfortable", value: "uncomfortable", label: "😟" },
  { id: "trash", value: "trash", label: "💩" },
];

export default function ImpactReport() {
  const [form, setForm] = useState({
    reaction: "",
    impactRating: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const account = useAccount();
  function createReport(event: FormEvent) {
    setIsLoading(true);
    event?.preventDefault();
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }
  return (
    <div className="hero bg-base-200 flex-grow pt-8 md:pt-16 lg:pt-8 h-full xl:pt-16">
      <div className="h-full align-start px-6 flex flex-col xl:pb-16 w-full md:w-3/5 lg:px-16 space-y-4 xl:w-1/2">
        <div className="w-full px-4">
          <p className="text-lg">
            Al responder estas preguntas, podrás crear un Reporte de Impacto ligado a la entrevista
          </p>
        </div>
        <div className="w-full px-4">
          <div className="bg-base-100 border-primary border-2 shadow-md shadow-secondary rounded-xl px-6 lg:px-8 mb-6 space-y-2 py-8 xl:px-16 xl:py-12">
            <h4 className="text-xl">Reporte de Impacto</h4>
            <form className="flex flex-col space-y-4 md:space-y-6 w-full" onSubmit={createReport}>
              <div>
                <label className="label py-1" htmlFor="address">
                  <span className="text-base label-text">Dirección cartera</span>
                </label>
                <input
                  id="address"
                  name="address"
                  value={account.address ?? "Conecta tu cartera"}
                  className="input input-primary input-bordered border-2 w-full rounded-lg bg-base-200 text-left"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <label className="label py-1" htmlFor="reaction">
                  <span className="text-base label-text">¿Cómo te sientes después de ver el corto?</span>
                </label>
                <div className="w-full flex justify-center">
                  <div className="grid grid-cols-5 grid-rows-2 gap-x-2 gap-y-4">
                    {reactionsArray.map((reaction, index) => (
                      <label
                        htmlFor={reaction.id}
                        className={`btn btn-sm rounded-full ${
                          form.reaction === reaction.value ? "btn-accent" : "btn-secondary"
                        }`}
                        key={reaction.id + index}
                      >
                        <input
                          type="radio"
                          name="reaction"
                          className="hidden"
                          value={reaction.value}
                          id={reaction.id}
                          checked={form.reaction === reaction.value}
                          onChange={event => setForm({ ...form, reaction: event?.target.value })}
                        />
                        {reaction.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="label py-1" htmlFor="impactRating">
                  <span className="text-base label-text">
                    ¿Cómo calificas el impacto de este corto en tu camino Web3?
                  </span>
                </label>
                <div className="w-full flex justify-center">
                  <div className="rating rating-md space-x-3">
                    <input
                      type="radio"
                      name="impactRating"
                      className={`mask mask-star-2 ${form.impactRating >= 1 ? "bg-accent" : "bg-primary/20"}`}
                      value="1"
                      id="1"
                      checked={form.impactRating === 1}
                      onChange={() => setForm({ ...form, impactRating: 1 })}
                    />
                    <input
                      type="radio"
                      name="impactRating"
                      className={`mask mask-star-2 ${form.impactRating >= 2 ? "bg-accent" : "bg-primary/20"}`}
                      value="2"
                      id="2"
                      checked={form.impactRating === 2}
                      onChange={() => setForm({ ...form, impactRating: 2 })}
                    />
                    <input
                      type="radio"
                      name="impactRating"
                      className={`mask mask-star-2 ${form.impactRating >= 3 ? "bg-accent" : "bg-primary/20"}`}
                      value="3"
                      id="3"
                      checked={form.impactRating === 3}
                      onChange={() => setForm({ ...form, impactRating: 3 })}
                    />
                    <input
                      type="radio"
                      name="impactRating"
                      className={`mask mask-star-2 ${form.impactRating >= 4 ? "bg-accent" : "bg-primary/20"}`}
                      value="4"
                      id="4"
                      checked={form.impactRating === 4}
                      onChange={() => setForm({ ...form, impactRating: 4 })}
                    />
                    <input
                      type="radio"
                      name="impactRating"
                      className={`mask mask-star-2 ${form.impactRating >= 5 ? "bg-accent" : "bg-primary/20"}`}
                      value="5"
                      id="5"
                      checked={form.impactRating === 5}
                      onChange={() => setForm({ ...form, impactRating: 5 })}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-sm md:px-4 lg:px-12 xl:px-16">
                  <p>Inconsecuente</p>
                  <p>Trascendental</p>
                </div>
              </div>
              <div className="w-full flex justify-center">
                <button className="btn btn-accent rounded-lg" disabled={isLoading}>
                  {isLoading ? "Creando..." : "Crear reporte"}
                  {isLoading && <span className="loading loading-spinner loading-sm"></span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
