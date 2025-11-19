# Supabase to Convex Migration Context

## Project Overview
**Application**: Tailor's Log Book - PWA for tailors to manage client measurements and invoices
**Current Stack**: React + TypeScript + Vite + Supabase + shadcn/ui
**Target**: Migrate from Supabase to Convex for backend + auth

## Current Supabase Implementation Analysis

### Database Schema
- **Main table**: `measurements` (30+ measurement fields + metadata)
- **Key fields**: client info, body measurements, job tracking, payments, dates
- **User system**: Supabase auth with user_id foreign key

### Current Dependencies
```json
"@supabase/supabase-js": "^2.49.5"
```

### Files Using Supabase
- `src/integrations/supabase/client.ts` - Main client
- `src/integrations/supabase/types.ts` - Generated types
- `src/contexts/AuthContext.tsx` - Auth management
- `src/hooks/useMeasurements.tsx` - CRUD operations
- `src/pages/Auth.tsx` - Login/signup forms

### Current Features
1. User authentication (signup/login/logout)
2. Measurements CRUD operations
3. Real-time auth state management
4. Client search and filtering
5. Job tracking and payment management
6. Invoice generation

## Convex Migration Plan

### Phase 1: Setup & Dependencies
- Install: `convex`
- Remove: `@supabase/supabase-js`
- Set up Convex project configuration

### Phase 2: Schema Design
```typescript
// Convex schema structure
export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
  }),
  
  measurements: defineTable({
    // Client Info
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    gender: v.optional(v.string()),
    
    // 30+ Body Measurements
    chest: v.optional(v.number()),
    waist: v.optional(v.number()),
    // ... all measurement fields
    
    // Job/Service Info
    jobs: v.optional(v.array(v.any())),
    serviceCharge: v.optional(v.string()),
    paidAmount: v.optional(v.string()),
    balance: v.optional(v.string()),
    
    // Metadata
    timestamp: v.optional(v.string()),
    userId: v.id("users"),
  })
  .index("by_user", ["userId"])
  .searchIndex("search_clients", {
    searchField: "name",
    filterFields: ["userId"]
  }),
});
```

### Phase 3: Implementation Files to Replace
1. `src/integrations/convex/client.ts` (replace Supabase client)
2. `src/contexts/AuthContext.tsx` (use useConvexAuth)
3. `src/hooks/useMeasurements.tsx` (use Convex queries/mutations)
4. `convex/measurements.ts` (backend functions)
5. `convex/auth.ts` (auth functions)

### Phase 4: Key Benefits Expected
- Real-time updates by default
- Full TypeScript integration
- Simplified authentication
- Better developer experience
- Built-in search capabilities
- Optimistic UI updates

### Phase 5: Migration Strategy
1. Parallel development (keep Supabase running)
2. Feature parity testing
3. Data export from Supabase
4. Gradual rollout with feature flags
5. Full migration and cleanup

## Current Application Status
- Development server running on http://localhost:8080/stitch-scribe-tracker/
- No current TODOs or bugs identified in codebase
- Well-structured React application with good separation of concerns
- PWA ready with Capacitor for mobile deployment

## Next Steps When Resuming
1. **Start with Phase 1**: Install Convex dependencies
2. **Set up Convex project**: Initialize convex in the workspace
3. **Create schema**: Design the measurements table schema
4. **Implement auth**: Replace AuthContext with Convex auth
5. **Migrate measurements hook**: Replace Supabase calls with Convex

## Data Migration Considerations
- Export existing measurements data from Supabase
- User re-registration may be required (or build migration script)
- Field type mappings between Supabase and Convex schemas
- Preserve measurement history and client relationships

---
*Context saved on: [Current Date]*
*Ready to continue migration implementation*