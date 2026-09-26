/* Content used to render pages dynamically.
   Update this file to change steps, FAQs or dates without touching the HTML. */

const IMPORTANT_DATES = [
  { title: "Online registration opens", date: "2026-10-05T10:00:00", note: "Create your account on the portal" },
  { title: "Registration & fee deadline", date: "2026-10-20T23:59:00", note: "Late registrations are not accepted" },
  { title: "Choice filling & locking", date: "2026-10-28T17:00:00", note: "Unlocked choices are auto-locked" },
  { title: "Round 1 seat allotment", date: "2026-11-02T12:00:00", note: "Results published on the portal" },
  { title: "Reporting to allotted college", date: "2026-11-09T17:00:00", note: "Carry original documents" }
];

const STEPS = [
  {
    title: "Online registration",
    time: "~15 minutes",
    summary: "Create your account on the counseling portal using a valid email ID and mobile number.",
    details: ["Keep your entrance exam roll number and scorecard handy",
              "Use an email and mobile number you check regularly; all updates are sent there",
              "Note down your application number and password safely"]
  },
  {
    title: "Pay registration fee",
    time: "~5 minutes",
    summary: "Pay the non-refundable counseling fee online via UPI, net banking or card.",
    details: ["Save the payment receipt / transaction ID",
              "If money is deducted but status shows 'pending', wait 24 hours before paying again"]
  },
  {
    title: "Upload documents",
    time: "~20 minutes",
    summary: "Upload scanned copies of your certificates in the required format and size.",
    details: ["Class 10 and 12 marksheets (plus graduation marksheets for PG courses)",
              "Entrance exam scorecard",
              "Category / EWS / PwD certificate, if applicable",
              "Recent passport-size photo and signature (JPG, under 100 KB)",
              "Aadhaar card or another government photo ID"]
  },
  {
    title: "Fill your choices",
    time: "Take your time",
    summary: "Select colleges and courses in your order of preference. There is no limit, so fill as many as you are genuinely willing to join.",
    details: ["Put your dream options at the top and safer options below",
              "Check previous years' opening and closing ranks",
              "Consider location, fees, hostel availability and placements"]
  },
  {
    title: "Lock your choices",
    time: "Before the deadline",
    summary: "Review your list carefully and lock it. Locked choices cannot be edited.",
    details: ["Download and save the PDF of your locked choices",
              "If you don't lock them, the portal auto-locks your last saved list at the deadline"]
  },
  {
    title: "Seat allotment result",
    time: "As per schedule",
    summary: "Check your allotment result on the portal. You may get a seat from one of your choices based on rank and availability.",
    details: ["Download the provisional allotment letter",
              "Choose Freeze (accept seat), Float (accept but want a better option) or Slide (same college, better course)"]
  },
  {
    title: "Pay seat acceptance fee",
    time: "Within 3–4 days",
    summary: "Confirm your seat by paying the seat acceptance fee before the deadline, or the seat is cancelled.",
    details: ["The fee is adjusted against your first-year tuition fee",
              "Keep the payment receipt for reporting"]
  },
  {
    title: "Report & verify documents",
    time: "On reporting date",
    summary: "Visit the allotted college with original documents for physical verification and admission.",
    details: ["Carry originals plus two sets of self-attested photocopies",
              "Carry the allotment letter and fee receipts",
              "Collect your admission confirmation slip. Congratulations! 🎉"]
  }
];

const FAQS = [
  { cat: "Registration", q: "Who is eligible to register for counseling?",
    a: "Any candidate who has qualified in the relevant entrance exam and meets the minimum academic criteria for the course (usually 45–50% in the qualifying exam, relaxed for reserved categories) can register." },
  { cat: "Registration", q: "I forgot my password. What should I do?",
    a: "Use the 'Forgot Password' link on the portal login page. A reset link or OTP will be sent to your registered email and mobile number." },
  { cat: "Registration", q: "Can I edit my registration details after submitting?",
    a: "Basic details such as name and date of birth are taken from your entrance exam record and cannot be changed. Contact details and category can usually be edited until the registration deadline." },
  { cat: "Documents", q: "What format and size should documents be in?",
    a: "Certificates are usually required as PDFs under 500 KB each. Photo and signature should be JPG/JPEG files under 100 KB. Always check the portal instructions for exact limits." },
  { cat: "Documents", q: "My category certificate is old. Is it valid?",
    a: "OBC-NCL and EWS certificates must usually be issued in the current financial year. SC/ST certificates generally do not expire. Get a fresh certificate if you are unsure." },
  { cat: "Documents", q: "What if my documents are rejected during verification?",
    a: "You will receive a notification with the reason. Re-upload the correct document within the given window, or carry it for physical verification if the portal allows." },
  { cat: "Choice filling", q: "How many choices should I fill?",
    a: "There is no upper limit. Fill as many choices as you are genuinely willing to join, in order of preference. More choices improve your chances of getting a seat." },
  { cat: "Choice filling", q: "Does the order of choices matter?",
    a: "Yes. Seats are allotted by going down your list from the top. You get the highest-preference option available at your rank, so put the options you want most first." },
  { cat: "Seat allotment", q: "What is the difference between Freeze, Float and Slide?",
    a: "Freeze: you accept the allotted seat and exit further rounds. Float: you accept the seat but want to be considered for a higher choice in any college. Slide: you accept the seat but want a higher-choice course in the same college." },
  { cat: "Seat allotment", q: "I didn't get a seat in Round 1. What now?",
    a: "You will automatically be considered in the next round with your existing choices. Some counseling bodies also let you add new choices before later rounds." },
  { cat: "Fees", q: "Is the registration fee refundable?",
    a: "No, the counseling registration fee is non-refundable. The seat acceptance fee may be refundable (minus processing charges) if you withdraw before the specified date." },
  { cat: "Fees", q: "Money was deducted but payment shows failed. What should I do?",
    a: "Don't pay again right away. Failed transactions are usually reversed automatically within 5–7 working days. If the status doesn't update within 24 hours, contact the helpline with your transaction ID." }
];
