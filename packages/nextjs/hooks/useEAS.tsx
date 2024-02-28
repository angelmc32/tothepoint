import { useEffect, useState } from "react";
import { EAS, SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import { WindowProvider } from "wagmi";
import appConfig from "~~/config";
import { getEthersSigner } from "~~/services/web3/ethersAdapters";

declare global {
  interface Window {
    ethereum?: WindowProvider;
  }
}
export const useEAS = ({ chainId }: { chainId: number }) => {
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
      const easInstance = new EAS(appConfig.addresses.optimismMainnet.easContract);
      const schemaRegistry = new SchemaRegistry(appConfig.addresses.optimismMainnet.schemaRegistryContract);

      const signer = await getEthersSigner({ chainId });

      if (!signer) {
        console.log("Unable to initialize EAS: no signer found");
        return;
      }

      const address = signer.address;

      // Connects an ethers style provider/signingProvider to perform read/write functions.
      easInstance.connect(signer); // allow users to attest using saved schemas (appConfig file)
      schemaRegistry.connect(signer); // allow users to register their own reputation schema (not supported in current release)
      setEas(easInstance);
      setSchemaRegistry(schemaRegistry);
      setAttesterAddress(address);
    };
    init();
  }, [attesterAddress, chainId, eas, schemaRegistry]);

  return { eas, schemaRegistry, attesterAddress };
};
