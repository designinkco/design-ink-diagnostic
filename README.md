# Design Ink Co. — The 10-Point Diagnostic

A four-minute self-assessment that scores interior design studio websites
against the ten components proven to win clients. Built on a balanced-scorecard
study of 18 leading studios across the UK, Australia, and the United States.

The lead magnet for **designinkco.com**. Visitors arriving from the Squarespace
site take the diagnostic, submit their email, and become Flodesk subscribers
inside the "10-Point Diagnostic Leads" segment.

## Local preview

```
python3 -m http.server 8000
```

Then open http://localhost:8000/

## Deploy

Connected to Vercel. Every `git push` to `main` deploys automatically.

## Lead capture

The email gate POSTs to a webhook configured in `diagnostic.js` (constant
`WEBHOOK_URL` at the top of the file). The webhook is an n8n flow that
adds the subscriber to Flodesk and notifies the team.

## The Studio Business Diagnostic

A second diagnostic at `/business` (`business.html`, `business.js`,
`business.css`). It scores the business side of a studio across Skills,
Strategy and Systems and routes to one of four results: Design for Success,
Studio Strategy Session, AI Studio Setup, or Not yet.

- 13 questions: 9 scored (10 / 5 / 0), 4 unscored that only decide the result.
- Questions, routing rules and all result copy live at the top of `business.js`.
- The result is shown straight away. Email is optional and comes after it.
- Email is off until `WEBHOOK_URL` in `business.js` is set to an n8n webhook
  that adds the person to Flodesk and tags them with `flodesk_tag`.
- It shares `styles.css` and `motion.js` with The 10-Point Diagnostic and
  changes neither.
