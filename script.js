// Mobile Navigation Toggle
document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    // Close menu when clicking on a link
    document.querySelectorAll(".nav-menu a").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
      });
    });
  }

  // Tab Switching Functionality
  initializeTabs();

  // Initialize fake news detector
  initializeFakeNewsDetector();

  // Initialize deepfake analyzer
  initializeDeepfakeAnalyzer();
});

// Tab Switching
function initializeTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetTab = button.getAttribute("data-tab");

      // Remove active class from all tabs and contents
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Add active class to clicked tab and corresponding content
      button.classList.add("active");
      const targetContent = document.getElementById(targetTab + "-tab");
      if (targetContent) {
        targetContent.classList.add("active");
      }
    });
  });
}

// Fake News Detector Functions
function initializeFakeNewsDetector() {
  const analyzeBtn = document.getElementById("analyzeBtn");
  if (analyzeBtn) {
    analyzeBtn.addEventListener("click", analyzeFakeNews);
  }
}

async function analyzeFakeNews() {
  const textContent = document.getElementById("newsText")?.value.trim();
  const urlContent = document.getElementById("newsUrl")?.value.trim();
  const analyzeBtn = document.getElementById("analyzeBtn");
  const resultsContent = document.getElementById("resultsContent");

  if (!textContent && !urlContent) {
    showError("Please enter text or URL for analysis");
    return;
  }

  // Show loading state
  analyzeBtn.innerHTML = '<div class="loading"></div> Analyzing...';
  analyzeBtn.disabled = true;

  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock analysis results
    const result = generateMockFakeNewsResult(textContent || urlContent);
    displayFakeNewsResults(result);
  } catch (error) {
    showError("Analysis failed. Please try again.");
  } finally {
    analyzeBtn.innerHTML = '<i class="fas fa-search"></i> Analyze Content';
    analyzeBtn.disabled = false;
  }
}

function generateMockFakeNewsResult(content) {
  const contentLength = content.length;
  const hasEmotionalWords =
    /\b(amazing|terrible|shocking|unbelievable|breaking|urgent|must|never|always)\b/i.test(
      content
    );
  const hasCapitalWords = /[A-Z]{3,}/.test(content);
  const hasExclamations = (content.match(/!/g) || []).length;

  // Calculate fake probability based on content analysis
  let fakeScore = 0;
  if (hasEmotionalWords) fakeScore += 30;
  if (hasCapitalWords) fakeScore += 20;
  if (hasExclamations > 2) fakeScore += 25;
  if (contentLength < 100) fakeScore += 15;

  fakeScore = Math.min(fakeScore, 85) + Math.random() * 15;

  return {
    confidence: fakeScore,
    verdict:
      fakeScore > 70
        ? "Likely Fake"
        : fakeScore > 40
        ? "Suspicious"
        : "Likely Authentic",
    details: {
      "Emotional Language": hasEmotionalWords ? "High" : "Low",
      "Source Credibility": Math.random() > 0.5 ? "Moderate" : "Low",
      "Fact Verification": Math.random() > 0.6 ? "Partial" : "Failed",
      "Bias Detection": Math.random() > 0.4 ? "Detected" : "Minimal",
    },
    warnings: generateWarnings(fakeScore),
  };
}

function generateWarnings(score) {
  const warnings = [];
  if (score > 70) {
    warnings.push("High emotional language detected");
    warnings.push("Unverified claims found");
  } else if (score > 40) {
    warnings.push("Some suspicious patterns detected");
  }
  return warnings;
}

function displayFakeNewsResults(result) {
  const resultsContent = document.getElementById("resultsContent");
  const scoreClass =
    result.confidence > 70
      ? "score-low"
      : result.confidence > 40
      ? "score-medium"
      : "score-high";

  resultsContent.innerHTML = `
        <div class="analysis-result">
            <div class="result-header">
                <h3>${result.verdict}</h3>
                <span class="confidence-score ${scoreClass}">
                    ${Math.round(result.confidence)}% Risk
                </span>
            </div>
            
            ${
              result.warnings.length > 0
                ? `
                <div class="warnings">
                    <h4>⚠️ Warning Signs:</h4>
                    <ul>
                        ${result.warnings
                          .map((warning) => `<li>${warning}</li>`)
                          .join("")}
                    </ul>
                </div>
            `
                : ""
            }
            
            <div class="result-details">
                ${Object.entries(result.details)
                  .map(
                    ([key, value]) => `
                    <div class="detail-item">
                        <div class="detail-label">${key}</div>
                        <div class="detail-value">${value}</div>
                    </div>
                `
                  )
                  .join("")}
            </div>
        </div>
    `;
}

// Deepfake Analyzer Functions
function initializeDeepfakeAnalyzer() {
  const fileUpload = document.getElementById("fileUpload");
  const videoFile = document.getElementById("videoFile");
  const analyzeVideoBtn = document.getElementById("analyzeVideoBtn");

  if (fileUpload && videoFile) {
    fileUpload.addEventListener("click", () => videoFile.click());
    fileUpload.addEventListener("dragover", handleDragOver);
    fileUpload.addEventListener("drop", handleFileDrop);
    videoFile.addEventListener("change", handleFileSelect);
  }

  if (analyzeVideoBtn) {
    analyzeVideoBtn.addEventListener("click", analyzeDeepfake);
  }
}

function handleDragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add("drag-over");
}

function handleFileDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.remove("drag-over");

  const files = e.dataTransfer.files;
  if (files.length > 0) {
    handleVideoFile(files[0]);
  }
}

function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file) {
    handleVideoFile(file);
  }
}

function handleVideoFile(file) {
  if (!file.type.startsWith("video/")) {
    showError("Please select a valid video file");
    return;
  }

  if (file.size > 100 * 1024 * 1024) {
    // 100MB limit
    showError("File size must be less than 100MB");
    return;
  }

  const videoPreview = document.getElementById("previewVideo");
  const fileUrl = URL.createObjectURL(file);

  videoPreview.src = fileUrl;
  videoPreview.style.display = "block";

  // Update upload area to show file selected
  const fileUpload = document.getElementById("fileUpload");
  fileUpload.innerHTML = `
        <div class="upload-icon">
            <i class="fas fa-video"></i>
        </div>
        <h3>Video Selected</h3>
        <p>${file.name}</p>
        <p class="file-info">Size: ${(file.size / 1024 / 1024).toFixed(
          2
        )} MB</p>
    `;
}

async function analyzeDeepfake() {
  const videoFile = document.getElementById("videoFile").files[0];
  const videoUrl = document.getElementById("videoUrl")?.value.trim();
  const analyzeBtn = document.getElementById("analyzeVideoBtn");
  const resultsContent = document.getElementById("videoResultsContent");

  if (!videoFile && !videoUrl) {
    showError("Please select a video file or enter a URL");
    return;
  }

  // Show loading state
  analyzeBtn.innerHTML = '<div class="loading"></div> Analyzing Video...';
  analyzeBtn.disabled = true;

  try {
    // Simulate longer analysis time for video
    await new Promise((resolve) => setTimeout(resolve, 4000));

    // Mock deepfake analysis results
    const result = generateMockDeepfakeResult();
    displayDeepfakeResults(result);
  } catch (error) {
    showError("Video analysis failed. Please try again.");
  } finally {
    analyzeBtn.innerHTML = '<i class="fas fa-search"></i> Analyze Video';
    analyzeBtn.disabled = false;
  }
}

function generateMockDeepfakeResult() {
  const authenticity = Math.random() * 100;
  const isDeepfake = authenticity < 40;

  return {
    authenticity: authenticity,
    verdict: isDeepfake
      ? "Likely Deepfake"
      : authenticity > 80
      ? "Authentic"
      : "Inconclusive",
    details: {
      "Facial Consistency": Math.random() > 0.5 ? "Inconsistent" : "Consistent",
      "Temporal Coherence": Math.random() > 0.3 ? "Natural" : "Suspicious",
      "Compression Artifacts": Math.random() > 0.6 ? "Present" : "Minimal",
      "Audio-Visual Sync": Math.random() > 0.4 ? "Synchronized" : "Mismatched",
      "Blinking Patterns": Math.random() > 0.5 ? "Natural" : "Unnatural",
      "Lip Sync Accuracy": Math.random() > 0.3 ? "Accurate" : "Inaccurate",
    },
    frameAnalysis: {
      totalFrames: Math.floor(Math.random() * 1000) + 500,
      suspiciousFrames: Math.floor(Math.random() * 100),
      processingTime: (Math.random() * 30 + 10).toFixed(1) + "s",
    },
  };
}

function displayDeepfakeResults(result) {
  const resultsContent = document.getElementById("videoResultsContent");
  const scoreClass =
    result.authenticity < 40
      ? "score-low"
      : result.authenticity < 80
      ? "score-medium"
      : "score-high";

  resultsContent.innerHTML = `
        <div class="analysis-result">
            <div class="result-header">
                <h3>${result.verdict}</h3>
                <span class="confidence-score ${scoreClass}">
                    ${Math.round(result.authenticity)}% Authentic
                </span>
            </div>
            
            <div class="result-details">
                <div class="detail-item">
                    <div class="detail-label">Total Frames</div>
                    <div class="detail-value">${
                      result.frameAnalysis.totalFrames
                    }</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Suspicious Frames</div>
                    <div class="detail-value">${
                      result.frameAnalysis.suspiciousFrames
                    }</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Processing Time</div>
                    <div class="detail-value">${
                      result.frameAnalysis.processingTime
                    }</div>
                </div>
            </div>
            
            <h4 style="margin: 20px 0 15px 0;">Detailed Analysis:</h4>
            <div class="result-details">
                ${Object.entries(result.details)
                  .map(
                    ([key, value]) => `
                    <div class="detail-item">
                        <div class="detail-label">${key}</div>
                        <div class="detail-value">${value}</div>
                    </div>
                `
                  )
                  .join("")}
            </div>
        </div>
    `;
}

// Utility Functions
function showError(message) {
  alert(message); // In production, use a proper modal or toast notification
}

// N8N Workflow Integration (Mock)
async function sendToN8NWorkflow(data, workflowType) {
  // Mock N8N webhook URL - replace with actual N8N webhook
  const webhookUrl = `https://pinkp.app.n8n.cloud/webhook-test/4fed089a-df7e-4ece-94e2-23992e3ad029`;

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Workflow execution failed");
    }

    return await response.json();
  } catch (error) {
    console.error("N8N Workflow Error:", error);
    throw error;
  }
}

// Enhanced file validation
function validateVideoFile(file) {
  const allowedTypes = [
    "video/mp4",
    "video/avi",
    "video/quicktime",
    "video/x-msvideo",
  ];
  const maxSize = 100 * 1024 * 1024; // 100MB

  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      "Unsupported file format. Please use MP4, AVI, or MOV files."
    );
  }

  if (file.size > maxSize) {
    throw new Error("File size must be less than 100MB.");
  }

  return true;
}

// URL validation
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Progress tracking for analysis
function updateProgress(percentage) {
  // This would update a progress bar if implemented
  console.log(`Analysis progress: ${percentage}%`);
}

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
});



////////////// messege sending

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value
    };

    status.textContent = "Sending...";

    try {
      const res = await fetch("https://pinkp.app.n8n.cloud/webhook-test/5ac3338f-bc94-40a3-8c58-88934112ee09", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        status.textContent = "✅ Message sent successfully!";
        form.reset();
      } else {
        status.textContent = "❌ Failed to send. Try again later.";
      }
    } catch (err) {
      status.textContent = "❌ Network error. Check your connection.";
    }
  });
});

