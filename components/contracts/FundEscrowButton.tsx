"use client";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type Props = {
  contractId: number;
  onSuccess: () => void;
};

export default function FundEscrowButton({
  contractId,
  onSuccess,
}: Props) {

  const startPayment = async () => {

    const orderRes =
      await fetch(`/api/contracts/${contractId}/fund`,
        {
          method: "POST"
        }
      );

    const order = await orderRes.json();

    // debug
    console.log("ORDER RESPONSE:", order);

    if (!order.orderId) {
      alert("Order ID missing");
      return;
    }

    const options = {

      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      order_id: order.orderId,
      name: "MVPConnect",
      description: "Escrow Funding",

      handler: async (response: any) => {

        console.log("RAZORPAY RESPONSE");
        console.log(response);

        const verify = await fetch("/api/escrow/verify",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify(response),
          }
        );

        const verifyData = await verify.json();

        console.log("VERIFY RESPONSE", verifyData);


        if (verify.ok) {
          alert("Escrow funded");

          onSuccess();
        } else {
          alert(verifyData.error);
        }

      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <button onClick={startPayment}
      className="bg-green-600 text-white px-4 py-2 rounded-lg"
    >
      Fund Escrow
    </button>
  );
}