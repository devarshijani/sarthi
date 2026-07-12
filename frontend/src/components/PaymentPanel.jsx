import React, { useState } from "react";
import axios from "axios";

const PaymentPanel = ({ ride, onPaymentSuccess }) => {
  const [loadingCash, setLoadingCash] = useState(false);
  const [loadingOnline, setLoadingOnline] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayCash = async () => {
    try {
      setLoadingCash(true);
      setErrorMsg("");

      const token = localStorage.getItem("userToken");
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/payments/cash`,
        { rideId: ride._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMsg("Paid in cash ✓");
      setTimeout(() => {
        onPaymentSuccess("paid_cash");
      }, 1500);

    } catch (err) {
      console.error("Cash payment error:", err);
      setErrorMsg(err.response?.data?.message || "Cash payment failed. Please try again.");
    } finally {
      setLoadingCash(false);
    }
  };

  const handlePayOnline = async () => {
    try {
      setLoadingOnline(true);
      setErrorMsg("");

      // 1️⃣ Load Razorpay checkout script dynamically
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setErrorMsg("Failed to load payment gateway. Please check your internet connection.");
        setLoadingOnline(false);
        return;
      }

      // 2️⃣ Create Razorpay order on backend
      const token = localStorage.getItem("userToken");
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/payments/create-order`,
        { rideId: ride._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { orderId, amount, currency, keyId } = res.data;

      // 3️⃣ Open Razorpay Checkout modal
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "Sarthi",
        description: "Ride Payment Collection",
        order_id: orderId,
        handler: async function (response) {
          // 4️⃣ Verify signature server-side
          try {
            setLoadingOnline(true);
            setErrorMsg("");

            const verifyRes = await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/api/payments/verify`,
              {
                rideId: ride._id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            setSuccessMsg("Payment successful ✓");
            setTimeout(() => {
              onPaymentSuccess("paid_online");
            }, 1500);

          } catch (verErr) {
            console.error("Payment verification failure:", verErr);
            setErrorMsg(verErr.response?.data?.message || "Signature verification failed. Please retry.");
            setLoadingOnline(false);
          }
        },
        theme: {
          color: "#2563EB", // Blue app brand color
        },
        modal: {
          ondismiss: function () {
            // Handle when checkout modal is dismissed (Condition 5)
            setLoadingOnline(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error("Online payment order creation error:", err);
      setErrorMsg(err.response?.data?.message || "Failed to create online payment order. Please try again.");
      setLoadingOnline(false);
    }
  };

  const isBtnDisabled = loadingCash || loadingOnline || successMsg !== "";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-65 z-[1500] flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-md shadow-2xl relative animate-fade-in">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 text-center mb-1">
          Complete Ride Payment
        </h3>
        <p className="text-sm text-gray-500 text-center mb-6">
          Choose your preferred method to complete payment
        </p>

        {successMsg ? (
          /* Success Screen */
          <div className="py-8 text-center text-green-600 space-y-3">
            <i className="ri-checkbox-circle-fill text-6xl block animate-bounce"></i>
            <p className="font-bold text-lg">{successMsg}</p>
          </div>
        ) : (
          /* Payment Select Form */
          <div className="space-y-6">
            {/* Fare Summary Box */}
            <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl flex justify-between items-center">
              <div>
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">
                  Final Fare
                </span>
                <span className="text-sm text-gray-500 font-medium capitalize mt-1 block">
                  {ride?.vehicleType || "Ride"} Trip
                </span>
              </div>
              <div className="text-right">
                <span className="text-3xl font-extrabold text-gray-900">
                  ₹{ride?.fare}
                </span>
              </div>
            </div>

            {/* Error Message Box */}
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-600 font-semibold text-center">
                {errorMsg}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3">
              {/* Pay Online */}
              <button
                disabled={isBtnDisabled}
                onClick={handlePayOnline}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-md transition ${
                  isBtnDisabled
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {loadingOnline ? (
                  <>
                    <i className="ri-loader-4-line animate-spin"></i>
                    Processing Online...
                  </>
                ) : (
                  <>
                    <i className="ri-bank-card-line"></i>
                    Pay Online
                  </>
                )}
              </button>

              {/* Pay Cash */}
              <button
                disabled={isBtnDisabled}
                onClick={handlePayCash}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 border transition ${
                  isBtnDisabled
                    ? "border-gray-100 text-gray-400 bg-gray-50 cursor-not-allowed"
                    : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                }`}
              >
                {loadingCash ? (
                  <>
                    <i className="ri-loader-4-line animate-spin"></i>
                    Processing Cash...
                  </>
                ) : (
                  <>
                    <i className="ri-hand-coin-line"></i>
                    Pay Cash
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPanel;
