"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <AnimatePresence mode="wait">
      {status === "sent" ? (
        <motion.p
          key="sent"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-ink"
        >
          Thanks — she'll be in touch soon.
        </motion.p>
      ) : (
        <motion.form
          key="form"
          exit={{ opacity: 0 }}
          onSubmit={submit}
          className="flex max-w-md flex-col gap-4"
        >
          <input
            required
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border border-line bg-transparent p-2 text-ink transition-colors duration-200 focus:border-gold"
          />
          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border border-line bg-transparent p-2 text-ink transition-colors duration-200 focus:border-gold"
          />
          <textarea
            required
            rows={5}
            placeholder="Tell her about your production"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="border border-line bg-transparent p-2 text-ink transition-colors duration-200 focus:border-gold"
          />
          <motion.button
            whileTap={{ scale: 0.96 }}
            disabled={status === "sending"}
            className={`w-fit border border-gold px-4 py-2 text-sm text-gold disabled:opacity-50 ${
              status === "sending" ? "animate-pulse" : ""
            }`}
          >
            {status === "sending" ? "Sending…" : "Send"}
          </motion.button>
          {status === "error" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-red-700"
            >
              Something went wrong — try again.
            </motion.p>
          )}
        </motion.form>
      )}
    </AnimatePresence>
  );
}
