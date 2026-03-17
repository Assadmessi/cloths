export const sampleUser = {
  uid: 'sample-admin',
  name: 'Asaad Admin',
  role: 'admin',
  email: 'admin@clothingos.com'
};

export const initialData = {
  products: [
    {
      id: 'prod-shirt-001',
      name: 'Classic Cotton Shirt',
      sku: 'CCS-001',
      category: 'Shirt',
      region: 'Yangon',
      fabricCostPerMeter: 4200,
      metersUsedPerItem: 1.6,
      fabricWastagePercent: 7,
      factoryChargeType: 'per_piece',
      factoryCostValue: 2400,
      factoryBatchQty: 0,
      priceTagBatchCost: 18000,
      priceTagUnits: 500,
      packagingBatchCost: 35000,
      packagingUnits: 500,
      outsideAccessoryCostPerPiece: 0,
      transportAllocation: 250,
      storageAllocation: 180,
      marketingAllocation: 320,
      wastageAllowance: 220,
      targetMargin: 0.35,
      minimumProfit: 1200,
      competitorMin: 9000,
      competitorMax: 14500,
      stockQty: 280,
      currentSellingPrice: 12900
    },
    {
      id: 'prod-trouser-001',
      name: 'Daily Wear Trouser',
      sku: 'DWT-001',
      category: 'Trouser',
      region: 'Rural',
      fabricCostPerMeter: 5300,
      metersUsedPerItem: 1.8,
      fabricWastagePercent: 9,
      factoryChargeType: 'batch',
      factoryCostValue: 720000,
      factoryBatchQty: 300,
      priceTagBatchCost: 18000,
      priceTagUnits: 500,
      packagingBatchCost: 42000,
      packagingUnits: 500,
      outsideAccessoryCostPerPiece: 150,
      transportAllocation: 300,
      storageAllocation: 220,
      marketingAllocation: 280,
      wastageAllowance: 260,
      targetMargin: 0.32,
      minimumProfit: 1400,
      competitorMin: 12000,
      competitorMax: 18000,
      stockQty: 150,
      currentSellingPrice: 16400
    }
  ],
  sales: [
    { id: 'sale-1', productId: 'prod-shirt-001', qty: 40, pricePerPiece: 12900, date: '2026-03-01', channel: 'Retail' },
    { id: 'sale-2', productId: 'prod-trouser-001', qty: 18, pricePerPiece: 16400, date: '2026-03-03', channel: 'Retail' }
  ],
  expenses: [
    { id: 'exp-1', category: 'Marketing', amount: 150000, date: '2026-03-02', note: 'Thingyan teaser posters' },
    { id: 'exp-2', category: 'Transport', amount: 85000, date: '2026-03-04', note: 'Factory delivery run' }
  ],
  shareholders: [
    { id: 'sh-1', name: 'Founder A', shares: 60, capital: 6000000 },
    { id: 'sh-2', name: 'Partner B', shares: 40, capital: 4000000 }
  ],
  dividends: [
    { id: 'div-1', title: 'Q1 Interim Dividend', amount: 600000, date: '2026-03-10' }
  ],
  promotions: [
    {
      id: 'promo-1',
      productId: 'prod-shirt-001',
      type: 'discount_percent',
      title: 'Thingyan Shirt Push',
      discountPercent: 10,
      fixedDiscount: 0,
      giftCost: 0,
      extraPackagingCost: 100,
      marketingCost: 120,
      campaignCost: 60000,
      qty: 100,
      date: '2026-03-12',
      seasonTag: 'Thingyan'
    }
  ],
  factoryOrders: [
    { id: 'fo-1', productId: 'prod-shirt-001', fabricSentMeters: 600, quantityProduced: 320, defectiveItems: 8, factoryCost: 768000, date: '2026-03-05' }
  ],
  settings: {
    companyName: 'Myanmar Clothing OS',
    currency: 'MMK',
    marketRegion: 'Myanmar',
    forceUnsafePricing: false
  },
  auditLogs: []
};
