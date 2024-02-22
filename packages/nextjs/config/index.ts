const availableNetworks = ["scrollSepolia", "optimismSepolia"] as const;
type AvailableNetworks = (typeof availableNetworks)[number];

// RPC
type RPCs = Record<
  AvailableNetworks,
  {
    http: string;
  }
>;
const rpcs: RPCs = {
  scrollSepolia: {
    http: "https://sepolia.optimism.io",
  },
  optimismSepolia: {
    http: "https://sepolia-rpc.scroll.io",
  },
};

// Addresses
type Addresses = Record<
  AvailableNetworks,
  {
    easContract: `0x${string}`;
    schemaRegistryContract: `0x${string}`;
  }
>;
const addresses: Addresses = {
  scrollSepolia: {
    easContract: "0xaEF4103A04090071165F78D45D83A0C0782c2B2a",
    schemaRegistryContract: "0x55D26f9ae0203EF95494AE4C170eD35f4Cf77797",
  },
  optimismSepolia: {
    easContract: "0x4200000000000000000000000000000000000021",
    schemaRegistryContract: "0x4200000000000000000000000000000000000020",
  },
};

// Block explorers
type Explorers = Record<
  AvailableNetworks,
  {
    blockchain: string;
    attestation: string;
  }
>;
const explorers: Explorers = {
  scrollSepolia: {
    blockchain: "https://sepolia.scrollscan.com",
    attestation: "https://scroll-sepolia.easscan.org/attestation/view",
  },
  optimismSepolia: {
    blockchain: "https://sepolia-optimism.etherscan.io",
    attestation: "https://optimism-sepolia.easscan.org",
  },
};

type Attestation = {
  id: string;
  name: string;
  schema: string;
};

type Attestations = Record<
  AvailableNetworks,
  {
    impactReport: Attestation;
  }
>;

const attestations: Attestations = {
  scrollSepolia: {
    impactReport: {
      id: "0x426fe0f5e2eb0ff970e3760b82683aea2198eca82afb2b30122249eaa51a436b",
      name: "Reporte de Impacto",
      schema:
        "address cortoAddress, uint256 cortoTokenId, string cortoId, string cortoName, string emotionQuestion, string emotion, string impactQuestion, uint8 impactRating, string attestRole",
    },
  },
  optimismSepolia: {
    impactReport: {
      id: "0x0461f6e91268a14ab7e02e0e4043a41452be0c1306d707c133341a4b0fb875e4",
      name: "Reporte de Impacto",
      schema:
        "string schemaName, string schemaId, address referenceAddress, uint256 referenceTokenId, string referenceUniqueId, string referenceName, string emotionQuestion, string emotion, string impactQuestion, uint8 impact, string attestRole",
    },
  },
};

const appConfig = {
  rpcs,
  addresses,
  attestations,
  explorers,
} as const;

export default appConfig;
