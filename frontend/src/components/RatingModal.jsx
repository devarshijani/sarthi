import React, { useState } from "react";
import axios from "axios";
import RatingStars from "./RatingStars";

const RatingModal = ({ rideId, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async () => {
    if (rating < 1 || rating > 5) {
      setErrorMsg("Please select a rating of 1 to 5 stars.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const token = localStorage.getItem("userToken");
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/rides/${rideId}/rate`,
        { rating, comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMsg("Thanks for the feedback!");
      if (onSuccess) {
        onSuccess(rating);
      }

      // Close modal after a brief delay so they see the success message
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (err) {
      console.error("Rate ride error:", err);
      const serverMessage = err.response?.data?.message || "Something went wrong. Please try again.";
      setErrorMsg(serverMessage);

      // If already rated, close on click
      if (serverMessage.toLowerCase().includes("already rated")) {
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-65 z-[2000] flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-md shadow-2xl relative animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <i className="ri-close-line text-2xl"></i>
        </button>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
          Rate your ride
        </h3>
        <p className="text-sm text-gray-500 text-center mb-6">
          Your feedback helps improve Sarthi's captain experiences.
        </p>

        {successMsg ? (
          /* Success Indicator */
          <div className="py-8 text-center text-green-600 space-y-3">
            <i className="ri-checkbox-circle-fill text-6xl block animate-bounce"></i>
            <p className="font-bold text-lg">{successMsg}</p>
          </div>
        ) : (
          /* Form Content */
          <div className="space-y-6">
            {/* Stars selection */}
            <div className="flex flex-col items-center gap-2">
              <RatingStars
                rating={rating}
                interactive={true}
                onChange={setRating}
                size="text-4xl"
              />
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                {rating === 1 ? "Terrible" : rating === 2 ? "Bad" : rating === 3 ? "Okay" : rating === 4 ? "Good" : rating === 5 ? "Amazing" : "Select rating"}
              </span>
            </div>

            {/* Comment block */}
            <div className="relative">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value.slice(0, 200))}
                placeholder="Optional: Tell us about your ride..."
                rows={3}
                className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 border-gray-200 resize-none"
              />
              <span className="absolute bottom-2 right-3 text-xs text-gray-400 font-medium">
                {comment.length}/200
              </span>
            </div>

            {/* Errors */}
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-600 font-semibold text-center">
                {errorMsg}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                disabled={loading}
                onClick={onClose}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition"
              >
                Skip
              </button>
              <button
                disabled={loading || rating === 0}
                onClick={handleSubmit}
                className={`flex-1 py-3 rounded-xl font-bold shadow-md transition ${
                  rating === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RatingModal;
