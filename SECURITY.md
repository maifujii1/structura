# Security Policy

## Security model

Structura is a static browser-only application. It has no backend and does not require authentication, API keys, cookies, analytics, or third-party JavaScript.

Pasted source text is processed locally in JavaScript. The app does not intentionally transmit that text over the network.

### Defensive measures

- User-derived strings are passed through HTML escaping before rendered HTML is assigned with `innerHTML`.
- The page declares a Content Security Policy that blocks outbound connections (`connect-src 'none'`), embedded objects, form submission, and `<base>` URL changes.
- Input is limited to 100,000 characters to reduce accidental resource exhaustion in the browser.
- Generated downloads use a local `text/plain` Blob URL.
- `localStorage` is used only for the light/dark theme preference.
- The project has no npm packages or third-party runtime dependencies, reducing supply-chain exposure.

## Reporting a vulnerability

If you publish this repository on GitHub and discover a security issue, prefer opening a **private GitHub Security Advisory** rather than posting exploit details in a public issue.

## Scope note

Because Structura runs in the browser, browser extensions, modified local copies, injected scripts from outside the repository, or a compromised hosting account are outside the application's own security boundary.
