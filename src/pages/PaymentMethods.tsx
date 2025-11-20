
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { CreditCard, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, "Card number must be 16 digits"),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry date must be in MM/YY format"),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
  cardHolderName: z.string().min(3, "Cardholder name is required"),
});

type FormValues = z.infer<typeof formSchema>;

const PaymentMethods = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showAddCard, setShowAddCard] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardHolderName: "",
    }
  });

  const onSubmit = (data: FormValues) => {
    // For demo purposes, we'll just add a masked card to the list
    const maskedCard = `**** **** **** ${data.cardNumber.slice(-4)}`;
    setPaymentMethods([...paymentMethods, maskedCard]);
    setShowAddCard(false);
    
    toast({
      title: "Card Added",
      description: "Your payment method has been successfully added"
    });
    
    form.reset();
  };

  const formatCardNumber = (value: string) => {
    return value.replace(/\D/g, "").substring(0, 16);
  };

  const formatExpiryDate = (value: string) => {
    value = value.replace(/\D/g, "");
    if (value.length > 2) {
      return `${value.substring(0, 2)}/${value.substring(2, 4)}`;
    }
    return value;
  };

  return (
    <div className="py-6 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Payment & Shipping</h1>
        <Button 
          onClick={() => navigate("/dashboard")} 
          variant="outline"
        >
          Back to Dashboard
        </Button>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Payment Methods</h2>
        
        {paymentMethods.length > 0 ? (
          <div className="space-y-3">
            {paymentMethods.map((card, index) => (
              <Card key={index}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <span>{card}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              <p>No payment methods added yet</p>
            </CardContent>
          </Card>
        )}
        
        {!showAddCard ? (
          <Button 
            className="w-full" 
            onClick={() => setShowAddCard(true)}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Payment Method
          </Button>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Add New Card</CardTitle>
              <CardDescription>Enter your card details</CardDescription>
            </CardHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="cardHolderName"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="cardHolderName">Cardholder Name</Label>
                        <FormControl>
                          <Input 
                            id="cardHolderName"
                            placeholder="John Doe" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <FormControl>
                          <Input 
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456" 
                            value={field.value}
                            onChange={(e) => field.onChange(formatCardNumber(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="expiryDate"
                      render={({ field }) => (
                        <FormItem>
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <FormControl>
                            <Input 
                              id="expiryDate"
                              placeholder="MM/YY" 
                              value={field.value}
                              onChange={(e) => field.onChange(formatExpiryDate(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="cvv"
                      render={({ field }) => (
                        <FormItem>
                          <Label htmlFor="cvv">CVV</Label>
                          <FormControl>
                            <Input 
                              id="cvv"
                              placeholder="123" 
                              type="password"
                              maxLength={4}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAddCard(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Add Card</Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        )}
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Fund Wallet</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Label htmlFor="amount">Amount</Label>
              <Input 
                id="amount" 
                placeholder="Enter amount" 
                type="number" 
              />
              <Button className="w-full">Fund Wallet</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentMethods;
