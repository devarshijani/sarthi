import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import map from "../assets/map.png";
import logo from "../assets/logo.png";

const Riding = () => {
  const navigate = useNavigate();
  const [showPaymentPanel, setShowPaymentPanel] = useState(false);

  // Mock ride data - you can pass this via route state or context
  const rideData = {
    driver: {
      name: "Sarthak",
      vehicle: "Maruti Suzuki Alto",
      plate: "MP04 AB 1234",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjzE6procPzT4lGu4C32IqWcwBtKbQi2GK_g&s",
    },
    pickup: "562/11-A",
    pickupAddress: "Kankariya Talab, Bhopal",
    destination: "City Mall",
    destinationAddress: "Main Road, Bhopal",
    fare: "₹193.20",
    paymentMethod: "Cash",
    distance: "6 min",
    arrivalTime: "Arrival 6 min",
  };

  const handlePayment = () => {
    // Handle payment logic here
    alert("Payment successful!");
    navigate("/home");
  };

  return (
    <div className="h-screen w-full relative overflow-hidden">
      <Link
        to="/home"
        className="fixed right-5 top-14 h-12 w-12 bg-white flex items-center justify-center rounded-full shadow-lg z-50 hover:bg-gray-100 transition-colors"
      >
        <i class="ri-home-4-fill"></i>
      </Link>
      {/* MAP with route */}

      <div className="h-full w-full relative">
        <img src={map} alt="map" className="h-full w-full object-cover" />

        {/* Route overlay - you can replace this with actual route drawing */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path
            d="M 100 400 Q 200 200, 350 150"
            stroke="black"
            strokeWidth="4"
            fill="none"
            strokeDasharray="10,5"
          />
          {/* Car icon on route */}
          <g transform="translate(250, 250)">
            <rect x="-20" y="-10" width="40" height="20" fill="black" rx="3" />
            <circle cx="-12" cy="10" r="4" fill="white" />
            <circle cx="12" cy="10" r="4" fill="white" />
          </g>
        </svg>
      </div>

      {/* LOGO */}
      <img src={logo} alt="logo" className="w-14 absolute left-5 top-5 z-20" />

      {/* Arrival indicator at top */}
      <div className="absolute top-5 right-5 bg-white rounded-full px-5 py-2 shadow-lg z-20">
        <p className="text-sm font-semibold flex items-center gap-2">
          <i className="ri-time-line"></i>
          {rideData.arrivalTime}
        </p>
      </div>

      {/* Bottom Panel - Ride Info */}
      <div className="absolute bottom-0 w-full bg-white rounded-t-3xl shadow-2xl z-30">
        {/* Progress bar */}
        <div className="w-full h-1 bg-gray-200 rounded-t-3xl overflow-hidden">
          <div className="h-full bg-green-500 w-2/3 transition-all duration-500"></div>
        </div>

        <div className="p-5">
          {/* Driver Info Header */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b">
            <div className="flex items-center gap-3">
              <img
                src={rideData.driver.image}
                alt="driver"
                className="h-16 w-16 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold">
                  {rideData.driver.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {rideData.driver.vehicle}
                </p>
                <p className="text-sm font-medium">{rideData.driver.plate}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex gap-2">
                <button className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center hover:bg-green-200">
                  <i className="ri-phone-fill text-green-600 text-xl"></i>
                </button>
                <button className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200">
                  <i className="ri-message-3-fill text-blue-600 text-xl"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Trip Details */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Pickup</p>
                <p className="font-medium">{rideData.pickup}</p>
                <p className="text-xs text-gray-500">
                  {rideData.pickupAddress}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 ml-1">
              <div className="w-1 h-8 border-l-2 border-dashed border-gray-300"></div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Destination</p>
                <p className="font-medium">{rideData.destination}</p>
                <p className="text-xs text-gray-500">
                  {rideData.destinationAddress}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-4">
            <div className="flex items-center gap-3">
              <i className="ri-money-rupee-circle-fill text-2xl text-gray-700"></i>
              <div>
                <p className="text-lg font-bold">{rideData.fare}</p>
                <p className="text-sm text-gray-600">
                  {rideData.paymentMethod}
                </p>
              </div>
            </div>
          </div>

          {/* Make Payment Button */}
          <button
            onClick={() => setShowPaymentPanel(true)}
            className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <i className="ri-secure-payment-line"></i>
            Make a Payment
          </button>
        </div>
      </div>

      {/* Payment Confirmation Overlay */}
      {showPaymentPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-check-line text-4xl text-green-600"></i>
              </div>
              <h3 className="text-2xl font-bold mb-2">Trip Completed!</h3>
              <p className="text-gray-600">Thank you for riding with us</p>
            </div>

            <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-xl">
              <div className="flex justify-between">
                <span className="text-gray-600">Trip Fare</span>
                <span className="font-semibold">{rideData.fare}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-semibold">{rideData.paymentMethod}</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="font-bold">Total Paid</span>
                <span className="font-bold text-lg text-green-600">
                  {rideData.fare}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handlePayment}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
              >
                Confirm Payment
              </button>
              <button
                onClick={() => setShowPaymentPanel(false)}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>

            {/* Rate your ride */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-2">Rate your ride</p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className="text-2xl text-gray-300 hover:text-yellow-400 transition-colors"
                  >
                    <i className="ri-star-fill"></i>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Riding;
