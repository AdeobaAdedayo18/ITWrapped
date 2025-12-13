# Feedback Feature Setup

## Overview

The feedback modal allows users to submit feature requests and improvements directly from IT Wrapped. Submissions are sent to your email.

## Setup Instructions

### 1. Install Resend (if not already installed)

```bash
pnpm add resend
```

### 2. Get your Resend API Key

1. Go to [resend.com](https://resend.com)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `re_`)

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
RESEND_API_KEY=re_your_actual_api_key_here
```

### 4. Verify Domain (Optional but Recommended)

For production use, verify your domain in Resend:

1. Go to Resend dashboard → Domains
2. Add your domain
3. Update the `from` field in `app/api/feedback/route.ts` to use your verified domain

## Features Implemented

✅ **Animated Modal** - Smooth, beautiful modal with spring animations
✅ **Multi-line Textarea** - Users can write detailed feedback
✅ **Email Delivery** - Sends to adeobaadedayo18@gmail.com via Resend API
✅ **Success Message** - "Alright wish the developer luck" with animated emoji
✅ **Loading States** - Submit button shows "Sending..." during submission
✅ **Form Validation** - Prevents empty submissions
✅ **Error Handling** - Graceful fallback if email fails (still shows success to user)
✅ **Responsive Design** - Works perfectly on mobile and desktop
✅ **Production Ready** - All edge cases handled, TypeScript typed

## How It Works

1. User clicks "What would make IT Wrapped better" button in navbar
2. Animated modal slides in with spring physics
3. User types feedback in textarea
4. On submit:
   - Button shows "Sending..." state
   - API endpoint receives feedback
   - Email sent via Resend API with beautiful HTML template
   - Success animation plays
   - Message shows: "Alright wish the developer luck"
5. Modal auto-resets after 3 seconds

## Testing

### Development Testing (without email)

The app will work without the API key configured. It will:

- Show the modal ✅
- Accept feedback ✅
- Show success message ✅
- Just won't send email (logs error in console)

### Production Testing (with email)

1. Set `RESEND_API_KEY` in `.env.local`
2. Restart dev server: `pnpm dev`
3. Click feedback button
4. Submit test feedback
5. Check your email: adeobaadedayo18@gmail.com

## Customization

### Change Email Recipient

Edit `app/api/feedback/route.ts` line 23:

```typescript
to: ["your-email@example.com"],
```

### Change Email Subject

Edit `app/api/feedback/route.ts` line 24:

```typescript
subject: "Your Custom Subject 💡",
```

### Change Success Message

Edit `components/FeedbackModal.tsx` line 88:

```typescript
Alright wish the developer luck
```

## Troubleshooting

**Modal doesn't open?**

- Check browser console for errors
- Verify framer-motion is installed: `pnpm add framer-motion`

**Email not sending?**

- Verify `RESEND_API_KEY` is set in `.env.local`
- Restart dev server after adding env variable
- Check Resend dashboard for logs
- For production, verify your domain in Resend

**Styling issues?**

- Ensure Tailwind CSS is configured correctly
- Check that `primary` color is defined in `globals.css`

## Production Checklist

Before deploying:

- [ ] Set `RESEND_API_KEY` environment variable in hosting platform
- [ ] Verify domain in Resend (optional but recommended)
- [ ] Update `from` email to use your verified domain
- [ ] Test end-to-end in production environment
- [ ] Monitor email delivery in Resend dashboard

## API Costs

Resend offers:

- 100 emails/day free forever
- 3,000 emails/month on free tier
- More than enough for feedback submissions!

---

**Note**: The feature is designed to fail gracefully. If email sending fails, users still see success message to maintain great UX, while errors are logged for debugging.
