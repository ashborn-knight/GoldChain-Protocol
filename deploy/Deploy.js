const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

/**
 * @notice Hardhat deployment script for the GoldChain protocol suite on Ethereum Sepolia / Localhost.
 * @dev Deploys MinerRegistry, GoldBatch (ERC-721), and VerificationSystem in sequential dependency order.
 */
async function main() {
  console.log("=====================================================");
  console.log("🏅 Starting GoldChain Deployment to:", hre.network.name);
  console.log("=====================================================\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // 1. Deploy MinerRegistry
  console.log("1/3 Deploying MinerRegistry...");
  const MinerRegistry = await hre.ethers.getContractFactory("MinerRegistry");
  const minerRegistry = await MinerRegistry.deploy();
  await minerRegistry.waitForDeployment();
  const minerRegistryAddress = await minerRegistry.getAddress();
  console.log("   ✅ MinerRegistry deployed at:", minerRegistryAddress);

  // 2. Deploy GoldBatch (ERC-721)
  console.log("2/3 Deploying GoldBatch (ERC-721)...");
  const GoldBatch = await hre.ethers.getContractFactory("GoldBatch");
  const goldBatch = await GoldBatch.deploy(minerRegistryAddress);
  await goldBatch.waitForDeployment();
  const goldBatchAddress = await goldBatch.getAddress();
  console.log("   ✅ GoldBatch deployed at:", goldBatchAddress);

  // 3. Deploy VerificationSystem
  console.log("3/3 Deploying VerificationSystem...");
  const VerificationSystem = await hre.ethers.getContractFactory("VerificationSystem");
  const verificationSystem = await VerificationSystem.deploy(goldBatchAddress, minerRegistryAddress);
  await verificationSystem.waitForDeployment();
  const verificationSystemAddress = await verificationSystem.getAddress();
  console.log("   ✅ VerificationSystem deployed at:", verificationSystemAddress);

  console.log("\n-----------------------------------------------------");
  console.log("🏢 Initializing Demo Whitelist & Genesis Batches...");
  console.log("-----------------------------------------------------");

  // Add initial licensed mining entities
  const tx1 = await minerRegistry.addMiner(
    deployer.address,
    "AngloGold Ashanti (Ghana) Ltd",
    "EPA-GH-MIN-2024-0891",
    "Obuasi Concession, Ashanti Region"
  );
  await tx1.wait();
  console.log("   ✅ Authorized deployer as AngloGold Ashanti Obuasi");

  // Mint Genesis Gold Batch #1001
  const genesisDate = Math.floor(Date.now() / 1000) - 86400 * 3; // 3 days ago
  const mintTx = await goldBatch.mintBatch(
    "Obuasi Deep Underground Mine, Block 2, Ashanti (6.202°N, 1.684°W)",
    25000, // 25 kg in grams (or 25 kg)
    999,   // 99.9% 24 Karat
    genesisDate,
    "AngloGold Ashanti (Ghana) Ltd",
    "EPA-GH-MIN-2024-0891",
    "EPA Ghana Certified Tier-1 • Mercury-Free Cyanidation • ISO 14001 Reforestation Bonded",
    "bafybeicb3nslx2e2l4g2u63gupgh7hszpfn2h5mvyy2w67q2mzyxgh2j7e"
  );
  await mintTx.wait();
  console.log("   ✅ Minted Genesis Gold Batch #1001 (25 kg / 24K Gold)");

  // Output summary
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      MinerRegistry: minerRegistryAddress,
      GoldBatch: goldBatchAddress,
      VerificationSystem: verificationSystemAddress,
    },
    genesisBatch: {
      tokenId: 1001,
      company: "AngloGold Ashanti (Ghana) Ltd",
      weightKg: 25,
      purity: "24K (99.9%)",
      location: "Obuasi Deep Underground Mine, Block 2, Ashanti (6.202°N, 1.684°W)"
    }
  };

  const outputPath = path.join(__dirname, "../src/contracts/deployedAddresses.json");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(deploymentInfo, null, 2));

  console.log("\n=====================================================");
  console.log("🎉 GoldChain Protocol successfully deployed!");
  console.log("Saved deployment configuration to:", outputPath);
  console.log("=====================================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
