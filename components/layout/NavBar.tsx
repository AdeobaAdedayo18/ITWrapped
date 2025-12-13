"use client";

import { FeedbackModal } from "../FeedbackModal";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-black bg-white">
      <div className="w-full flex h-16 items-center justify-between pl-6">
        <div className="flex items-center gap-3">
          <a
            className="font-bold tracking-tight text-2xl md:text-4xl"
            href="#"
            aria-label="Gumroad home"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            ITwrapped
          </a>
          <span className="inline-flex items-center gap-1 rounded-full border border-neutral-300 px-2.5 py-0.5 text-xs">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            7.2K
          </span>
        </div>

        <div className="flex items-center gap-8">
          <div className="pl-8 flex items-center justify-end">
            <FeedbackModal />
          </div>
        </div>
      </div>
    </header>
  );
}
