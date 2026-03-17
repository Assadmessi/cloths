# Production architecture summary

## App layers
- `screens/` → feature UI
- `components/` → reusable UI
- `context/` → auth and session state
- `services/` → Firestore + audit write APIs
- `utils/` → business formulas and decision engines
- `data/` → seed/sample data

## Core modules
1. Authentication + role guard
2. Product master data
3. Production costing engine
4. Pricing engine
5. Promotion simulator
6. Finance + shareholder engine
7. Factory production tracker
8. Reports / analytics
9. Audit history + retention
10. Myanmar market intelligence

## Recommended backend upgrades
- Cloud Functions:
  - `onWrite` triggers for automatic audit logs
  - nightly job for log retention
  - dividend close-period processing
  - market snapshot updater
- Storage for invoices, production slips, packaging images
- callable functions for privileged actions such as force-unsafe pricing overrides

## Myanmar adaptation rules
- default currency = MMK
- rounded prices:
  - standard = nearest 500
  - premium = 100 below next 1000
  - promo = 100 below next 500
- regional strategy:
  - Yangon: higher premium tolerance
  - rural: stronger price sensitivity

## Recommended next implementation tasks
- add CRUD forms for every entity
- wire live Firestore queries
- add security rules based on custom claims or user documents
- add PDF invoice/export layer
- add offline cache and sync status
- add barcode / SKU scan support
