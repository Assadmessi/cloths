import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialData } from '../data/sampleData';
import {
  calcDefectRate,
  calcDividend,
  calcNetProfit,
  calcOwnership,
  calcPricing,
  generateBusinessDecision,
  myanmarMarketSuggestion,
  simulatePromotion
} from '../utils/businessLogic';

const STORAGE_KEY = 'clothing_os_editable_v2';
const DataContext = createContext(null);

const makeId = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
const nowIso = () => new Date().toISOString();

function normalizeNumber(value) {
  if (value === '' || value === null || value === undefined) return 0;
  const parsed = Number(String(value).replace(/,/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function withArchiveCleanup(data) {
  const now = Date.now();
  const oneYearMs = 365 * 24 * 60 * 60 * 1000;
  const existingLogs = Array.isArray(data.auditLogs) ? data.auditLogs : [];
  const kept = existingLogs.filter((log) => now - new Date(log.timestamp).getTime() <= oneYearMs);
  if (kept.length === existingLogs.length) return { ...data, auditLogs: existingLogs };
  const archivedCount = existingLogs.length - kept.length;
  return {
    ...data,
    auditLogs: [
      ...kept,
      {
        id: makeId('audit'),
        entityType: 'auditLogs',
        entityId: 'system-retention',
        action: 'archive',
        fieldChanged: 'retention',
        oldValue: `${archivedCount} old logs`,
        newValue: 'archived/deleted by 365-day rule',
        userId: 'system',
        userName: 'System Retention Job',
        role: 'system',
        timestamp: nowIso(),
        message: `System archived ${archivedCount} audit record(s) older than 365 days.`
      }
    ]
  };
}

export function DataProvider({ children, user }) {
  const [state, setState] = useState(initialData);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setState(withArchiveCleanup({ ...initialData, ...parsed }));
        } else {
          setState(withArchiveCleanup(initialData));
        }
      } finally {
        setReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, ready]);

  const addAudit = ({ entityType, entityId, action, fieldChanged, oldValue, newValue, message }) => {
    const log = {
      id: makeId('audit'),
      entityType,
      entityId,
      action,
      fieldChanged,
      oldValue: oldValue ?? null,
      newValue: newValue ?? null,
      userId: user?.uid || 'local-admin',
      userName: user?.name || 'Local Admin',
      role: user?.role || 'admin',
      timestamp: nowIso(),
      message
    };
    setState((prev) => ({ ...prev, auditLogs: [log, ...(prev.auditLogs || [])] }));
  };

  const createItem = (collection, payload) => {
    const id = payload.id || makeId(collection.slice(0, 3));
    const item = { ...payload, id };
    setState((prev) => ({ ...prev, [collection]: [item, ...prev[collection]] }));
    Object.keys(item).forEach((field) => {
      if (field === 'id') return;
      addAudit({
        entityType: collection,
        entityId: id,
        action: 'create',
        fieldChanged: field,
        oldValue: null,
        newValue: item[field],
        message: `${user?.role || 'Admin'} created ${collection} record ${id} and set ${field}.`
      });
    });
  };

  const updateItem = (collection, id, payload) => {
    setState((prev) => ({
      ...prev,
      [collection]: prev[collection].map((item) => (item.id === id ? { ...item, ...payload } : item))
    }));
    const existing = state[collection].find((item) => item.id === id) || {};
    Object.keys(payload).forEach((field) => {
      if (existing[field] !== payload[field]) {
        addAudit({
          entityType: collection,
          entityId: id,
          action: 'update',
          fieldChanged: field,
          oldValue: existing[field],
          newValue: payload[field],
          message: `${user?.role || 'Admin'} updated ${field} from ${existing[field]} to ${payload[field]}`
        });
      }
    });
  };

  const deleteItem = (collection, id) => {
    const existing = state[collection].find((item) => item.id === id);
    if (!existing) return;
    setState((prev) => ({ ...prev, [collection]: prev[collection].filter((item) => item.id !== id) }));
    Object.keys(existing).forEach((field) => {
      if (field === 'id') return;
      addAudit({
        entityType: collection,
        entityId: id,
        action: 'delete',
        fieldChanged: field,
        oldValue: existing[field],
        newValue: null,
        message: `${user?.role || 'Admin'} deleted ${collection} record ${id}`
      });
    });
  };

  const updateSettings = (payload) => {
    const oldSettings = state.settings;
    setState((prev) => ({ ...prev, settings: { ...prev.settings, ...payload } }));
    Object.keys(payload).forEach((field) => {
      if (oldSettings[field] !== payload[field]) {
        addAudit({
          entityType: 'settings',
          entityId: 'app-settings',
          action: 'update',
          fieldChanged: field,
          oldValue: oldSettings[field],
          newValue: payload[field],
          message: `${user?.role || 'Admin'} updated setting ${field}.`
        });
      }
    });
  };

  const resetAllData = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setState(withArchiveCleanup(initialData));
  };

  const computed = useMemo(() => {
    const products = state.products.map((p) => {
      const sanitized = Object.fromEntries(Object.entries(p).map(([k, v]) => [k, typeof v === 'string' && /^\d+(\.\d+)?$/.test(v) ? normalizeNumber(v) : v]));
      const pricing = calcPricing({ ...sanitized, currentSellingPrice: normalizeNumber(p.currentSellingPrice || 0) }, normalizeNumber(p.currentSellingPrice || 0) || null);
      return { ...p, pricing, marketSuggestion: myanmarMarketSuggestion({ ...p }, pricing) };
    });
    const productMap = Object.fromEntries(products.map((p) => [p.id, p]));
    const revenue = state.sales.reduce((sum, s) => sum + normalizeNumber(s.qty) * normalizeNumber(s.pricePerPiece), 0);
    const productionCost = state.sales.reduce((sum, s) => {
      const product = productMap[s.productId];
      return sum + normalizeNumber(s.qty) * normalizeNumber(product?.pricing?.productionCostPerPiece || 0);
    }, 0);
    const expenses = state.expenses.reduce((sum, e) => sum + normalizeNumber(e.amount), 0);
    const netProfit = calcNetProfit({ revenue, expenses, productionCost });
    const stockValue = products.reduce((sum, p) => sum + normalizeNumber(p.stockQty) * normalizeNumber(p.pricing.productionCostPerPiece), 0);
    const totalMoney = 12000000 + revenue - expenses;
    const totalShares = state.shareholders.reduce((sum, sh) => sum + normalizeNumber(sh.shares), 0);
    const totalDividends = state.dividends.reduce((sum, d) => sum + normalizeNumber(d.amount), 0);
    const shareholders = state.shareholders.map((s) => ({
      ...s,
      ownership: calcOwnership({ shares: normalizeNumber(s.shares) }, totalShares),
      dividendProjection: calcDividend(Math.max(0, netProfit - totalDividends), { shares: normalizeNumber(s.shares) }, totalShares)
    }));
    const promotions = state.promotions.map((promo) => {
      const product = productMap[promo.productId];
      const sellingPrice = normalizeNumber(product?.currentSellingPrice || product?.pricing?.recommendedPrice || 0);
      const simulation = simulatePromotion({
        sellingPrice,
        productionCostPerPiece: normalizeNumber(product?.pricing?.productionCostPerPiece || 0),
        discountPercent: normalizeNumber(promo.discountPercent),
        fixedDiscount: normalizeNumber(promo.fixedDiscount),
        giftCost: normalizeNumber(promo.giftCost),
        extraPackagingCost: normalizeNumber(promo.extraPackagingCost),
        marketingCost: normalizeNumber(promo.marketingCost),
        campaignCost: normalizeNumber(promo.campaignCost),
        qty: normalizeNumber(promo.qty || 1)
      });
      return { ...promo, productName: product?.name || 'Unknown Product', sellingPrice, ...simulation };
    });
    const factoryOrders = state.factoryOrders.map((o) => ({
      ...o,
      defectRate: calcDefectRate({ quantityProduced: normalizeNumber(o.quantityProduced), defectiveItems: normalizeNumber(o.defectiveItems) }),
      costPerPiece: normalizeNumber(o.quantityProduced) ? normalizeNumber(o.factoryCost) / normalizeNumber(o.quantityProduced) : 0
    }));
    const recommendations = generateBusinessDecision({
      cash: totalMoney,
      stockValue,
      netProfit,
      lowMarginProducts: products.filter((p) => p.pricing.lowMargin).length,
      unsafePromotions: promotions.filter((p) => p.unsafe).length
    });

    return {
      ...state,
      products,
      shareholders,
      promotions,
      factoryOrders,
      revenue,
      productionCost,
      expensesTotal: expenses,
      netProfit,
      stockValue,
      totalMoney,
      totalShares,
      totalDividends,
      recommendations
    };
  }, [state]);

  const value = {
    ready,
    ...computed,
    createItem,
    updateItem,
    deleteItem,
    updateSettings,
    resetAllData,
    normalizeNumber
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  return useContext(DataContext);
}
