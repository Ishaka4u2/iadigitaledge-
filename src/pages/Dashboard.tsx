import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import ServiceCard from "@/components/ServiceCard";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { playSuccessSound } from "@/utils/soundUtils";
import { Button } from "@/components/ui/button";
import { Smartphone, Tv, CreditCard, FileText, ArrowRightLeft, Wallet, Gift, IdCard, Lock, CreditCardIcon, Phone, Award, Banknote, MoreHorizontal, Key, Home, Eye, EyeOff, Send, Plus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import MainLayout from "@/components/MainLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NotificationSheet from "@/components/NotificationSheet";
import logoApp from "@/assets/logo-app.png";
import { useWallet } from "@/contexts/WalletContext";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy } from "lucide-react";

const Dashboard = () => {
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const { formatBalance, addFunds } = useWallet();
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [fundAmount, setFundAmount] = useState("");
  const [openFundDialog, setOpenFundDialog] = useState(false);
  const isMobile = useIsMobile();
  const user = JSON.parse(localStorage.getItem("iadigital_user") || "{}");
  const mainServices = [{
    icon: Smartphone,
    title: "Buy Data",
    path: "/buy-data"
  }, {
    icon: Phone,
    title: "Buy Airtime",
    path: "/buy-airtime"
  }, {
    icon: Send,
    title: "Transfer",
    path: "/transfer"
  }, {
    icon: Tv,
    title: "Cable TV",
    path: "/cable-tv"
  }, {
    icon: ArrowRightLeft,
    title: "Airtime to Cash",
    path: "/airtime-to-cash"
  }, {
    icon: MoreHorizontal,
    title: "More",
    action: () => setShowMoreOptions(!showMoreOptions)
  }];
  const moreServices = [{
    icon: Gift,
    title: "Gift Cards",
    path: "/gift-cards"
  }, {
    icon: Award,
    title: "Exam PINs",
    path: "/exam-pins"
  }, {
    icon: IdCard,
    title: "NIN Status",
    path: "/nin-status"
  }, {
    icon: Phone,
    title: "Customer Care",
    path: "/customer-care"
  }];
  const handleServiceClick = service => {
    if (service.action) {
      service.action();
      return;
    }
    const path = service.path;
    if (path === "/profile" || path === "/payment-methods" || path === "/api-keys") {
      navigate(path);
      return;
    }
    if (path !== "/nin-status" && path !== "/buy-data" && path !== "/buy-airtime" && path !== "/cable-tv" && path !== "/airtime-to-cash" && path !== "/transfer" && path !== "/customer-care") {
      toast({
        title: "Coming Soon",
        description: "This feature will be available in the next update"
      });
    }
    navigate(path);
  };
  const handleFundWallet = () => {
    setOpenFundDialog(true);
  };

  const handleAddFunds = () => {
    const amount = parseFloat(fundAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    addFunds(amount);
    playSuccessSound();
    setFundAmount("");
    setOpenFundDialog(false);
  };
  return (
    <MainLayout>
      <div className="py-6 space-y-6 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
        {/* Header with Logo and User Profile */}
        <div className="flex items-center justify-between mb-6">
          <img 
            src={logoApp} 
            alt="IA Digital Edge Logo" 
            className="w-[120px] h-[40px] object-contain cursor-pointer"
            onClick={() => navigate("/")}
          />
          <div className="flex items-center gap-3">
            <NotificationSheet />
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleServiceClick({ path: "/customer-care" })}
            >
              <Phone className="h-4 w-4" />
            </Button>
            <Avatar className="h-10 w-10 cursor-pointer" onClick={() => navigate("/profile")}>
              <AvatarImage src={user.profilePicture} alt={user.email || "User"} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {(user.email || "U").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Wallet Balance */}
        <div>
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Wallet Balance</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-2xl font-bold">
                      {showBalance ? formatBalance() : "••••••"}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowBalance(!showBalance)}
                      className="text-primary-foreground hover:bg-white/20 p-1 h-auto"
                    >
                      {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Dialog open={openFundDialog} onOpenChange={setOpenFundDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={handleFundWallet}
                      variant="secondary"
                      size="sm"
                      className="bg-white/20 text-primary-foreground hover:bg-white/30"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Fund Wallet
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Fund Wallet</DialogTitle>
                      <DialogDescription>
                        Choose your preferred funding method
                      </DialogDescription>
                    </DialogHeader>
                    <Tabs defaultValue="bank" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
                        <TabsTrigger value="transfer">Transfer</TabsTrigger>
                        <TabsTrigger value="test">Test Fund</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="bank" className="space-y-4 py-4">
                        <div className="space-y-3">
                          <div className="p-4 bg-muted rounded-lg space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Bank Name</span>
                              <span className="font-medium">GTBank</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Account Number</span>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">0123456789</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => {
                                    navigator.clipboard.writeText("0123456789");
                                    toast({ title: "Copied!", description: "Account number copied to clipboard" });
                                  }}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Account Name</span>
                              <span className="font-medium">IA Digital Edge</span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Transfer to the account above and your wallet will be credited automatically within 5 minutes.
                          </p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="transfer" className="space-y-4 py-4">
                        <div className="space-y-3">
                          <div className="p-4 bg-muted rounded-lg space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Payment Method</span>
                              <span className="font-medium">Paystack</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Reference ID</span>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-xs">PAY-{user.email?.substring(0, 8).toUpperCase()}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => {
                                    const ref = `PAY-${user.email?.substring(0, 8).toUpperCase()}`;
                                    navigator.clipboard.writeText(ref);
                                    toast({ title: "Copied!", description: "Reference ID copied to clipboard" });
                                  }}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Use online transfer with the reference ID above. Funds will reflect immediately after confirmation.
                          </p>
                          <Button className="w-full" variant="outline">
                            Proceed to Payment
                          </Button>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="test" className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="amount">Amount (₦)</Label>
                          <Input
                            id="amount"
                            type="number"
                            placeholder="Enter amount"
                            value={fundAmount}
                            onChange={(e) => setFundAmount(e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setFundAmount("1000")}
                          >
                            ₦1,000
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setFundAmount("5000")}
                          >
                            ₦5,000
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setFundAmount("10000")}
                          >
                            ₦10,000
                          </Button>
                        </div>
                        <Button onClick={handleAddFunds} className="w-full">Add Funds</Button>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Services */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Services</h3>
          <div className="grid grid-cols-3 gap-4">
            {mainServices.map((service, index) => (
              <ServiceCard
                key={index}
                icon={service.icon}
                title={service.title}
                onClick={() => handleServiceClick(service)}
              />
            ))}
          </div>
        </div>

        {/* More Services - Show when toggled */}
        {showMoreOptions && (
          <div>
            <h3 className="text-lg font-semibold mb-4">More Services</h3>
            <div className="grid grid-cols-2 gap-4">
              {moreServices.map((service, index) => (
                <ServiceCard
                  key={index}
                  icon={service.icon}
                  title={service.title}
                  onClick={() => handleServiceClick(service)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
export default Dashboard;