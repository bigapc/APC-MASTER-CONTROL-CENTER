# APC Launch Readiness Checklist

**Preferred target:** August 26, 2026  
**Contingency:** First week of September 2026

## Purpose

This checklist is the launch gate for APC's current Step 1 build. It is intentionally limited to launch-critical validation. Future concepts must not delay the first stable launch unless they are required for safety, security, legal, or core operation.

## A. Architecture

- [ ] APC Enterprise Master Architecture v1.0 is the source of truth.
- [ ] SafeConnect remains a distinct product/business.
- [ ] CommunitySafeConnect remains a distinct community product.
- [ ] CSC 2.0 remains a distinct advanced institutional/enterprise product.
- [ ] SafeConnect operational Dispatcher remains inside SafeConnect.
- [ ] Standalone Dispatcher Software remains separate APC-owned technology/IP.
- [ ] APC Master Control Center remains the enterprise monitoring plane.
- [ ] APC Executive Command remains separate owner-level oversight.

## B. Master Control Center

- [ ] Existing Master Control Center functionality is preserved unless a documented blocker requires change.
- [ ] APC corporate branding is applied using the official APC signature/master mark.
- [ ] APC red/black/white design language is consistent.
- [ ] Product navigation is clearly separated from enterprise monitoring.
- [ ] Authorized operators can view permitted unit status.
- [ ] Critical incidents/escalations can be surfaced.
- [ ] Communications/call functions are verified where already implemented.
- [ ] Supervisor/staff monitoring follows role permissions.
- [ ] Enterprise analytics/status views load without critical errors.
- [ ] SafeConnect, CommunitySafeConnect, and CSC 2.0 integrations are verified where implemented.
- [ ] APC-branded footer/legal notice is present.

## C. APC Executive Command

- [ ] Owner-level environment is logically separated from ordinary operator access.
- [ ] CFO/COO/CMO/other executive views use appropriate role-based permissions.
- [ ] Sensitive executive information is not exposed to ordinary staff.
- [ ] Least-privilege access is verified.

## D. Product Applications

### SafeConnect
- [ ] Existing working application remains intact.
- [ ] Operational Dispatcher remains intact.
- [ ] Authentication/authorization works.
- [ ] Critical courier/dispatch workflow passes smoke test.
- [ ] Existing AI decision-support integration is not broken.

### CommunitySafeConnect
- [ ] Existing community workflows remain intact.
- [ ] Command/operations functions pass smoke test.
- [ ] Authentication/authorization works.

### CSC 2.0
- [ ] Public app and Control Hub remain distinct.
- [ ] Institutional/enterprise workflows remain intact.
- [ ] Authentication/authorization works.
- [ ] Core organization/control workflows pass smoke test.

### Standalone Dispatcher Software
- [ ] Repository builds successfully.
- [ ] Web/API startup succeeds.
- [ ] Authentication works.
- [ ] Database connectivity works.
- [ ] Dispatch core workflow passes smoke test.
- [ ] AI package does not introduce unauthorized data access.
- [ ] No production secrets are committed.

## E. Security

- [ ] No API keys, passwords, JWT secrets, database passwords, or private credentials are committed.
- [ ] Production secrets are stored through approved secret/environment configuration.
- [ ] Webhooks use appropriate signing/authentication.
- [ ] Cross-platform data access is explicitly authorized.
- [ ] AI services inherit user authorization boundaries.
- [ ] Demo/test credentials are disabled or controlled for production.

## F. Branding / IP

- [ ] Official APC signature logo is used without distortion/recoloring.
- [ ] Each product has an identifiable APC-family product mark.
- [ ] Appropriate copyright notice is present.
- [ ] Trademark symbols are used only where APC has intentionally designated the mark; registration status is not implied.
- [ ] No feature is described as patented unless professionally confirmed/filed.

## G. Build / Validation

- [ ] Production build passes.
- [ ] Type checking passes where configured.
- [ ] Linting passes where configured.
- [ ] Existing automated tests pass where configured.
- [ ] Critical routes load.
- [ ] Critical APIs respond.
- [ ] Database migrations/schema are verified.
- [ ] No new critical console/runtime errors.
- [ ] Launch candidate is tagged/identified before deployment.

## H. Change Control

Before any coding-agent change:

- [ ] Exact repository identified.
- [ ] Exact feature identified.
- [ ] Existing implementation inspected.
- [ ] Acceptance criteria written.
- [ ] No duplicate feature is being rebuilt unnecessarily.
- [ ] Change is limited to the required scope.
- [ ] Build/test verification is planned.

## Launch Decision

**GO** only when all launch-critical blockers are resolved.

**HOLD** if there is a critical security, authorization, data-loss, build, database, or core operational failure.

**DEFER** noncritical enhancements to the post-launch roadmap rather than allowing them to consume the launch window.

> **Measure twice. Build once.**
