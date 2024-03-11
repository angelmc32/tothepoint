"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { NextPage } from "next";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { isAddress } from "viem";
import { useAccount } from "wagmi";
import { CloudArrowUpIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import { AddressInput, RainbowKitFormConnectButton } from "~~/components/scaffold-eth";
import supabase from "~~/services/supabase";
import { notification } from "~~/utils/scaffold-eth";

const supabaseApiUrl = process.env.NEXT_PUBLIC_SUPABASE_API_URL ?? "";
const cdnUrl = `${supabaseApiUrl}/storage/v1/object/public/povs/`;

const CreatePost: NextPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    mediaUrl: "",
    title: "",
    description: "",
  });
  const [collaboratorAddress, setCollaboratorAddress] = useState("");
  const [isUploadVideo, setIsUploadVideo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { push } = useRouter();
  const { address, isConnected } = useAccount();

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) setFile(event.target.files[0]);
  }

  async function createReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      !form.title ||
      !form.description ||
      !address ||
      (!isUploadVideo && !form.mediaUrl) ||
      (isUploadVideo && !file)
    ) {
      return notification.error("Todos los campos son requeridos para crear el POV");
    }
    if (collaboratorAddress.length > 0 && !isAddress(collaboratorAddress)) {
      return notification.error("Introduce una dirección o ENS válidos para agregar colaboraciones");
    }
    let mediaUrl = form.mediaUrl;
    setIsLoading(true);
    try {
      if (isUploadVideo && file) {
        const { data: videoData, error: videoUploadError } = await supabase.storage
          .from("povs")
          .upload(uuidv4() + path.extname(file.name), file);

        if (videoUploadError) {
          notification.error("Error al subir el video");
          return;
        }
        mediaUrl = cdnUrl + videoData?.path;
      }

      const response = await fetch("api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          connectedAddress: address,
          collaborator: collaboratorAddress.length > 0 ? collaboratorAddress : null,
          mediaUrl,
        }),
      });
      const data = await response.json();
      if (response.status === 200) {
        notification.success(`Tu publicación fue creada exitosamente`);
        setForm({
          mediaUrl: "",
          title: "",
          description: "",
        });
        push(`/povs/${data.post.id}`);
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
        <div className="hero-content px-6 flex flex-col lg:flex-row lg:items-start md:pb-24 lg:pb-8 xl:pb-16 md:w-3/4 lg:w-full lg:px-12 xl:px-16">
          <div className="w-full lg:w-1/2 lg:flex lg:flex-col lg:pt-8">
            <h1 className="text-4xl lg:text-5xl leading-[1.05] lg:pl-12">
              Cuenta <span className="underline underline-offset-8 decoration-accent">historias</span> <br />y comparte
              emociones ✨
            </h1>
            <p className="pt-4 text-lg lg:px-4 lg:pl-12">
              Ayuda a otros a descubrir el <span className="text-accent font-bold">impacto</span> <br />
              de lo que sucede en Web3
            </p>
          </div>
          <div className="w-full lg:w-1/2 lg:px-4">
            <div className="bg-base-100 border-primary border-2 shadow-md shadow-secondary rounded-xl px-6 lg:px-8 mb-6 space-y-2 py-8">
              <h4 className="text-xl">Crea un POV</h4>
              <form className="flex flex-col space-y-1 w-full" onSubmit={createReport}>
                <div>
                  <div className="w-full flex justify-between items-center">
                    <label className="label py-1" htmlFor="title">
                      <span className="text-base label-text">Video</span>
                    </label>
                    <button
                      className="btn btn-ghost btn-accent btn-xs !text-sm"
                      onClick={event => {
                        event.preventDefault();
                        if (!isUploadVideo)
                          notification.warning(
                            "Por el momento solo puedes registrar ligas de video, pronto rehabilitaremos las subidas de video",
                          );
                        setIsUploadVideo(false);
                      }}
                    >
                      {isUploadVideo ? <CloudArrowUpIcon className="h-5 w-5" /> : <GlobeAltIcon className="h-5 w-5" />}
                    </button>
                  </div>
                  {isUploadVideo ? (
                    <input
                      type="file"
                      className="file-input file-input-primary file-input-bordered border-2 w-full rounded-lg h-10 bg-base-200"
                      onChange={handleFileChange}
                      accept="video/mp4,video/x-m4v,video/*"
                    />
                  ) : (
                    <input
                      id="mediaUrl"
                      name="mediaUrl"
                      value={form.mediaUrl}
                      onChange={event => setForm({ ...form, mediaUrl: event.target.value })}
                      type="text"
                      placeholder="Liga de YouTube/Loom/etc..."
                      className="input input-primary border-2 w-full rounded-lg h-10 bg-base-200 input-bordered"
                    />
                  )}
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
                <div>
                  <label className="label py-1" htmlFor="collaborator">
                    <span className="text-base label-text">Colabora:</span>
                  </label>
                  <AddressInput
                    value={collaboratorAddress}
                    name="collaborator"
                    placeholder="Dirección o ENS"
                    onChange={setCollaboratorAddress}
                  />
                </div>
                <div className="w-full flex justify-center pt-4">
                  {isConnected ? (
                    <button
                      className="btn btn-accent rounded-lg"
                      disabled={isLoading || !form.description || !form.title}
                    >
                      {isLoading ? "Creando..." : "Crear POV"}
                      {isLoading && <span className="loading loading-spinner loading-sm"></span>}
                    </button>
                  ) : (
                    <RainbowKitFormConnectButton />
                  )}
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
