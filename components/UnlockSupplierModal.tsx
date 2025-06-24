// components/modals/UnlockSupplierModal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { loadStripe } from "@stripe/stripe-js";

const handleStripeCheckout = async (quoteId: string) => {
  const token = localStorage.getItem("accessToken");
  const stripe = await loadStripe("pk_test_51RVqS3PORzuHer..."); // your Stripe **publishable** key

  try {
    const res = await fetch(
      "https://web-production-3f682.up.railway.app/quotes/stripe/create-checkout-session/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
        body: JSON.stringify({ quote_id: quoteId }), // pass the current quote ID
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Something went wrong");
    }

    // Redirect to Stripe Checkout
    if (data.checkout_url) {
      window.location.href = data.checkout_url;
    } else {
      throw new Error("Stripe session URL missing");
    }
  } catch (err) {
    console.error("Stripe Checkout error:", err);
    alert("Payment failed to start.");
  }
};

export default function UnlockSupplierModal({
  open,
  onClose,
  onConfirm,
  quoteId,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  quoteId: string;
}) {
  const handleProceedToPayment = () => {
    handleStripeCheckout(quoteId);
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unlock Supplier Access</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 text-sm">
          <p>
            This quote is locked. To view supplier details and message them
            directly, please purchase access for $29.00.
          </p>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleProceedToPayment}>Proceed to Payment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
