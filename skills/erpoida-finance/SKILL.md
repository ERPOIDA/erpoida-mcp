---
name: erpoida-finance
description: Handle ERPoida accounting, invoicing, payments, purchasing and payroll through the erpoida MCP server, following the draft-post-reverse rules of double-entry bookkeeping. Use when the user asks about invoices, bills, payments, journal entries, the trial balance, purchase orders, payroll runs or anything that touches the ledger in ERPoida.
---

# ERPoida: finance

Financial tools change the books. Posted entries are **locked**. Mistakes are corrected by a
reversal or through the source document, never by editing. Work slowly and confirm.

These tools record bookkeeping entries. **None of them move money** in a bank. Say so if the
user seems to expect a real transfer.

## The lifecycle

```
draft  ──(post)──▶  posted (locked, in the ledger)  ──(reverse / correct document)──▶  offset
```

- `create_invoice` and `create_journal_entry` create **drafts**. Drafts do not affect the ledger.
- `post_invoice` and `post_journal_entry` lock the entry and write it to the ledger.
- `reverse_journal_entry` creates an offsetting entry for a posted **manual** journal entry.
  Entries posted by a document (invoice, bill, payment, credit note) are refused; correct the
  document instead.

**Always create the draft, show it to the user, and post only after explicit confirmation.**
Never post in the same step as creating unless the user clearly asked for both.

## Before creating anything

1. `list_accounts` for account ids (code, name, type). Never guess an `accountId`.
2. For customers, suppliers or employees, find the record id with `list_records`.
3. For payments, `list_payment_accounts` (invoices) or `list_bill_payment_accounts` (bills).
   The first account is the suggested default; tell the user which one you will use.

## Invoices

- `create_invoice { lines: [{ description, qty, unitPrice, accountId, taxId? }] }` creates a draft.
- `post_invoice` locks amounts and posts AR debit / revenue and tax credit.
- `record_payment { invoiceId, amount, moneyAccountId, receivedAt, reference?, method? }`
  applies to a **posted** invoice and updates its balance and status.
- `list_invoices { status, q }` with status `draft | posted | paid | overdue | cancelled`.
- Payment plans: `list_payment_terms`, `generate_payment_schedule`, `list_installments`,
  `create_invoice_from_installment` (bills one installment as a draft invoice).

## Journal entries

- Lines must balance: `sum(debit) == sum(credit)`, and each line has a debit **or** a credit,
  never both. Check the arithmetic yourself before calling.
- `get_trial_balance` always sums to zero. Use it to sanity-check after posting.

## Purchasing

`create_purchase_order` → `confirm_purchase_order` → `receive_purchase_order` (stock in) →
`bill_purchase_order` (supplier bill) → `record_bill_payment`. Confirm at each step that changes
state; receiving affects inventory and billing affects payables.

## Payroll

`create_payroll_run` → `compute_payroll_run` → review with `get_payroll_run` → adjustments
(`add_payroll_adjustment` / `remove_payroll_adjustment`) → `approve_payroll_run` →
`post_payroll_run` → `record_payroll_payment`.

Payroll involves personal salary data. Show only what the user asked for, and confirm before
approving or posting a run.

## Presenting numbers

- Amounts come back as exact values; do not round unless asked, and keep the currency.
- When summarising, state the period and the filters you used.
- If the trial balance or a total looks wrong, report it; do not "fix" it with an entry
  unless the user asks and confirms the exact lines.

## Confirmation template

> I'll post invoice INV-0042 for Acme (3 lines, net 1,200.00, tax 228.00, total 1,428.00 EUR)
> to account 1200 Receivables. Posting locks it. Go ahead?
