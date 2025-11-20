import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";

const Transfer = () => {
  const navigate = useNavigate();
  const [network, setNetwork] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [recipientName, setRecipientName] = useState("");

  const networks = [
    { value: "mtn", label: "MTN" },
    { value: "glo", label: "Glo" },
    { value: "airtel", label: "Airtel" },
    { value: "9mobile", label: "9Mobile" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Navigate to transaction preview page with transaction data
    navigate("/transaction-preview", {
      state: {
        transactionData: {
          receiptData: {
            type: "Money Transfer",
            transactionId: "TXN" + Math.random().toString(36).substr(2, 9).toUpperCase(),
            phoneNumber,
            recipientName,
            network: networks.find(n => n.value === network)?.label,
            amount: `₦${amount}`,
            status: "Successful",
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString()
          }
        }
      }
    });
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="mr-3"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Transfer Money</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Recipient Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="network" className="text-left block">Network</Label>
                  <Select value={network} onValueChange={setNetwork}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select network" />
                    </SelectTrigger>
                    <SelectContent>
                      {networks.map((net) => (
                        <SelectItem key={net.value} value={net.value}>
                          {net.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-left block">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="080xxxxxxxx"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recipientName" className="text-left block">Recipient Name</Label>
                  <Input
                    id="recipientName"
                    placeholder="Enter recipient's name"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-left block">Amount (₦)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full mt-6">
                  <Send className="h-4 w-4 mr-2" />
                  Continue Transfer
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Transfer;