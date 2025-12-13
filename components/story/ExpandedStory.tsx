import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Plus,
  Minus,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Testimonial } from "@/components/sections/TestimonialColumns1";
import { cn } from "@/lib/utils";

export type Comment = {
  id: string;
  author: string;
  avatar: string;
  text: string;
  likes: number;
  replies?: Comment[];
};

function CommentNode({ node, depth = 0 }: { node: Comment; depth?: number }) {
  const [open, setOpen] = useState(true);
  const [liked, setLiked] = useState(false);
  return (
    <div className="mt-3 relative">
      {depth > 0 && (
        <div
          aria-hidden
          className="absolute -left-4 top-0 h-5 w-4 border-l border-b border-border rounded-bl-xl"
        />
      )}
      <div className="flex items-start gap-3">
        <img
          src={node.avatar}
          alt={node.author}
          className="h-8 w-8 rounded-full border object-cover"
        />
        <div className="flex-1">
          <div className="text-sm font-medium">{node.author}</div>
          <div className="text-sm opacity-80 leading-6">{node.text}</div>
          <div className="mt-1 flex items-center gap-2 text-xs opacity-70">
            <button
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-md",
                liked && "text-red-500"
              )}
              onClick={() => setLiked((v) => !v)}
            >
              <Heart
                className={cn(
                  "h-3.5 w-3.5",
                  liked && "fill-red-500 text-red-500"
                )}
              />{" "}
              {liked ? node.likes + 1 : node.likes}
            </button>
            {node.replies && node.replies.length > 0 && (
              <button
                className="flex items-center gap-1 px-2 py-1 rounded-md"
                onClick={() => setOpen((v) => !v)}
              >
                {open ? (
                  <Minus className="h-3.5 w-3.5" />
                ) : (
                  <Plus className="h-3.5 w-3.5" />
                )}{" "}
                {open ? "Hide" : "Show"} replies
              </button>
            )}
          </div>
          {open && node.replies && node.replies.length > 0 && (
            <div className="ml-4 border-l pl-4">
              {node.replies.map((r) => (
                <CommentNode node={r} key={r.id} depth={depth + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function sampleComments(): Comment[] {
  return [
    {
      id: "c1",
      author: "happyan...",
      avatar: "https://api.dicebear.com/7.x/big-smile/svg?seed=h1",
      text: "drop them from your life lol they sound like an insecure sore loser",
      likes: 132,
      replies: [
        {
          id: "c1-1",
          author: "captain_clanker",
          avatar: "https://api.dicebear.com/7.x/big-smile/svg?seed=h2",
          text: "+1, protect your energy. Focus on growth not approval.",
          likes: 42,
        },
      ],
    },
    {
      id: "c2",
      author: "L0udSilence",
      avatar: "https://api.dicebear.com/7.x/big-smile/svg?seed=h3",
      text: "That’s not a friend.",
      likes: 237,
    },
    {
      id: "c1",
      author: "happyan...",
      avatar: "https://api.dicebear.com/7.x/big-smile/svg?seed=h1",
      text: "drop them from your life lol they sound like an insecure sore loser",
      likes: 132,
      replies: [
        {
          id: "c1-1",
          author: "captain_clanker",
          avatar: "https://api.dicebear.com/7.x/big-smile/svg?seed=h2",
          text: "+1, protect your energy. Focus on growth not approval.",
          likes: 42,
        },
      ],
    },
    {
      id: "c2",
      author: "L0udSilence",
      avatar: "https://api.dicebear.com/7.x/big-smile/svg?seed=h3",
      text: "That’s not a friend.",
      likes: 237,
    },
    {
      id: "c1",
      author: "happyan...",
      avatar: "https://api.dicebear.com/7.x/big-smile/svg?seed=h1",
      text: "drop them from your life lol they sound like an insecure sore loser",
      likes: 132,
      replies: [
        {
          id: "c1-1",
          author: "captain_clanker",
          avatar: "https://api.dicebear.com/7.x/big-smile/svg?seed=h2",
          text: "+1, protect your energy. Focus on growth not approval.",
          likes: 42,
        },
      ],
    },
    {
      id: "c2",
      author: "L0udSilence",
      avatar: "https://api.dicebear.com/7.x/big-smile/svg?seed=h3",
      text: "That’s not a friend.",
      likes: 237,
    },
    {
      id: "c1",
      author: "happyan...",
      avatar: "https://api.dicebear.com/7.x/big-smile/svg?seed=h1",
      text: "drop them from your life lol they sound like an insecure sore loser",
      likes: 132,
      replies: [
        {
          id: "c1-1",
          author: "captain_clanker",
          avatar: "https://api.dicebear.com/7.x/big-smile/svg?seed=h2",
          text: "+1, protect your energy. Focus on growth not approval.",
          likes: 42,
        },
      ],
    },
    {
      id: "c2",
      author: "L0udSilence",
      avatar: "https://api.dicebear.com/7.x/big-smile/svg?seed=h3",
      text: "That’s not a friend.",
      likes: 237,
    },
    {
      id: "c1",
      author: "happyan...",
      avatar: "https://api.dicebear.com/7.x/big-smile/svg?seed=h1",
      text: "drop them from your life lol they sound like an insecure sore loser",
      likes: 132,
      replies: [
        {
          id: "c1-1",
          author: "captain_clanker",
          avatar: "https://api.dicebear.com/7.x/big-smile/svg?seed=h2",
          text: "+1, protect your energy. Focus on growth not approval.",
          likes: 42,
        },
      ],
    },
    {
      id: "c2",
      author: "L0udSilence",
      avatar: "https://api.dicebear.com/7.x/big-smile/svg?seed=h3",
      text: "That’s not a friend.",
      likes: 237,
    },
    {
      id: "c1",
      author: "happyan...",
      avatar: "https://api.dicebear.com/7.x/big-smile/svg?seed=h1",
      text: "drop them from your life lol they sound like an insecure sore loser",
      likes: 132,
      replies: [
        {
          id: "c1-1",
          author: "captain_clanker",
          avatar: "https://api.dicebear.com/7.x/big-smile/svg?seed=h2",
          text: "+1, protect your energy. Focus on growth not approval.",
          likes: 42,
        },
        {
          id: "c1-2",
          author: "happyan...",
          avatar: "https://api.dicebear.com/7.x/big-smile/svg?seed=h1",
          text: "drop them from your life lol they sound like an insecure sore loser",
          likes: 132,
          replies: [
            {
              id: "c1-2-1",
              author: "captain_clanker",
              avatar: "https://api.dicebear.com/7.x/big-smile/svg?seed=h2",
              text: "+1, protect your energy. Focus on growth not approval.",
              likes: 42,
            },
          ],
        },
      ],
    },
    {
      id: "c2",
      author: "L0udSilence",
      avatar: "https://api.dicebear.com/7.x/big-smile/svg?seed=h3",
      text: "That’s not a friend.",
      likes: 237,
    },
  ];
}

export function ExpandedStory({
  open,
  onClose,
  item,
  layoutId,
}: {
  open: boolean;
  onClose: () => void;
  item: Testimonial | null;
  layoutId: string;
}) {
  const escHandler = (e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };
  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", escHandler);
    return () => document.removeEventListener("keydown", escHandler);
  }, [open]);

  const comments = sampleComments();
  const [commentText, setCommentText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [likedStory, setLikedStory] = useState(false);
  const [likeCount, setLikeCount] = useState(126);

  const handlePublish = () => {
    const text = commentText.trim();
    if (!text) return;
    // TODO: wire to your backend or state store
    // For now we just clear the textarea
    setCommentText("");
    setIsFocused(false);
  };

  return (
    <AnimatePresence>
      {open && item && (
        <div className="fixed inset-0 z-[70]">
          <motion.button
            className="absolute inset-0 bg-black/40 animate-ricochet-in"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-label="Close"
          />

          <motion.div
            layoutId={`card-${layoutId}`}
            className="expanded-story absolute inset-0 animate-ricochet-in md:inset-[10vh] md:inset-2x md:left-[20vw] md:bottom-[10vh]  md:-translate-y-1/2 md:h-auto md:max-h-[80vh] md:w-[60vw] overflow-auto rounded-2xl bg-card border shadow-xl"
            // initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
            style={{
              animationDelay: "250ms", // increased from 2000ms to 3500ms
            }}
          >
            <div className="flex items-center gap-2 p-4 border-b sticky top-0 bg-card z-10">
              <button
                className="md:hidden p-2 rounded hover:bg-accent"
                aria-label="Back"
                onClick={onClose}
              >
                <ArrowLeft />
              </button>
              <div className="flex items-center gap-2">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-8 w-8 rounded-full border object-cover"
                />
                <div className="text-sm font-medium">{item.name}</div>
              </div>
              <button
                className="ml-auto p-2 rounded hover:bg-accent hidden md:inline-flex"
                onClick={onClose}
                aria-label="Close"
              >
                <X />
              </button>
            </div>

            <div className="p-6">
              <div className="text-base sm:text-lg leading-7">{item.text}</div>
              <div className="mt-3 text-sm opacity-70 flex items-center gap-2">
                <span>{item.role}</span>
                <span>·</span>
                <img
                  src={item.companyLogo}
                  alt={item.companyName}
                  className="h-4 w-4 rounded-sm border object-contain"
                />
                <span>{item.companyName}</span>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label="Love"
                    onClick={() => {
                      setLikedStory((prev) => {
                        const next = !prev;
                        setLikeCount((c) => c + (next ? 1 : -1));
                        return next;
                      });
                    }}
                    className={`transition-colors flex items-center gap-1 rounded-full px-3 py-1 ${
                      likedStory
                        ? "text-red-500"
                        : "text-gray-600 hover:text-red-500"
                    }`}
                  >
                    <motion.div
                      animate={
                        likedStory ? { scale: [1, 1.4, 1] } : { scale: 1 }
                      }
                      transition={{ duration: 0.3 }}
                    >
                      <Heart
                        className={`transition-colors ${
                          likedStory ? "fill-red-500 text-red-500" : ""
                        }`}
                      />
                    </motion.div>
                    <motion.span
                      animate={
                        likedStory
                          ? { scale: [1, 1.3, 1], color: "#ef4444" }
                          : { scale: 1, color: "#4b5563" }
                      }
                      transition={{ duration: 0.3 }}
                    >
                      {likeCount}
                    </motion.span>
                  </Button>
                </motion.div>
                <Button variant="ghost" size="sm" aria-label="Share">
                  <Share2 className="mr-1" /> Share
                </Button>
              </div>

              <div className="mt-6">
                <div className="text-sm font-semibold mb-2">
                  Join the conversation
                </div>
                <div
                  data-slot="input-group"
                  role="group"
                  className={cn(
                    "group/input-group border-input relative flex w-full items-stretch rounded-md border shadow-xs transition-[color,box-shadow] outline-none",
                    "h-auto min-w-0",
                    "has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot=input-group-control]:focus-visible]:ring-[3px]"
                  )}
                >
                  <div
                    role="group"
                    data-slot="input-group-addon"
                    data-align="inline-start"
                    className="text-muted-foreground flex h-auto cursor-text items-start py-1.5 justify-center gap-2  text-sm font-medium select-none px-3"
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest("button")) return;
                      (
                        e.currentTarget.parentElement?.querySelector(
                          "textarea[data-slot='input-group-control']"
                        ) as HTMLTextAreaElement | null
                      )?.focus();
                    }}
                  >
                    <img
                      src="https://api.dicebear.com/7.x/big-smile/svg?seed=you"
                      className="h-8 w-8 rounded-full border"
                      alt="you"
                    />
                  </div>

                  <textarea
                    data-slot="input-group-control"
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => {
                      setCommentText(e.target.value);
                      // Auto-expand the textarea as text increases
                      const ta = e.target as HTMLTextAreaElement;
                      ta.style.height = "auto";
                      ta.style.height = Math.min(ta.scrollHeight, 200) + "px"; // 200px max
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => {
                      if (!commentText.trim()) setIsFocused(false);
                    }}
                    onKeyDown={(e) => {
                      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                        e.preventDefault();
                        handlePublish();
                      }
                    }}
                    style={{
                      overflowY: "auto",
                      maxHeight: 200,
                    }}
                    className={cn(
                      "flex-1 resize-none rounded-none border-0 bg-transparent py-3 pr-2 text-sm shadow-none focus-visible:ring-0 outline-none min-h-[72px]"
                    )}
                  />

                  {(isFocused || commentText.trim().length > 0) && (
                    <div
                      role="group"
                      data-slot="input-group-addon"
                      data-align="inline-end"
                      className="text-muted-foreground flex h-auto items-center justify-center gap-2  text-sm font-medium select-none pr-0.5 py-0.5 "
                    >
                      <Button
                        type="button"
                        size="sm"
                        className="h-full w-12 p-0 rounded-md bg-black text-white hover:text-black"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={handlePublish}
                        aria-label="Publish comment"
                        title="Send (Ctrl+Enter)"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6">
                {comments.map((c) => (
                  <CommentNode node={c} key={c.id} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
