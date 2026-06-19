const STEPS = [
  {
    key: "intro",
    bot: "👋 Welcome to the NCRP Complaint Assistant!\n\nI'll help you file a cybercrime complaint step by step. You can type or use 🎤 voice input.\n\nReady to begin?",
    options: ["Yes, let's start", "What is NCRP?"],
    next: (ans) => ans.toLowerCase().includes("ncrp") ? "ncrp_info" : "category"
  },
  {
    key: "ncrp_info",
    bot: "ℹ️ NCRP (National Cyber Crime Reporting Portal) is an initiative by the Government of India to enable citizens to report cybercrime complaints online at https://cybercrime.gov.in\n\nShall we proceed to file your complaint?",
    options: ["Yes, proceed"],
    next: () => "category"
  },
  {
    key: "category",
    bot: "📋 Please select the category of cybercrime:",
    options: [
      "Financial Fraud",
      "Social Media Crime",
      "Online Harassment",
      "Hacking / Data Breach",
      "Child Pornography / CSAM",
      "Ransomware / Malware",
      "Other"
    ],
    next: () => "sub_category"
  },
  {
    key: "sub_category",
    bot: (data) => {
      const subs = {
        "Financial Fraud": ["UPI Fraud", "Internet Banking Fraud", "Credit/Debit Card Fraud", "OTP Fraud", "Job Fraud", "Lottery Fraud"],
        "Social Media Crime": ["Fake Profile", "Morphed Images", "Cyberbullying", "Impersonation"],
        "Online Harassment": ["Stalking", "Obscene Content", "Extortion / Blackmail"],
        "Hacking / Data Breach": ["Email Hacking", "Website Hacking", "Data Theft"],
        "Child Pornography / CSAM": ["CSAM Reporting"],
        "Ransomware / Malware": ["Ransomware Attack", "Virus Attack"],
        "Other": ["Other Cybercrime"]
      };
      const key = data.category || "Other";
      return `🔍 Select the sub-category for "${key}":`;
    },
    optionsFn: (data) => {
      const subs = {
        "Financial Fraud": ["UPI Fraud", "Internet Banking Fraud", "Credit/Debit Card Fraud", "OTP Fraud", "Job Fraud", "Lottery Fraud"],
        "Social Media Crime": ["Fake Profile", "Morphed Images", "Cyberbullying", "Impersonation"],
        "Online Harassment": ["Stalking", "Obscene Content", "Extortion / Blackmail"],
        "Hacking / Data Breach": ["Email Hacking", "Website Hacking", "Data Theft"],
        "Child Pornography / CSAM": ["CSAM Reporting"],
        "Ransomware / Malware": ["Ransomware Attack", "Virus Attack"],
        "Other": ["Other Cybercrime"]
      };
      return subs[data.category] || ["Other Cybercrime"];
    },
    next: () => "victim_name"
  },
  {
    key: "victim_name",
    bot: "👤 Please enter the victim's full name:",
    placeholder: "e.g. Rahul Sharma",
    next: () => "victim_phone"
  },
  {
    key: "victim_phone",
    bot: "📱 Enter the victim's mobile number (10 digits):",
    placeholder: "e.g. 9876543210",
    validate: (v) => /^\d{10}$/.test(v.trim()) ? null : "⚠️ Please enter a valid 10-digit mobile number.",
    next: () => "victim_email"
  },
  {
    key: "victim_email",
    bot: "📧 Enter the victim's email address:",
    placeholder: "e.g. name@email.com",
    validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? null : "⚠️ Please enter a valid email address.",
    next: () => "victim_state"
  },
  {
    key: "victim_state",
    bot: "🗺️ Select the state/UT where the victim resides:",
    options: [
      "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Delhi",
      "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
      "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
      "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
      "Uttar Pradesh","Uttarakhand","West Bengal","Others"
    ],
    next: () => "incident_date"
  },
  {
    key: "incident_date",
    bot: "📅 When did the incident occur? (DD/MM/YYYY or describe like 'last week')",
    placeholder: "e.g. 15/06/2025",
    next: () => "incident_description"
  },
  {
    key: "incident_description",
    bot: "📝 Describe the incident in detail:\n(Include what happened, how it happened, and any suspect details you know)",
    placeholder: "Describe the cybercrime incident...",
    next: () => "suspect_info"
  },
  {
    key: "suspect_info",
    bot: "🔎 Do you have any information about the suspect?",
    options: [
      "Yes, I have suspect details",
      "No suspect info available"
    ],
    next: (ans) => ans.includes("Yes") ? "suspect_details" : "loss_amount"
  },
  {
    key: "suspect_details",
    bot: "🕵️ Please share suspect details (name, phone, account number, social media handle, website URL — whatever you know):",
    placeholder: "e.g. Phone: 9000000000, UPI: suspect@upi",
    next: () => "loss_amount"
  },
  {
    key: "loss_amount",
    bot: "💰 Was there any financial loss? If yes, enter the amount in ₹. If no, type '0':",
    placeholder: "e.g. 25000",
    validate: (v) => /^\d+$/.test(v.trim()) ? null : "⚠️ Please enter a numeric amount (e.g. 5000) or 0.",
    next: () => "evidence"
  },
  {
    key: "evidence",
    bot: "🗂️ Do you have evidence (screenshots, transaction IDs, call recordings)?",
    options: [
      "Yes – I have screenshots/transaction IDs",
      "Yes – I have call recordings",
      "No evidence available"
    ],
    next: () => "review"
  },
  {
    key: "review",
    bot: "✅ Here's a summary of your complaint. Please review:",
    isSummary: true,
    options: ["✅ Confirm & Submit", "✏️ Edit a field"],
    next: (ans) => ans.includes("Edit") ? "edit_choice" : "submitted"
  },
  {
    key: "edit_choice",
    bot: "✏️ Which field would you like to edit?",
    options: [
      "Category", "Sub Category", "Victim Name", "Phone", "Email",
      "State", "Incident Date", "Incident Description", "Suspect Info", "Loss Amount", "Evidence"
    ],
    next: (ans) => {
      const map = {
        "Category": "category", "Sub Category": "sub_category",
        "Victim Name": "victim_name", "Phone": "victim_phone",
        "Email": "victim_email", "State": "victim_state",
        "Incident Date": "incident_date", "Incident Description": "incident_description",
        "Suspect Info": "suspect_info", "Loss Amount": "loss_amount", "Evidence": "evidence"
      };
      return map[ans] || "review";
    }
  },
  {
    key: "submitted",
    bot: "🎉 Your complaint has been recorded!\n\n📌 Reference Number: NCRP-" + Math.floor(100000 + Math.random() * 900000) + "\n\n✅ Next Steps:\n1. Visit https://cybercrime.gov.in to officially submit\n2. Keep your reference number safe\n3. You may be contacted by authorities\n\nThank you for reporting. Stay safe! 🛡️",
    final: true
  }
];

const formData = {};
let currentStepKey = "intro";
let isEditing = false;

const chatBody = document.getElementById("chatBody");
const userInput = document.getElementById("userInput");
const quickReplies = document.getElementById("quickReplies");
const micBtn = document.getElementById("micBtn");
const micStatus = document.getElementById("micStatus");
const sendBtn = document.getElementById("sendBtn");

function getStep(key) { return STEPS.find(s => s.key === key); }

function addMessage(text, role, isSummary = false) {
  const div = document.createElement("div");
  div.className = `msg ${role}${isSummary ? " summary" : ""}`;
  div.innerText = text;
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function showQuickReplies(options) {
  quickReplies.innerHTML = "";
  (options || []).forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "qr-btn";
    btn.innerText = opt;
    btn.onclick = () => handleUserInput(opt);
    quickReplies.appendChild(btn);
  });
}

function buildSummary() {
  const lines = [
    "📋 COMPLAINT SUMMARY",
    "─────────────────────",
    `Category       : ${formData.category || "—"}`,
    `Sub Category   : ${formData.sub_category || "—"}`,
    `Victim Name    : ${formData.victim_name || "—"}`,
    `Phone          : ${formData.victim_phone || "—"}`,
    `Email          : ${formData.victim_email || "—"}`,
    `State          : ${formData.victim_state || "—"}`,
    `Incident Date  : ${formData.incident_date || "—"}`,
    `Description    : ${(formData.incident_description || "—").substring(0, 80)}...`,
    `Suspect Info   : ${formData.suspect_details || formData.suspect_info || "—"}`,
    `Loss Amount    : ₹${formData.loss_amount || "0"}`,
    `Evidence       : ${formData.evidence || "—"}`
  ];
  return lines.join("\n");
}

function renderStep(key) {
  const step = getStep(key);
  if (!step) return;
  currentStepKey = key;

  const botText = typeof step.bot === "function" ? step.bot(formData) : step.bot;
  addMessage(botText, "bot");

  if (step.isSummary) addMessage(buildSummary(), "bot", true);

  const opts = step.optionsFn ? step.optionsFn(formData) : step.options;
  showQuickReplies(opts || []);

  userInput.placeholder = step.placeholder || "Type your response...";

  if (step.final) {
    userInput.disabled = true;
    sendBtn.disabled = true;
    micBtn.disabled = true;
  }
}

function handleUserInput(value) {
  const raw = value.trim();
  if (!raw) return;

  const step = getStep(currentStepKey);
  if (!step) return;

  // Validation
  if (step.validate) {
    const err = step.validate(raw);
    if (err) { addMessage(err, "bot"); return; }
  }

  addMessage(raw, "user");
  userInput.value = "";
  quickReplies.innerHTML = "";

  // Save data
  if (!["intro", "ncrp_info", "review", "edit_choice"].includes(currentStepKey)) {
    formData[currentStepKey] = raw;
  }

  // Determine next step
  const nextKey = step.next ? step.next(raw) : null;

  // If edit flow loops back through steps, re-route to review after
  if (isEditing && nextKey && nextKey !== "edit_choice" && nextKey !== "review") {
    const targetStep = getStep(nextKey);
    if (targetStep) {
      currentStepKey = nextKey;
      const botText = typeof targetStep.bot === "function" ? targetStep.bot(formData) : targetStep.bot;
      addMessage(botText, "bot");
      const opts = targetStep.optionsFn ? targetStep.optionsFn(formData) : targetStep.options;
      showQuickReplies(opts || []);
      userInput.placeholder = targetStep.placeholder || "Type your response...";
      // After this field is answered, jump to review
      const origNext = targetStep.next;
      targetStep.next = (a) => {
        targetStep.next = origNext;
        isEditing = false;
        return "review";
      };
    }
    return;
  }

  if (nextKey === "edit_choice") isEditing = true;
  if (nextKey) setTimeout(() => renderStep(nextKey), 400);
}

sendBtn.addEventListener("click", () => handleUserInput(userInput.value));
userInput.addEventListener("keydown", (e) => { if (e.key === "Enter") handleUserInput(userInput.value); });

// Voice Input
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = "en-IN";
  recognition.interimResults = false;

  micBtn.addEventListener("click", () => {
    if (micBtn.classList.contains("listening")) {
      recognition.stop();
    } else {
      recognition.start();
    }
  });

  recognition.onstart = () => {
    micBtn.classList.add("listening");
    micStatus.textContent = "🎤 Listening... speak now";
  };

  recognition.onresult = (e) => {
    const transcript = e.results[0][0].transcript;
    userInput.value = transcript;
    micStatus.textContent = `✅ Heard: "${transcript}"`;
    setTimeout(() => handleUserInput(transcript), 600);
  };

  recognition.onerror = (e) => {
    micStatus.textContent = `⚠️ Voice error: ${e.error}. Try typing instead.`;
  };

  recognition.onend = () => {
    micBtn.classList.remove("listening");
    setTimeout(() => micStatus.textContent = "", 3000);
  };
} else {
  micBtn.title = "Voice input not supported in this browser";
  micBtn.style.opacity = "0.4";
  micBtn.disabled = true;
  micStatus.textContent = "Voice input not supported. Please use Chrome/Edge.";
}

// Start
setTimeout(() => renderStep("intro"), 300);
