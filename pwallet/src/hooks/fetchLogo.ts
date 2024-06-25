import noneLogo from "../assets/none.png";

export const fetchLogo = async (symbol: string): Promise<string> => {
  if (symbol && symbol.length > 5) {
    return noneLogo;
  }

  try {
    const response = await fetch(`http://localhost:3000/logo?symbol=${symbol}`);
    if (!response.ok) {
      throw new Error("Logo not found");
    }
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error(error);
    return noneLogo;
  }
};

export default fetchLogo;