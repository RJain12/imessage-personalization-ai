# iMessage Intelligence & Cognitive Profiling Engine

A high-fidelity reverse-engineering tool that transforms the opaque iMessage `chat.db` into a structured, analytical character study. This engine bypasses standard data exporters to perform direct SQL analysis on your communication history, mapping the hidden relationships and temporal patterns of your digital life.

## 🧠 Core Innovation: The Reverse-Engineering Layer

The primary achievement of this project is the **Reverse Engineering of the Apple iMessage Database Schema**. Instead of relying on APIs or basic exports, this tool performs:
- **Direct SQL Injection**: Utilizing `sql.js` (WASM-based) to parse the encrypted and relational `chat.db` locally in the browser.
- **Complex Join Orchestration**: We've decoded the relationship between `handle`, `chat`, `message`, and `chat_handle_join` tables to reconstruct full conversation flows and group chat identities.
- **Temporal Pattern Recovery**: Algorithms designed to extract peaks in social activity and communication cadence across years of data.
- **Relationship Mapping**: Reverse-engineering the "importance" of contacts by analyzing reciprocal message counts, response latency, and shared group memberships.

## 🤖 The Intelligence Layer (Gemini 2.5 Flash Lite)

Once the raw SQL data is distilled into structured context, we utilize **Gemini 2.5 Flash Lite** (the state-of-the-art for high-context character study) to perform:
- **Cognitive Profile Generation**: A 1,200+ word deep-dive into your personality and values, expressed through metaphors and analogies.
- **Professional Growth Audit**: Tailored advice on how your natural iMessage voice translates to high-level professional leadership.
- **Communication Blindspots**: AI-detected patterns where your natural shorthand leads to external ambiguity.

## 🛡️ Privacy as a Technical Requirement
- **Local-First Execution**: Your `chat.db` never leaves your machine. All SQL parsing occurs in an isolated WASM container in your browser.
- **Server-Side Proxying**: Gemini requests are proxied via a local Next.js route to ensure your **API Key** stays environment-locked and never hits the client-side network tab.
- **Zero-Logging Policy**: Configurable "Safety Mode" ensures Gemini data logging is disabled for every analysis session.

## 🛠️ Technical Architecture
- **Engine**: Next.js 16 + Webpack (Native support for binary `sql.js` processing).
- **Relational DB**: In-memory SQLite parsing of Apple's `chat.db`.
- **UI Architecture**: Monospace-brutalist design for high-transparency intelligence reporting.
- **Models**: Optimized for Gemini 2.5 Flash Lite 09-2025 preview.

## 🚀 Deployment & Usage
1. **Prepare**: Extract your database using the provided helper command in the app.
2. **Inject**: Upload the `.db` file for local WASM parsing.
3. **Map**: Select your identity from the reverse-engineered contact list.
4. **Distill**: Generate your technical AI manual and deep-intelligence reports.

---
Built by [Rishab Jain](https://rishabjaink.com) • [GitHub](https://github.com/RJain12/imessage-personalization-ai)
