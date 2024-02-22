"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { NextPage } from "next";
import { notification } from "~~/utils/scaffold-eth";

const CreatePost: NextPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { push } = useRouter();

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) setFile(event.target.files[0]);
  }

  async function createReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData();
    if (!file || !form.title || !form.description) {
      return notification.error("Todos los campos son requeridos para crear Reporte");
    }
    formData.append("file", file);
    formData.append("title", form.title);
    formData.append("description", form.description);
    setIsLoading(true);
    try {
      const response = await fetch("api/upload-video", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.status === 200) {
        notification.success(`Tu publicación fue creada con id ${data.post.id}`);
        push("/");
      } else {
        notification.error(data.error);
      }
    } catch (error) {
      console.error(error);
      if ((error as { error: string }).error) notification.error((error as { error: string }).error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
      <div className="hero bg-base-200 flex-grow pt-8">
        <div className="hero-content px-6 flex flex-col lg:flex-row lg:items-start lg:pb-8 xl:pb-16">
          <div className="w-full lg:w-1/2 lg:flex lg:flex-col lg:pt-8">
            <h1 className="text-4xl md:text-5xl leading-[1.05] lg:pl-12">
              Cuenta <span className="underline underline-offset-8 decoration-accent">historias</span> <br />y comparte
              emociones ✨
            </h1>
            <p className="pt-4 text-lg px-4 lg:pl-12">
              Descubre <span className="text-accent font-bold">en corto</span> el impacto
              <br className="hidden md:block" /> de lo que sucede en Web3
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
                    onChange={handleFileChange}
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
    </>
  );
};

export default CreatePost;
