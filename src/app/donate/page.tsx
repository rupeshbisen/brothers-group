"use client";

import { useState } from "react";
import {
  Heart,
  Building2,
  QrCode,
  Copy,
  Check,
  IndianRupee,
} from "lucide-react";
import Image from "next/image";

export default function DonatePage() {
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [transactionId, setTransactionId] = useState("");
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const donationData = {
        donor_name: donorName || "Anonymous",
        donor_email: donorEmail || undefined,
        donor_phone: donorPhone || undefined,
        amount: parseFloat(amount),
        payment_method: paymentMethod,
        transaction_id: transactionId || undefined,
        notes: notes || undefined,
      };

      const response = await fetch("/api/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(donationData),
      });

      if (response.ok) {
        setSubmitted(true);
        // Reset form
        setDonorName("");
        setDonorEmail("");
        setDonorPhone("");
        setAmount("");
        setTransactionId("");
        setNotes("");
        setPaymentMethod("upi");
      } else {
        const error = await response.json();
        alert(error.message || "Failed to submit donation");
      }
    } catch (error) {
      console.error("Error submitting donation:", error);
      alert("Failed to submit donation");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-600 to-orange-800 text-white py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 md:mb-6">
            Make a Donation
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-orange-100 max-w-3xl mx-auto px-2">
            Support our community initiatives and help us continue serving the
            community through cultural and religious activities
          </p>
        </div>
      </section>

      {/* Donation Form Section */}
      <section className="py-8 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
              {/* Donation Form */}
              <div className="order-2 lg:order-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 md:mb-8">
                  Donate Now
                </h2>

                {submitted ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <Heart className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-green-900 mb-2">
                      Thank You for Your Donation!
                    </h3>
                    <p className="text-green-700 mb-4">
                      Your donation has been submitted successfully. We&apos;ll
                      process it shortly and send you a receipt via email.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Make Another Donation
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4 md:space-y-6"
                  >
                    <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                      <div>
                        <label
                          htmlFor="donorName"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="donorName"
                          value={donorName}
                          onChange={e => setDonorName(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Enter your name"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="donorEmail"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="donorEmail"
                          value={donorEmail}
                          onChange={e => setDonorEmail(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Enter your email"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                      <div>
                        <label
                          htmlFor="donorPhone"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="donorPhone"
                          value={donorPhone}
                          onChange={e => setDonorPhone(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Enter your phone number"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="amount"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Amount <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                          <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Enter amount"
                            min="1"
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3 md:mb-4">
                        Payment Method
                      </label>
                      <div className="space-y-2 md:space-y-3">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="upi"
                            checked={paymentMethod === "upi"}
                            onChange={e => setPaymentMethod(e.target.value)}
                            className="text-orange-600 focus:ring-orange-500"
                            disabled={isSubmitting}
                          />
                          <QrCode className="w-5 h-5 text-orange-600" />
                          <span className="text-gray-700">UPI Payment</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="bank_transfer"
                            checked={paymentMethod === "bank_transfer"}
                            onChange={e => setPaymentMethod(e.target.value)}
                            className="text-orange-600 focus:ring-orange-500"
                            disabled={isSubmitting}
                          />
                          <Building2 className="w-5 h-5 text-orange-600" />
                          <span className="text-gray-700">Bank Transfer</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="cash"
                            checked={paymentMethod === "cash"}
                            onChange={e => setPaymentMethod(e.target.value)}
                            className="text-orange-600 focus:ring-orange-500"
                            disabled={isSubmitting}
                          />
                          <IndianRupee className="w-5 h-5 text-orange-600" />
                          <span className="text-gray-700">Cash Payment</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="transactionId"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Transaction ID
                      </label>
                      <input
                        type="text"
                        id="transactionId"
                        value={transactionId}
                        onChange={e => setTransactionId(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter transaction ID if you've already paid"
                        disabled={isSubmitting}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        If you&apos;ve already made the payment, please enter
                        the transaction ID here
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="notes"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Notes
                      </label>
                      <textarea
                        id="notes"
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Any additional notes or comments"
                        disabled={isSubmitting}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Heart className="w-5 h-5 mr-2" />
                          Submit Donation
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Payment Details */}
              <div className="order-1 lg:order-2">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
                  Payment Details
                </h3>

                {paymentMethod === "upi" ? (
                  <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
                    <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
                      UPI Payment
                    </h4>
                    <div className="space-y-3 md:space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          UPI ID
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value="rupeshbisen11@okaxis"
                            readOnly
                            className="flex-1 px-3 py-2 border border-gray-300 rounded bg-white text-sm"
                          />
                          <button
                            onClick={() => handleCopy("rupeshbisen11@okaxis")}
                            className="px-2 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors text-xs whitespace-nowrap flex-shrink-0"
                          >
                            {copied ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="w-48 h-48 sm:w-64 sm:h-64 bg-white border-2 border-gray-300 rounded-lg mx-auto overflow-hidden">
                          <Image
                            src="/UPI_Scanner.jpeg"
                            alt="UPI QR Code Scanner"
                            width={256}
                            height={256}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          Scan QR code to pay via UPI
                        </p>
                      </div>
                    </div>
                  </div>
                ) : paymentMethod === "bank_transfer" ? (
                  <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
                    <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
                      Bank Details
                    </h4>
                    <div className="space-y-3 md:space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Account Name
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value="Brother Bal Ganesh Utsav Mandal"
                            readOnly
                            className="flex-1 px-3 py-2 border border-gray-300 rounded bg-white text-sm"
                          />
                          <button
                            onClick={() =>
                              handleCopy("Brother Bal Ganesh Utsav Mandal")
                            }
                            className="px-2 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors text-xs whitespace-nowrap flex-shrink-0"
                          >
                            {copied ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Account Number
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value="1234567890"
                            readOnly
                            className="flex-1 px-3 py-2 border border-gray-300 rounded bg-white text-sm"
                          />
                          <button
                            onClick={() => handleCopy("1234567890")}
                            className="px-2 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors text-xs whitespace-nowrap flex-shrink-0"
                          >
                            {copied ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          IFSC Code
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value="ICIC0001234"
                            readOnly
                            className="flex-1 px-3 py-2 border border-gray-300 rounded bg-white text-sm"
                          />
                          <button
                            onClick={() => handleCopy("ICIC0001234")}
                            className="px-2 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors text-xs whitespace-nowrap flex-shrink-0"
                          >
                            {copied ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Bank Name
                        </label>
                        <input
                          type="text"
                          value="ICICI Bank"
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
                    <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
                      Cash Payment
                    </h4>
                    <div className="space-y-3 md:space-y-4">
                      <div className="text-center">
                        <IndianRupee className="w-16 h-16 text-orange-600 mx-auto mb-4" />
                        <p className="text-gray-700 mb-2">
                          For cash donations, please visit our office or contact
                          us to arrange collection.
                        </p>
                        <div className="bg-white p-4 rounded-lg border">
                          <p className="font-semibold text-gray-900">
                            Contact Information:
                          </p>
                          <p className="text-gray-700">Phone: 8408889448</p>
                          <p className="text-gray-700">
                            Address: Gangabagh, Pardi, Nagpur 440035,
                            Maharashtra
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4 md:mt-6 p-3 md:p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-2 text-sm md:text-base">
                    Important Notes:
                  </h4>
                  <ul className="text-xs md:text-sm text-orange-800 space-y-1">
                    <li>• All donations are tax-deductible</li>
                    <li>• Receipt will be sent to your email</li>
                    <li>• Your donation helps support community activities</li>
                    <li>
                      • For any queries, contact us at
                      info@brothersbalganesh.com
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-8 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 md:mb-12">
              Your Donation Makes a Difference
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                <Heart className="w-10 h-10 md:w-12 md:h-12 text-orange-600 mx-auto mb-3 md:mb-4" />
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                  Community Service
                </h3>
                <p className="text-sm md:text-base text-gray-600">
                  Supporting local community initiatives and welfare programs
                </p>
              </div>
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                <Building2 className="w-10 h-10 md:w-12 md:h-12 text-orange-600 mx-auto mb-3 md:mb-4" />
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                  Cultural Preservation
                </h3>
                <p className="text-sm md:text-base text-gray-600">
                  Preserving and promoting our rich cultural heritage
                </p>
              </div>
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                <IndianRupee className="w-10 h-10 md:w-12 md:h-12 text-orange-600 mx-auto mb-3 md:mb-4" />
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                  Transparent Usage
                </h3>
                <p className="text-sm md:text-base text-gray-600">
                  All funds are used transparently for community development
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
