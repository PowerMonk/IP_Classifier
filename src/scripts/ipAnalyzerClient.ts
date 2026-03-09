/**
 * Client-side logic for IP Analyzer component
 * Handles DOM manipulation and user interactions
 */

import { analyzeAndGroupIPs, type NetworkGroup } from "../utils/ipClassifier";

// State management
let ipCount = 1;
let ipAddresses: string[] = [""];

/**
 * Initialize the IP analyzer when DOM is ready
 */
function init() {
  const countInput = document.getElementById("ip-count") as HTMLInputElement;
  const setCountBtn = document.getElementById(
    "set-count-btn",
  ) as HTMLButtonElement;
  const addIpBtn = document.getElementById("add-ip-btn") as HTMLButtonElement;
  const analyzeBtn = document.getElementById(
    "analyze-btn",
  ) as HTMLButtonElement;
  const clearBtn = document.getElementById("clear-btn") as HTMLButtonElement;

  // Event listeners
  countInput?.addEventListener("input", handleCountInput);
  setCountBtn?.addEventListener("click", handleSetCount);
  addIpBtn?.addEventListener("click", handleAddIP);
  analyzeBtn?.addEventListener("click", handleAnalyze);
  clearBtn?.addEventListener("click", handleClear);

  // Initial render
  renderIPInputs();
}

/**
 * Handle IP count input change
 */
function handleCountInput(e: Event) {
  const input = e.target as HTMLInputElement;
  const value = parseInt(input.value, 10);

  if (value > 0 && value <= 100) {
    ipCount = value;
  }
}

/**
 * Handle "Set Count" button click
 */
function handleSetCount() {
  const countInput = document.getElementById("ip-count") as HTMLInputElement;
  const value = parseInt(countInput.value, 10);

  if (value > 0 && value <= 100) {
    ipCount = value;
    ipAddresses = Array(ipCount).fill("");
    renderIPInputs();
    hideResults();
  }
}

/**
 * Handle "Add IP" button click
 */
function handleAddIP() {
  ipCount++;
  ipAddresses.push("");
  renderIPInputs();

  // Update count input
  const countInput = document.getElementById("ip-count") as HTMLInputElement;
  if (countInput) {
    countInput.value = ipCount.toString();
  }
}

/**
 * Handle "Analyze" button click
 */
function handleAnalyze() {
  // Get all IP values from inputs
  updateIPAddressesFromInputs();

  // Filter out empty IPs
  // !== cheks for null, undefined and empty strings
  const nonEmptyIPs = ipAddresses.filter((ip) => ip.trim() !== "");

  if (nonEmptyIPs.length === 0) {
    alert("Please enter at least one IP address");
    return;
  }

  // Analyze and group IPs
  const groups = analyzeAndGroupIPs(nonEmptyIPs);

  // Render results
  renderResults(groups);
}

/**
 * Handle "Clear" button click
 */
function handleClear() {
  ipCount = 1;
  ipAddresses = [""];

  const countInput = document.getElementById("ip-count") as HTMLInputElement;
  if (countInput) {
    countInput.value = "1";
  }

  renderIPInputs();
  hideResults();
}

/**
 * Update ipAddresses array from current input values
 */
function updateIPAddressesFromInputs() {
  const inputs = document.querySelectorAll<HTMLInputElement>(".ip-input");
  ipAddresses = Array.from(inputs).map((input) => input.value);
}

/**
 * Render IP input fields
 */
function renderIPInputs() {
  const container = document.getElementById("ip-inputs-container");
  if (!container) return;

  container.innerHTML = "";

  for (let i = 0; i < ipCount; i++) {
    const wrapper = document.createElement("div");
    wrapper.className = "mb-3";

    const label = document.createElement("label");
    label.className = "block text-sm font-medium text-gray-700 mb-1";
    label.textContent = `IP Address ${i + 1}`;

    const input = document.createElement("input");
    input.type = "text";
    input.className =
      "ip-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition";
    input.placeholder = "e.g., 192.168.1.1";
    input.value = ipAddresses[i] || "";
    input.dataset.index = i.toString();

    // Update state on input change
    input.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      const index = parseInt(target.dataset.index || "0", 10);
      ipAddresses[index] = target.value;
    });

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    container.appendChild(wrapper);
  }
}

/**
 * Render analysis results
 */
function renderResults(groups: NetworkGroup[]) {
  const resultsContainer = document.getElementById("results-container");
  if (!resultsContainer) return;

  resultsContainer.innerHTML = "";
  resultsContainer.classList.remove("hidden");

  // Title
  const title = document.createElement("h2");
  title.className = "text-2xl font-bold text-gray-800 mb-6";
  title.textContent = "Analysis Results";
  resultsContainer.appendChild(title);

  // Render each network group
  groups.forEach((group, groupIndex) => {
    const isInvalidGroup = group.networkAddress.startsWith("invalid-");

    // Group header (only for valid groups)
    if (!isInvalidGroup && group.ipResults.length > 1) {
      const groupHeader = document.createElement("div");
      groupHeader.className = "mb-2";

      const groupTitle = document.createElement("h3");
      groupTitle.className = "text-lg font-semibold text-gray-700";
      groupTitle.textContent = `Network: ${group.networkAddress} (${group.ipResults.length} IPs)`;

      groupHeader.appendChild(groupTitle);
      resultsContainer.appendChild(groupHeader);
    }

    // Render each IP in the group
    group.ipResults.forEach((result) => {
      const card = document.createElement("div");
      card.className = `p-4 mb-3 border-l-4 rounded-lg ${group.colorClass}`;

      if (!result.isValid) {
        // Invalid IP card
        const ipText = document.createElement("div");
        ipText.className = "font-mono text-lg font-semibold text-red-700";
        ipText.textContent = result.originalIP;

        const errorText = document.createElement("div");
        errorText.className = "text-red-600 mt-2";
        errorText.textContent = `❌ ${result.errorMessage}`;

        card.appendChild(ipText);
        card.appendChild(errorText);
      } else {
        // Valid IP card
        const ipText = document.createElement("div");
        ipText.className = "font-mono text-lg font-semibold text-gray-800";
        ipText.textContent = result.originalIP;

        const classText = document.createElement("div");
        classText.className = "text-sm font-semibold text-gray-600 mt-1";
        classText.textContent = `Class ${result.class}`;

        const details = document.createElement("div");
        details.className = "mt-3 space-y-1 text-sm";

        const networkLine = document.createElement("div");
        networkLine.className = "flex justify-between";
        networkLine.innerHTML = `
          <span class="text-gray-600">Network Address:</span>
          <span class="font-mono font-medium">${result.networkAddress}</span>
        `;

        const broadcastLine = document.createElement("div");
        broadcastLine.className = "flex justify-between";
        broadcastLine.innerHTML = `
          <span class="text-gray-600">Broadcast Address:</span>
          <span class="font-mono font-medium">${result.broadcastAddress}</span>
        `;

        const maskLine = document.createElement("div");
        maskLine.className = "flex justify-between";
        maskLine.innerHTML = `
          <span class="text-gray-600">Subnet Mask:</span>
          <span class="font-mono font-medium">${result.subnetMask}</span>
        `;

        details.appendChild(networkLine);
        details.appendChild(broadcastLine);
        details.appendChild(maskLine);

        card.appendChild(ipText);
        card.appendChild(classText);
        card.appendChild(details);
      }

      resultsContainer.appendChild(card);
    });

    // Add spacing between groups
    if (groupIndex < groups.length - 1) {
      const spacer = document.createElement("div");
      spacer.className = "h-6";
      resultsContainer.appendChild(spacer);
    }
  });
}

/**
 * Hide results section
 */
function hideResults() {
  const resultsContainer = document.getElementById("results-container");
  if (resultsContainer) {
    resultsContainer.classList.add("hidden");
  }
}

// Initialize when DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
