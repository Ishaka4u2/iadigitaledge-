
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { playSuccessSound } from "@/utils/soundUtils";

const AirtimeToCash = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [network, setNetwork] = useState("");
  const [pin, setPin] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bankName, setBankName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const networks = [
    { id: "mtn", name: "MTN" },
    { id: "airtel", name: "Airtel" },
    { id: "glo", name: "Glo" },
    { id: "9mobile", name: "9Mobile" },
  ];

  const banks = [
    { id: "access", name: "Access Bank" },
    { id: "fidelity", name: "Fidelity Bank" },
    { id: "first", name: "First Bank" },
    { id: "gtb", name: "Guaranty Trust Bank" },
    { id: "uba", name: "United Bank for Africa" },
    { id: "zenith", name: "Zenith Bank" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!phoneNumber || !amount || !network || !pin || !bankAccount || !bankName) {
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
        title: "Request Submitted",
        description: "Your airtime to cash request is being processed.",
      });
      
      // Navigate to transaction preview page with transaction data
      const afterFees = parseFloat(amount) * 0.7; // 30% fee deducted
      navigate("/transaction-preview", {
        state: {
          transactionData: {
            receiptData: {
              type: "Airtime to Cash",
              transactionId: "TXN" + Math.random().toString(36).substr(2, 9).toUpperCase(),
              phoneNumber,
              network: networks.find(n => n.id === network)?.name,
              amount: `₦${afterFees.toFixed(2)}`,
              status: "Processing",
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
        <h1 className="text-2xl font-bold">Airtime to Cash</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Convert Airtime to Cash</CardTitle>
          <CardDescription>We charge a 30% service fee for this conversion</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="network">Select Network</Label>
              <Select value={network} onValueChange={setNetwork}>
                <SelectTrigger>
                  <SelectValue placeholder="Select network" />
                </SelectTrigger>
                <SelectContent>
                  {networks.map((net) => (
                    <SelectItem key={net.id} value={net.id}>
                      {net.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                placeholder="Enter phone number with airtime"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Airtime Amount (₦)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              {amount && (
                <p className="text-sm text-muted-foreground">
                  You will receive ₦{Math.round(Number(amount) * 0.7)} (30% service fee applied)
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pin">Transfer Pin</Label>
              <Input
                id="pin"
                type="password"
                placeholder="Enter transfer pin"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                You'll need to dial *transfer code# to transfer the airtime
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Select value={bankName} onValueChange={setBankName}>
                <SelectTrigger>
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent>
                  {banks.map((bank) => (
                    <SelectItem key={bank.id} value={bank.id}>
                      {bank.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bankAccount">Account Number</Label>
              <Input
                id="bankAccount"
                placeholder="Enter account number"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                required
              />
            </div>
          </CardContent>
          
          <CardFooter>
            <Button className="w-full" disabled={isLoading}>
              {isLoading ? "Processing..." : "Submit Request"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AirtimeToCash;
