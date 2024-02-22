"use client";

import React, { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useSession } from "next-auth/react";
import { zeroAddress } from "viem";
import { useAccount, useNetwork } from "wagmi";
import { ArrowLeftIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import ShortCard from "~~/components/cards/ShortCard";
import { RainbowKitFormConnectButton } from "~~/components/scaffold-eth";
import appConfig from "~~/config";
import { useEAS } from "~~/hooks/useEAS";
import { cortoImpactAttestation, trueStoryAttestation } from "~~/lib/forms/attestations";
import { emotionsArray, getEmojiFromString } from "~~/lib/forms/emotions";
import { AttestationType, PostType } from "~~/types";
import { notification } from "~~/utils/scaffold-eth";

export default function Short() {
  const [post, setPost] = useState<PostType | undefined>(undefined);
  const [hasLoadedPost, setHasLoadedPost] = useState(false);
  const [form, setForm] = useState({
    emotion: "",
    impactRating: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isInterviewee, setIsInterviewee] = useState(false);
  const [userAttestation, setUserAttestation] = useState<AttestationType | undefined>(undefined);

  const router = useRouter();
  const { eas } = useEAS();
  const { id } = useParams();
  const { address: connectedAddress, isConnected } = useAccount();
  const network = useNetwork();
  const session = useSession();

  useEffect(() => {
    async function getPost() {
      if (hasLoadedPost) return;
      const response = await fetch(`/api/posts/${id}`, {
        method: "GET",
      });
      const data = await response.json();
      setPost(data.post as PostType);
      const userAttestations: AttestationType[] = data.post.attestations.filter(
        (attestation: AttestationType) => attestation.attester === connectedAddress,
      );
      if (userAttestations.length > 0) {
        setUserAttestation(userAttestations[0]);
      }
      if (session.status === "authenticated") {
        setIsInterviewee(session.data?.user?.name === data.post.collaborators[0]);
      }
      setHasLoadedPost(true);
    }
    getPost();
  }, [connectedAddress, hasLoadedPost, id, session]);

  useEffect(() => {
    if (session.status === "authenticated" && post && post.collaborators && post.collaborators.length > 0) {
      setIsInterviewee(session.data?.user?.name === post?.collaborators[0]);
    }
  }, [session, post]);

  // async function updatePost(event: FormEvent) {
  //   event.preventDefault();

  //   const response = await fetch(`/api/posts/${post?.id}`, {
  //     method: "PATCH",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       emotion: form.emotion,
  //       impact: form.impactRating,
  //     }),
  //   });
  //   const data = await response.json();
  // }

  async function createAttestation(attestationId: string, txId: string) {
    let chainName: string;
    if (network.chain?.name === "Scroll Sepolia") {
      chainName = "SCROLL_SEPOLIA";
    } else {
      chainName = "ARBITRUM_ONE";
    }
    const createAttestationRes = await fetch("/api/attestations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        attestationId,
        txId,
        chain: chainName,
        schemaId: appConfig.attestations.scrollSepolia.impactReport.id,
        attester: connectedAddress,
        recipient: post?.author,
        emotion: form.emotion,
        impact: form.impactRating,
        attesterRole: isInterviewee ? "interviewee" : "audience",
        category: isInterviewee ? "TRUE_STORY" : "IMPACT_REPORT",
        postId: post?.id,
        connectedAddress,
      }),
    });
    const attestationResData = await createAttestationRes.json();
    return attestationResData.updatedPost;
  }

  async function createImpactReport(event: FormEvent) {
    event?.preventDefault();
    setIsLoading(true);
    if (!eas || !post) return;
    if (!session || !session.data?.user?.name || session.data?.user?.name !== connectedAddress) {
      setIsLoading(false);
      return notification.warning("Debes iniciar sesión");
    }
    if (!form.emotion || !form.impactRating) {
      setIsLoading(false);
      return notification.warning("Debes responder ambas preguntas");
    }
    try {
      const schemaEncoder = new SchemaEncoder(appConfig.attestations.scrollSepolia.impactReport.schema);
      const encodedData = schemaEncoder.encodeData([
        { name: "cortoAddress", value: zeroAddress, type: "address" },
        { name: "cortoTokenId", value: zeroAddress, type: "uint256" },
        { name: "cortoId", value: post.id, type: "string" },
        { name: "cortoName", value: post.title, type: "string" },
        { name: "emotionQuestion", value: cortoImpactAttestation.emotionQuestion, type: "string" },
        { name: "emotion", value: form.emotion, type: "string" },
        { name: "impactQuestion", value: cortoImpactAttestation.impactQuestion, type: "string" },
        { name: "impactRating", value: form.impactRating, type: "uint8" },
        { name: "attestRole", value: cortoImpactAttestation.attestRole, type: "string" },
      ]);

      const transaction = await eas.attest({
        schema: appConfig.attestations.scrollSepolia.impactReport.id,
        data: {
          recipient: post.author,
          expirationTime: undefined,
          revocable: true,
          data: encodedData,
        },
      });

      const newAttestationUID = await transaction.wait();
      const updatedPost = await createAttestation(newAttestationUID, transaction.tx.hash);
      setPost(updatedPost as PostType);

      const userAttestations: AttestationType[] = updatedPost.attestations.filter(
        (attestation: AttestationType) => attestation.attester === connectedAddress,
      );
      if (userAttestations.length > 0) {
        setUserAttestation(userAttestations[0]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function createTrueStory(event: FormEvent) {
    event?.preventDefault();
    setIsLoading(true);
    if (!eas || !post) return;
    if (!session || !session.data?.user?.name || session.data?.user?.name !== connectedAddress) {
      setIsLoading(false);
      return notification.warning("Debes iniciar sesión");
    }
    if (!form.emotion || !form.impactRating) {
      setIsLoading(false);
      return notification.warning("Debes responder ambas preguntas");
    }
    try {
      const schemaEncoder = new SchemaEncoder(appConfig.attestations.scrollSepolia.impactReport.schema);
      const encodedData = schemaEncoder.encodeData([
        { name: "cortoAddress", value: zeroAddress, type: "address" },
        { name: "cortoTokenId", value: zeroAddress, type: "uint256" },
        { name: "cortoId", value: post.id, type: "string" },
        { name: "cortoName", value: post.title, type: "string" },
        { name: "emotionQuestion", value: trueStoryAttestation.emotionQuestion, type: "string" },
        { name: "emotion", value: form.emotion, type: "string" },
        { name: "impactQuestion", value: trueStoryAttestation.impactQuestion, type: "string" },
        { name: "impactRating", value: form.impactRating, type: "uint8" },
        { name: "attestRole", value: "interviewee", type: "string" },
      ]);

      const transaction = await eas.attest({
        schema: appConfig.attestations.scrollSepolia.impactReport.id,
        data: {
          recipient: post.author,
          expirationTime: undefined,
          revocable: true,
          data: encodedData,
        },
      });

      const newAttestationUID = await transaction.wait();
      createAttestation(newAttestationUID, transaction.tx.hash);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="hero bg-base-200 flex-grow pt-8 md:pt-16 lg:pt-8 h-full xl:pt-16">
      <div className="h-full align-start px-6 flex flex-col xl:pb-16 w-full md:w-3/5 lg:px-16 space-y-4 xl:w-1/2">
        <div className="w-full">
          <button className="btn btn-secondary btn-sm !text-sm" onClick={() => router.back()}>
            <ArrowLeftIcon className="h-3 w-3" />
            Atrás
          </button>
        </div>
        <div className="w-full">
          {hasLoadedPost && post ? (
            <>
              <ShortCard id={post.id} title={post.title} content={post.content} mediaUrl={post?.mediaUrl} layout="col">
                {userAttestation ? (
                  <div className="px-4 md:px-8 py-4">
                    <div className="flex flex-col space-y-4 md:space-y-6 w-full border-base-300 border-2 rounded-box py-6 md:py-4 px-4">
                      <h5 className="text-base text-center">Tu atestación</h5>
                      <div className="flex space-x-4 items-center">
                        <label className="label py-1" htmlFor="impactRating">
                          <span className="label-text">Emoción registrada:</span>
                        </label>
                        <button className="btn btn-sm rounded-full btn-accent">
                          {getEmojiFromString(userAttestation.emotion)}
                        </button>
                      </div>
                      <div className="space-y-2">
                        <label className="label py-1" htmlFor="impactRating">
                          <span className="label-text">Impacto de este corto:</span>
                        </label>
                        <div className="w-full flex justify-center">
                          <div className="rating rating-md space-x-3">
                            <input
                              type="radio"
                              name="impactRating"
                              className={`mask mask-star-2 ${
                                userAttestation.impact >= 1 ? "bg-accent" : "bg-primary/20"
                              }`}
                              value="1"
                              id="1"
                              checked={userAttestation.impact >= 1}
                              readOnly
                            />
                            <input
                              type="radio"
                              name="impactRating"
                              className={`mask mask-star-2 ${
                                userAttestation.impact >= 2 ? "bg-accent" : "bg-primary/20"
                              }`}
                              value="2"
                              id="2"
                              checked={userAttestation.impact >= 2}
                              readOnly
                            />
                            <input
                              type="radio"
                              name="impactRating"
                              className={`mask mask-star-2 ${
                                userAttestation.impact >= 3 ? "bg-accent" : "bg-primary/20"
                              }`}
                              value="3"
                              id="3"
                              checked={userAttestation.impact >= 3}
                              readOnly
                            />
                            <input
                              type="radio"
                              name="impactRating"
                              className={`mask mask-star-2 ${
                                userAttestation.impact >= 4 ? "bg-accent" : "bg-primary/20"
                              }`}
                              value="4"
                              id="4"
                              checked={userAttestation.impact >= 4}
                              readOnly
                            />
                            <input
                              type="radio"
                              name="impactRating"
                              className={`mask mask-star-2 ${
                                userAttestation.impact >= 5 ? "bg-accent" : "bg-primary/20"
                              }`}
                              value="5"
                              id="5"
                              checked={userAttestation.impact >= 5}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="flex justify-between text-sm md:px-4 lg:px-12 xl:px-16">
                          <p className="text-center">Inconsecuente</p>
                          <p className="text-center">Trascendental</p>
                        </div>
                        <div className="w-full flex flex-col items-center pt-2 space-y-2">
                          <Link
                            href={appConfig.explorers.scrollSepolia.attestation + `/${userAttestation.id}`}
                            target="blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 dark:text-accent font-bold"
                          >
                            <span>Atestación</span>
                            <ArrowTopRightOnSquareIcon className="h-4 w-4 mb-1" />
                          </Link>
                          <Link
                            href={appConfig.explorers.scrollSepolia.blockchain + `/tx/${userAttestation.txId}`}
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
                ) : (
                  <form
                    className="flex flex-col space-y-4 md:space-y-6 w-full"
                    onSubmit={isInterviewee ? createTrueStory : createImpactReport}
                  >
                    <div className="space-y-2">
                      <label className="label py-1" htmlFor="emotion">
                        <span className="text-base label-text">
                          {isInterviewee
                            ? trueStoryAttestation.emotionQuestion
                            : cortoImpactAttestation.emotionQuestion}
                        </span>
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
                          {isInterviewee ? trueStoryAttestation.impactQuestion : cortoImpactAttestation.impactQuestion}
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
                        <p className="text-center">Inconsecuente</p>
                        <p className="text-center">Trascendental</p>
                      </div>
                    </div>
                    <div className="w-full flex justify-center pt-2 pb-6">
                      {isConnected ? (
                        <button className="btn btn-accent rounded-lg" disabled={isLoading || !hasLoadedPost}>
                          {isLoading ? "Certificando..." : "Certifica impacto"}
                          {isLoading && <span className="loading loading-spinner loading-sm"></span>}
                        </button>
                      ) : (
                        <RainbowKitFormConnectButton />
                      )}
                    </div>
                  </form>
                )}
              </ShortCard>
            </>
          ) : (
            <div className="w-full flex flex-col items-center py-16 space-y-4">
              <span className="loading loading-spinner loading-lg text-accent" />
              <h4 className="text-lg">Cargando...</h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}