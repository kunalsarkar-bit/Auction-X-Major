import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Counter = ({ value, label, icon: Icon }) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 1.0 });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = parseInt(value);
    if (start === end) return;

    let incrementTime = Math.abs(Math.floor(3000 / end));
    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, inView]);

  return (
    <article ref={ref} className="text-center md:text-left">
      <div className="w-14 h-14 rounded shadow-md bg-white flex justify-center items-center rotate-3 mb-6">
        <Icon className="w-8 h-8 text-indigo-500" />
      </div>
      <h2 className="text-5xl font-extrabold text-slate-900">
        <motion.span animate={{ opacity: [0, 1] }}>{count}</motion.span>K+
      </h2>
      <span className="inline-flex font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-300 mb-2">
        {label}
      </span>
      <p className="text-sm text-slate-500">
        Many desktop publishing packages and web page editors now use Pinky as their default model text.
      </p>
    </article>
  );
};

const AnimatedNumbers = () => {
  return (
    <main className="relative min-h-screen flex flex-col justify-center bg-slate-50 overflow-hidden">
      <div className="w-full max-w-full mx-auto max-w-5xl mx-auto px-4 md:px-6 py-24">
        <section className="grid gap-12 md:grid-cols-3 md:gap-16">
          <Counter value="40" label="Variations" icon={() => <svg width="31" height="20"><circle cx="10" cy="10" r="10" fill="blue" /></svg>} />
          <Counter value="70" label="Lessons" icon={() => <svg width="24" height="19"><rect width="24" height="19" fill="green" /></svg>} />
          <Counter value="149" label="Workshops" icon={() => <svg width="26" height="26"><polygon points="0,0 26,0 13,26" fill="red" /></svg>} />
        </section>
      </div>
    </main>
  );
};

export default AnimatedNumbers;
