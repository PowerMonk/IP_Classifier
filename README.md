# IP Address Classifier

A web application for analyzing and classifying IPv4 addresses according to classful networking standards (Class A, B, and C). Built with Astro and Tailwind CSS.

## Features

- **IP Classification**: Automatically classifies IP addresses into Class A, B, or C based on the first octet
- **Network Calculations**: Computes network address, broadcast address, and subnet mask for each IP
- **Network Grouping**: Visually groups IP addresses that belong to the same network with color-coded cards
- **Dynamic Input**: Add or remove IP address fields as needed
- **Input Validation**: Validates IP address format and octet ranges (0-255)
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## How It Works

The application analyzes IP addresses using classful networking rules:

- **Class A**: 0.0.0.0 to 127.255.255.255 (Subnet Mask: 255.0.0.0 or /8)
- **Class B**: 128.0.0.0 to 191.255.255.255 (Subnet Mask: 255.255.0.0 or /16)
- **Class C**: 192.0.0.0 to 255.255.255.255 (Subnet Mask: 255.255.255.0 or /24)

For each IP address, the tool calculates:

1. **Network Address**: Using binary AND operation between IP and subnet mask
2. **Broadcast Address**: Setting all host bits to 1
3. **Network Grouping**: Identifies which IPs share the same network

## Usage

1. Enter the number of IP addresses you want to analyze
2. Input the IP addresses in the generated text fields
3. Click "Analyze IPs" to see the results
4. Use "Add Another IP" to add more fields dynamically
5. Use "Clear All" to reset the form

## Tech Stack

- **Astro 5.17.1**: Modern web framework for fast, content-focused websites
- **Tailwind CSS 4.1.18**: Utility-first CSS framework for styling
- **TypeScript**: Type-safe JavaScript for robust code

## Project Structure

```
src/
├── components/
│   └── IPAnalyzer.astro       # Main UI component (markup only)
├── pages/
│   └── index.astro            # Homepage that renders IPAnalyzer
├── scripts/
│   └── ipAnalyzerClient.ts    # Client-side DOM manipulation logic
├── styles/
│   └── global.css             # Global styles and Tailwind imports
└── utils/
    └── ipClassifier.ts        # Core IP classification algorithms
```

## Development

```sh
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Examples

**Same Network Detection:**

- 192.168.10.1, 192.168.10.10, and 192.168.10.110 will be grouped together (Network: 192.168.10.0)

**Different Networks:**

- 192.168.10.1 and 192.168.20.1 will be in separate groups (Networks: 192.168.10.0 and 192.168.20.0)

**Cross-Class Examples:**

- Class A: 38.40.101.125 → Network: 38.0.0.0, Broadcast: 38.255.255.255
- Class B: 140.20.36.10 → Network: 140.20.0.0, Broadcast: 140.20.255.255
- Class C: 192.168.10.1 → Network: 192.168.10.0, Broadcast: 192.168.10.255

## License

MIT
