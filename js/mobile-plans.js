/**
 * Mobile Plans Data Structure
 * 
 * This file contains the complete list of mobile plans used by the Mobile Plan Finder application.
 * Each plan has the following structure:
 * - id: Unique identifier for the plan
 * - name: Name of the plan
 * - carrier: Mobile carrier offering the plan
 * - price: Monthly price in USD
 * - data: Data allowance description
 * - features: Array of features included in the plan
 * - hotspot: Hotspot capability description
 */

const MOBILE_PLANS = [
    // Verizon Plans
    {
        id: 1,
        name: "Unlimited Welcome",
        carrier: "Verizon",
        price: 65,
        data: "Unlimited",
        features: ["5G", "Talk & Text", "Basic streaming"],
        hotspot: "No"
    },
    {
        id: 2,
        name: "Unlimited Plus",
        carrier: "Verizon",
        price: 80,
        data: "Unlimited",
        features: ["5G", "Premium streaming", "25GB hotspot", "HD video"],
        hotspot: "25GB"
    },
    {
        id: 3,
        name: "Unlimited Ultimate",
        carrier: "Verizon",
        price: 90,
        data: "Unlimited",
        features: ["5G", "Premium streaming", "60GB hotspot", "4K video", "International calling"],
        hotspot: "60GB"
    },
    {
        id: 4,
        name: "5G Start",
        carrier: "Verizon",
        price: 70,
        data: "Unlimited",
        features: ["5G", "Talk & Text", "Basic streaming"],
        hotspot: "No"
    },
    {
        id: 5,
        name: "5G Play More",
        carrier: "Verizon",
        price: 85,
        data: "Unlimited",
        features: ["5G", "Premium streaming", "25GB hotspot", "Disney+ included"],
        hotspot: "25GB"
    },

    // T-Mobile Plans
    {
        id: 6,
        name: "Essentials",
        carrier: "T-Mobile",
        price: 60,
        data: "Unlimited",
        features: ["5G", "Talk & Text", "Basic streaming"],
        hotspot: "3G speeds"
    },
    {
        id: 7,
        name: "Magenta",
        carrier: "T-Mobile",
        price: 70,
        data: "Unlimited",
        features: ["5G", "Premium streaming", "5GB hotspot", "Netflix included"],
        hotspot: "5GB"
    },
    {
        id: 8,
        name: "Magenta MAX",
        carrier: "T-Mobile",
        price: 85,
        data: "Unlimited",
        features: ["5G", "Premium streaming", "40GB hotspot", "Netflix included", "4K video"],
        hotspot: "40GB"
    },
    {
        id: 9,
        name: "Go5G",
        carrier: "T-Mobile",
        price: 75,
        data: "Unlimited",
        features: ["5G", "Premium streaming", "15GB hotspot", "Apple TV+ included"],
        hotspot: "15GB"
    },
    {
        id: 10,
        name: "Go5G Plus",
        carrier: "T-Mobile",
        price: 90,
        data: "Unlimited",
        features: ["5G", "Premium streaming", "50GB hotspot", "Apple TV+ included", "4K video"],
        hotspot: "50GB"
    },

    // AT&T Plans
    {
        id: 11,
        name: "Unlimited Starter",
        carrier: "AT&T",
        price: 65,
        data: "Unlimited",
        features: ["5G", "Talk & Text", "Basic streaming"],
        hotspot: "No"
    },
    {
        id: 12,
        name: "Unlimited Extra",
        carrier: "AT&T",
        price: 75,
        data: "Unlimited",
        features: ["5G", "Premium streaming", "15GB hotspot", "HBO Max included"],
        hotspot: "15GB"
    },
    {
        id: 13,
        name: "Unlimited Elite",
        carrier: "AT&T",
        price: 85,
        data: "Unlimited",
        features: ["5G", "Premium streaming", "40GB hotspot", "HBO Max included", "4K video"],
        hotspot: "40GB"
    },
    {
        id: 14,
        name: "Value Plus",
        carrier: "AT&T",
        price: 50,
        data: "Unlimited",
        features: ["5G", "Talk & Text", "Basic streaming"],
        hotspot: "No"
    },
    {
        id: 15,
        name: "Premium",
        carrier: "AT&T",
        price: 80,
        data: "Unlimited",
        features: ["5G", "Premium streaming", "30GB hotspot", "HBO Max included", "HD video"],
        hotspot: "30GB"
    },

    // Budget Carrier Plans
    {
        id: 16,
        name: "Unlimited",
        carrier: "Visible",
        price: 30,
        data: "Unlimited",
        features: ["5G", "Talk & Text", "Basic streaming"],
        hotspot: "One device"
    },
    {
        id: 17,
        name: "Unlimited Plus",
        carrier: "Visible",
        price: 45,
        data: "Unlimited",
        features: ["5G", "Premium streaming", "Unlimited hotspot", "HD video"],
        hotspot: "Unlimited"
    },
    {
        id: 18,
        name: "Unlimited",
        carrier: "Mint Mobile",
        price: 30,
        data: "Unlimited",
        features: ["5G", "Talk & Text", "Basic streaming"],
        hotspot: "5GB"
    },
    {
        id: 19,
        name: "Unlimited Premium",
        carrier: "Mint Mobile",
        price: 40,
        data: "Unlimited",
        features: ["5G", "Premium streaming", "15GB hotspot", "HD video"],
        hotspot: "15GB"
    },
    {
        id: 20,
        name: "Unlimited",
        carrier: "Metro by T-Mobile",
        price: 50,
        data: "Unlimited",
        features: ["5G", "Talk & Text", "Basic streaming", "Google One included"],
        hotspot: "5GB"
    }
];

// Export the data structure
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MOBILE_PLANS };
} else {
    // For browser usage
    window.MOBILE_PLANS = MOBILE_PLANS;
}
