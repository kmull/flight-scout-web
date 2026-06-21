# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server at http://localhost:4200 (hot reload)
npm run build      # Production build → dist/
npm run watch      # Dev build with watch mode
npm test           # Run unit tests with Karma/Jasmine in Chrome
```

To run a single spec file, pass the `--include` flag:
```bash
ng test --include src/app/services/auth-service.spec.ts
```

## Architecture

**Angular 20, standalone components, zoneless change detection.**  
The app uses `provideZonelessChangeDetection()` — there is no `NgZone`. Change detection relies on signals and explicit `markForCheck`/`detectChanges` calls. Prefer Angular signals over RxJS subjects for local state.

### Auth flow

`AuthService` (`src/app/services/auth-service.ts`) is the single source of truth for auth state. It exposes `isLoggedIn` as a `signal<boolean>` and stores the JWT in `localStorage` under the key `'token'`.

- `authInterceptor` automatically attaches `Authorization: Bearer <token>` to every outgoing HTTP request.
- `authGuard` (`canActivate`) protects routes that require login; redirects to `/dashboard` (note: currently redirects to dashboard instead of `/login` — likely a bug).
- `noAuthGuard` blocks already-authenticated users from reaching `/login` and `/register`, redirecting them to `/dashboard`.

Backend is expected at `http://localhost:9002/api/auth` (register/login endpoints).

### Routing

| Path | Component | Guard |
|---|---|---|
| `/` | `LandingComponent` | — |
| `/login` | `LoginComponent` | `noAuthGuard` |
| `/register` | `RegisterComponent` | `noAuthGuard` |
| `/dashboard` | `DashboardComponent` (nested under `SidebarLayoutComponent`) | `authGuard` |

`SidebarLayoutComponent` is a shell layout wrapping the authenticated area — it owns the sidebar nav and logout logic.

### HTTP Logging (dev tool)

`loggingInterceptor` is off by default. Enable/disable it at runtime from the browser console:
```js
window.enableHttpLogging()
window.disableHttpLogging()
```

### Code conventions

- **Styles:** SCSS per component (generated automatically via Angular schematics).
- **UI:** Angular Material + CDK. Use `MatFormFieldModule`, `MatInputModule`, etc. imported directly in each standalone component.
- **Notifications:** `ngx-toastr` via `ToastrService` (top-right, 3 s timeout, no duplicates). UI strings are in Polish.
- **Forms:** Reactive forms (`FormBuilder`, `ReactiveFormsModule`) — not template-driven forms.
- **DI:** Use `inject()` function, not constructor injection.
- **Enums:** Domain enums live in `src/app/enums/`. Each enum file also exports a `*Labels` record mapping enum values to Polish display strings (see `cabin-class.enum.ts`).
