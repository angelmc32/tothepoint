"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import appConfig from "~~/config";
import { getEmojiFromString } from "~~/lib/forms/emotions";
import { AttestationType } from "~~/types";
import { notification } from "~~/utils/scaffold-eth";
import { truncateString } from "~~/utils/string";

const Attestations: NextPage = () => {
  const [attestations, setAttestations] = useState<AttestationType[]>([]);
  useEffect(() => {
    async function fetchAttestations() {
      const response = await fetch("api/attestations", {
        method: "GET",
      });
      const data = await response.json();
      setAttestations(data.attestations);
      if (response.status !== 200) {
        notification.warning("Ocurrió un error al cargar las atestaciones");
      }
    }
    fetchAttestations();
  }, []);
  return (
    <>
      <div className="w-full flex space-y-4 flex-col items-center pt-16 bg-base-200 flex-grow px-6 lg:px-16">
        <div className="md:w-4/5">
          <h2 className="text-4xl text-left">Últimas atestaciones...</h2>
        </div>
        <div className="grid gap-6 auto-rows-fr grid-cols-1 w-full md:w-4/5 md:grid-cols-2 xl:grid-cols-3">
          {attestations.map(attestation => (
            <div key={attestation.id} className="card w-full bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">UID: {truncateString(attestation.id)}</h2>
                <div className="text-left flex justify-start w-full">
                  Post:{" "}
                  <Link className="ml-2 text-accent font-bold" href={`/shorts/${attestation.post.id}`}>
                    {attestation.post.title}
                  </Link>
                </div>
                <div className="card-actions justify-end">
                  <div className="w-full flex flex-col items-start">
                    <p>Firma: {truncateString(attestation.attester)}</p>
                    <p>Recibe: {truncateString(attestation.recipient)}</p>
                  </div>
                  <div className="w-full flex flex-col items-start">
                    <div className="flex space-x-4 items-center w-full">
                      <label className="label py-1" htmlFor="impactRating">
                        <span className="label-text">Emoción registrada:</span>
                      </label>
                      <button className="btn btn-sm rounded-full btn-accent">
                        {getEmojiFromString(attestation.emotion)}
                      </button>
                    </div>
                    <div className="space-y-2 w-full">
                      <label className="label py-1" htmlFor="impactRating">
                        <span className="label-text">Impacto de este corto:</span>
                      </label>
                      <div className="w-full flex justify-center">
                        <div className="rating rating-md space-x-3">
                          <input
                            type="radio"
                            name="impactRating"
                            className={`mask mask-star-2 ${attestation.impact >= 1 ? "bg-accent" : "bg-primary/20"}`}
                            value="1"
                            id="1"
                            checked={attestation.impact >= 1}
                            readOnly
                          />
                          <input
                            type="radio"
                            name="impactRating"
                            className={`mask mask-star-2 ${attestation.impact >= 2 ? "bg-accent" : "bg-primary/20"}`}
                            value="2"
                            id="2"
                            checked={attestation.impact >= 2}
                            readOnly
                          />
                          <input
                            type="radio"
                            name="impactRating"
                            className={`mask mask-star-2 ${attestation.impact >= 3 ? "bg-accent" : "bg-primary/20"}`}
                            value="3"
                            id="3"
                            checked={attestation.impact >= 3}
                            readOnly
                          />
                          <input
                            type="radio"
                            name="impactRating"
                            className={`mask mask-star-2 ${attestation.impact >= 4 ? "bg-accent" : "bg-primary/20"}`}
                            value="4"
                            id="4"
                            checked={attestation.impact >= 4}
                            readOnly
                          />
                          <input
                            type="radio"
                            name="impactRating"
                            className={`mask mask-star-2 ${attestation.impact >= 5 ? "bg-accent" : "bg-primary/20"}`}
                            value="5"
                            id="5"
                            checked={attestation.impact >= 5}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="w-full flex justify-between text-sm md:px-0">
                        <p className="text-center">Inconsecuente</p>
                        <p className="text-center">Trascendental</p>
                      </div>
                      <div className="w-full flex flex-col items-center pt-2 space-y-2">
                        <Link
                          href={appConfig.explorers.optimismMainnet.attestation + `/${attestation.id}`}
                          target="blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 dark:text-accent font-bold"
                        >
                          <span>Atestación</span>
                          <ArrowTopRightOnSquareIcon className="h-4 w-4 mb-1" />
                        </Link>
                        <Link
                          href={appConfig.explorers.optimismMainnet.blockchain + `/tx/${attestation.txId}`}
                          target="blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-blue-700 dark:text-accent font-bold"
                        >
                          <span>Transacción</span>
                          <ArrowTopRightOnSquareIcon className="h-4 w-4 mb-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Attestations;
