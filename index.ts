import {
  clusterApiUrl,
  Connection,
  GetProgramAccountsFilter,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

const connection = new Connection(clusterApiUrl("devnet"));

const walletToQuery = "YOUR_PUBLIC_KEY";

async function getTokenAccountsOwnerByWallet(
  wallet: string,
  connection: Connection,
) {
  const filters: GetProgramAccountsFilter[] = [
    {
      dataSize: 165,
    },
    {
      memcmp: {
        offset: 32,
        bytes: wallet,
      },
    },
  ];
  const accounts = await connection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
    filters: filters,
  });
  console.log(`Found ${accounts.length} token accounts for wallet ${wallet}.`);

  accounts.forEach((account, i) => {
    const parsedAccountInfo: any = account.account.data;
    const mintAddress: string = parsedAccountInfo["parsed"]["info"]["mint"];
    const tokenBalance: number =
      parsedAccountInfo["parsed"]["info"]["tokenAmount"]["amount"];
    console.log(`Token Account No. ${i + 1}: ${account.pubkey.toString()}`);
    console.log(`--Token Mint: ${mintAddress}`);
    console.log(`--Token Balance: ${tokenBalance}`);
  });
}

getTokenAccountsOwnerByWallet(walletToQuery, connection);
