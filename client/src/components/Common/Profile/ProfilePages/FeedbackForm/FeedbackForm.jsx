import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

function FeedbackForm() {
  const [displayForm, setDisplayForm] = useState(true);
  const [phValue, setPhValue] = useState();
  const [checkedVal, setCheckedVal] = useState([]);
  const [errorMsg, setErrorMsg] = useState(
    "Please enter the value for the above field"
  );
  const [showErrors, setShowErrors] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  // Get user data from Redux store
  const { user } = useSelector((state) => state.auth);
  const emValue = user?.email || "";
  const nmValue = user?.name || "";

  const handleOnChange = (isChecked, value) => {
    let temp = [...checkedVal];
    const pre = value.split("_")[0];
    if (isChecked) {
      temp = temp.filter((item) => item.split("_")[0] !== pre);
      temp.push(value);
      setCheckedVal(temp);
    } else {
      setCheckedVal(temp.filter((item) => item !== value));
    }
  };

  const validateForm = () => {
    setErrorMsg("Please enter the value for the above field");
    setShowErrors(true);

    if (!nmValue) return false;
    if (!emValue || !emValue.includes("@") || !emValue.endsWith(".com")) {
      setErrorMsg("Invalid Email");
      return false;
    }
    if (!phValue || phValue.length < 10) {
      setErrorMsg("Invalid Phone number");
      return false;
    }
    if (checkedVal.length < Object.keys(feedbackType).length) return false;

    return true;
  };

  const formSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const entry = {
          email: emValue,
          name: nmValue,
          phone: phValue,
          checkbox_values: checkedVal,
        };

        console.log("Submitting feedback data:", entry);

        const response = await axios.post(
          `${API_URL}/api/feedback/user`,
          entry,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Feedback sent successfully");
        setDisplayForm(false);
      } catch (error) {
        console.error("Error submitting feedback:", error);
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);

        const errorMessage =
          error.response?.data?.message ||
          "There was an error submitting your feedback. Please try again later.";

        setErrorMsg(errorMessage);
        toast.error(`Failed to submit feedback: ${errorMessage}`);
      }
    }
  };

  const feedbackType = {
    qos: "How easy was it to place a bid on items?",
    qob: "How would you rate the support you received from our team?",
    roc: "Was it easy to find the items you were looking for?",
    exp: "Please rate your overall experience.",
  };

  const feedbackOpts = ["Excellent", "Good", "Bad"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#191919] py-16 px-4 sm:px-6 lg:px-8 pt-30">
      <div className="max-w-4xl mx-auto">
        {displayForm ? (
          <div className="bg-white dark:bg-[#303030] shadow-xl rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">Your Feedback Matters</h2>
              <p className="text-purple-100">
                We are committed to providing you with the best auction
                experience possible, so we welcome your comments.
              </p>
            </div>

            {/* Form */}
            <div className="p-8">
              <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                Please fill out this questionnaire to help us improve.
              </p>

              <form onSubmit={formSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 after:content-['*'] after:ml-0.5 after:text-red-500"
                    >
                      Customer Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      readOnly
                      value={nmValue}
                      className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-[#404040] px-4 py-3 text-gray-800 dark:text-gray-100 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    />
                    {showErrors && !nmValue && (
                      <p className="mt-2 text-sm text-red-600">
                        ⓘ Name is required
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 after:content-['*'] after:ml-0.5 after:text-red-500"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      readOnly
                      value={emValue}
                      className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-[#404040] px-4 py-3 text-gray-800 dark:text-gray-100 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    />
                    {showErrors &&
                      (!emValue ||
                        !emValue.includes("@") ||
                        !emValue.endsWith(".com")) && (
                        <p className="mt-2 text-sm text-red-600">
                          ⓘ {errorMsg}
                        </p>
                      )}
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 after:content-['*'] after:ml-0.5 after:text-red-500"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <PhoneInput
                      placeholder="Enter phone number"
                      value={phValue}
                      onChange={setPhValue}
                      className="w-full rounded-lg border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-800 dark:text-gray-100 shadow-sm focus:border-purple-500 focus:ring-purple-500 [&_.PhoneInputInput]:bg-gray-100 [&_.PhoneInputInput]:dark:bg-[#404040] [&_.PhoneInputInput]:dark:text-gray-100 [&_.PhoneInputCountrySelect]:dark:bg-[#404040] [&_.PhoneInputCountrySelect]:dark:text-gray-100 [&_.PhoneInputCountrySelectArrow]:dark:border-t-gray-100"
                    />
                  </div>
                  {showErrors && (!phValue || phValue.length < 10) && (
                    <p className="mt-2 text-sm text-red-600" id="phone-error">
                      ⓘ {errorMsg}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {Object.keys(feedbackType).map((ty) => (
                    <div
                      key={ty}
                      className="bg-gray-50 dark:bg-[#404040] p-4 rounded-lg shadow-sm"
                    >
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3 after:content-['*'] after:ml-0.5 after:text-red-500">
                        {feedbackType[ty]}
                      </label>
                      <div className="space-y-3">
                        {feedbackOpts.map((opt, key) => (
                          <div
                            key={`${ty}_${key}`}
                            className="flex items-center"
                          >
                            <input
                              id={`${ty}_${key}`}
                              name={`${ty}_feedback_opts`}
                              type="checkbox"
                              checked={checkedVal.includes(`${ty}_${opt}`)}
                              onChange={(e) =>
                                handleOnChange(e.target.checked, `${ty}_${opt}`)
                              }
                              className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-[#404040] text-purple-600 focus:ring-purple-500"
                            />
                            <label
                              htmlFor={`${ty}_${key}`}
                              className="ml-3 text-sm text-gray-700 dark:text-gray-300"
                            >
                              {opt}
                            </label>
                          </div>
                        ))}
                      </div>
                      {showErrors &&
                        !checkedVal.some((val) => val.startsWith(ty)) && (
                          <p
                            className="mt-2 text-sm text-red-600"
                            id={`er_${ty}`}
                          >
                            ⓘ {errorMsg}
                          </p>
                        )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
                  >
                    Submit Feedback
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#303030] shadow-xl rounded-2xl overflow-hidden text-center p-8">
            <div className="flex justify-center my-8">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-green-500 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Thank You for Your Feedback!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              We appreciate you taking the time to share your thoughts. We will
              work towards improving your experience.
            </p>
            <button
              onClick={() => (window.location.href = "/")}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
            >
              Return Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FeedbackForm;
