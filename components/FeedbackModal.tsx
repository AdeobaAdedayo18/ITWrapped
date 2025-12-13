"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
  useModal,
} from "./ui/animated-modal";
import { motion } from "framer-motion";

export function FeedbackModal() {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ feedback }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFeedback("");
        setTimeout(() => {
          setSubmitted(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal>
      <ModalTrigger className="h-16 bg-black px-4 text-lg font-medium text-white hover:bg-primary hover:text-black transition-colors relative overflow-hidden rounded-none">
        <span className="relative z-10">What would make IT Wrapped better</span>
      </ModalTrigger>
      <ModalBody>
        <ModalContent>
          {!submitted ? (
            <>
              <motion.h4
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg md:text-2xl text-neutral-900 dark:text-neutral-100 font-bold text-center mb-8"
              >
                What would make{" "}
                <span className="px-1 py-0.5 rounded-md bg-primary/20 border border-primary/30">
                  IT Wrapped
                </span>{" "}
                better? 💡
              </motion.h4>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="w-full"
              >
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Just tell me what you want and I will spend my own precious time building it😂😂"
                  className="w-full min-h-[200px] p-4 rounded-lg border-2 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-y"
                  disabled={isSubmitting}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400"
              >
                Your feedback helps make IT Wrapped better for everyone! 🚀
              </motion.div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6"
              >
                <span className="text-4xl">🍀</span>
              </motion.div>
              <motion.h4
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 text-center mb-2"
              >
                Alright wish the developer luck
              </motion.h4>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-neutral-600 dark:text-neutral-400 text-center"
              >
                Your feedback has been sent! 🎉
              </motion.p>
            </motion.div>
          )}
        </ModalContent>
        {!submitted && (
          <ModalFooter className="gap-4">
            <ModalCloseButton />
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !feedback.trim()}
              className="bg-black text-white dark:bg-white dark:text-black text-sm px-6 py-2 rounded-md border border-black hover:bg-primary hover:text-black hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isSubmitting ? "Sending..." : "Submit"}
            </button>
          </ModalFooter>
        )}
      </ModalBody>
    </Modal>
  );
}

function ModalCloseButton() {
  const { setOpen } = useModal();
  return (
    <button
      onClick={() => setOpen(false)}
      className="px-6 py-2 bg-gray-200 text-black dark:bg-neutral-800 dark:border-neutral-700 dark:text-white border border-gray-300 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-neutral-700 transition-colors font-medium"
    >
      Cancel
    </button>
  );
}
