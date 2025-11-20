import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, Clock, CreditCard, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import MainLayout from "@/components/MainLayout";

const Transactions = () => {
  // Demo transactions data
  const transactions = [
    {
      id: "tx1",
      title: "Buy Airtime",
      amount: "₦500",
      date: "Today, 2:30 PM",
      status: "completed",
      type: "debit",
      category: "airtime",
    },
    {
      id: "tx2",
      title: "Data Bundle - 1GB",
      amount: "₦300",
      date: "Yesterday, 10:15 AM",
      status: "completed",
      type: "debit",
      category: "data",
    },
    {
      id: "tx3",
      title: "DSTV Subscription",
      amount: "₦7,900",
      date: "Mar 15, 2025",
      status: "failed",
      type: "debit",
      category: "cable",
    },
    {
      id: "tx4",
      title: "Wallet Funding",
      amount: "₦5,000",
      date: "Mar 12, 2025",
      status: "completed",
      type: "credit",
      category: "wallet",
    },
    {
      id: "tx5",
      title: "Airtime to Cash",
      amount: "₦700",
      date: "Mar 10, 2025",
      status: "pending",
      type: "credit",
      category: "airtime2cash",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-amber-500" />;
      default:
        return <CreditCard className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "credit":
        return <ArrowDownLeft className="h-5 w-5 text-green-500" />;
      case "debit":
        return <ArrowUpRight className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const renderTransactionList = (filter: string = "all") => {
    const filteredTransactions = filter === "all" 
      ? transactions 
      : transactions.filter(tx => tx.category === filter || tx.type === filter || tx.status === filter);
    
    return (
      <div className="space-y-3">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((tx) => (
            <Card key={tx.id} className="hover:bg-muted/20 transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-primary/10 text-primary rounded-full w-10 h-10 flex items-center justify-center mr-3">
                    {getStatusIcon(tx.status)}
                  </div>
                  <div>
                    <h3 className="font-medium">{tx.title}</h3>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <p className={cn(
                    "font-medium mr-2",
                    tx.type === "credit" ? "text-green-600" : "text-red-600"
                  )}>
                    {tx.type === "credit" ? "+" : "-"}{tx.amount}
                  </p>
                  {getTypeIcon(tx.type)}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            <p>No transactions found</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="py-6 space-y-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">View and manage your transaction history</p>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="credit">Credit</TabsTrigger>
            <TabsTrigger value="debit">Debit</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {renderTransactionList("all")}
          </TabsContent>
          
          <TabsContent value="credit">
            {renderTransactionList("credit")}
          </TabsContent>
          
          <TabsContent value="debit">
            {renderTransactionList("debit")}
          </TabsContent>
          
          <TabsContent value="pending">
            {renderTransactionList("pending")}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Transactions;
