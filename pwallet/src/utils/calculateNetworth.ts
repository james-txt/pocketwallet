import { Tokens } from "../hooks/useFetchTokensAndNfts";

export const calculateTotalNetworth = (tokens: Tokens[]): number => {
  return tokens.reduce((acc, token) => {
    const usdValue = token.usd_value || 0;
    return acc + usdValue;
  }, 0);
};

export const calculateNetworth24hrUsdChange = (tokens: Tokens[]): number => {
  return tokens.reduce((acc, token) => {
    const usdValue = token.usd_value_24hr_usd_change || 0;
    return acc + usdValue;
  }, 0);
};

export const calculateNetworth24hrPctChange = (tokens: Tokens[]): number => {
  const initialNetworth = tokens.reduce((acc, token) => {
    const initialUsdValue = (token.usd_value || 0) - (token.usd_value_24hr_usd_change || 0);
    return acc + initialUsdValue;
  }, 0);

  const currentNetworth = tokens.reduce((acc, token) => {
    const currentUsdValue = token.usd_value || 0;
    return acc + currentUsdValue;
  }, 0);

  if (initialNetworth === 0) {
    return 0;
  }

  const percentageChange = ((currentNetworth - initialNetworth) / initialNetworth) * 100;
  return parseFloat(percentageChange.toFixed(2));
};
