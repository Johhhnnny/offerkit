# Security checklist before public launch

- Add user authentication before storing private business information.
- Add server-side per-user rate limits and usage accounting.
- Add billing and subscription entitlement checks on the server.
- Keep provider credentials in Cloudflare secrets, never in frontend code.
- Restrict CORS to the deployed frontend origin.
- Add request size limits, abuse monitoring, and clear acceptable-use rules.
- Add privacy policy, terms, support contact, and account deletion flow.
- Test error handling and costs under realistic usage before accepting customers.

The current prototype does not include authentication, billing, or per-user limits. Do not treat it as production-ready until these controls are implemented.