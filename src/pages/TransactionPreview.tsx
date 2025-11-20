import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { playSuccessSound } from "@/utils/soundUtils";
import { useWallet } from "@/contexts/WalletContext";

const TransactionPreview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { deductFunds } = useWallet();
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const transactionData = location.state?.transactionData;

  // If no transaction data, redirect back
  if (!transactionData) {
    navigate("/dashboard");
    return null;
  }

  const handleConfirm = () => {
    if (pin.length !== 4) {
      toast({
        title: "Error",
        description: "Please enter your 4-digit PIN",
        variant: "destructive",
      });
      return;
    }

    // Get stored PIN from localStorage (default is "1234")
    const storedPin = localStorage.getItem("iadigital_pin") || "1234";
    
    if (pin !== storedPin) {
      toast({
        title: "Error",
        description: "Incorrect PIN. Please try again.",
        variant: "destructive",
      });
      setPin("");
      return;
    }

    // Extract amount from transaction data
    const amountString = transactionData.receiptData.amount;
    const amount = parseFloat(amountString.replace(/[₦,]/g, ''));

    // Try to deduct funds
    const success = deductFunds(amount);
    if (!success) {
      setPin("");
      return;
    }

    setIsLoading(true);

    // Simulate API request
    setTimeout(() => {
      setIsLoading(false);
      playSuccessSound();
      toast({
        title: "Success",
        description: "Transaction completed successfully!",
      });

      // Navigate to receipt page with transaction data
      navigate("/confirm-receipt", {
        state: {
          receiptData: transactionData.receiptData
        }
      });
    }, 1500);
  };

  return (
    <div className="py-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Confirm Transaction</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Transaction Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(transactionData.receiptData).map(([key, value]) => {
            if (key === "status") return null; // Skip status in preview
            return (
              <div key={key} className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                <span className="font-medium">{String(value)}</span>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Enter Transaction PIN</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Enter your 4-digit PIN to confirm this transaction
            </p>
            <InputOTP
              maxLength={4}
              value={pin}
              onChange={(value) => setPin(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
            <Button
              type="button"
              variant="link"
              onClick={() => navigate("/reset-pin")}
              className="text-sm"
            >
              Forgot PIN?
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            className="w-full" 
            onClick={handleConfirm}
            disabled={isLoading || pin.length !== 4}
          >
            {isLoading ? "Processing..." : "Confirm Transaction"}
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => navigate(-1)}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TransactionPreview;
