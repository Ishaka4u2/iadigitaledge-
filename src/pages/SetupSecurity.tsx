import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SetupSecurity = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [question1, setQuestion1] = useState("");
  const [answer1, setAnswer1] = useState("");
  const [question2, setQuestion2] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const securityQuestions = [
    { value: "pet", label: "What is your pet's name?" },
    { value: "city", label: "What city were you born in?" },
    { value: "school", label: "What is your mother's maiden name?" },
    { value: "food", label: "What is your favorite food?" },
    { value: "color", label: "What is your favorite color?" },
  ];

  // Get existing security answers if any
  const existingAnswers = JSON.parse(localStorage.getItem("iadigital_security") || "{}");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question1 || !answer1 || !question2 || !answer2) {
      toast({
        title: "Error",
        description: "Please complete all security questions",
        variant: "destructive",
      });
      return;
    }

    if (question1 === question2) {
      toast({
        title: "Error",
        description: "Please select different security questions",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Save security questions and answers
    setTimeout(() => {
      const securityData = {
        [question1]: answer1.toLowerCase().trim(),
        [question2]: answer2.toLowerCase().trim(),
      };
      
      localStorage.setItem("iadigital_security", JSON.stringify(securityData));
      
      setIsLoading(false);
      toast({
        title: "Success",
        description: "Security questions saved successfully",
      });
      
      navigate("/profile");
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
        <h1 className="text-2xl font-bold">Setup Security Questions</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <CardTitle>Secure Your Account</CardTitle>
          </div>
          <CardDescription>
            Set up security questions to help recover your PIN if you forget it
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Security Question 1</Label>
                <Select value={question1} onValueChange={setQuestion1}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a question" />
                  </SelectTrigger>
                  <SelectContent>
                    {securityQuestions
                      .filter(q => q.value !== question2)
                      .map((q) => (
                        <SelectItem key={q.value} value={q.value}>
                          {q.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="answer1">Your Answer</Label>
                <Input
                  id="answer1"
                  type="text"
                  placeholder="Enter your answer"
                  value={answer1}
                  onChange={(e) => setAnswer1(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Security Question 2</Label>
                <Select value={question2} onValueChange={setQuestion2}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a different question" />
                  </SelectTrigger>
                  <SelectContent>
                    {securityQuestions
                      .filter(q => q.value !== question1)
                      .map((q) => (
                        <SelectItem key={q.value} value={q.value}>
                          {q.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="answer2">Your Answer</Label>
                <Input
                  id="answer2"
                  type="text"
                  placeholder="Enter your answer"
                  value={answer2}
                  onChange={(e) => setAnswer2(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Important:</strong> Remember your answers! They will be used to verify your identity when resetting your PIN.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Security Questions"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SetupSecurity;
