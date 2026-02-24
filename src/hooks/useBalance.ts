import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import type { ChainName, ChainType } from '../lib/types';
import { BackendAPI } from '../config';

export const useBalance = (address: string, chain: ChainName, chainType: ChainType) => {
    const [balance, setBalance] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchBalance = useCallback(async () => {
        if (!address) return;

        try {
            const normalizedChain = chain.toLowerCase();
            const endpoint = BackendAPI + `/${normalizedChain}/getBalance`;
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    address,
                    chainType
                })
            }

            const response = await fetch(endpoint, options);

            if (!response.ok) {
                throw new Error('Server unreachable');
            }

            const data = await response.json();

            if (normalizedChain === 'solana') {
                // Data expected: { lamports: "string" }
                if (data.lamports) {
                    const solFloat = Number(data.lamports) / 1000000000;
                    setBalance(solFloat.toFixed(4));
                }
            } else {
                // Data expected: { wei: "0x..." }
                if (data.wei) {
                    const eth = ethers.formatEther(data.wei);
                    setBalance(Number(eth).toFixed(4));
                }
            }

            setError(false);
        } catch (err) {
            console.error('Balance fetch failed:', err);
            setError(true);
        } finally {
            setIsLoading(false);
        }
    }, [address, chain, chainType]);

    useEffect(() => {
        fetchBalance();
        const interval = setInterval(fetchBalance, 10000);

        return () => clearInterval(interval);
    }, [fetchBalance]);

    return { balance, isLoading, error, refetch: fetchBalance };
};
