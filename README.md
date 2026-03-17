# Clothing OS Mobile

Production-oriented React Native (Expo) mobile operating system for a Myanmar clothing company using outsourced factory manufacturing.

## Stack
- React Native (JavaScript) with Expo
- Firebase Auth + Firestore
- Role-based access
- Central business engines for costing, pricing, promotions, decisions, market analysis, and audit logs

## Included business domains
- Products
- Production costing
- Pricing strategy
- Promotions
- Sales
- Expenses
- Shareholders / dividends
- Factory orders
- Market analysis for Myanmar
- Audit history
- Dashboard / reports / settings

## Setup

1. Install Node 20+ and Expo CLI.
2. Install packages:

```bash
npm install
```

3. Create Firebase project and enable:
   - Authentication → Email/Password
   - Firestore Database

4. Copy `.env.example` values into `src/config/firebase.js`.

5. Start the app:

```bash
npm run start
```

## Firestore collections

- `users`
- `products`
- `factoryOrders`
- `sales`
- `expenses`
- `promotions`
- `shareholders`
- `dividends`
- `auditLogs`
- `settings`
- `marketSnapshots`

## Roles
- `admin`
- `manager`
- `staff`
- `viewer`

## Audit log behavior
Every create / update / delete should call `createAuditLog(...)`.
Logs are read-only by design and kept for 365 days. A scheduled cleanup function should archive or delete expired logs.

## Recommended production deployment additions
- Move audit logging + retention to Cloud Functions or Supabase Edge Functions
- Add App Check
- Add Firestore security rules
- Add EAS build profiles
- Add crash reporting (Sentry / Firebase Crashlytics via bare workflow)
- Add offline queueing for poor network conditions in Myanmar

## Suggested Firebase security rules (starter idea)
- Read access based on signed-in status and role document
- Only admin/manager can delete main entities
- Nobody can update/delete `auditLogs` from client
- Only server-side scheduled function handles audit retention

## Seed users
Create users in Firebase Auth, then add matching Firestore `users/{uid}` docs:
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "role": "admin"
}
```

## Deployment
### Android
```bash
npx expo run:android
```

### iOS
```bash
npx expo run:ios
```

For store deployment use Expo EAS:
```bash
npm install -g eas-cli
eas build:configure
eas build --platform android
eas build --platform ios
```
