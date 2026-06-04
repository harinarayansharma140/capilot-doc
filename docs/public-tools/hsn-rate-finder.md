---
title: HSN / SAC rate finder
---

# HSN / SAC + GST rate finder

Curated dataset of ~100 commonly-invoiced HSN (goods) and SAC (services) codes with their consolidated GST rate.

![HSN rate finder](/img/screens/05-hsn-finder.png)

## What it does

- **Live search** across code, description, category — debounced 250 ms.
- **Kind filter**: All / Goods (HSN) / Services (SAC).
- **Rate filter**: 0% (Exempt) / 3% / 5% / 12% / 18% / 28%.
- Each result row shows:
  - Code with HSN / SAC tag
  - Description + category + any caveat note (e.g. "+ cess varies 1-22%" on motor cars)
  - Colour-coded rate tag (green Exempt, blue 5%, geekblue 12%, purple 18%, red 28%)
  - Cess column for sin goods

## Try it

[/tools/hsn-rate-finder](http://localhost:5173/tools/hsn-rate-finder) — try "motor cars" → HSN 8703 @ 28%, "consulting" → SAC 998311 / 998313 @ 18%.

## What's in the dataset

CA-relevant **services (SAC)** — accounting / auditing (998222), tax consultancy (998231), management consulting (998311), IT consulting (998313), advertising, real estate, transport, restaurant, hotel (rate-banded), education + healthcare (exempt categories).

**Goods (HSN)** — a representative spread: food + FMCG (rice, sugar, biscuits, beverages), pharma (3003-3006), apparel (rate-banded by sale-value-per-piece), electronics, vehicles + cess, construction (cement at 28%, steel at 18%), books + paper, jewellery (3% gold), plastics, sanitary (exempt), tobacco + sin goods at 28% + cess.

## What's stub / pending

- **Inline autocomplete on invoice-line HSN field** — needs a custom cell-editor type on the LocalGrid. Today the dataset is browseable on the public page and the user manually pastes codes into the invoice line. Polish slice.
- **Quarterly refresh from CBIC** — currently the seed is hand-curated; an automated refresh script that re-reads the CBIC GST schedule would keep rates current as Council meetings happen.
- **HSN search inside invoice form** — quick "Find HSN" button on the invoice that opens a popover and pastes selected code + rate into the active line. Polish.
