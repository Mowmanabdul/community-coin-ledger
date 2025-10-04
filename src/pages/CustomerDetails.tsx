import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, Minus, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

interface Transaction {
  id: string;
  customerId: string;
  type: "debt" | "repayment";
  amount: number;
  description: string;
  date: string;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  notes: string;
  balance: number;
}

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    loadCustomerData();
  }, [id]);

  const loadCustomerData = () => {
    const customers = JSON.parse(localStorage.getItem("cl_customers") || "[]");
    const foundCustomer = customers.find((c: Customer) => c.id === id);
    
    if (foundCustomer) {
      setCustomer(foundCustomer);
    }

    const allTransactions = JSON.parse(localStorage.getItem("cl_transactions") || "[]");
    const customerTransactions = allTransactions
      .filter((t: Transaction) => t.customerId === id)
      .sort((a: Transaction, b: Transaction) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    
    setTransactions(customerTransactions);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleSendReminder = () => {
    if (!customer) return;

    if (!customer.phone) {
      toast.error("No phone number saved for this customer");
      return;
    }

    if (customer.balance <= 0) {
      toast.error("Customer has no outstanding balance");
      return;
    }

    const authData = JSON.parse(localStorage.getItem("cl_auth") || "{}");
    const message = `Hi ${customer.name}, this is a friendly reminder from ${authData.name} about your outstanding balance of ${formatCurrency(customer.balance)}. Thank you!`;
    
    const smsUrl = `sms:${customer.phone}?body=${encodeURIComponent(message)}`;
    window.location.href = smsUrl;
  };

  if (!customer) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Customer not found</p>
          <Button onClick={() => navigate("/customers")}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-card border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/customers")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{customer.name}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">
        <Card className="p-6 text-center card-shadow-lg">
          <p className="text-sm text-muted-foreground mb-2">Current Balance</p>
          <p className={`text-4xl font-bold ${
            customer.balance > 0 
              ? "text-destructive" 
              : customer.balance < 0 
              ? "text-success" 
              : "text-muted-foreground"
          }`}>
            {formatCurrency(customer.balance)}
          </p>
        </Card>

        <div className="grid grid-cols-3 gap-3">
          <Button
            className="h-16 flex flex-col gap-1"
            variant="outline"
            onClick={() => navigate(`/customer/${id}/add-transaction/debt`)}
          >
            <Plus className="h-5 w-5" />
            <span className="text-xs">Add Debt</span>
          </Button>
          <Button
            className="h-16 flex flex-col gap-1"
            variant="outline"
            onClick={() => navigate(`/customer/${id}/add-transaction/repayment`)}
          >
            <Minus className="h-5 w-5" />
            <span className="text-xs">Add Payment</span>
          </Button>
          <Button
            className="h-16 flex flex-col gap-1"
            variant="outline"
            onClick={handleSendReminder}
            disabled={!customer.phone || customer.balance <= 0}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs">Remind</span>
          </Button>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Transaction History</h2>
          {transactions.length === 0 ? (
            <Card className="p-8 text-center card-shadow">
              <p className="text-muted-foreground">No transactions yet</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <Card key={transaction.id} className="p-4 card-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">
                        {formatDate(transaction.date)}
                      </p>
                      {transaction.description && (
                        <p className="text-sm text-foreground mb-2">
                          {transaction.description}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-semibold ${
                        transaction.type === "debt" 
                          ? "text-destructive" 
                          : "text-success"
                      }`}>
                        {transaction.type === "debt" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.type === "debt" ? "Debt" : "Payment"}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default CustomerDetails;
