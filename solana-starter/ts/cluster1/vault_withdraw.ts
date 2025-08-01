import {
  Connection,
  Keypair,
  SystemProgram,
  PublicKey,
  Commitment,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  Program,
  Wallet,
  AnchorProvider,
  Address,
  BN,
} from "@coral-xyz/anchor";
import { WbaVault, IDL } from "./programs/wba_vault";
// import wallet from "../../../wallet/dev-wallet.json";
import wallet from "../../../wallet/turbin3-wallet.json";

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// Commitment
const commitment: Commitment = "confirmed";

// Create a devnet connection
const connection = new Connection("https://api.devnet.solana.com");

// Create our anchor provider
const provider = new AnchorProvider(connection, new Wallet(keypair), {
  commitment,
});

// Create our program
const program = new Program<WbaVault>(
  IDL,
  "D51uEDHLbWAxNfodfQDv7qkp8WZtxrhi3uganGbNos7o" as Address,
  provider
);

// Create a random keypair
const vaultState = new PublicKey(
  "Ave3wBYkjoEAhD3oK8aPDB5BSZ4WkYiAXNH4ETH32mxJ"
);
// Create the PDA for our enrollment account
// Seeds are "auth", vaultState
const seedsAuth: Array<Buffer> = [Buffer.from("auth"), vaultState.toBuffer()];
const [vaultAuth, bump] = PublicKey.findProgramAddressSync(
  seedsAuth,
  program.programId
);

// Create the vault key
// Seeds are "vault", vaultAuth
const seedsVault: Array<Buffer> = [Buffer.from("vault"), vaultAuth.toBuffer()];
const [vault] = PublicKey.findProgramAddressSync(seedsVault, program.programId);

// Execute our enrollment transaction
(async () => {
  try {
    const signature = await program.methods
      .withdraw(new BN(1 * LAMPORTS_PER_SOL))
      .accounts({
        owner: keypair.publicKey,
        vaultState: vaultState,
        vaultAuth: vaultAuth,
        vault: vault,
        systemProgram: SystemProgram.programId,
      })
    .signers([
        keypair
    ]).rpc();
    console.log(`Withdraw success! Check out your TX here:\n\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();

// Withdraw success! Check out your TX here:

// https://explorer.solana.com/tx/4NFgqcSkuE1ZaiGJdqHDVSZ7gqffVr15TxX4eVTmZ5ubQvmEySL1NETrM8wFQo766h19GuU6DhDp6XKaXL2TB4EY?cluster=devnet
// ✨  Done in 3.69s.