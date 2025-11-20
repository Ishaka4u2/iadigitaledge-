
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, Copy, RefreshCw, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const APIKeys = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState(localStorage.getItem("iadigital_api_key") || "");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generateApiKey = () => {
    setIsGenerating(true);
    
    // Simulate API Key generation (in a real app, this would be a backend call)
    setTimeout(() => {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const prefix = 'IA_';
      let result = prefix;
      
      for (let i = 0; i < 32; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      
      setApiKey(result);
      localStorage.setItem("iadigital_api_key", result);
      setIsGenerating(false);
      setShowApiKey(true);
      
      toast({
        title: "API Key Generated",
        description: "Your new API key has been generated successfully."
      });
    }, 1000);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    toast({
      title: "Copied to Clipboard",
      description: "API key copied to clipboard"
    });
  };
  
  const toggleShowApiKey = () => {
    setShowApiKey(!showApiKey);
  };
  
  return (
    <div className="container py-6 px-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">API Keys</h1>
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Your API Key
          </CardTitle>
          <CardDescription>
            Use this API key to access our services programmatically.
            Keep your API key secure and don't share it publicly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="api-key"
                    value={apiKey ? (showApiKey ? apiKey : '•'.repeat(Math.min(30, apiKey.length))) : ''}
                    readOnly
                    className="pr-10 font-mono text-sm"
                    placeholder="No API key generated yet"
                  />
                  {apiKey && (
                    <button
                      type="button"
                      onClick={toggleShowApiKey}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  )}
                </div>
                {apiKey && (
                  <Button variant="outline" size="icon" onClick={copyToClipboard} title="Copy to clipboard">
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            <div className="pt-2">
              <Button 
                onClick={generateApiKey} 
                className="w-full sm:w-auto" 
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : apiKey ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Regenerate API Key
                  </>
                ) : (
                  <>
                    <Key className="mr-2 h-4 w-4" />
                    Generate API Key
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start text-sm bg-muted/50 text-muted-foreground rounded-b-lg">
          <p className="pb-2">
            <span className="font-semibold">Security notice:</span> If you think your API key has been compromised, regenerate it immediately.
          </p>
          <p>
            API requests are limited to 1000 per day in the standard plan.
          </p>
        </CardFooter>
      </Card>
      
      <Card className="mt-6 shadow-md">
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
          <CardDescription>
            Learn how to use our API to integrate with your applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Visit our API documentation portal to learn more about available endpoints,
            request formats, and response structures.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline">
            View Documentation
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default APIKeys;
