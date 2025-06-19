import { motion } from "framer-motion";

const pricingOptions = [
  {
    id: "option-1",
    price: "$9",
    period: "/mo",
    title: "Freelancer",
    features: [
      "1GB of space",
      "Unlimited traffic",
      "Forum access",
      "Support at $25/hour",
    ],
    color: "rose",
  },
  {
    id: "option-2",
    price: "$99",
    period: "/mo",
    title: "Business",
    features: [
      "5GB of space",
      "Unlimited traffic",
      "Forum access",
      "Priority support at $5/hour",
    ],
    color: "cyan",
  },
  {
    id: "option-3",
    price: "$499",
    period: "/mo",
    title: "Enterprise",
    features: [
      "20GB of space",
      "Unlimited traffic",
      "Forum access",
      "Dedicated support",
    ],
    color: "green",
  },
];

export default function PricingTable() {
  return (
    <div
      className="flex justify-center items-center min-h-screen px-6 py-12"
      style={{
        backgroundImage:
          "url('https://wallpapers.com/images/hd/pure-black-background-ew4xbck42qurzwry.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <motion.main
        className="grid md:grid-cols-3 gap-8 w-full max-w-5xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {pricingOptions.map((option) => (
          <motion.article
            key={option.id}
            className="relative shadow-lg rounded-xl overflow-hidden border border-[#444] transition-all duration-300"
            whileHover={{ scale: 1.02 }}
          >
            {/* Blur Layer (Background Only) */}
            <div className="absolute inset-0 backdrop-blur-lg bg-black/40"></div>

            {/* Content Layer (No Blur) */}
            <div className="relative z-10">
              {/* Header Section */}
              <motion.div
                className={`bg-gradient-to-r from-${option.color}-400 to-${option.color}-700 p-8 text-center text-white`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <p className="text-4xl font-bold">
                  {option.price}
                  <span className="text-base font-light">{option.period}</span>
                </p>
                <h2 className="uppercase font-medium tracking-wide text-lg">
                  {option.title}
                </h2>
              </motion.div>

              {/* Feature List */}
              <motion.ul
                className="mt-6 mb-8 space-y-3 text-sm text-center text-[#CCCCCC] px-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {option.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex justify-center items-center gap-2"
                  >
                    <span className="text-[#AAAAAA]">✔</span> {feature}
                  </li>
                ))}
              </motion.ul>

              {/* Selection Button */}
              <motion.div
                className="flex justify-center pb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <motion.button
                  className={`py-3 px-6 rounded-full font-medium uppercase text-sm transition-all duration-500 text-white bg-gradient-to-r from-${option.color}-400 to-${option.color}-600 hover:opacity-90`}
                  whileHover={{ scale: 1.05 }}
                >
                  Choose Plan
                </motion.button>
              </motion.div>
            </div>
          </motion.article>
        ))}
      </motion.main>
    </div>
  );
}
