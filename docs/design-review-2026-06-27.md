# Design Review - 2026-06-27

## Scope

- Reviewed `docs/design-preview.html` as the first visual proof of the Executive Finance Cockpit direction.
- Checked desktop at 1440px and mobile emulation at 390px.

## Finding

### DR-001: Mobile preview had horizontal overflow and ambiguous bottom navigation

On narrow screens, secondary topbar metadata, panel header badges, bottom navigation counters, and the decision table could force or imply horizontal overflow. The bottom navigation also showed numeric counters without clear labels in the first mobile baseline.

## Fix

- Kept desktop layout unchanged.
- Made mobile topbar compact by hiding secondary chips and using a compact theme control.
- Restored bottom navigation labels and hid counters on mobile.
- Allowed panel headers and labels to stack naturally on mobile.
- Added fixed mobile table layout with wrapping cells.

## Verification

- Desktop screenshot: 1440px visual pass.
- Mobile CDP emulation: `viewport=390`, `scrollWidth=390`, `bodyScrollWidth=390`, `offenders=[]`.
