import { roundPriceMyanmar } from './format';

export function calcFabricCostPerPiece(product) {
  const base = Number(product.fabricCostPerMeter || 0) * Number(product.metersUsedPerItem || 0);
  const wastageMultiplier = 1 + Number(product.fabricWastagePercent || 0) / 100;
  return base * wastageMultiplier;
}

export function calcFactoryCostPerPiece(product) {
  if (product.factoryChargeType === 'batch') {
    const qty = Number(product.factoryBatchQty || 1);
    return Number(product.factoryCostValue || 0) / qty;
  }
  return Number(product.factoryCostValue || 0);
}

export function calcBatchUnitCost(batchCost, units) {
  if (!units) return 0;
  return Number(batchCost || 0) / Number(units || 1);
}

export function calcProductionCostPerPiece(product) {
  return (
    calcFabricCostPerPiece(product) +
    calcFactoryCostPerPiece(product) +
    calcBatchUnitCost(product.priceTagBatchCost, product.priceTagUnits) +
    calcBatchUnitCost(product.packagingBatchCost, product.packagingUnits) +
    Number(product.outsideAccessoryCostPerPiece || 0) +
    Number(product.transportAllocation || 0) +
    Number(product.storageAllocation || 0) +
    Number(product.marketingAllocation || 0) +
    Number(product.wastageAllowance || 0)
  );
}

export function calcPricing(product, forcedPrice = null) {
  const productionCostPerPiece = calcProductionCostPerPiece(product);
  const minimumPrice = productionCostPerPiece + Number(product.minimumProfit || 0);
  const recommendedPrice = productionCostPerPiece * (1 + Number(product.targetMargin || 0));
  const premiumPrice = recommendedPrice * 1.15;
  const promotionalPrice = recommendedPrice * 0.92;
  const selectedPrice = forcedPrice ?? recommendedPrice;
  const profit = selectedPrice - productionCostPerPiece;
  const margin = selectedPrice > 0 ? profit / selectedPrice : 0;
  return {
    productionCostPerPiece,
    minimumPrice,
    recommendedPrice: roundPriceMyanmar(recommendedPrice, 'standard'),
    premiumPrice: roundPriceMyanmar(premiumPrice, 'premium'),
    promotionalPrice: roundPriceMyanmar(promotionalPrice, 'promotional'),
    selectedPrice,
    profit,
    margin,
    isUnsafe: selectedPrice < minimumPrice,
    lowMargin: margin < 0.15
  };
}

export function simulatePromotion({ sellingPrice, productionCostPerPiece, discountPercent = 0, fixedDiscount = 0, giftCost = 0, extraPackagingCost = 0, marketingCost = 0, campaignCost = 0, qty = 1 }) {
  const priceAfterPercent = sellingPrice * (1 - discountPercent / 100);
  const discountedPrice = Math.max(0, priceAfterPercent - fixedDiscount);
  const extraPromotionCost = giftCost + extraPackagingCost + marketingCost + campaignCost / Math.max(qty, 1);
  const promotionProfit = discountedPrice - productionCostPerPiece - extraPromotionCost;
  const promotionMargin = discountedPrice > 0 ? promotionProfit / discountedPrice : 0;
  const totalPromotionCost = (sellingPrice - discountedPrice) + giftCost + extraPackagingCost + marketingCost + campaignCost;
  const breakEvenSalesNeeded = promotionProfit > 0 ? Math.ceil(totalPromotionCost / promotionProfit) : Infinity;

  return {
    discountedPrice,
    extraPromotionCost,
    promotionProfit,
    promotionMargin,
    totalPromotionCost,
    breakEvenSalesNeeded,
    unsafe: promotionProfit < 0 || promotionMargin < 0.08
  };
}

export function calcOwnership(shareholder, totalShares) {
  return totalShares > 0 ? shareholder.shares / totalShares : 0;
}

export function calcDividend(distributableProfit, shareholder, totalShares) {
  return distributableProfit * calcOwnership(shareholder, totalShares);
}

export function calcNetProfit({ revenue, expenses, productionCost }) {
  return Number(revenue || 0) - Number(expenses || 0) - Number(productionCost || 0);
}

export function calcDefectRate(order) {
  const total = Number(order.quantityProduced || 0);
  if (!total) return 0;
  return Number(order.defectiveItems || 0) / total;
}

export function myanmarMarketSuggestion(product, pricing) {
  const avgCompetitor = (Number(product.competitorMin || 0) + Number(product.competitorMax || 0)) / 2;
  if (pricing.selectedPrice > avgCompetitor * 1.12) return 'Price is premium for market. Use branding or event-led value campaign.';
  if (pricing.selectedPrice < Number(product.competitorMin || 0)) return 'Price is highly competitive. Check margin before scaling.';
  if ((product.region || '').toLowerCase().includes('rural')) return 'Use practical bundle or payday promotions for rural-sensitive demand.';
  return 'Maintain recommended price and prepare event-specific promotions for Yangon and urban retail.';
}

export function generateBusinessDecision({ cash, stockValue, netProfit, lowMarginProducts = 0, unsafePromotions = 0 }) {
  const actions = [];
  if (netProfit > 0 && cash > stockValue * 0.25) actions.push('Consider dividend distribution while preserving working capital.');
  if (cash < stockValue * 0.1) actions.push('Request more capital or slow procurement until cash improves.');
  if (lowMarginProducts > 0) actions.push('Adjust pricing or cut allocations on weak-margin products.');
  if (unsafePromotions > 0) actions.push('Pause unsafe campaigns and switch to bundles or premium gift strategy.');
  if (stockValue < cash * 0.2) actions.push('Buy more stock for best-performing SKUs before seasonal demand.');
  if (!actions.length) actions.push('Hold money, maintain inventory discipline, and monitor pricing weekly.');
  return actions;
}
