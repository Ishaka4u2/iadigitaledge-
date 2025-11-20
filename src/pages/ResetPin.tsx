import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ShieldQuestion, Mail } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const ResetPin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Security Questions state
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  
  // Email verification state
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  
  // New PIN state
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const securityQuestions = [
    { value: "pet", label: "What is your pet's name?" },
    { value: "city", label: "What city were you born in?" },
    { value: "school", label: "What is your mother's maiden name?" },
    { value: "food", label: "What is your favorite food?" },
    { value: "color", label: "What is your favorite color?" },
  ];

  const handleSecurityQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedQuestion || !securityAnswer) {
      toast({
        title: "Error",
        description: "Please select a question and provide an answer",
        variant: "destructive",
      });
      return;
    }

    // Get stored security answers
    const storedAnswers = JSON.parse(localStorage.getItem("iadigital_security") || "{}");
    const storedAnswer = storedAnswers[selectedQuestion]?.toLowerCase();
    
    if (storedAnswer !== securityAnswer.toLowerCase().trim()) {
      toast({
        title: "Error",
        description: "Incorrect answer. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsVerified(true);
    toast({
      title: "Verified",
      description: "Please set your new PIN",
    });
  };

  const handleEmailVerification = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate sending verification code
    setTimeout(() => {
      setIsLoading(false);
      setIsCodeSent(true);
      toast({
        title: "Code Sent",
        description: `Verification code sent to ${email}`,
      });
    }, 1500);
  };

  const handleCodeVerification = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verificationCode.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter the 6-digit verification code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate code verification (in production, verify with backend)
    setTimeout(() => {
      setIsLoading(false);
      setIsVerified(true);
      toast({
        title: "Verified",
        description: "Email verified successfully. Please set your new PIN",
      });
    }, 1000);
  };

  const handleResetPin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPin.length !== 4 || confirmPin.length !== 4) {
      toast({
        title: "Error",
        description: "PIN must be 4 digits",
        variant: "destructive",
      });
      return;
    }

    if (newPin !== confirmPin) {
      toast({
        title: "Error",
        description: "PINs do not match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Save new PIN
    setTimeout(() => {
      localStorage.setItem("iadigital_pin", newPin);
      setIsLoading(false);
      toast({
        title: "Success",
        description: "Your PIN has been reset successfully",
      });
      
      // Navigate back
      navigate(-1);
    }, 1000);
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
        <h1 className="text-2xl font-bold">Reset PIN</h1>
      </div>

      {!isVerified ? (
        <Tabs defaultValue="security" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="security">
              <ShieldQuestion className="h-4 w-4 mr-2" />
              Security Question
            </TabsTrigger>
            <TabsTrigger value="email">
              <Mail className="h-4 w-4 mr-2" />
              Email Verification
            </TabsTrigger>
          </TabsList>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Answer Security Question</CardTitle>
                <CardDescription>
                  Answer your security question to reset your PIN
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSecurityQuestionSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Security Question</Label>
                    <Select value={selectedQuestion} onValueChange={setSelectedQuestion}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a question" />
                      </SelectTrigger>
                      <SelectContent>
                        {securityQuestions.map((q) => (
                          <SelectItem key={q.value} value={q.value}>
                            {q.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="answer">Your Answer</Label>
                    <Input
                      id="answer"
                      type="text"
                      placeholder="Enter your answer"
                      value={securityAnswer}
                      onChange={(e) => setSecurityAnswer(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">
                    Verify Answer
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>Email Verification</CardTitle>
                <CardDescription>
                  We'll send a verification code to your email
                </CardDescription>
              </CardHeader>
              {!isCodeSent ? (
                <form onSubmit={handleEmailVerification}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Sending..." : "Send Verification Code"}
                    </Button>
                  </CardFooter>
                </form>
              ) : (
                <form onSubmit={handleCodeVerification}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Enter Verification Code</Label>
                      <p className="text-sm text-muted-foreground mb-4">
                        Enter the 6-digit code sent to {email}
                      </p>
                      <Input
                        type="text"
                        placeholder="000000"
                        maxLength={6}
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                        className="text-center text-lg tracking-widest"
                        required
                      />
                    </div>
                    <Button
                      type="button"
                      variant="link"
                      className="w-full"
                      onClick={() => {
                        setIsCodeSent(false);
                        setVerificationCode("");
                      }}
                    >
                      Didn't receive code? Try again
                    </Button>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Verifying..." : "Verify Code"}
                    </Button>
                  </CardFooter>
                </form>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Set New PIN</CardTitle>
            <CardDescription>
              Enter and confirm your new 4-digit PIN
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleResetPin}>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="space-y-2 w-full">
                  <Label className="text-center block">New PIN</Label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={4}
                      value={newPin}
                      onChange={(value) => setNewPin(value)}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>

                <div className="space-y-2 w-full">
                  <Label className="text-center block">Confirm PIN</Label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={4}
                      value={confirmPin}
                      onChange={(value) => setConfirmPin(value)}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading || newPin.length !== 4 || confirmPin.length !== 4}
              >
                {isLoading ? "Resetting..." : "Reset PIN"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  );
};

export default ResetPin;
