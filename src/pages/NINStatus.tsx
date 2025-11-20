
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { IdCard, Printer, Eye, CreditCard, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const NINStatus = () => {
  const { toast } = useToast();
  const [ninNumber, setNinNumber] = useState("");
  const [slipDesign, setSlipDesign] = useState("regular");
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);

  const slipOptions = [
    { value: "regular", label: "Regular Slip", price: "₦200" },
    { value: "standard", label: "Standard Slip", price: "₦220" },
    { value: "premium", label: "Premium Slip", price: "₦220" }
  ];

  const slipImages = {
    regular: "/lovable-uploads/5bec3434-80f9-40d0-9acf-1a53dd5d6319.png",
    standard: "/lovable-uploads/2573d376-eda3-4341-ad98-bcf90e411939.png",
    premium: "/lovable-uploads/df2597e3-8826-468b-9044-6b2d0bc2d5a4.png"
  };

  const sampleSlipImages = [
    "/lovable-uploads/9a672119-c06c-4113-bc5d-9495ad62b0c7.png",
    "/lovable-uploads/44c0aa76-ba8b-413a-a2d9-b9a401a5c5c2.png",
    "/lovable-uploads/be0539af-ae16-4541-9675-8512a590b5cb.png"
  ];

  const handleCheck = () => {
    if (!ninNumber || ninNumber.length < 11) {
      toast({
        title: "Invalid NIN",
        description: "Please enter a valid 11-digit NIN number",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setVerificationResult(true);
      setPreviewImage(slipImages[slipDesign as keyof typeof slipImages]);
      toast({
        title: "NIN Found",
        description: "Your NIN information has been retrieved successfully"
      });
    }, 1500);
  };

  const handlePrint = () => {
    toast({
      title: "Printing Initiated",
      description: `Your ${slipOptions.find(opt => opt.value === slipDesign)?.label} will be processed and delivered.`
    });
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your NIN slip is being downloaded"
    });
  };

  return (
    <div className="py-6 space-y-6">
      <div className="flex items-center space-x-3 mb-4">
        <IdCard className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">NIN Status</h1>
          <p className="text-muted-foreground">Check your NIN status and print a slip</p>
        </div>
      </div>

      <Tabs defaultValue="verify" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="verify">Verify NIN</TabsTrigger>
          <TabsTrigger value="samples">Sample Slips</TabsTrigger>
        </TabsList>
        
        <TabsContent value="verify" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>NIN Verification</CardTitle>
              <CardDescription>Enter your NIN number and select slip design</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nin">National Identification Number (NIN)</Label>
                <Input 
                  id="nin" 
                  placeholder="Enter your 11-digit NIN" 
                  value={ninNumber}
                  onChange={(e) => setNinNumber(e.target.value)}
                  maxLength={11}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slip-design">Slip Design</Label>
                <Select value={slipDesign} onValueChange={setSlipDesign}>
                  <SelectTrigger id="slip-design">
                    <SelectValue placeholder="Select slip design" />
                  </SelectTrigger>
                  <SelectContent>
                    {slipOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label} - {option.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                className="w-full mt-2" 
                onClick={handleCheck}
                disabled={loading}
              >
                {loading ? "Checking..." : "Check NIN Status"}
              </Button>
            </CardContent>
          </Card>

          {verificationResult && (
            <Card>
              <CardHeader>
                <CardTitle>Verification Result</CardTitle>
                <CardDescription>
                  NIN verification status
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="flex items-center gap-3 p-3 rounded-md bg-green-50 border border-green-200 text-green-700 mb-4">
                  <CreditCard className="h-5 w-5" />
                  <span>NIN successfully verified</span>
                </div>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">NIN Number</p>
                      <p>•••• ••• {ninNumber.slice(-4)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <p className="text-green-600">Active</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Slip Type</p>
                      <p>{slipOptions.find(opt => opt.value === slipDesign)?.label}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Price</p>
                      <p>{slipOptions.find(opt => opt.value === slipDesign)?.price}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {previewImage && (
            <Card>
              <CardHeader>
                <CardTitle>NIN Slip Preview</CardTitle>
                <CardDescription>
                  {slipOptions.find(opt => opt.value === slipDesign)?.label} Design
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="relative border rounded-md overflow-hidden">
                  <img 
                    src={previewImage} 
                    alt="NIN Slip Preview" 
                    className="max-w-full h-auto"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                    <Eye className="h-8 w-8 text-primary" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setPreviewImage(null)}>Cancel</Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print Slip
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="samples" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sample NIN Slips</CardTitle>
              <CardDescription>
                Examples of different NIN slip formats
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Digital NIN Slip (Green Background)</h3>
                <div className="border rounded-md overflow-hidden">
                  <img 
                    src={sampleSlipImages[0]} 
                    alt="Digital NIN Slip"
                    className="w-full h-auto" 
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  The Digital NIN Slip features a green background with the Nigerian coat of arms watermark. It includes personal details and a QR code.
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">National Identity Management System Slip</h3>
                <div className="border rounded-md overflow-hidden">
                  <img 
                    src={sampleSlipImages[1]} 
                    alt="NIMS Slip" 
                    className="w-full h-auto"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  This tabular format includes a tracking ID, personal information, and contact details for the National Identity Management Commission.
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Premium NIN Card Format</h3>
                <div className="border rounded-md overflow-hidden">
                  <img 
                    src={sampleSlipImages[2]} 
                    alt="Premium NIN Card" 
                    className="w-full h-auto"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  This premium design features a transparent Nigeria coat of arms background with clearly structured personal information.
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => toast({
                  title: "Information",
                  description: "These are sample formats. Your actual NIN slip may vary."
                })}
              >
                See More Information
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NINStatus;
