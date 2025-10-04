import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Users as UsersIcon } from "lucide-react";
import BottomNav from "@/components/BottomNav";

interface Customer {
  id: string;
  name: string;
  phone: string;
  notes: string;
  balance: number;
  userId: string;
}

const Customers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = () => {
    const authData = JSON.parse(localStorage.getItem("cl_auth") || "{}");
    const allCustomers = JSON.parse(localStorage.getItem("cl_customers") || "[]");
    const userCustomers = allCustomers.filter((c: Customer) => c.userId === authData.userId);
    setCustomers(userCustomers);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-card border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-foreground">Customers</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6">
        {customers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <UsersIcon className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground mb-6">
              No customers yet. Tap the + button to add your first one!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {customers.map((customer) => (
              <Card
                key={customer.id}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow card-shadow"
                onClick={() => navigate(`/customer/${customer.id}`)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {customer.name}
                    </h3>
                    <p className={`text-sm font-medium ${
                      customer.balance > 0 
                        ? "text-foreground" 
                        : customer.balance < 0 
                        ? "text-success" 
                        : "text-muted-foreground"
                    }`}>
                      Balance: {formatCurrency(customer.balance)}
                    </p>
                  </div>
                  <div className="text-right">
                    {customer.balance > 0 && (
                      <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded">
                        Owes
                      </span>
                    )}
                    {customer.balance < 0 && (
                      <span className="text-xs bg-success/10 text-success px-2 py-1 rounded">
                        Credit
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Button
        className="fixed bottom-24 right-6 h-14 w-14 rounded-full shadow-lg bg-accent hover:bg-accent/90"
        onClick={() => navigate("/add-customer")}
      >
        <Plus className="h-6 w-6" />
      </Button>

      <BottomNav />
    </div>
  );
};

export default Customers;
