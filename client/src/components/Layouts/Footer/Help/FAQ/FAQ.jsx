import React from "react";
import { MDBIcon } from "mdb-react-ui-kit";
import { useThemeProvider } from "../../../../AdminDashboard/utils/ThemeContext";

const FAQ = () => {
  const { currentTheme } = useThemeProvider();

  return (
    <div className={`${currentTheme === 'dark' ? 'bg-[#191919] text-gray-200' : 'bg-white text-gray-800'} py-10 px-5 md:px-20 mt-20`}>
      <section>
        <h3 className={`text-center text-3xl font-bold ${currentTheme === 'dark' ? 'text-sky-400' : 'text-sky-600'} mb-4`}>
          FAQ
        </h3>
        <p className={`text-center mb-8 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Find the answers for the most frequently asked questions below
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* FAQ Item 1 */}
          <div className="mb-6">
            <h6 className={`flex items-center ${currentTheme === 'dark' ? 'text-sky-400' : 'text-sky-600'} font-bold mb-3`}>
              <MDBIcon far icon="paper-plane" className={`${currentTheme === 'dark' ? 'text-sky-400' : 'text-sky-600'} pr-2`} /> A
              simple question?
            </h6>
            <p className={currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              <strong>
                <u>Absolutely!</u>
              </strong>{" "}
              We work with top payment companies which guarantees your safety
              and security. All billing information is stored on our payment
              processing partner.
            </p>
          </div>

          {/* FAQ Item 2 */}
          <div className="mb-6">
            <h6 className={`flex items-center ${currentTheme === 'dark' ? 'text-sky-400' : 'text-sky-600'} font-bold mb-3`}>
              <MDBIcon fas icon="pen-alt" className={`${currentTheme === 'dark' ? 'text-sky-400' : 'text-sky-600'} pr-2`} /> A
              question that is longer than the previous one?
            </h6>
            <p className={currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              <strong>
                <u>Yes, it is possible!</u>
              </strong>{" "}
              You can cancel your subscription anytime in your account. Once the
              subscription is cancelled, you will not be charged next month.
            </p>
          </div>

          {/* FAQ Item 3 */}
          <div className="mb-6">
            <h6 className={`flex items-center ${currentTheme === 'dark' ? 'text-sky-400' : 'text-sky-600'} font-bold mb-3`}>
              <MDBIcon fas icon="user" className={`${currentTheme === 'dark' ? 'text-sky-400' : 'text-sky-600'} pr-2`} /> A simple
              question?
            </h6>
            <p className={currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              Currently, we only offer monthly subscription. You can upgrade or
              cancel your monthly account at any time with no further
              obligation.
            </p>
          </div>

          {/* FAQ Item 4 */}
          <div className="mb-6">
            <h6 className={`flex items-center ${currentTheme === 'dark' ? 'text-sky-400' : 'text-sky-600'} font-bold mb-3`}>
              <MDBIcon fas icon="rocket" className={`${currentTheme === 'dark' ? 'text-sky-400' : 'text-sky-600'} pr-2`} /> A
              simple question?
            </h6>
            <p className={currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              Yes. Go to the billing section of your dashboard and update your
              payment information.
            </p>
          </div>

          {/* FAQ Item 5 */}
          <div className="mb-6">
            <h6 className={`flex items-center ${currentTheme === 'dark' ? 'text-sky-400' : 'text-sky-600'} font-bold mb-3`}>
              <MDBIcon fas icon="home" className={`${currentTheme === 'dark' ? 'text-sky-400' : 'text-sky-600'} pr-2`} /> A simple
              question?
            </h6>
            <p className={currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              <strong>
                <u>Unfortunately no</u>.
              </strong>{" "}
              We do not issue full or partial refunds for any reason.
            </p>
          </div>

          {/* FAQ Item 6 */}
          <div className="mb-6">
            <h6 className={`flex items-center ${currentTheme === 'dark' ? 'text-sky-400' : 'text-sky-600'} font-bold mb-3`}>
              <MDBIcon fas icon="book-open" className={`${currentTheme === 'dark' ? 'text-sky-400' : 'text-sky-600'} pr-2`} />{" "}
              Another question that is longer than usual
            </h6>
            <p className={currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              Of course! We're happy to offer a free plan to anyone who wants to
              try our service.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;