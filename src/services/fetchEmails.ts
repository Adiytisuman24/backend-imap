import { categorizeEmail } from "./categorizeEmail";

// Jab email fetch ho jaye, use categorize kar:
async function processEmail(email) {
  const category = await categorizeEmail(email.subject, email.body);
  console.log(`📩 Email categorized as: ${category}`);
  
  // Elasticsearch me store karne ke liye modify kar:
  return {
    ...email,
    category, // AI Categorization added
  };
}
