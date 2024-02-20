"use client";

import { FormEvent, useState } from "react";
import type { NextPage } from "next";

const Home: NextPage = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  function createReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(form);
  }
  return (
    <>
      <div className="hero bg-base-200 flex-grow pt-8">
        <div className="hero-content px-6 flex flex-col lg:flex-row lg:items-start lg:pb-8 xl:pb-16">
          <div className="w-full lg:w-1/2 lg:flex lg:flex-col lg:pt-8">
            <h1 className="text-5xl leading-[1.05] lg:pl-12">
              Cuenta <span className="underline underline-offset-8 decoration-accent">historias</span> <br />y comparte
              emociones ✨
            </h1>
            <p className="pt-4 text-lg px-4 lg:pl-12">
              Con <span className="text-accent font-bold">gm</span>report descubre el impacto
              <br className="hidden md:block" /> de lo que sucede en Web3, un reporte a la vez
            </p>
          </div>
          <div className="w-full lg:w-1/2 px-4">
            <div className="bg-base-100 border-primary border-2 shadow-md shadow-secondary rounded-xl px-6 lg:px-8 mb-6 space-y-2 py-8">
              <h4 className="text-xl">Crea un Reporte</h4>
              <form className="flex flex-col space-y-1 w-full" onSubmit={createReport}>
                <div>
                  <label className="label py-1" htmlFor="title">
                    <span className="text-base label-text">Video</span>
                  </label>
                  <input
                    type="file"
                    className="file-input file-input-primary file-input-bordered border-2 w-full rounded-lg h-10 bg-base-200"
                  />
                </div>
                <div>
                  <label className="label py-1" htmlFor="title">
                    <span className="text-base label-text">Título</span>
                  </label>
                  <textarea
                    id="title"
                    name="description"
                    value={form.title}
                    onChange={event => setForm({ ...form, title: event.target.value })}
                    className="textarea textarea-primary border-2 w-full rounded-lg bg-base-200 text-left"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="label py-1" htmlFor="description">
                    <span className="text-base label-text">Descripción</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={event => setForm({ ...form, description: event.target.value })}
                    className="textarea textarea-primary border-2 w-full rounded-lg bg-base-200 text-left"
                    rows={4}
                  />
                </div>
                <div className="w-full flex justify-center pt-4">
                  <button className="btn btn-accent rounded-lg">Crear reporte</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
