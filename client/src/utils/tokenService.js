export const fetchTokens = async () => {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&sparkline=true"
    );

    const data = await response.json();

    if (data.length > 0) {
      localStorage.setItem("tokens", JSON.stringify(data));
    }

    return data;
  } catch (error) {
    console.log("Error fetching tokens:", error);
    return null;
  }
};