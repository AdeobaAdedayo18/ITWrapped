import type { Testimonial } from "@/components/sections/TestimonialColumns1";

export type Company = { name: string; logo: string; slug: string };

export const companies: Company[] = [
  { name: "Google", slug: "google", logo: "https://logo.clearbit.com/google.com" },
  { name: "Microsoft", slug: "microsoft", logo: "https://logo.clearbit.com/microsoft.com" },
  { name: "Apple", slug: "apple", logo: "https://logo.clearbit.com/apple.com" },
  { name: "Amazon", slug: "amazon", logo: "https://logo.clearbit.com/amazon.com" },
  { name: "Meta", slug: "meta", logo: "https://logo.clearbit.com/meta.com" },
  { name: "Netflix", slug: "netflix", logo: "https://logo.clearbit.com/netflix.com" },
  { name: "Stripe", slug: "stripe", logo: "https://logo.clearbit.com/stripe.com" },
  { name: "Shopify", slug: "shopify", logo: "https://logo.clearbit.com/shopify.com" },
  { name: "Coinbase", slug: "coinbase", logo: "https://logo.clearbit.com/coinbase.com" },
  { name: "Adobe", slug: "adobe", logo: "https://logo.clearbit.com/adobe.com" },
  { name: "OpenAI", slug: "openai", logo: "https://logo.clearbit.com/openai.com" },
  { name: "Tesla", slug: "tesla", logo: "https://logo.clearbit.com/tesla.com" },
  { name: "NVIDIA", slug: "nvidia", logo: "https://logo.clearbit.com/nvidia.com" },
  { name: "Figma", slug: "figma", logo: "https://logo.clearbit.com/figma.com" },
  { name: "Notion", slug: "notion", logo: "https://logo.clearbit.com/notion.so" },
  { name: "Airbnb", slug: "airbnb", logo: "https://logo.clearbit.com/airbnb.com" },
  { name: "Slack", slug: "slack", logo: "https://logo.clearbit.com/slack.com" },
  { name: "Spotify", slug: "spotify", logo: "https://logo.clearbit.com/spotify.com" },
  { name: "Canva", slug: "canva", logo: "https://logo.clearbit.com/canva.com" },
  { name: "Zoom", slug: "zoom", logo: "https://logo.clearbit.com/zoom.us" },
];

export const testimonials: Testimonial[] = [
  {
    text:
      "Reading these stories helped me prep for my first standup and not overthink my imposter syndrome. Real talk from students who were just there.",
    image: "https://api.dicebear.com/7.x/big-smile/svg?seed=Ada",
    name: "Ada O.",
    role: "Design Intern",
    companyName: "Google",
    companyLogo: "https://logo.clearbit.com/google.com",
  },
  {
    text:
      "They shared exactly what the first week looked like at a FAANG internship. Helped shared exactly what the first week looked like at a FAANG internship. Helped shared exactly what the first week looked like at a FAANG internship. Helped shared exactly what the first week looked like at a FAANG internship. Helped shared exactly what the first week looked like at a FAANG internship. Helped shared exactly what the first week looked like at a FAANG internship. Helped shared exactly what the first week looked like at a FAANG internship. Helped shared exactly what the first week looked like at a FAANG internship. Helped shared exactly what the first week looked like at a FAANG internship. Helped me set expectations and breathe.",
    image: "https://api.dicebear.com/7.x/big-smile/svg?seed=Ben",
    name: "Ben S.",
    role: "SWE Intern",
    companyName: "Microsoft",
    companyLogo: "https://logo.clearbit.com/microsoft.com",
  },
  {
    text:
      "Loved the honest bits about manager 1:1s and feedback. No fluff, just useful advice you can actually apply.",
    image: "https://api.dicebear.com/7.x/big-smile/svg?seed=Chloe",
    name: "Chloe A.",
    role: "PM Intern",
    companyName: "Apple",
    companyLogo: "https://logo.clearbit.com/apple.com",
  },
  {
    text:
      "The portfolio tips and day-in-the-life posts were gold. I shipped my first feature in week two.",
    image: "https://api.dicebear.com/7.x/big-smile/svg?seed=Diego",
    name: "Diego R.",
    role: "SWE Intern",
    companyName: "Amazon",
    companyLogo: "https://logo.clearbit.com/amazon.com",
  },
  {
    text:
      "Helped me ask better questions and not panic when nothing worked on day one.",
    image: "https://api.dicebear.com/7.x/big-smile/svg?seed=Eve",
    name: "Eve K.",
    role: "Data Intern",
    companyName: "Meta",
    companyLogo: "https://logo.clearbit.com/meta.com",
  },
  {
    text:
      "Finally a place where interns are honest about both wins and misses. It’s refreshing.",
    image: "https://api.dicebear.com/7.x/big-smile/svg?seed=Finn",
    name: "Finn T.",
    role: "Research Intern",
    companyName: "Netflix",
    companyLogo: "https://logo.clearbit.com/netflix.com",
  },
  {
    text:
      "Reading at night before my offer call gave me so much context. I felt ready.",
    image: "https://api.dicebear.com/7.x/big-smile/svg?seed=Gwen",
    name: "Gwen L.",
    role: "Design Intern",
    companyName: "Stripe",
    companyLogo: "https://logo.clearbit.com/stripe.com",
  },
  {
    text:
      "This community got me through a rough sprint. The comments were supportive and practical.",
    image: "https://api.dicebear.com/7.x/big-smile/svg?seed=Hector",
    name: "Hector M.",
    role: "Mobile Intern",
    companyName: "Shopify",
    companyLogo: "https://logo.clearbit.com/shopify.com",
  },
  {
    text:
      "I shared my story and immediately got DMs from sophomores with great questions. Paying it forward feels good.",
    image: "https://api.dicebear.com/7.x/big-smile/svg?seed=Ivy",
    name: "Ivy P.",
    role: "Security Intern",
    companyName: "Coinbase",
    companyLogo: "https://logo.clearbit.com/coinbase.com",
  },
  {
    text:
      "I didn’t expect to find so many real stories from people in roles like mine. I ended up connecting with my now-mentor through here!",
    image: "https://api.dicebear.com/7.x/big-smile/svg?seed=Jamal",
    name: "Jamal T.",
    role: "AI Research Intern",
    companyName: "OpenAI",
    companyLogo: "https://logo.clearbit.com/openai.com",
  },
  {
    text:
      "Reading how others handled feedback loops at design critiques gave me so much confidence going into my own sessions.",
    image: "https://api.dicebear.com/7.x/big-smile/svg?seed=Kira",
    name: "Kira D.",
    role: "UX Intern",
    companyName: "Figma",
    companyLogo: "https://logo.clearbit.com/figma.com",
  },
  {
    text:
      "The engineering culture stories from Tesla interns were wild. It helped me understand how to adapt to a fast-moving environment.",
    image: "https://api.dicebear.com/7.x/big-smile/svg?seed=Leo",
    name: "Leo G.",
    role: "Embedded Systems Intern",
    companyName: "Tesla",
    companyLogo: "https://logo.clearbit.com/tesla.com",
  },
  {
    text:
      "Before reading these posts, I thought everyone had it all figured out. Turns out, most interns are learning as they go too!",
    image: "https://api.dicebear.com/7.x/big-smile/svg?seed=Maya",
    name: "Maya C.",
    role: "Marketing Intern",
    companyName: "Canva",
    companyLogo: "https://logo.clearbit.com/canva.com",
  },
  {
    text:
      "I learned how to communicate blockers effectively from someone’s week-one post. That tip alone made my onboarding smoother.",
    image: "https://api.dicebear.com/7.x/big-smile/svg?seed=Noah",
    name: "Noah F.",
    role: "Backend Intern",
    companyName: "NVIDIA",
    companyLogo: "https://logo.clearbit.com/nvidia.com",
  },
  {
    text:
      "Seeing others juggle work and remote culture at Slack made me feel less alone. I applied some of their tips immediately.",
    image: "https://api.dicebear.com/7.x/big-smile/svg?seed=Olivia",
    name: "Olivia J.",
    role: "Comms Intern",
    companyName: "Slack",
    companyLogo: "https://logo.clearbit.com/slack.com",
  },
  {
    text:
      "People underestimate how much small, honest advice can change how you show up to work. This platform nails that.",
    image: "https://api.dicebear.com/7.x/big-smile/svg?seed=Paul",
    name: "Paul W.",
    role: "Finance Intern",
    companyName: "Zoom",
    companyLogo: "https://logo.clearbit.com/zoom.us",
  },
  {
    text:
      "Someone shared their first cold-email success story and it pushed me to try. I landed my dream internship because of it.",
    image: "https://api.dicebear.com/7.x/big-smile/svg?seed=Quinn",
    name: "Quinn R.",
    role: "Growth Intern",
    companyName: "Notion",
    companyLogo: "https://logo.clearbit.com/notion.so",
  },
  {
    text:
      "I keep coming back because these posts feel like talking to a big sibling who’s just one step ahead.",
    image: "https://api.dicebear.com/7.x/big-smile/svg?seed=Rosa",
    name: "Rosa E.",
    role: "ML Intern",
    companyName: "Adobe",
    companyLogo: "https://logo.clearbit.com/adobe.com",
  },
  {
    text:
      "Short and insightful stories like ‘what I wish I knew before my internship’ are what make this community special.",
    image: "https://api.dicebear.com/7.x/big-smile/svg?seed=Sam",
    name: "Sam L.",
    role: "DevOps Intern",
    companyName: "Spotify",
    companyLogo: "https://logo.clearbit.com/spotify.com",
  },
  {
    text:
      "These testimonials made me realize that career growth isn’t linear — it’s about learning from every experience.",
    image: "https://api.dicebear.com/7.x/big-smile/svg?seed=Tara",
    name: "Tara M.",
    role: "AI Intern",
    companyName: "Airbnb",
    companyLogo: "https://logo.clearbit.com/airbnb.com",
  },
];
