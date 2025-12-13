import React, { useState } from "react";
import {
  TestimonialsColumn,
  type Testimonial,
} from "@/components/sections/TestimonialColumns1";
import { ExpandedStory } from "../story/ExpandedStory";

function chunkIntoColumns(items: Testimonial[], cols: number): Testimonial[][] {
  const out: Testimonial[][] = Array.from({ length: cols }, () => []);
  items.forEach((item, i) => {
    out[i % cols].push(item);
  });
  return out;
}

export function TestimonialsColumns({
  testimonials,
  durations = [15, 19, 17],
}: {
  testimonials: Testimonial[];
  durations?: number[];
}) {
  const [c1, c2, c3] = chunkIntoColumns(testimonials, 3);
  const [openId, setOpenId] = useState<string | null>(null);
  const [openItem, setOpenItem] = useState<Testimonial | null>(null);
  return (
    <div className="flex justify-center gap-6 mt-10 overflow-hidden">
      <TestimonialsColumn
        testimonials={c1}
        duration={durations[0] ?? 15}
        setOpenItem={setOpenItem}
        setOpenId={setOpenId}
      />
      <TestimonialsColumn
        testimonials={c2}
        className="hidden md:block"
        duration={durations[1] ?? 19}
        setOpenItem={setOpenItem}
        setOpenId={setOpenId}
      />
      <TestimonialsColumn
        testimonials={c3}
        className="hidden lg:block"
        duration={durations[2] ?? 17}
        setOpenItem={setOpenItem}
        setOpenId={setOpenId}
      />
      <ExpandedStory
        open={openId !== null}
        onClose={() => setOpenId(null)}
        item={openItem}
        layoutId={openId || ""}
      />
    </div>
  );
}
