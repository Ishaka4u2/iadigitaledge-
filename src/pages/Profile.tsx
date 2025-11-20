
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, LogOut, CreditCard, Lock, Edit3, Settings, Plus } from "lucide-react";
import MainLayout from "@/components/MainLayout";

const Profile = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("iadigital_user") || "{}");
  const [editingPersonalDetails, setEditingPersonalDetails] = useState(false);
  const [personalDetails, setPersonalDetails] = useState({
    fullName: user.fullName || user.username || "",
    email: user.email || "",
    phone: user.phone || "",
    address: user.address || "",
    dateOfBirth: user.dateOfBirth || "",
    gender: user.gender || ""
  });
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handlePaymentMethods = () => {
    navigate("/payment-methods");
  };

  const handleSavePersonalDetails = () => {
    // Save personal details logic
    const updatedUser = { ...user, ...personalDetails };
    localStorage.setItem("iadigital_user", JSON.stringify(updatedUser));
    setEditingPersonalDetails(false);
  };
  
  return (
    <MainLayout>
      <div className="py-6 space-y-6 px-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your account details</p>
        </div>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Personal Details</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingPersonalDetails(!editingPersonalDetails)}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              {editingPersonalDetails ? "Cancel" : "Edit"}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 text-primary rounded-full w-16 h-16 flex items-center justify-center">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-medium text-lg">{personalDetails.fullName || "User"}</h3>
                <p className="text-muted-foreground text-sm">Member since April 2025</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="space-y-1">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={personalDetails.fullName}
                  onChange={(e) => setPersonalDetails({...personalDetails, fullName: e.target.value})}
                  readOnly={!editingPersonalDetails}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={personalDetails.email}
                  onChange={(e) => setPersonalDetails({...personalDetails, email: e.target.value})}
                  readOnly={!editingPersonalDetails}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={personalDetails.phone}
                  onChange={(e) => setPersonalDetails({...personalDetails, phone: e.target.value})}
                  readOnly={!editingPersonalDetails}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={personalDetails.dateOfBirth}
                  onChange={(e) => setPersonalDetails({...personalDetails, dateOfBirth: e.target.value})}
                  readOnly={!editingPersonalDetails}
                />
              </div>
              
              <div className="space-y-1 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={personalDetails.address}
                  onChange={(e) => setPersonalDetails({...personalDetails, address: e.target.value})}
                  readOnly={!editingPersonalDetails}
                  placeholder="Enter your address"
                />
              </div>
            </div>
            
            {editingPersonalDetails && (
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setEditingPersonalDetails(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSavePersonalDetails}>
                  Save Changes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Manage your payment methods for funding your wallet
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 text-blue-600 rounded p-2">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Bank Transfer</p>
                    <p className="text-sm text-muted-foreground">Add funds via bank transfer</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Setup
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 text-green-600 rounded p-2">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Card Payment</p>
                    <p className="text-sm text-muted-foreground">Pay with debit/credit card</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Add Card
                </Button>
              </div>
            </div>
            
            <Button onClick={handlePaymentMethods} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Manage Payment Methods
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="h-5 w-5 mr-2" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 text-primary rounded p-2">
                    <Lock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Security Questions</p>
                    <p className="text-sm text-muted-foreground">Setup recovery questions for PIN reset</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/setup-security")}
                >
                  Setup
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 text-primary rounded p-2">
                    <Settings className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Reset PIN</p>
                    <p className="text-sm text-muted-foreground">Forgot your transaction PIN?</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/reset-pin")}
                >
                  Reset
                </Button>
              </div>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                <strong>Important:</strong> Setup security questions to easily recover your PIN. Your PIN is required for all transactions.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Button 
          variant="destructive" 
          className="w-full" 
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </MainLayout>
  );
};

export default Profile;
