import { motion } from "framer-motion";
import { TestimonialsColumns } from "@/components/sections/TestimonialColumns";
import type { Testimonial as StoryTestimonial } from "@/components/sections/TestimonialColumns1";

export const TestimonialsWall = ({
  testimonials,
}: {
  testimonials: StoryTestimonial[];
}) => {
  return (
    <section className="bg-background my-20 relative">
      <div className="container z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[640px] mx-auto"
        >
          <div className="flex items-center gap-2 justify-center">
            <img
              src="https://api.dicebear.com/7.x/big-smile/svg?seed=Bitmoji"
              alt="bitmoji"
              className="h-8 w-8 rounded-full"
            />
            <div className="border py-1 px-4 rounded-lg">Latest Stories</div>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold tracking-tight mt-5 text-center">
            What students are saying
          </h2>
          <p className="text-center mt-4 opacity-80">
            Filter by company from the sidebar to tailor the feed.
          </p>
        </motion.div>

        <TestimonialsColumns testimonials={testimonials} />
      </div>
    </section>
  );
};
