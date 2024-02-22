"use client";

import React, { FormEvent, useState } from "react";
import Link from "next/link";
import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { zeroAddress } from "viem";
import { useAccount } from "wagmi";
import appConfig from "~~/config";
import { useEAS } from "~~/hooks/useEAS";
import { trueStoryAttestation } from "~~/lib/forms/attestations";

const emotionsArray = [
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

export default function TrueStory() {
  const [form, setForm] = useState({
    emotion: "",
    impactRating: 0,
  });
  const [attestationUid, setAttestationUID] = useState("");
  const [txHash, setTxHash] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { eas } = useEAS();

  const account = useAccount();

  async function createReport(event: FormEvent) {
    event?.preventDefault();
    setIsLoading(true);
    if (!eas) return;
    try {
      const schemaEncoder = new SchemaEncoder(appConfig.attestations.scrollSepolia.impactReport.schema);
      const encodedData = schemaEncoder.encodeData([
        { name: "cortoAddress", value: zeroAddress, type: "address" },
        { name: "cortoTokenId", value: zeroAddress, type: "uint256" },
        { name: "cortoId", value: "test-id", type: "string" },
        { name: "cortoName", value: trueStoryAttestation.cortoName, type: "string" },
        { name: "emotionQuestion", value: trueStoryAttestation.emotionQuestion, type: "string" },
        { name: "emotion", value: form.emotion, type: "string" },
        { name: "impactQuestion", value: trueStoryAttestation.impactQuestion, type: "string" },
        { name: "impactRating", value: form.impactRating, type: "uint8" },
        { name: "attestRole", value: trueStoryAttestation.attestRole, type: "string" },
      ]);

      const transaction = await eas.attest({
        schema: appConfig.attestations.scrollSepolia.impactReport.id,
        data: {
          recipient: "0xF54f4815f62ccC360963329789d62d3497A121Ae",
          expirationTime: undefined,
          revocable: true,
          data: encodedData,
        },
      });

      const newAttestationUID = await transaction.wait();
      setAttestationUID(newAttestationUID);
      setTxHash(transaction.tx.hash);
      setForm({
        emotion: "",
        impactRating: 0,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="hero bg-base-200 flex-grow pt-8 md:pt-16 lg:pt-8 h-full xl:pt-16">
      <div className="h-full align-start px-6 flex flex-col xl:pb-16 w-full md:w-3/5 lg:px-16 space-y-4 xl:w-1/2">
        <div className="w-full px-4">
          {attestationUid ? (
            <div className="flex flex-col space-y-2">
              <Link href={appConfig.explorers.scrollSepolia.attestation + attestationUid}>Atestación</Link>
              <Link href={appConfig.explorers.scrollSepolia.blockchain + "tx/" + txHash}>Tx</Link>
            </div>
          ) : (
            <p className="text-lg">
              Al responder estas preguntas y firmar, crearemos una atestación que certificará la entrevista que le
              realizaron
            </p>
          )}
        </div>
        <div className="w-full px-4">
          <div className="bg-base-100 border-primary border-2 shadow-md shadow-secondary rounded-xl px-6 lg:px-8 mb-6 space-y-2 py-8 xl:px-16 xl:py-12">
            <h4 className="text-xl">Atestación de Entrevista</h4>
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
                <label className="label py-1" htmlFor="emotion">
                  <span className="text-base label-text">¿Cómo te sentiste durante la entrevista?</span>
                </label>
                <div className="w-full flex justify-center">
                  <div className="grid grid-cols-5 grid-rows-2 gap-x-2 gap-y-4">
                    {emotionsArray.map((emotion, index) => (
                      <label
                        htmlFor={emotion.id}
                        className={`btn btn-sm rounded-full ${
                          form.emotion === emotion.value ? "btn-accent" : "btn-secondary"
                        }`}
                        key={emotion.id + index}
                      >
                        <input
                          type="radio"
                          name="emotion"
                          className="hidden"
                          value={emotion.value}
                          id={emotion.id}
                          checked={form.emotion === emotion.value}
                          onChange={event => setForm({ ...form, emotion: event?.target.value })}
                        />
                        {emotion.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="label py-1" htmlFor="impactRating">
                  <span className="text-base label-text">
                    ¿Cómo calificas el impacto de ETHDenver en tu vida y carrera?
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
                  {isLoading ? "Creando..." : "Crear Atestación"}
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
