import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

interface WalletContextType {
  balance: number;
  addFunds: (amount: number) => void;
  deductFunds: (amount: number) => boolean;
  formatBalance: () => string;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Load balance from localStorage
    const storedBalance = localStorage.getItem("iadigital_wallet_balance");
    if (storedBalance) {
      setBalance(parseFloat(storedBalance));
    } else {
      // Initialize with default balance for testing
      const defaultBalance = 15000;
      setBalance(defaultBalance);
      localStorage.setItem("iadigital_wallet_balance", defaultBalance.toString());
    }
  }, []);

  const addFunds = (amount: number) => {
    const newBalance = balance + amount;
    setBalance(newBalance);
    localStorage.setItem("iadigital_wallet_balance", newBalance.toString());
    toast({
      title: "Funds Added",
      description: `₦${amount.toLocaleString()} has been added to your wallet`,
    });
  };

  const deductFunds = (amount: number): boolean => {
    if (balance < amount) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough funds in your wallet",
        variant: "destructive",
      });
      return false;
    }
    
    const newBalance = balance - amount;
    setBalance(newBalance);
    localStorage.setItem("iadigital_wallet_balance", newBalance.toString());
    return true;
  };

  const formatBalance = () => {
    return `₦${balance.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <WalletContext.Provider
      value={{
        balance,
        addFunds,
        deductFunds,
        formatBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
