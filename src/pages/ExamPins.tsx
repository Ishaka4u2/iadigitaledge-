
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
import waecLogo from "@/assets/waec-logo.png";
import necoLogo from "@/assets/neco-logo.png";
import nabtebLogo from "@/assets/nabteb-logo.png";

const ExamPins = () => {
  const [examBoard, setExamBoard] = useState("waec");
  const [quantity, setQuantity] = useState("1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const examBoards = [
    { id: "waec", name: "WAEC", logo: waecLogo, price: "₦2,500" },
    { id: "neco", name: "NECO", logo: necoLogo, price: "₦800" },
    { id: "nabteb", name: "NABTEB", logo: nabtebLogo, price: "₦800" },
  ];

  const quantities = ["1", "2", "3", "4", "5"];

  const calculateTotal = () => {
    const board = examBoards.find(b => b.id === examBoard);
    const price = parseInt(board?.price.replace(/[₦,]/g, '') || "0");
    const qty = parseInt(quantity);
    return `₦${(price * qty).toLocaleString()}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!phoneNumber || !quantity || !examBoard) {
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
        description: "Exam pins purchased successfully!",
      });
      
      // Navigate to transaction preview page with transaction data
      const selectedBoard = examBoards.find(b => b.id === examBoard);
      navigate("/transaction-preview", {
        state: {
          transactionData: {
            receiptData: {
              type: "Exam Pins Purchase",
              transactionId: `TXN${Date.now()}`,
              phoneNumber,
              examBoard: selectedBoard?.name,
              quantity,
              unitPrice: selectedBoard?.price,
              amount: calculateTotal(),
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
        <h1 className="text-2xl font-bold">Buy Exam Pins</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Purchase Examination Pins</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Exam Board</Label>
              <div className="grid grid-cols-3 gap-2">
                {examBoards.map((board) => (
                  <Button
                    key={board.id}
                    type="button"
                    variant={examBoard === board.id ? "default" : "outline"}
                    onClick={() => setExamBoard(board.id)}
                    className="h-24 flex flex-col items-center justify-center gap-2"
                  >
                    <img 
                      src={board.logo} 
                      alt={board.name}
                      className="h-12 w-auto object-contain"
                    />
                    <span className="text-xs">{board.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Price per Pin</Label>
              <div className="p-3 bg-muted rounded-md">
                <p className="text-lg font-semibold">
                  {examBoards.find(b => b.id === examBoard)?.price}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Select Quantity</Label>
              <RadioGroup value={quantity} onValueChange={setQuantity}>
                <div className="grid grid-cols-5 gap-2">
                  {quantities.map((qty) => (
                    <div key={qty} className="relative">
                      <RadioGroupItem 
                        value={qty} 
                        id={qty} 
                        className="peer sr-only"
                      />
                      <Label 
                        htmlFor={qty} 
                        className="flex items-center justify-center p-4 border rounded-md cursor-pointer hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground"
                      >
                        {qty}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Total Amount</Label>
              <div className="p-3 bg-muted rounded-md">
                <p className="text-xl font-bold text-primary">
                  {calculateTotal()}
                </p>
              </div>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button className="w-full" disabled={isLoading}>
              {isLoading ? "Processing..." : "Purchase Exam Pins"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ExamPins;
