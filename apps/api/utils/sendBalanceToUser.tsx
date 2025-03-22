import {
  Keypair,
  Transaction,
  Connection,
  SystemProgram,
  PublicKey,
  SendTransactionError,
} from "@solana/web3.js";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

const sendBalanceToUser = async (
  balance: number,
  pubKey: string
): Promise<string> => {
  try {
    if (!process.env.CONNECTION_URL) {
      throw new Error("Missing CONNECTION_URL in environment variables.");
    }

    const connection = new Connection(process.env.CONNECTION_URL, "confirmed");

    const from = getKeypairFromEnvironment("SECRET_KEY");
    const toPublicKey = new PublicKey(pubKey);

    const lamportsToSend = Math.floor(balance * 1_000_000_000);

    const fromBalance = await connection.getBalance(from.publicKey);
    if (fromBalance < lamportsToSend + 5000) {
      throw new Error("Insufficient funds for transfer and fees.");
    }

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: toPublicKey,
        lamports: lamportsToSend,
      })
    );

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash("confirmed");

    transaction.recentBlockhash = blockhash;
    transaction.feePayer = from.publicKey;

    transaction.sign(from);

    const signature = await connection.sendRawTransaction(
      transaction.serialize(),
      {
        skipPreflight: false,
        preflightCommitment: "confirmed",
      }
    );

    console.log("Transaction successful:", signature);
    return signature;
  } catch (error) {
    console.error("Withdrawal error:", {
      message: (error as Error).message,
      stack: (error as Error).stack,
      details: { balance, pubKey },
    });

    if (error instanceof SendTransactionError) {
      console.error("Transaction error details:", error.logs);
    }

    throw error;
  }
};

export default sendBalanceToUser;
