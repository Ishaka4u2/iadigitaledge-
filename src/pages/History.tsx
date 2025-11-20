import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, XCircle, CreditCard, ArrowUpRight, Search } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import MainLayout from "@/components/MainLayout";

const History = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  
  // Demo history data for different services
  const historyItems = [
    {
      id: "h1",
      title: "MTN Airtime - 08012345678",
      amount: "₦500",
      date: "Apr 5, 2025",
      status: "success",
      type: "airtime",
    },
    {
      id: "h2",
      title: "Airtel Data - 1GB - 09087654321",
      amount: "₦300",
      date: "Apr 3, 2025",
      status: "success",
      type: "data",
    },
    {
      id: "h3",
      title: "DSTV Premium - 12345678901",
      amount: "₦21,000",
      date: "Mar 28, 2025",
      status: "success",
      type: "cable",
    },
    {
      id: "h4",
      title: "WAEC Result Checker",
      amount: "₦2,500",
      date: "Mar 20, 2025",
      status: "success",
      type: "exam",
    },
    {
      id: "h5",
      title: "Amazon Gift Card - $50",
      amount: "₦62,500",
      date: "Mar 15, 2025",
      status: "failed",
      type: "giftcard",
    },
    {
      id: "h6",
      title: "MTN Airtime to Cash",
      amount: "₦2,800",
      date: "Mar 10, 2025",
      status: "success",
      type: "airtime2cash",
    },
    {
      id: "h7",
      title: "JAMB Registration PIN",
      amount: "₦4,700",
      date: "Mar 5, 2025",
      status: "success",
      type: "exam",
    },
    {
      id: "h8",
      title: "GLO Data - 5GB - 08076543210",
      amount: "₦1,000",
      date: "Mar 1, 2025",
      status: "failed",
      type: "data",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <CreditCard className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    return <ArrowUpRight className="h-5 w-5 text-red-500" />;
  };

  // Filter history items based on search term and filter type
  const filteredHistory = historyItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <MainLayout>
      <div className="py-6 space-y-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Purchase History</h1>
          <p className="text-muted-foreground">View your past transactions and services</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search history..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="w-1/3">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="airtime">Airtime</SelectItem>
                  <SelectItem value="data">Data</SelectItem>
                  <SelectItem value="cable">Cable TV</SelectItem>
                  <SelectItem value="exam">Exam PINs</SelectItem>
                  <SelectItem value="giftcard">Gift Cards</SelectItem>
                  <SelectItem value="airtime2cash">Airtime to Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-3">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((item) => (
                <Card key={item.id} className="hover:bg-muted/20 transition-colors cursor-pointer">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-primary/10 text-primary rounded-full w-10 h-10 flex items-center justify-center mr-3">
                        {getStatusIcon(item.status)}
                      </div>
                      <div>
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-xs text-muted-foreground">{item.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <p className="font-medium mr-2 text-red-600">
                        -{item.amount}
                      </p>
                      {getTypeIcon(item.type)}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <p>No history items found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default History;
