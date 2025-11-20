
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { playSuccessSound } from "@/utils/soundUtils";
import { detectNetwork } from "@/utils/networkDetection";
import mtnLogo from "@/assets/mtn-logo.png";
import airtelLogo from "@/assets/airtel-logo.png";
import gloLogo from "@/assets/glo-logo.png";
import nineMobileLogo from "@/assets/9mobile-logo.png";

const BuyData = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [network, setNetwork] = useState("mtn");
  const [plan, setPlan] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeDataType, setActiveDataType] = useState("SME");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePhoneNumberChange = (value: string) => {
    setPhoneNumber(value);
    
    // Auto-detect network from phone number
    const detectedNetwork = detectNetwork(value);
    if (detectedNetwork) {
      setNetwork(detectedNetwork);
      setPlan(""); // Reset plan when network changes
    }
  };

  const dataTypes = ["SME", "SME2"];

  const dataPlans: Record<string, Record<string, Array<{ id: string; name: string; price: string }>>> = {
    SME: {
      mtn: [
        { id: "mtn_sme_500mb", name: "500MB MONTHLY", price: "₦400" },
        { id: "mtn_sme_1gb", name: "1GB MONTHLY", price: "₦570" },
        { id: "mtn_sme_2gb", name: "2GB MONTHLY", price: "₦1200" },
        { id: "mtn_sme_3gb", name: "3GB MONTHLY", price: "₦1550" },
        { id: "mtn_sme_5gb", name: "5GB MONTHLY", price: "₦2150" },
      ],
      airtel: [
        { id: "airtel_sme_500mb", name: "500MB MONTHLY", price: "₦400" },
        { id: "airtel_sme_1gb", name: "1GB MONTHLY", price: "₦570" },
        { id: "airtel_sme_2gb", name: "2GB MONTHLY", price: "₦1200" },
        { id: "airtel_sme_3gb", name: "3GB MONTHLY", price: "₦1550" },
        { id: "airtel_sme_5gb", name: "5GB MONTHLY", price: "₦2150" },
      ],
      glo: [
        { id: "glo_sme_500mb", name: "500MB MONTHLY", price: "₦400" },
        { id: "glo_sme_1gb", name: "1GB MONTHLY", price: "₦570" },
        { id: "glo_sme_2gb", name: "2GB MONTHLY", price: "₦1200" },
        { id: "glo_sme_3gb", name: "3GB MONTHLY", price: "₦1550" },
        { id: "glo_sme_5gb", name: "5GB MONTHLY", price: "₦2150" },
      ],
      "9mobile": [
        { id: "9mobile_sme_500mb", name: "500MB MONTHLY", price: "₦400" },
        { id: "9mobile_sme_1gb", name: "1GB MONTHLY", price: "₦570" },
        { id: "9mobile_sme_2gb", name: "2GB MONTHLY", price: "₦1200" },
        { id: "9mobile_sme_3gb", name: "3GB MONTHLY", price: "₦1550" },
        { id: "9mobile_sme_5gb", name: "5GB MONTHLY", price: "₦2150" },
      ],
    },
    SME2: {
      mtn: [
        { id: "mtn_sme2_500mb", name: "500MB WEEKLY", price: "₦410" },
        { id: "mtn_sme2_1gb", name: "1GB MONTHLY", price: "₦550" },
        { id: "mtn_sme2_2gb", name: "2GB MONTHLY", price: "₦1100" },
        { id: "mtn_sme2_3gb", name: "3GB MONTHLY", price: "₦1650" },
        { id: "mtn_sme2_5gb", name: "5GB MONTHLY", price: "₦2750" },
      ],
      airtel: [
        { id: "airtel_sme2_500mb", name: "500MB WEEKLY", price: "₦410" },
        { id: "airtel_sme2_1gb", name: "1GB MONTHLY", price: "₦550" },
        { id: "airtel_sme2_2gb", name: "2GB MONTHLY", price: "₦1100" },
        { id: "airtel_sme2_3gb", name: "3GB MONTHLY", price: "₦1650" },
        { id: "airtel_sme2_5gb", name: "5GB MONTHLY", price: "₦2750" },
      ],
      glo: [
        { id: "glo_sme2_500mb", name: "500MB WEEKLY", price: "₦410" },
        { id: "glo_sme2_1gb", name: "1GB MONTHLY", price: "₦550" },
        { id: "glo_sme2_2gb", name: "2GB MONTHLY", price: "₦1100" },
        { id: "glo_sme2_3gb", name: "3GB MONTHLY", price: "₦1650" },
        { id: "glo_sme2_5gb", name: "5GB MONTHLY", price: "₦2750" },
      ],
      "9mobile": [
        { id: "9mobile_sme2_500mb", name: "500MB WEEKLY", price: "₦410" },
        { id: "9mobile_sme2_1gb", name: "1GB MONTHLY", price: "₦550" },
        { id: "9mobile_sme2_2gb", name: "2GB MONTHLY", price: "₦1100" },
        { id: "9mobile_sme2_3gb", name: "3GB MONTHLY", price: "₦1650" },
        { id: "9mobile_sme2_5gb", name: "5GB MONTHLY", price: "₦2750" },
      ],
    },
  };

  const networks = [
    { id: "mtn", name: "MTN", logo: mtnLogo },
    { id: "airtel", name: "Airtel", logo: airtelLogo },
    { id: "glo", name: "Glo", logo: gloLogo },
    { id: "9mobile", name: "9Mobile", logo: nineMobileLogo },
  ];

  const handleDataTypeSelect = (dataType: string) => {
    setActiveDataType(dataType);
    setPlan(""); // Reset plan selection when data type changes
    toast({
      title: `${dataType} Selected`,
      description: `You've selected ${dataType} data type`
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!phoneNumber || !network || !plan) {
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
        description: "Data bundle purchased successfully!",
      });
      
      // Navigate to transaction preview page with transaction data
      const selectedPlan = dataPlans[activeDataType][network].find(p => p.id === plan);
      navigate("/transaction-preview", {
        state: {
          transactionData: {
            receiptData: {
              type: "Data Purchase",
              transactionId: `TXN${Date.now()}`,
              phoneNumber,
              network: networks.find(n => n.id === network)?.name,
              amount: selectedPlan?.price,
              plan: selectedPlan?.name,
              dataType: activeDataType,
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
        <h1 className="text-2xl font-bold">Buy Data</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Purchase Data Bundle</CardTitle>
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
              <Label>Data Type</Label>
              <div className="flex gap-2">
                {dataTypes.map(dataType => (
                  <Button
                    key={dataType}
                    type="button"
                    variant={activeDataType === dataType ? "default" : "outline"}
                    onClick={() => handleDataTypeSelect(dataType)}
                    className="flex-1"
                  >
                    {dataType}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Select Data Plan</Label>
              <RadioGroup value={plan} onValueChange={setPlan}>
                <div className="space-y-2">
                  {network && activeDataType &&
                    dataPlans[activeDataType][network].map((dataPlan) => (
                      <div key={dataPlan.id} className="flex items-center space-x-2 p-2 border rounded hover:bg-accent transition-colors">
                        <RadioGroupItem value={dataPlan.id} id={dataPlan.id} />
                        <Label htmlFor={dataPlan.id} className="flex justify-between w-full cursor-pointer">
                          <span>{dataPlan.name}</span>
                          <span className="font-medium">{dataPlan.price}</span>
                        </Label>
                      </div>
                    ))
                  }
                </div>
              </RadioGroup>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button className="w-full" disabled={isLoading}>
              {isLoading ? "Processing..." : "Purchase Data"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default BuyData;
