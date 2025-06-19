import React, { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { useThemeProvider } from "../../../../components/AdminDashboard/utils/ThemeContext";
import gpay from "../../../../assets/images/components/Payment/Gpay.png";
import phonepay from "../../../../assets/images/components/Payment/PhonePe.png";
import debit from "../../../../assets/images/components/Payment/debit.png";
import credit from "../../../../assets/images/components/Payment/credit.png";
import netbank from "../../../../assets/images/components/Payment/net-banking-icon.png";
import Coin from "../../../../assets/images/components/Payment/COIN IMAGE.png";
import { toast } from "react-hot-toast";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_API_KEY;

const PaymentPage = () => {
  const [amount, setAmount] = useState(0);
  const [inputAmount, setInputAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isWithdrawMode, setIsWithdrawMode] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const { currentTheme } = useThemeProvider();

  // Get user data from Redux
  const user = useSelector((state) => state.auth.user);
  const email = user?.email;
  const name = user?.name; // Get name from Redux

  // Dark mode classes
  const darkModeClasses = {
    bg: currentTheme === "dark" ? "bg-[#191919]" : "bg-gray-50",
    containerBg: currentTheme === "dark" ? "bg-[#303030]" : "bg-white",
    textPrimary: currentTheme === "dark" ? "text-white" : "text-gray-800",
    textSecondary: currentTheme === "dark" ? "text-gray-300" : "text-gray-600",
    border: currentTheme === "dark" ? "border-gray-600" : "border-gray-200",
    cardBg: currentTheme === "dark" ? "bg-[#404040]" : "bg-white",
    inputBg:
      currentTheme === "dark"
        ? "bg-[#404040] border-gray-500 text-white"
        : "bg-white border-gray-300",
    amountCardBg:
      currentTheme === "dark"
        ? "bg-blue-900 border-blue-700"
        : "bg-blue-50 border-blue-100",
    amountCardText: currentTheme === "dark" ? "text-blue-100" : "text-blue-800",
    switchCardBg:
      currentTheme === "dark"
        ? "bg-[#404040] border-gray-600"
        : "bg-white border-gray-100",
    quickAmountBtn:
      currentTheme === "dark"
        ? "bg-[#404040] border-gray-600 text-white hover:bg-[#505050]"
        : "bg-transparent border-gray-300 text-gray-700 hover:bg-gray-100",
    paymentOptionBg:
      currentTheme === "dark"
        ? "bg-[#404040] hover:shadow-gray-800"
        : "bg-white hover:shadow-lg",
    paymentOptionSelected:
      currentTheme === "dark"
        ? "border-blue-500 bg-blue-900"
        : "border-blue-500 bg-blue-50",
    paymentOptionIconBg:
      currentTheme === "dark" ? "bg-blue-800" : "bg-blue-100",
    errorBg: currentTheme === "dark" ? "bg-red-900" : "bg-red-50",
  };

  const handleAmountChange = (change) => {
    setInputAmount(change.toString());
  };

  const handleInputAmountChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]*$/.test(value)) {
      setInputAmount(value);
    }
  };

  useEffect(() => {
    const fetchAmount = async () => {
      if (!email) {
        console.error("No email found in Redux store");
        return;
      }
      try {
        const response = await axios.get(`${API_URL}/api/auth/get-amount`, {
          withCredentials: true,
        });
        if (response.data && response.data.amount !== undefined) {
          setAmount(response.data.amount);
        } else {
          console.error("Amount not found in the response");
        }
      } catch (error) {
        console.error("Error fetching amount from the server:", error);
      }
    };

    fetchAmount();
  }, [email]);

  // Function to record transaction
  const recordTransaction = async (type, transactionAmount) => {
    try {
      await axios.post(`${API_URL}/api/transactions`, {
        userEmail: email,
        name: name,
        type: type,
        amount: transactionAmount,
      });
    } catch (error) {
      console.error("Error recording transaction:", error);
    }
  };

  const handleTransaction = () => {
    if (!email) {
      console.error("No email found in local storage");
      setErrorMessage("Please log in to proceed.");
      return;
    }

    if (!isWithdrawMode && !selectedPaymentMethod) {
      setErrorMessage("Please select a payment method.");
      return;
    }

    const amountToProcess = parseInt(inputAmount, 10);
    if (isNaN(amountToProcess) || amountToProcess <= 0) {
      setErrorMessage("Please enter a valid amount.");
      return;
    }

    if (isWithdrawMode) {
      // Withdraw logic
      if (amountToProcess > amount) {
        setErrorMessage("Insufficient funds.");
        return;
      }

      const totalAmount = amount - amountToProcess;

      axios
        .patch(
          `${API_URL}/api/auth/update-amount`,
          {
            amount: totalAmount,
          },
          {
            withCredentials: true, // This is crucial for sending cookies
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          setAmount(totalAmount);
          setInputAmount("");
          setErrorMessage("");
          // Record withdrawal transaction
          recordTransaction("withdrawal", amountToProcess);
          toast.success("Withdrawal successful");
        })
        .catch((error) => {
          console.error("Error updating amount in the database:", error);
          alert("Withdrawal failed. Please try again.");
        });
    } else {
      // Add money logic
      const amountToPay = amountToProcess;

      var options = {
        key: RAZORPAY_KEY,
        amount: amountToPay * 100,
        currency: "INR",
        name: "AuctionX Payment",
        description: "Payment for AuctionX website",
        image:
          "https://res.cloudinary.com/dszvpb3q5/image/upload/v1738092417/xohxoosm3tnn0jjvquuv.png",
        handler: function (response) {
          fetch("/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.success) {
                setErrorMessage("");
              } else {
                setErrorMessage(
                  "Payment verification failed. Please try again."
                );
              }
            })
            .catch((err) => {
              const totalamount = amount + amountToPay;
              setAmount(() => amount + amountToPay);
              axios
                .patch(
                  `${API_URL}/api/auth/update-amount`,
                  {
                    amount: totalamount,
                  },
                  {
                    withCredentials: true, // This is crucial for sending cookies
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                )
                .then((response) => {
                  // Record deposit transaction
                  recordTransaction("deposit", amountToPay);
                  toast.success("Payment successful");
                })
                .catch((error) => {
                  console.error(
                    "Error updating amount in the database:",
                    error
                  );
                  setErrorMessage(
                    "Payment verified, but failed to update amount."
                  );
                });
              console.error("Error:", err);
            });
        },
        modal: {
          ondismiss: function () {
            window.location.reload();
          },
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
          contact: "9999999999",
        },
      };

      var rzp1 = new window.Razorpay(options);
      rzp1.open();
    }
  };

  useEffect(() => {
    const loadScript = (src) => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    loadScript("https://checkout.razorpay.com/v1/checkout.js");
  }, []);

  const paymentOptions = [
    {
      id: "phonepay",
      name: "PhonePe",
      icon: phonepay,
      description: "Fast and secure payments",
    },
    {
      id: "gpay",
      name: "GPay",
      icon: gpay,
      description: "Earn rewards with every payment",
    },
    {
      id: "credit",
      name: "Credit Card",
      icon: credit,
      description: "All major cards accepted",
    },
    {
      id: "debit",
      name: "Debit Card",
      icon: debit,
      description: "Direct from your bank account",
    },
    {
      id: "netbank",
      name: "Net Banking",
      icon: netbank,
      description: "Connect with 100+ banks",
    },
  ];

  return (
    <div
      className={`min-h-screen font-poppins ${darkModeClasses.textPrimary} pt-10 pb-10 ${darkModeClasses.bg}`}
    >
      <div
        className={`container mx-auto px-4 py-8 ${darkModeClasses.containerBg} rounded-xl shadow-md relative`}
      >
        {/* Available Money and Switch Button Section */}
        <div className="absolute top-5 right-5 flex flex-col gap-3">
          {/* Available Money */}
          <div
            className={`${darkModeClasses.amountCardBg} p-3 rounded-lg shadow-sm font-bold ${darkModeClasses.amountCardText} border`}
          >
            Available Money: ₹{amount.toLocaleString()}
          </div>

          {/* Switch Button */}
          <div
            className={`${darkModeClasses.switchCardBg} p-3 rounded-lg shadow-sm border ${darkModeClasses.border}`}
            style={{ position: "relative", zIndex: 3 }}
          >
            <button
              className={`font-medium transition-all duration-300 ${
                isWithdrawMode
                  ? "text-green-400 hover:text-green-300"
                  : "text-blue-400 hover:text-blue-300"
              }`}
              onClick={() => {
                setIsWithdrawMode(!isWithdrawMode);
                setSelectedPaymentMethod(null);
              }}
            >
              {isWithdrawMode
                ? "Switch to Add Money"
                : "Switch to Withdraw Money"}
            </button>
          </div>
        </div>

        {/* Title Section */}
        <div className="flex justify-between items-center">
          <h2
            className={`text-2xl font-semibold ${darkModeClasses.textPrimary}`}
          >
            {isWithdrawMode ? "Withdraw Funds" : "Add Funds"}
          </h2>
        </div>

        {/* Enter Amount Section */}
        <div className="text-center mt-8 relative">
          {/* Background Image */}
          <div className="absolute top-[-140px] left-1/2 transform -translate-x-1/2 w-[900px] h-[900px] bg-contain bg-no-repeat bg-center opacity-30 z-1">
            <img
              src={Coin}
              className="w-[1000px] h-[500px]"
              alt="Coin background"
            />
          </div>

          <div className="relative z-2 text-center mt-8">
            <h3
              className={`text-xl font-semibold ${darkModeClasses.textPrimary}`}
            >
              {isWithdrawMode
                ? "Enter Amount to Withdraw"
                : "Enter Amount to Add"}
            </h3>
            <div className="flex justify-center mt-4">
              <span
                className={`${darkModeClasses.inputBg} p-3 rounded-l-lg font-bold`}
              >
                ₹
              </span>
              <input
                type="text"
                value={inputAmount}
                onChange={handleInputAmountChange}
                className={`p-3 border ${darkModeClasses.border} rounded-r-lg w-1/4 relative z-10 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent ${darkModeClasses.inputBg}`}
                placeholder={
                  isWithdrawMode ? "Withdraw amount" : "Enter amount"
                }
              />
            </div>
            <div className="mt-4">
              <button
                className={`relative z-10 ${darkModeClasses.quickAmountBtn} px-4 py-2 rounded-lg mr-2 transition-all`}
                onClick={() => handleAmountChange(500)}
              >
                +500
              </button>
              <button
                className={`relative z-10 ${darkModeClasses.quickAmountBtn} px-4 py-2 rounded-lg mr-2 transition-all`}
                onClick={() => handleAmountChange(1000)}
              >
                +1000
              </button>
              <button
                className={`relative z-10 ${darkModeClasses.quickAmountBtn} px-4 py-2 rounded-lg transition-all`}
                onClick={() => handleAmountChange(1500)}
              >
                +1500
              </button>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center mt-8 z-2">
          <button
            className={`relative z-2 px-6 py-3 rounded-full text-lg font-semibold ${
              inputAmount === "" || parseInt(inputAmount, 10) <= 0
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : isWithdrawMode
                ? "bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg"
                : "bg-green-500 text-white hover:bg-green-600 hover:shadow-lg"
            } transition-all duration-300`}
            disabled={
              inputAmount === "" ||
              parseInt(inputAmount, 10) <= 0 ||
              (!isWithdrawMode && !selectedPaymentMethod)
            }
            onClick={handleTransaction}
          >
            {isWithdrawMode ? "Withdraw Money" : "Proceed to Payment"}
          </button>

          {errorMessage && (
            <div
              className={`${darkModeClasses.errorBg} text-red-300 mt-4 p-2 rounded-lg inline-block`}
            >
              <h4>{errorMessage}</h4>
            </div>
          )}
        </div>

        {/* Payment Options Section */}
        {!isWithdrawMode && (
          <div className="mt-12 relative z-10">
            <h5
              className={`text-lg font-medium mb-4 border-b ${darkModeClasses.border} pb-2 ${darkModeClasses.textPrimary}`}
            >
              Select Payment Method
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {paymentOptions.map((option) => (
                <div
                  key={option.id}
                  className={`cursor-pointer rounded-xl overflow-hidden transition-all duration-300 border ${
                    selectedPaymentMethod === option.id
                      ? `${darkModeClasses.paymentOptionSelected} transform scale-105`
                      : `${darkModeClasses.paymentOptionBg} ${darkModeClasses.border}`
                  }`}
                  onClick={() => setSelectedPaymentMethod(option.id)}
                >
                  <div className="p-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 p-2 rounded-full flex items-center justify-center ${
                          selectedPaymentMethod === option.id
                            ? darkModeClasses.paymentOptionIconBg
                            : "bg-gray-100"
                        }`}
                      >
                        <img
                          src={option.icon}
                          alt={option.name}
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h6
                          className={`font-medium ${darkModeClasses.textPrimary}`}
                        >
                          {option.name}
                        </h6>
                        <p
                          className={`text-xs ${darkModeClasses.textSecondary}`}
                        >
                          {option.description}
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 ${darkModeClasses.border} flex items-center justify-center`}
                      >
                        {selectedPaymentMethod === option.id && (
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
