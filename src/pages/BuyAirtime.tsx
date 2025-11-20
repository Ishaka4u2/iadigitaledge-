
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { playSuccessSound } from "@/utils/soundUtils";
import { detectNetwork } from "@/utils/networkDetection";
import mtnLogo from "@/assets/mtn-logo.png";
import airtelLogo from "@/assets/airtel-logo.png";
import gloLogo from "@/assets/glo-logo.png";
import nineMobileLogo from "@/assets/9mobile-logo.png";

const BuyAirtime = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [network, setNetwork] = useState("mtn");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePhoneNumberChange = (value: string) => {
    setPhoneNumber(value);
    
    // Auto-detect network from phone number
    const detectedNetwork = detectNetwork(value);
    if (detectedNetwork) {
      setNetwork(detectedNetwork);
    }
  };

  const networks = [
    { id: "mtn", name: "MTN", logo: mtnLogo },
    { id: "airtel", name: "Airtel", logo: airtelLogo },
    { id: "glo", name: "Glo", logo: gloLogo },
    { id: "9mobile", name: "9Mobile", logo: nineMobileLogo },
  ];

  const quickAmounts = ["100", "200", "500", "1000"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!phoneNumber || !amount || !network) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    // Show loading state
    setIsLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      setIsLoading(false);
      playSuccessSound();
      toast({
        title: "Success",
        description: `₦${amount} airtime purchased successfully!`,
      });
      
      // Navigate to transaction preview page with transaction data
      navigate("/transaction-preview", {
        state: {
          transactionData: {
            receiptData: {
              type: "Airtime Purchase",
              transactionId: "TXN" + Math.random().toString(36).substr(2, 9).toUpperCase(),
              phoneNumber,
              network: networks.find(n => n.id === network)?.name,
              amount: `₦${amount}`,
              status: "Successful",
              date: new Date().toLocaleDateString(),
              time: new Date().toLocaleTimeString()
            }
          }
        }
      });
    }, 2000);
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
        <h1 className="text-2xl font-bold">Buy Airtime</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Purchase Airtime</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={(e) => handlePhoneNumberChange(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Select Network</Label>
              <div className="grid grid-cols-2 gap-2">
                {networks.map((net) => (
                  <Button
                    key={net.id}
                    type="button"
                    variant={network === net.id ? "default" : "outline"}
                    onClick={() => setNetwork(net.id)}
                    className="h-20 flex flex-col items-center justify-center gap-2"
                  >
                    <img 
                      src={net.logo} 
                      alt={net.name}
                      className="h-10 w-auto object-contain"
                    />
                    <span className="text-xs">{net.name}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₦)</Label>
              <Input
                id="amount"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              
              <div className="grid grid-cols-4 gap-2 mt-2">
                {quickAmounts.map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    type="button"
                    variant="outline"
                    onClick={() => setAmount(quickAmount)}
                    className="h-12"
                  >
                    ₦{quickAmount}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button className="w-full" disabled={isLoading}>
              {isLoading ? "Processing..." : "Purchase Airtime"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default BuyAirtime;
