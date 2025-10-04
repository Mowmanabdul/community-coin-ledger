import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const AddTransaction = () => {
  const { id, type } = useParams<{ id: string; type: "debt" | "repayment" }>();
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      toast.error("Please enter a valid amount");
      setIsLoading(false);
      return;
    }

    const transactions = JSON.parse(localStorage.getItem("cl_transactions") || "[]");
    const customers = JSON.parse(localStorage.getItem("cl_customers") || "[]");

    const newTransaction = {
      id: Date.now().toString(),
      customerId: id,
      type,
      amount: numAmount,
      description: description.trim(),
      date: new Date().toISOString()
    };

    transactions.push(newTransaction);
    localStorage.setItem("cl_transactions", JSON.stringify(transactions));

    // Update customer balance
    const customerIndex = customers.findIndex((c: any) => c.id === id);
    if (customerIndex !== -1) {
      if (type === "debt") {
        customers[customerIndex].balance += numAmount;
      } else {
        customers[customerIndex].balance -= numAmount;
      }
      localStorage.setItem("cl_customers", JSON.stringify(customers));
    }

    toast.success(`${type === "debt" ? "Debt" : "Payment"} added successfully!`);
    navigate(`/customer/${id}`);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/customer/${id}`)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">
            {type === "debt" ? "Add Debt" : "Add Payment"}
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount *</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-muted-foreground">
                $
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-14 text-xl pl-8"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              type="text"
              placeholder="Optional description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-12"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 text-lg font-semibold"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : `Save ${type === "debt" ? "Debt" : "Payment"}`}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;
