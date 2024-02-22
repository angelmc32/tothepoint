import { useEffect, useState } from "react";
import { EAS, SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import { WindowProvider } from "wagmi";
import appConfig from "~~/config";

declare global {
  interface Window {
    ethereum?: WindowProvider;
  }
}
export const useEAS = () => {
  const [eas, setEas] = useState<EAS>();
  const [schemaRegistry, setSchemaRegistry] = useState<SchemaRegistry>();
  const [attesterAddress, setAttesterAddress] = useState("");
  useEffect(() => {
    if (attesterAddress) return;
    const init = async () => {
      if (!window.ethereum) {
        console.error("No ethereum object available, connect wallet or check provider");
        return;
      }
      // Initialize the sdk with the address of the EAS Schema contract address
      const easInstance = new EAS(appConfig.addresses.scrollSepolia.easContract);
      const schemaRegistry = new SchemaRegistry(appConfig.addresses.scrollSepolia.schemaRegistryContract);

      // Gets a default provider (in production use something else like infura/alchemy)
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // Connects an ethers style provider/signingProvider to perform read/write functions.
      easInstance.connect(signer); // allow clients to attest against freelancer's schema
      schemaRegistry.connect(signer); // allow Freelancer to register their own reputation schema
      setEas(easInstance);
      setSchemaRegistry(schemaRegistry);
      setAttesterAddress(address);
    };
    init();
  }, [eas, schemaRegistry, attesterAddress]);

  return { eas, schemaRegistry, attesterAddress };
};
