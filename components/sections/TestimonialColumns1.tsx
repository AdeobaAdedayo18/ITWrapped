"use client";
import React, { useState } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ExpandedStory } from "@/components/story/ExpandedStory";

export type Testimonial = {
  text: string;
  image: string;
  name: string;
  role: string;
  companyName: string;
  companyLogo: string;
};

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
  setOpenItem: (testimonial: Testimonial) => void;
  setOpenId: (id: string) => void;
}) => {
  // Track liked items by index
  const [liked, setLiked] = useState<{ [key: number]: boolean }>({});
  const toggleLike = (index: number) => {
    setLiked((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className={props.className}>
      <motion.div
        animate={{ translateY: "-50%" }}
        className="flex flex-col gap-6 pb-6 bg-background"
      >
        {[...new Array(2)].map((_, repeatIndex) => (
          <React.Fragment key={repeatIndex}>
            {props.testimonials.map(
              ({ text, image, name, role, companyName, companyLogo }, i) => {
                const isLiked = liked[i];
                const id = `${repeatIndex}-${i}`;
                return (
                  <article
                    key={id}
                    onClick={() => {
                      props.setOpenItem({
                        text,
                        image,
                        name,
                        role,
                        companyName,
                        companyLogo,
                      });
                      props.setOpenId(id);
                    }}
                    className="p-8 rounded-2xl border shadow-md shadow-slate/10 max-w-sm w-[600px] bg-card cursor-pointer"
                  >
                    <p className="text-md font-medium leading-6">{text}</p>
                    <div className="flex items-center gap-2 mt-5">
                      <img
                        width={40}
                        height={40}
                        src={image}
                        alt={name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="flex flex-col">
                        <div className="font-semibold tracking-tight leading-5">
                          {name}
                        </div>
                        <div className="leading-5 opacity-90 tracking-tight flex items-center gap-2">
                          <span>{role}</span>
                          <span>·</span>
                          <img
                            src={companyLogo}
                            alt={companyName}
                            className="h-4 w-4 rounded-sm border object-contain"
                          />
                          <span>{companyName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label="Love"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent event bubbling to parent article
                              toggleLike(i);
                            }}
                            className={`transition-colors flex items-center gap-1 rounded-full px-3 py-1 
                                        ${
                                          isLiked
                                            ? "text-red-500"
                                            : "text-gray-600 hover:text-red-500"
                                        }`}
                          >
                            <motion.div
                              animate={
                                isLiked ? { scale: [1, 1.4, 1] } : { scale: 1 }
                              }
                              transition={{ duration: 0.3 }}
                            >
                              <Heart
                                className={`transition-colors ${
                                  isLiked ? "fill-red-500 text-red-500" : ""
                                }`}
                              />
                            </motion.div>
                            <motion.span
                              animate={
                                isLiked
                                  ? { scale: [1, 1.3, 1], color: "#ef4444" }
                                  : { scale: 1, color: "#4b5563" }
                              }
                              transition={{ duration: 0.3 }}
                            >
                              {isLiked ? 127 : 126}
                            </motion.span>
                          </Button>
                        </motion.div>

                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label="Comment"
                          onClick={(e) => e.stopPropagation()} // Prevent event bubbling to parent article
                          className="text-gray-600 hover:text-blue-500 transition-colors"
                        >
                          <MessageCircle className="mr-1" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Share"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent event bubbling to parent article
                          const shareData = {
                            title: `${name} on ITwrapped`,
                            text,
                            url:
                              typeof window !== "undefined"
                                ? window.location.href
                                : "",
                          };
                          if (navigator.share) navigator.share(shareData);
                        }}
                        className="text-gray-600 hover:text-green-500 transition-colors"
                      >
                        <Share2 className="mr-1" />
                      </Button>
                    </div>
                  </article>
                );
              }
            )}
            {/* <ExpandedStory
              open={openId !== null}
              onClose={() => setOpenId(null)}
              item={openItem}
              layoutId={openId || ""}
            /> */}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};
