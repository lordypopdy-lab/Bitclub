import { useEffect, useState } from "react";

const TokenFetcher = () => {
    useEffect(() => {
        const test = async () => {
            try {
                const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd');
                const datas = await response.json();
                if (datas.length > 0) {
                    localStorage.setItem('tokens', JSON.stringify(datas));
                }
            } catch (error) {
                console.log(`Error fetching tokens:`, error);
            }
        }
        test();
    }, [])

    const tokenFormatter = async () => {
        const getTokens = localStorage.getItem('tokens');
       const tokens = JSON.parse(getTokens);
       const loopsTokens = tokens.map((token, index)=>{
        console.log(token)
       })
    }
    tokenFormatter();

    return (
        <>
            <h1>Hello World</h1>
        </>
    )
}

export default TokenFetcher