# APC Brand Identity and Logo Control Standard

**Status:** Owner-directed brand standard; APPC logo is a concept pending approval.  
**Applies to:** APC LLC, APC Daily, APC Daily Pay Card, and future APC-branded projects.

## 1. Official APC master logo

Armstrong Pack Company LLC (APC LLC) has one official master logo: the owner-supplied circular APC mark with the ARMSTRONG PACK COMPANY wordmark.

- Use the owner-supplied master artwork as-is on APC projects, websites, applications, manuals, cards, presentations, footers, stickers, and watermarks.
- Do not redraw, recreate, stretch, distort, crop, recolor, add shadows/reflections to, or substitute the official APC master artwork.
- Preserve its proportions, legibility, and adequate clear space.
- If a background makes the original artwork illegible, place the unchanged artwork on a suitable neutral field rather than modifying the logo.
- Any alternate file format or transparent-background export must be derived faithfully from the master artwork and approved by the owner.

**Asset note:** The official logo image must be added to the repository as an approved asset (suggested path: `public/brand/APC-Official-Logo.jpg`). This document does not claim that the image has already been committed.

## 2. APC Daily and APC Daily Pay Card

- The clothing storefront retains the existing name **APC Daily** and its current website/routes. Do not rename or replace the clothing store.
- The future financial-card concept must be written exactly **APC Daily Pay Card**.
- Use the unchanged official APC master logo on the card presentation.
- Card presentation colorways:
  1. **Signature:** solid APC red background with white details.
  2. **Classic:** solid white background with APC red details.
  3. **Executive:** solid black background with white details and restrained APC red accents.
- These colorways are card/product treatments, not alternate versions of the APC master logo.
- Any Coming Soon page must clearly identify the card as a concept until an actual financial program is approved and available. Do not imply that credit-building, investment, debit, credit, or tap-to-pay services are live when they are not.

## 3. Future tap accessory

An APC-branded sticker may be presented as a decorative branding concept. A wand or other tap accessory is a separate future product concept. Do not represent a decorative sticker as a payment device. Any payment-enabled accessory requires a suitable payment-program partner, compatible technology, security review, testing, and applicable approvals before being advertised as functional.

## 4. APPC LLC is a separate identity

**Armstrong PackPrint Company LLC (APPC LLC)** is a separate LLC from APC LLC.

- APPC's proposed logo direction is based on the APC visual identity, with an additional second **P** offset slightly and a subtle mid-light shadow/reflection.
- Keep the original APC master mark intact within the concept; the added P is what distinguishes the APPC variation.
- The APPC logo is a separate concept and must not be substituted for the official APC logo on APC LLC projects.
- Do not publish the APPC variation as an approved official mark until the owner has reviewed and approved the final artwork.

## 5. Trademark, copyright, and design records

The owner identifies the APC logo as trademarked. Preserve that owner designation in brand documentation, but do not imply that a new product name, card layout, accessory, or APPC variation is automatically registered or protected by the existing logo registration. Track registrations and applications separately and obtain appropriate legal review for any new filings.

## 6. Emergency backup repository plan

Maintain a separate, access-controlled GitHub repository for approved brand assets, source-code backups, release manifests, and recovery instructions. Suggested name: `apc-brand-code-emergency-backup`.

This repository is a planned separate backup location; it is not the same as this APC Master Control Center repository. Do not overwrite or repurpose active application repositories to create backups.

### Suggested backup structure

```text
apc-brand-code-emergency-backup/
  README.md
  brand/
    APC-Official-Logo.jpg
    APPC-Logo-Concept/
    brand-identity-register.md
  projects/
    apc-daily-pay-card/
      source/
      docs/
    armstrong-pack-clothing/
      integration-notes/
  recovery/
    restore-checklist.md
    release-manifest.md
```

### Backup security

- Back up approved code and assets only; never commit API keys, passwords, tokens, private keys, customer data, payment data, or `.env` files.
- Enable MFA, branch protection, and secret scanning where available.
- Record backup date, repository, commit SHA, deployment target, and restoration steps.
- Test restoration in a separate branch or directory before deployment.
- Obtain owner approval before restoring to production.
