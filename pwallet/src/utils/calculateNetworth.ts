import type { Tokens } from "../components/ViewWallet.tsx";


export const calculateTotalNetworth = (tokens: Tokens[]): string => {
  return tokens
    .reduce((acc, token) => {
      const usdValue = token.usd_value || 0;
      return acc + usdValue;
    }, 0)
    .toFixed(2);
};