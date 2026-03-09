# Plan: IP Address Classifier Web App

## TL;DR

Build an interactive IP address classification tool in Astro + Tailwind that classifies IPs (A/B/C), calculates network and broadcast addresses, and groups IPs on the same network visually. User enters count → enters IPs → clicks Analyze → sees grouped results with color-coded networks.

## Steps

### Phase 1: Core Logic (parallel)

1. **Create IP classification utilities** — New file `src/utils/ipClassifier.ts` with functions:
   - `classifyIP(ip: string)` → returns class (A/B/C) or null if invalid
   - `parseIP(ip: string)` → validate and convert to octets
   - `calculateNetworkAddress(ip: string, ipClass: string)` → binary AND operation
   - `calculateBroadcastAddress(networkAddr: string, ipClass: string)` → set host bits to 1
   - `groupByNetwork(ips: IPResult[])` → group IPs sharing same network address

### Phase 2: UI Components

2. **Create IPAnalyzer component** — New file `src/components/IPAnalyzer.astro`:
   - State: `ipCount` (number), `ipAddresses` (array of strings), `results` (array of analysis results), `analyzed` (boolean)
   - Initial input: "How many IPs?" number field
   - Dynamic IP input fields (render based on ipCount)
   - Buttons: "Analyze", "Clear", "+" (add one more field)
   - Results section: only shown after clicking "Analyze"

3. **Design results display format** — Each IP shows:
   - Original IP address
   - Class (A/B/C)
   - Network address
   - Broadcast address
   - Group IPs visually using colored border/background (same network = same color)

4. **Update main page** — Modify `src/pages/index.astro`:
   - Replace current content with IPAnalyzer component
   - Update title to "IP Address Classifier"
   - Keep global styles import

### Phase 3: Styling & Polish

5. **Style with Tailwind** — Use existing Tailwind v4:
   - Form inputs: bordered, focus states
   - Results cards: grouped with matching border colors
   - Responsive layout (mobile-friendly)
   - Error states: red text/border for invalid IPs

6. **Add validation** — Real-time or on-analyze:
   - Check format xxx.xxx.xxx.xxx
   - Each octet 0-255
   - Show inline error message below invalid inputs

## Relevant Files

- `src/pages/index.astro` — Main entry point, replace with IP classifier UI
- `src/components/Button.astro` — Reference for Tailwind button styling patterns
- `src/styles/global.css` — Already imports Tailwind, no changes needed
- `astro.config.mjs` — Already configured with Tailwind, no changes needed
- **NEW**: `src/utils/ipClassifier.ts` — Core classification logic
- **NEW**: `src/components/IPAnalyzer.astro` — Main interactive component

## Verification

1. Test classification:
   - Class A: 38.40.101.125 → Network: 38.0.0.0, Broadcast: 38.255.255.255
   - Class B: 140.20.36.10 → Network: 140.20.0.0, Broadcast: 140.20.255.255
   - Class C: 192.168.10.1 → Network: 192.168.10.0, Broadcast: 192.168.10.255
2. Test same network detection: 192.168.10.1, 192.168.10.10, 192.168.10.110 should be grouped
3. Test different networks: 192.168.10.1 vs 192.168.20.1 should be separate groups
4. Test invalid inputs: "999.999.999.999", "abc.def.ghi.jkl", "192.168.1" (incomplete)
5. Test dynamic fields: Add IP button, clear button, initial count input
6. Check responsive design on mobile and desktop

## Decisions

- **Framework choice**: Use Astro component (`.astro`) for simplicity since this is primarily a form — client interactivity via `<script>` tag with TypeScript
- **Client-side only**: All logic runs in browser, no API needed
- **Scope included**:
  - Classes A, B, C only (no D, E or special ranges)
  - Standard classful masks (/8 for A, /16 for B, /24 for C)
  - Visual grouping with automated color assignment
  - Dynamic field addition
- **Scope excluded**:
  - CIDR notation support (e.g., /26 custom masks)
  - Subnetting calculations beyond classful
  - IPv6 support
  - Saving/exporting results

## Further Considerations

1. **Component approach**: Astro component with client-side script vs. React/Preact component?
   - **Recommendation**: Astro component with `<script>` tag — simpler, no framework overhead needed for this use case
2. **Color assignment**: Predefined set of colors (5-6 distinct colors) or dynamic generation?
   - **Recommendation**: Predefined Tailwind colors (blue, green, purple, yellow, pink, indigo) — better accessibility and consistency
