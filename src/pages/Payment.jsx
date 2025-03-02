import React from "react";
import Razorpay from "razorpay";

function Payment() {
  const razorpay = new Razorpay({
    key_id: import.meta.env.VITE_RAZORPAY_KEYID,
    key_secret: import.meta.env.VITE_RAZORPAY_APIKEY,
  });

  const handlePayment = () => {
    const options = {
      key: "YOUR_RAZORPAY_KEY_ID",
      amount: "500",
      currency: "INR",
      name: "Payment",
      description: "Test Transaction",
      image: "https://example.com/logo",
      order_id: "",
      handler: function (response) {
        alert(response.razorpay_payment_id);
      },
      prefill: {
        name: "Harshil Mathur",
        email: "harshil.mathur@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const pay = razorpay.open(options);
  };

  return (
    <div className="payment">
      <button onClick={handlePayment}>Make Payment</button>
    </div>
  );
}

export default Payment;
