/**
 * IP Address Classification Utilities
 * Implements classful IP addressing (Class A, B, C)
 */

export interface IPResult {
  originalIP: string;
  isValid: boolean;
  errorMessage?: string;
  class?: "A" | "B" | "C";
  networkAddress?: string;
  broadcastAddress?: string;
  subnetMask?: string;
}

export interface NetworkGroup {
  networkAddress: string;
  ipResults: IPResult[];
  colorClass: string;
}

/**
 * Parse and validate an IP address string
 * @param ip - IP address string (e.g., "192.168.1.1")
 * @returns Array of 4 octets or null if invalid
 */
export function parseIP(ip: string): number[] | null {
  if (!ip || typeof ip !== "string") {
    return null;
  }

  const trimmed = ip.trim();
  // returns as array
  const parts = trimmed.split(".");

  if (parts.length !== 4) {
    return null;
  }

  // number [] = [] -> initialized as an empty array
  const octets: number[] = [];
  for (const part of parts) {
    // check if part is a valid number
    if (!/^\d+$/.test(part)) {
      return null;
    }

    const octet = parseInt(part, 10);

    // check range 0-255
    if (octet < 0 || octet > 255) {
      return null;
    }

    octets.push(octet);
  }

  return octets;
}

/**
 * Classify an IP address into Class A, B, or C
 * Based on the first octet:
 * - Class A: 0-127 (first bit: 0)
 * - Class B: 128-191 (first two bits: 10)
 * - Class C: 192-255 (first three bits: 110)
 *
 * @param firstOctet - First octet of the IP address
 * @returns IP class or null if out of range
 */
export function classifyIP(firstOctet: number): "A" | "B" | "C" | null {
  if (firstOctet >= 0 && firstOctet <= 127) {
    return "A";
  } else if (firstOctet >= 128 && firstOctet <= 191) {
    return "B";
  } else if (firstOctet >= 192 && firstOctet <= 255) {
    return "C";
  }
  return null;
}

/**
 * Get subnet mask for a given IP class
 * - Class A: 255.0.0.0 (/8)
 * - Class B: 255.255.0.0 (/16)
 * - Class C: 255.255.255.0 (/24)
 *
 * @param ipClass - IP class (A, B, or C)
 * @returns Subnet mask string
 */
export function getSubnetMask(ipClass: "A" | "B" | "C"): string {
  switch (ipClass) {
    case "A":
      return "255.0.0.0";
    case "B":
      return "255.255.0.0";
    case "C":
      return "255.255.255.0";
  }
}

/**
 * Calculate network address using binary AND operation
 * Network Address = IP Address AND Subnet Mask
 *
 * @param octets - Array of 4 octets from the IP address
 * @param ipClass - IP class (A, B, or C)
 * @returns Network address string
 */
export function calculateNetworkAddress(
  octets: number[],
  ipClass: "A" | "B" | "C",
): string {
  // ... creates a shallow copy
  const result = [...octets];

  switch (ipClass) {
    case "A":
      // Mask: 255.0.0.0 - preserve first octet, zero out rest
      result[1] = 0;
      result[2] = 0;
      result[3] = 0;
      break;
    case "B":
      // Mask: 255.255.0.0 - preserve first two octets, zero out rest
      result[2] = 0;
      result[3] = 0;
      break;
    case "C":
      // Mask: 255.255.255.0 - preserve first three octets, zero out last
      result[3] = 0;
      break;
  }

  return result.join(".");
}

/**
 * Calculate broadcast (diffusion) address
 * Broadcast Address = Network Address with all host bits set to 1
 *
 * @param networkAddress - Network address string
 * @param ipClass - IP class (A, B, or C)
 * @returns Broadcast address string
 */
export function calculateBroadcastAddress(
  networkAddress: string,
  ipClass: "A" | "B" | "C",
): string {
  // parse each octet to an array of numbers
  const octets = networkAddress.split(".").map((o) => parseInt(o, 10));

  switch (ipClass) {
    case "A":
      // Set last 3 octets to 255
      octets[1] = 255;
      octets[2] = 255;
      octets[3] = 255;
      break;
    case "B":
      // Set last 2 octets to 255
      octets[2] = 255;
      octets[3] = 255;
      break;
    case "C":
      // Set last octet to 255
      octets[3] = 255;
      break;
  }

  return octets.join(".");
}

/**
 * Analyze a single IP address
 * Returns complete classification including class, network, and broadcast addresses
 *
 * @param ip - IP address string to analyze
 * @returns IPResult object with analysis details
 */
export function analyzeIP(ip: string): IPResult {
  const octets = parseIP(ip);

  // if octets is null, IP is invalid
  if (!octets) {
    return {
      originalIP: ip,
      isValid: false,
      errorMessage:
        "Invalid IP address format. Expected xxx.xxx.xxx.xxx where each xxx is 0-255",
    };
  }

  const ipClass = classifyIP(octets[0]);

  if (!ipClass) {
    return {
      originalIP: ip,
      isValid: false,
      errorMessage: "IP address out of classful range",
    };
  }

  const networkAddress = calculateNetworkAddress(octets, ipClass);
  const broadcastAddress = calculateBroadcastAddress(networkAddress, ipClass);
  const subnetMask = getSubnetMask(ipClass);

  return {
    originalIP: ip,
    isValid: true,
    class: ipClass,
    networkAddress,
    broadcastAddress,
    subnetMask,
  };
}

/**
 * Analyze multiple IP addresses and group them by network
 * IPs with the same network address are grouped together
 *
 * @param ips - Array of IP address strings
 * @returns Array of network groups with assigned colors
 */
export function analyzeAndGroupIPs(ips: string[]): NetworkGroup[] {
  // Analyze all IPs
  const results = ips.map((ip) => analyzeIP(ip));

  // string is the key for the net address
  const networkMap = new Map<string, IPResult[]>();

  for (const result of results) {
    if (result.isValid && result.networkAddress) {
      // group valid IPs by their network address
      const existing = networkMap.get(result.networkAddress) || [];
      existing.push(result);
      networkMap.set(result.networkAddress, existing);
    } else {
      // Invalid IPs get their own "group" (shown separately)
      const key = `invalid-${result.originalIP}`;
      networkMap.set(key, [result]);
    }
  }

  // Assign colors to groups
  const colors = [
    "border-blue-500 bg-blue-50",
    "border-green-500 bg-green-50",
    "border-purple-500 bg-purple-50",
    "border-yellow-500 bg-yellow-50",
    "border-pink-500 bg-pink-50",
    "border-indigo-500 bg-indigo-50",
  ];

  const groups: NetworkGroup[] = [];
  let colorIndex = 0;

  for (const [networkAddress, ipResults] of networkMap.entries()) {
    // Invalid IPs get red color
    const isInvalidGroup = networkAddress.startsWith("invalid-");
    const colorClass = isInvalidGroup
      ? "border-red-500 bg-red-50"
      : colors[colorIndex % colors.length];

    groups.push({
      networkAddress,
      ipResults,
      colorClass,
    });

    if (!isInvalidGroup) {
      colorIndex++;
    }
  }

  return groups;
}
