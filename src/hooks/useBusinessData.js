import { useMemo } from 'react';
import { sampleExpenses, sampleFactoryOrders, sampleProducts, sampleSales, sampleShareholders } from '../data/sampleData';
import { calcDefectRate, calcDividend, calcNetProfit, calcOwnership, calcPricing, generateBusinessDecision, simulatePromotion } from '../utils/businessLogic';

export function useBusinessData() {
  return useMemo(() => {
    const products = sampleProducts.map((p) => ({ ...p, pricing: calcPricing(p) }));
    const revenue = sampleSales.reduce((sum, s) => sum + s.qty * s.pricePerPiece, 0);
    const productionCost = sampleSales.reduce((sum, s) => {
      const product = products.find((p) => p.id === s.productId);
      return sum + (product?.pricing?.productionCostPerPiece || 0) * s.qty;
    }, 0);
    const expenses = sampleExpenses.reduce((sum, e) => sum + e.amount, 0);
    const netProfit = calcNetProfit({ revenue, expenses, productionCost });
    const stockValue = products.reduce((sum, p) => sum + p.stockQty * p.pricing.productionCostPerPiece, 0);
    const cash = 12000000 + revenue - expenses;
    const totalShares = sampleShareholders.reduce((sum, s) => sum + s.shares, 0);
    const distributableProfit = Math.max(0, netProfit * 0.5);
    const shareholders = sampleShareholders.map((s) => ({
      ...s,
      ownership: calcOwnership(s, totalShares),
      dividend: calcDividend(distributableProfit, s, totalShares)
    }));
    const promotions = products.map((p) => ({
      productId: p.id,
      productName: p.name,
      ...simulatePromotion({
        sellingPrice: p.pricing.recommendedPrice,
        productionCostPerPiece: p.pricing.productionCostPerPiece,
        discountPercent: 10,
        marketingCost: 120,
        campaignCost: 60000,
        qty: 100
      })
    }));
    const lowMarginProducts = products.filter((p) => p.pricing.lowMargin).length;
    const unsafePromotions = promotions.filter((p) => p.unsafe).length;
    const recommendedActions = generateBusinessDecision({ cash, stockValue, netProfit, lowMarginProducts, unsafePromotions });
    const factoryOrders = sampleFactoryOrders.map((o) => ({ ...o, defectRate: calcDefectRate(o) }));
    return {
      products,
      sales: sampleSales,
      expensesList: sampleExpenses,
      revenue,
      productionCost,
      expenses,
      netProfit,
      stockValue,
      cash,
      shareholders,
      totalShares,
      distributableProfit,
      promotions,
      recommendedActions,
      factoryOrders
    };
  }, []);
}
