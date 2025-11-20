import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Share2, Download, CheckCircle, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import MainLayout from "@/components/MainLayout";
import { playSuccessSound } from "@/utils/soundUtils";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logoApp from "@/assets/logo-app.png";

interface ReceiptData {
  type: string;
  transactionId: string;
  phoneNumber: string;
  network?: string;
  amount: string;
  plan?: string;
  dataType?: string;
  status: string;
  date: string;
  time: string;
}

const ConfirmReceipt = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const receiptRef = React.useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  
  // Play success sound on component mount
  React.useEffect(() => {
    playSuccessSound();
  }, []);
  
  // Get receipt data from navigation state or use default
  const receiptData: ReceiptData = location.state?.receiptData || {
    type: "Data Purchase",
    transactionId: "TXN123456789",
    phoneNumber: "08123456789",
    network: "MTN",
    amount: "₦1,500",
    plan: "5GB - 30 Days",
    dataType: "SME",
    status: "Successful",
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString()
  };

  const generateReceiptImage = async (): Promise<Blob | null> => {
    if (!receiptRef.current) return null;

    setIsGenerating(true);
    
    // Wait for buttons to hide
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: '#fffbeb',
        scale: 2,
        logging: false,
        useCORS: true,
      });

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          setIsGenerating(false);
          resolve(blob);
        }, 'image/jpeg', 0.95);
      });
    } catch (error) {
      console.error('Error generating image:', error);
      setIsGenerating(false);
      return null;
    }
  };

  const handleShareAsImage = async () => {
    const blob = await generateReceiptImage();
    
    if (!blob) {
      toast({
        title: "Error",
        description: "Failed to generate receipt image",
        variant: "destructive"
      });
      return;
    }

    const file = new File([blob], `receipt-${receiptData.transactionId}.jpg`, { type: 'image/jpeg' });

    if (navigator.share && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: 'Transaction Receipt',
          text: `Transaction Receipt - ${receiptData.transactionId}`,
          files: [file]
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: Download the image
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `IA-Digital-Receipt-${receiptData.transactionId}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Receipt saved",
        description: "Receipt image has been downloaded"
      });
    }
  };

  const handleShare = async () => {
    await handleShareAsImage();
  };

  const handleSaveAsPDF = () => {
    const pdf = new jsPDF();
    
    const img = new Image();
    img.src = logoApp;
    
    img.onload = () => {
      pdf.addImage(img, 'PNG', 40, 10, 130, 50);
      
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text('TRANSACTION RECEIPT', 105, 50, { align: 'center' });
      
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, 55, 190, 55);
      
      pdf.setFillColor(220, 252, 231);
      pdf.roundedRect(40, 60, 130, 15, 3, 3, 'F');
      pdf.setFontSize(14);
      pdf.setTextColor(34, 197, 94);
      pdf.setFont("helvetica", "bold");
      pdf.text('✓ Transaction Successful!', 105, 70, { align: 'center' });
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(13);
      pdf.text('Transaction Details', 20, 90);
      
      pdf.setDrawColor(200, 200, 200);
      pdf.roundedRect(15, 95, 180, 90, 2, 2);
      
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      
      let yPos = 105;
      const lineHeight = 10;
      
      const details = [
        { label: 'Transaction Type:', value: receiptData.type },
        { label: 'Transaction ID:', value: receiptData.transactionId },
        { label: 'Phone Number:', value: receiptData.phoneNumber },
        ...(receiptData.network ? [{ label: 'Network:', value: receiptData.network }] : []),
        ...(receiptData.plan ? [{ label: 'Plan:', value: receiptData.plan }] : []),
        ...(receiptData.dataType ? [{ label: 'Data Type:', value: receiptData.dataType }] : []),
        { label: 'Amount:', value: receiptData.amount },
        { label: 'Status:', value: receiptData.status },
        { label: 'Date:', value: receiptData.date },
        { label: 'Time:', value: receiptData.time }
      ];
      
      details.forEach(detail => {
        pdf.setFont("helvetica", "bold");
        pdf.text(detail.label, 25, yPos);
        pdf.setFont("helvetica", "normal");
        pdf.text(detail.value, 90, yPos);
        yPos += lineHeight;
      });
      
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, 210, 190, 210);
      
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.setFont("helvetica", "italic");
      pdf.text('Thank you for using IA Digital Edge!', 105, 220, { align: 'center' });
      pdf.text('For support, contact: support@iadigitaledge.com', 105, 228, { align: 'center' });
      
      pdf.setFontSize(8);
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, 105, 280, { align: 'center' });
      
      pdf.save(`IA-Digital-Receipt-${receiptData.transactionId}.pdf`);
      
      toast({
        title: "Receipt saved",
        description: "Your transaction receipt has been downloaded as PDF"
      });
    };
    
    img.onerror = () => {
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text('IA DIGITAL EDGE', 105, 30, { align: 'center' });
      
      pdf.setFontSize(16);
      pdf.text('TRANSACTION RECEIPT', 105, 50, { align: 'center' });
      
      pdf.setFontSize(14);
      pdf.setTextColor(34, 197, 94);
      pdf.text('✓ Transaction Successful!', 105, 70, { align: 'center' });
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      
      let yPos = 90;
      const details = [
        `Transaction Type: ${receiptData.type}`,
        `Transaction ID: ${receiptData.transactionId}`,
        `Phone Number: ${receiptData.phoneNumber}`,
        ...(receiptData.network ? [`Network: ${receiptData.network}`] : []),
        ...(receiptData.plan ? [`Plan: ${receiptData.plan}`] : []),
        ...(receiptData.dataType ? [`Data Type: ${receiptData.dataType}`] : []),
        `Amount: ${receiptData.amount}`,
        `Status: ${receiptData.status}`,
        `Date: ${receiptData.date}`,
        `Time: ${receiptData.time}`
      ];
      
      details.forEach(detail => {
        pdf.text(detail, 20, yPos);
        yPos += 8;
      });
      
      pdf.save(`IA-Digital-Receipt-${receiptData.transactionId}.pdf`);
      
      toast({
        title: "Receipt saved",
        description: "Your transaction receipt has been downloaded as PDF"
      });
    };
  };

  const handleSaveAsJPG = async () => {
    const blob = await generateReceiptImage();
    
    if (!blob) {
      toast({
        title: "Error",
        description: "Failed to generate receipt image",
        variant: "destructive"
      });
      return;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IA-Digital-Receipt-${receiptData.transactionId}.jpg`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Receipt saved",
      description: "Receipt image has been downloaded as JPG"
    });
  };

  return (
    <MainLayout>
      <div className="py-6 space-y-6 px-4 bg-amber-50 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/dashboard")}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col items-center flex-1">
            <div className="mb-2">
              <img 
                src={logoApp} 
                alt="IA Digital Edge Logo" 
                className="w-[140px] h-[50px] object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold">Transaction Receipt</h1>
          </div>
          <div className="w-10"></div>
        </div>

        <Card className="max-w-md mx-auto" ref={receiptRef}>
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-3">
              <img 
                src={logoApp} 
                alt="IA Digital Edge Logo" 
                className="w-[170px] h-[65px] object-contain"
                crossOrigin="anonymous"
              />
            </div>
            <div className="flex justify-center mb-2">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-green-600">Transaction Successful!</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="text-center border-b pb-4">
              <h3 className="font-semibold text-lg">{receiptData.type}</h3>
              <p className="text-sm text-muted-foreground">Transaction ID: {receiptData.transactionId}</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone Number:</span>
                <span className="font-medium">{receiptData.phoneNumber}</span>
              </div>

              {receiptData.network && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Network:</span>
                  <span className="font-medium">{receiptData.network}</span>
                </div>
              )}

              {receiptData.plan && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan:</span>
                  <span className="font-medium">{receiptData.plan}</span>
                </div>
              )}

              {receiptData.dataType && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data Type:</span>
                  <span className="font-medium">{receiptData.dataType}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-bold text-lg">{receiptData.amount}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-medium text-green-600">{receiptData.status}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">{receiptData.date}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Time:</span>
                <span className="font-medium">{receiptData.time}</span>
              </div>
            </div>

            {!isGenerating && (
              <>
                <div className="pt-4 border-t">
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      variant="outline" 
                      onClick={handleShare}
                      className="flex items-center gap-2"
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                    <Button 
                      onClick={handleSaveAsJPG}
                      className="flex items-center gap-2"
                      variant="outline"
                    >
                      <ImageIcon className="h-4 w-4" />
                      JPG
                    </Button>
                    <Button 
                      onClick={handleSaveAsPDF}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      PDF
                    </Button>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate("/dashboard")}
                    className="w-full"
                  >
                    Back to Dashboard
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ConfirmReceipt;