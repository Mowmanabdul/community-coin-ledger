import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import BottomNav from "@/components/BottomNav";

interface Customer {
  id: string;
  name: string;
  balance: number;
  userId: string;
}

const Dashboard = () => {
  const [totalOwed, setTotalOwed] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [topCustomers, setTopCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const authData = JSON.parse(localStorage.getItem("cl_auth") || "{}");
    const customers: Customer[] = JSON.parse(localStorage.getItem("cl_customers") || "[]");
    const userCustomers = customers.filter((c) => c.userId === authData.userId);

    let owed = 0;
    let credit = 0;

    userCustomers.forEach((customer) => {
      if (customer.balance > 0) {
        owed += customer.balance;
      } else if (customer.balance < 0) {
        credit += Math.abs(customer.balance);
      }
    });

    setTotalOwed(owed);
    setTotalCredit(credit);

    const top5 = userCustomers
      .filter((c) => c.balance > 0)
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 5);
    
    setTopCustomers(top5);
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
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-6 card-shadow-lg">
            <div className="flex items-start justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Owed to You</p>
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-primary">
              {formatCurrency(totalOwed)}
            </p>
          </Card>

          <Card className="p-6 card-shadow-lg">
            <div className="flex items-start justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Business Credit</p>
              <TrendingDown className="h-5 w-5 text-success" />
            </div>
            <p className="text-3xl font-bold text-success">
              {formatCurrency(totalCredit)}
            </p>
          </Card>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Top 5 Customers by Debt
          </h2>
          {topCustomers.length === 0 ? (
            <Card className="p-8 text-center card-shadow">
              <p className="text-muted-foreground">No customers with debt yet</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {topCustomers.map((customer, index) => (
                <Card key={customer.id} className="p-4 card-shadow">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">
                          {index + 1}
                        </span>
                      </div>
                      <p className="font-medium text-foreground">{customer.name}</p>
                    </div>
                    <p className="text-lg font-semibold text-destructive">
                      {formatCurrency(customer.balance)}
                    </p>
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

export default Dashboard;
