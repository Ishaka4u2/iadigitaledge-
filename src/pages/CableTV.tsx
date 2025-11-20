
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import dstvLogo from "@/assets/logo-app.png"; // Placeholder - replace with actual DSTV logo
import gotvLogo from "@/assets/logo-app.png"; // Placeholder - replace with actual GOTV logo
import startimesLogo from "@/assets/logo-app.png"; // Placeholder - replace with actual StarTimes logo

const CableTV = () => {
  const [smartCardNumber, setSmartCardNumber] = useState("");
  const [provider, setProvider] = useState("");
  const [plan, setPlan] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const providers = [
    { id: "dstv", name: "DSTV", logo: dstvLogo },
    { id: "gotv", name: "GOTV", logo: gotvLogo },
    { id: "startimes", name: "StarTimes", logo: startimesLogo },
  ];

  const plans = {
    dstv: [
      { id: "dstv1", name: "DSTV Access", price: "₦2,000" },
      { id: "dstv2", name: "DSTV Family", price: "₦4,000" },
      { id: "dstv3", name: "DSTV Compact", price: "₦7,900" },
      { id: "dstv4", name: "DSTV Premium", price: "₦21,000" },
    ],
    gotv: [
      { id: "gotv1", name: "GOtv Lite", price: "₦900" },
      { id: "gotv2", name: "GOtv Value", price: "₦1,900" },
      { id: "gotv3", name: "GOtv Plus", price: "₦3,300" },
      { id: "gotv4", name: "GOtv Max", price: "₦4,150" },
    ],
    startimes: [
      { id: "startimes1", name: "Nova", price: "₦900" },
      { id: "startimes2", name: "Basic", price: "₦1,700" },
      { id: "startimes3", name: "Smart", price: "₦2,200" },
      { id: "startimes4", name: "Super", price: "₦4,200" },
    ],
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!smartCardNumber || !provider || !plan) {
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
      toast({
        title: "Success",
        description: "Subscription purchased successfully!",
      });
      
      // Navigate to transaction preview page with transaction data
      const selectedPlan = plans[provider as keyof typeof plans].find(p => p.id === plan);
      navigate("/transaction-preview", {
        state: {
          transactionData: {
            receiptData: {
              type: "Cable TV Subscription",
              transactionId: "TXN" + Math.random().toString(36).substr(2, 9).toUpperCase(),
              smartCardNumber,
              provider: provider.toUpperCase(),
              plan: selectedPlan?.name,
              amount: selectedPlan?.price,
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
        <h1 className="text-2xl font-bold">Cable TV</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Pay TV Subscription</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Provider</Label>
              <div className="grid grid-cols-3 gap-2">
                {providers.map((prov) => (
                  <Button
                    key={prov.id}
                    type="button"
                    variant={provider === prov.id ? "default" : "outline"}
                    onClick={() => setProvider(prov.id)}
                    className="h-20 flex flex-col items-center justify-center gap-2"
                  >
                    <img 
                      src={prov.logo} 
                      alt={prov.name}
                      className="h-10 w-auto object-contain"
                    />
                    <span className="text-xs">{prov.name}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="smartCardNumber">Smart Card/IUC Number</Label>
              <Input
                id="smartCardNumber"
                placeholder="Enter Smart Card/IUC Number"
                value={smartCardNumber}
                onChange={(e) => setSmartCardNumber(e.target.value)}
                required
              />
            </div>
            
            {provider && (
              <div className="space-y-2">
                <Label>Select Bouquet</Label>
                <RadioGroup value={plan} onValueChange={setPlan}>
                  <div className="space-y-2">
                    {plans[provider as keyof typeof plans].map((tvPlan) => (
                      <div key={tvPlan.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={tvPlan.id} id={tvPlan.id} />
                        <Label htmlFor={tvPlan.id} className="flex justify-between w-full cursor-pointer">
                          <span>{tvPlan.name}</span>
                          <span className="font-medium">{tvPlan.price}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}
          </CardContent>
          
          <CardFooter>
            <Button className="w-full" disabled={isLoading}>
              {isLoading ? "Processing..." : "Pay Subscription"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CableTV;
