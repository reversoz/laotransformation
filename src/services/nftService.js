import { Alchemy, Network } from "alchemy-sdk";

const getNetwork = () => {
  switch (process.env.NEXT_PUBLIC_ALCHEMY_NETWORK) {
    case "eth-sepolia":
      return Network.ETH_SEPOLIA;
    case "eth-mainnet":
      return Network.ETH_MAINNET;
    case "eth-goerli":
      return Network.ETH_GOERLI;
    default:
      return Network.ETH_SEPOLIA; // Default to Sepolia
  }
};

const config = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  network: getNetwork(),
};

const alchemy = new Alchemy(config);

export async function getNFTsForCollection(walletAddress) {
  try {
    let pageKey = null;
    let allNfts = [];
    do {
      const nfts = await alchemy.nft.getNftsForOwner(walletAddress, {
        contractAddresses: [process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS],
        pageKey,
        pageSize: 100,
      });
      allNfts.push(...nfts.ownedNfts);
      pageKey = nfts.pageKey;
    } while (pageKey);

    return allNfts.map((nft) => ({
      id: nft.tokenId,
      imageUrl: nft.image.originalUrl,
      name: nft.name,
    }));
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    return [];
  }
}
