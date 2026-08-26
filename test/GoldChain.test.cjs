const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GoldChain Protocol Suite", function () {
  let minerRegistry;
  let goldBatch;
  let verificationSystem;
  let owner, miner1, miner2, unauthorizedUser, buyer, refinery;

  const MOCK_COMPANY_1 = "AngloGold Ashanti (Ghana) Ltd";
  const MOCK_LICENSE_1 = "EPA-GH-MIN-2024-0891";
  const MOCK_REGION_1 = "Obuasi, Ashanti";
  const MOCK_LOCATION_1 = "Obuasi Underground Shaft 3 (6.20°N, 1.68°W)";
  const MOCK_WEIGHT_1 = 50000; // 50 kg in grams
  const MOCK_PURITY_1 = 999; // 24K (99.9%)
  const MOCK_ENV_STATUS_1 = "EPA Certified • Mercury-Free Cyanidation • Reforestation Escrow Active";
  const MOCK_IPFS_1 = "bafybeih4j3z74fk6y3y5v6f5w3m4n5k6j7l8m9";

  beforeEach(async function () {
    [owner, miner1, miner2, unauthorizedUser, buyer, refinery] = await ethers.getSigners();

    // 1. Deploy MinerRegistry
    const MinerRegistryFactory = await ethers.getContractFactory("MinerRegistry");
    minerRegistry = await MinerRegistryFactory.deploy();
    await minerRegistry.waitForDeployment();
    const minerRegistryAddress = await minerRegistry.getAddress();

    // 2. Deploy GoldBatch
    const GoldBatchFactory = await ethers.getContractFactory("GoldBatch");
    goldBatch = await GoldBatchFactory.deploy(minerRegistryAddress);
    await goldBatch.waitForDeployment();
    const goldBatchAddress = await goldBatch.getAddress();

    // 3. Deploy VerificationSystem
    const VerificationSystemFactory = await ethers.getContractFactory("VerificationSystem");
    verificationSystem = await VerificationSystemFactory.deploy(goldBatchAddress, minerRegistryAddress);
    await verificationSystem.waitForDeployment();

    // Authorize miner1 by default
    await minerRegistry.addMiner(miner1.address, MOCK_COMPANY_1, MOCK_LICENSE_1, MOCK_REGION_1);
  });

  // =========================================================================
  // Section 1: MinerRegistry Unit Tests (Tests 1 - 7)
  // =========================================================================
  describe("1. MinerRegistry Contract", function () {
    it("Test 1: Should set deployer as contract owner", async function () {
      expect(await minerRegistry.owner()).to.equal(owner.address);
    });

    it("Test 2: Owner can authorize a new licensed mining entity", async function () {
      await expect(
        minerRegistry.addMiner(miner2.address, "Newmont Gold Ghana", "EPA-GH-MIN-2024-0412", "Ahafo District")
      )
        .to.emit(minerRegistry, "MinerAdded")
        .withArgs(miner2.address, "Newmont Gold Ghana", "EPA-GH-MIN-2024-0412", "Ahafo District", (val) => val > 0);

      expect(await minerRegistry.isAuthorizedMiner(miner2.address)).to.be.true;
    });

    it("Test 3: Non-owner cannot add miners (reverts with OnlyOwner)", async function () {
      await expect(
        minerRegistry.connect(unauthorizedUser).addMiner(
          unauthorizedUser.address,
          "Illegal Syndicate",
          "FAKE-001",
          "Birim River Concession"
        )
      ).to.be.revertedWithCustomError(minerRegistry, "OnlyOwner");
    });

    it("Test 4: Cannot add zero address as miner", async function () {
      await expect(
        minerRegistry.addMiner(ethers.ZeroAddress, "Ghost Mining Corp", "EPA-000", "Western")
      ).to.be.revertedWithCustomError(minerRegistry, "ZeroAddressNotAllowed");
    });

    it("Test 5: Cannot authorize already registered miner", async function () {
      await expect(
        minerRegistry.addMiner(miner1.address, MOCK_COMPANY_1, MOCK_LICENSE_1, MOCK_REGION_1)
      ).to.be.revertedWithCustomError(minerRegistry, "MinerAlreadyAuthorized");
    });

    it("Test 6: Owner can revoke authorization of a miner", async function () {
      expect(await minerRegistry.isAuthorizedMiner(miner1.address)).to.be.true;
      await expect(minerRegistry.removeMiner(miner1.address))
        .to.emit(minerRegistry, "MinerRemoved");
      expect(await minerRegistry.isAuthorizedMiner(miner1.address)).to.be.false;
    });

    it("Test 7: Fetch miner profile returns full details and count", async function () {
      const details = await minerRegistry.getMinerDetails(miner1.address);
      expect(details.isAuthorized).to.be.true;
      expect(details.companyName).to.equal(MOCK_COMPANY_1);
      expect(details.licenseNumber).to.equal(MOCK_LICENSE_1);
      expect(details.region).to.equal(MOCK_REGION_1);
    });
  });

  // =========================================================================
  // Section 2: GoldBatch Minting & Duplicate Detection (Tests 8 - 15)
  // =========================================================================
  describe("2. GoldBatch ERC-721 Contract", function () {
    it("Test 8: Authorized miner can successfully mint a gold batch NFT", async function () {
      const extractionTime = Math.floor(Date.now() / 1000) - 3600;
      
      const tx = await goldBatch.connect(miner1).mintBatch(
        MOCK_LOCATION_1,
        MOCK_WEIGHT_1,
        MOCK_PURITY_1,
        extractionTime,
        MOCK_COMPANY_1,
        MOCK_LICENSE_1,
        MOCK_ENV_STATUS_1,
        MOCK_IPFS_1
      );

      await expect(tx)
        .to.emit(goldBatch, "BatchRegistered")
        .withArgs(1001, miner1.address, MOCK_COMPANY_1, MOCK_WEIGHT_1, MOCK_LOCATION_1, (val) => val.length === 66, (val) => val > 0);

      expect(await goldBatch.ownerOf(1001)).to.equal(miner1.address);
      expect(await goldBatch.balanceOf(miner1.address)).to.equal(1);
    });

    it("Test 9: Unauthorized caller cannot mint gold batch", async function () {
      const extractionTime = Math.floor(Date.now() / 1000) - 3600;
      await expect(
        goldBatch.connect(unauthorizedUser).mintBatch(
          "Uncertified River Dredge Site",
          10000,
          999,
          extractionTime,
          "Wildcat Gold",
          "NO-LICENSE",
          "None - Mercury Wash Used",
          "ipfs-none"
        )
      ).to.be.revertedWithCustomError(goldBatch, "UnauthorizedMiner");
    });

    it("Test 10: Duplicate Detection - Reverts when registering identical batch fingerprint", async function () {
      const extractionTime = 1700000000;

      // First registration succeeds
      await goldBatch.connect(miner1).mintBatch(
        MOCK_LOCATION_1,
        MOCK_WEIGHT_1,
        MOCK_PURITY_1,
        extractionTime,
        MOCK_COMPANY_1,
        MOCK_LICENSE_1,
        MOCK_ENV_STATUS_1,
        MOCK_IPFS_1
      );

      // Second registration with SAME location + extractionDate + miner MUST revert!
      await expect(
        goldBatch.connect(miner1).mintBatch(
          MOCK_LOCATION_1,
          MOCK_WEIGHT_1,
          MOCK_PURITY_1,
          extractionTime,
          MOCK_COMPANY_1,
          MOCK_LICENSE_1,
          MOCK_ENV_STATUS_1,
          MOCK_IPFS_1
        )
      ).to.be.revertedWithCustomError(goldBatch, "DuplicateBatchDetected");
    });

    it("Test 11: Emits DuplicateDetected event upon collision attempt", async function () {
      const extractionTime = 1700000000;
      await goldBatch.connect(miner1).mintBatch(
        MOCK_LOCATION_1,
        MOCK_WEIGHT_1,
        MOCK_PURITY_1,
        extractionTime,
        MOCK_COMPANY_1,
        MOCK_LICENSE_1,
        MOCK_ENV_STATUS_1,
        MOCK_IPFS_1
      );

      await expect(
        goldBatch.connect(miner1).mintBatch(
          MOCK_LOCATION_1,
          MOCK_WEIGHT_1,
          MOCK_PURITY_1,
          extractionTime,
          MOCK_COMPANY_1,
          MOCK_LICENSE_1,
          MOCK_ENV_STATUS_1,
          MOCK_IPFS_1
        )
      ).to.emit(goldBatch, "DuplicateDetected");
    });

    it("Test 12: Reverts when zero weight is provided", async function () {
      const extractionTime = Math.floor(Date.now() / 1000) - 3600;
      await expect(
        goldBatch.connect(miner1).mintBatch(
          MOCK_LOCATION_1,
          0, // 0 weight
          MOCK_PURITY_1,
          extractionTime,
          MOCK_COMPANY_1,
          MOCK_LICENSE_1,
          MOCK_ENV_STATUS_1,
          MOCK_IPFS_1
        )
      ).to.be.revertedWithCustomError(goldBatch, "InvalidWeight");
    });

    it("Test 13: Reverts when location is empty", async function () {
      const extractionTime = Math.floor(Date.now() / 1000) - 3600;
      await expect(
        goldBatch.connect(miner1).mintBatch(
          "",
          50000,
          999,
          extractionTime,
          MOCK_COMPANY_1,
          MOCK_LICENSE_1,
          MOCK_ENV_STATUS_1,
          MOCK_IPFS_1
        )
      ).to.be.revertedWithCustomError(goldBatch, "EmptyLocation");
    });

    it("Test 14: Reverts when future extraction date is provided", async function () {
      const futureDate = Math.floor(Date.now() / 1000) + 86400 * 10; // 10 days in future
      await expect(
        goldBatch.connect(miner1).mintBatch(
          MOCK_LOCATION_1,
          50000,
          999,
          futureDate,
          MOCK_COMPANY_1,
          MOCK_LICENSE_1,
          MOCK_ENV_STATUS_1,
          MOCK_IPFS_1
        )
      ).to.be.revertedWithCustomError(goldBatch, "InvalidExtractionDate");
    });

    it("Test 15: Allows standard ERC-721 token transfers from miner to refinery", async function () {
      const extractionTime = Math.floor(Date.now() / 1000) - 3600;
      await goldBatch.connect(miner1).mintBatch(
        MOCK_LOCATION_1,
        MOCK_WEIGHT_1,
        MOCK_PURITY_1,
        extractionTime,
        MOCK_COMPANY_1,
        MOCK_LICENSE_1,
        MOCK_ENV_STATUS_1,
        MOCK_IPFS_1
      );

      // Transfer from miner to refinery
      await goldBatch.connect(miner1).transferFrom(miner1.address, refinery.address, 1001);
      expect(await goldBatch.ownerOf(1001)).to.equal(refinery.address);
      expect(await goldBatch.balanceOf(miner1.address)).to.equal(0);
      expect(await goldBatch.balanceOf(refinery.address)).to.equal(1);
    });
  });

  // =========================================================================
  // Section 3: VerificationSystem Integrity & Validation (Tests 16 - 22)
  // =========================================================================
  describe("3. VerificationSystem Contract", function () {
    let testTokenId;
    let extractionTime;

    beforeEach(async function () {
      extractionTime = Math.floor(Date.now() / 1000) - 7200;
      await goldBatch.connect(miner1).mintBatch(
        MOCK_LOCATION_1,
        MOCK_WEIGHT_1,
        MOCK_PURITY_1,
        extractionTime,
        MOCK_COMPANY_1,
        MOCK_LICENSE_1,
        MOCK_ENV_STATUS_1,
        MOCK_IPFS_1
      );
      testTokenId = 1001;
    });

    it("Test 16: verifyBatch returns authentic metadata and validity boolean", async function () {
      const res = await verificationSystem.verifyBatch(testTokenId);
      expect(res.tokenId).to.equal(testTokenId);
      expect(res.isValid).to.be.true;
      expect(res.companyName).to.equal(MOCK_COMPANY_1);
      expect(res.weightGrams).to.equal(MOCK_WEIGHT_1);
      expect(res.location).to.equal(MOCK_LOCATION_1);
      expect(res.isMinerCurrentlyAuthorized).to.be.true;
      expect(res.isFingerprintIntact).to.be.true;
    });

    it("Test 17: isValid returns true for existing authentic batch", async function () {
      expect(await verificationSystem.isValid(testTokenId)).to.be.true;
    });

    it("Test 18: isValid returns false for non-existent token ID", async function () {
      expect(await verificationSystem.isValid(9999)).to.be.false;
    });

    it("Test 19: Provenance tracks current custody transfer accurately", async function () {
      // Transfer to vault
      await goldBatch.connect(miner1).transferFrom(miner1.address, buyer.address, testTokenId);
      const res = await verificationSystem.verifyBatch(testTokenId);
      expect(res.currentOwner).to.equal(buyer.address);
      expect(res.originatingMiner).to.equal(miner1.address);
    });

    it("Test 20: Flags status when miner is later de-authorized by regulatory authority", async function () {
      await minerRegistry.removeMiner(miner1.address);
      const res = await verificationSystem.verifyBatch(testTokenId);
      expect(res.isMinerCurrentlyAuthorized).to.be.false;
      // Historical batch data remains mathematically intact
      expect(res.isFingerprintIntact).to.be.true;
    });

    it("Test 21: Records on-chain verification audit event", async function () {
      await expect(verificationSystem.connect(refinery).recordOnChainVerification(testTokenId))
        .to.emit(verificationSystem, "BatchVerified")
        .withArgs(testTokenId, refinery.address, true, (val) => val > 0);
    });

    it("Test 22: Contract owner can update environmental audit status on GoldBatch", async function () {
      const newStatus = "EPA Ghana Re-Certified • Grade A+ Gold Refinement Standard";
      await expect(goldBatch.updateEnvironmentalAudit(testTokenId, newStatus))
        .to.emit(goldBatch, "EnvironmentalStatusUpdated")
        .withArgs(testTokenId, newStatus, (val) => val > 0);

      const batch = await goldBatch.getBatchDetails(testTokenId);
      expect(batch.environmentalStatus).to.equal(newStatus);
    });
  });
});
