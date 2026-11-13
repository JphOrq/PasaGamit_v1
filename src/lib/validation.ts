/** Form validation rules shared by pages and tests. */

export type InquiryErrors = Partial<Record<"name" | "email" | "topic" | "message", string>>;

export function validateInquiry(v: { name: string; email: string; topic: string; message: string }): InquiryErrors {
  const e: InquiryErrors = {};
  if (v.name.trim().length < 2) e.name = "Please enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "Enter a valid email address.";
  if (!v.topic) e.topic = "Choose a topic.";
  if (v.message.trim().length < 20) e.message = "Message should be at least 20 characters.";
  return e;
}

/** Student verification: a school email ending in .edu / .edu.ph, or a student ID like 2023-01456. */
export function isValidStudentVerification(value: string) {
  const v = value.trim();
  const schoolEmail = /^[^\s@]+@[^\s@]+\.edu(\.[a-z]{2})?$/i.test(v);
  const studentId = /^\d{4}-\d{4,6}$/.test(v);
  return schoolEmail || studentId;
}
