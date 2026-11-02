# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two rater groups, equally important. Trained research raters working through hundreds of items in long desk sittings, mostly from the keyboard. Invited contributors doing a few dozen items in short bursts, often on a phone. Neither is second-class.

Deployment owners (researchers and product teams) host an instance. Owners label like any rater, and also get a results page with agreement statistics and CSV export.

## Product Purpose

Jury Duty is a data labeling engine for coordinated multi-rater annotation. Each deployment is built around one dataset. Raters sign in, read one item at a time, and record a binary judgement against written guidelines. Success is a complete, consistent label set ready for IRR and downstream analysis, reached without rater fatigue.

## Positioning

Self-hosted and single-dataset, not an upload-anything platform. Items are assigned without collisions, and every rater judges independently, like a juror.

## Operating Context

Each item is reviewed alone and judged against the guidelines, so guidelines must stay reachable mid-item. The current deployment asks whether a Reddit post or comment is an explicit, recent, first-person confession of relapsing into smoking. Items are personal, sometimes distressing, and vary from one line to many paragraphs of Reddit-flavoured markdown.

## Capabilities and Constraints

- SvelteKit 3, Svelte 5, Supabase, Vercel. Google OAuth is the only sign-in.
- The API returns the next item plus `labeled_count` and `remaining_count`. Labels are `TRUE` or `FALSE`. Raters can undo a verdict for 10 minutes. There is no skip or history.
- Guidelines live in `frontend/src/lib/jury.config.ts` and change per deployment. Interface copy must not assume the smoking dataset.
- Existing keyboard shortcuts: `1`, `t`, or left arrow for TRUE; `2`, `f`, or right arrow for FALSE.

## Brand Commitments

The name "jury duty", the idea of casting a verdict, and the Rose Bench design stay: soft rose, a ballot box logo, Literata for posts, and Figtree for the interface. TRUE stays green and FALSE stays red.

## Evidence on Hand

Real product facts only. There are no customers, testimonials, benchmarks, or usage figures, and none may be invented. Sample items shown in designs must be labelled synthetic.

## Product Principles

1. The item is the star; everything else waits its turn.
2. The rater's rhythm is sacred; the interface never makes them wait for it.
3. Judgement stays independent; raters never see each other's verdicts.
4. Keyboard and thumb are equal citizens.
5. Treat what people wrote with care; these are real people's words.

## Accessibility & Inclusion

Long reading sessions demand comfortable text and contrast. TRUE and FALSE are green and red, but must never be distinguished by colour alone, and reduced motion must be respected.
