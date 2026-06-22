# Test Plan — PR #3: Compile Tailwind + fix layout/spacing
 
App under test: local frontend http://localhost:5173 (Vite dev, PR #3 branch) + backend :3000.
Seeded login: `test@example.com` / `password123`, with session "Trip planning" containing a user msg, a long assistant msg, and a long-unbroken-token user msg.
 
Why these tests are adversarial: if Tailwind were still not compiling (the bug), every utility class is a no-op, so the page would render as unstyled, full-width, top-left-stacked black text with no cards, no sidebar column, no bubbles. Each assertion below checks a concrete styled outcome that is impossible without Tailwind actually generating CSS.
 
## Test 1 — It should render the Login auth card styled and centered
Steps: load http://localhost:5173 (logged out).
Pass criteria:
- A dark card is **horizontally and vertically centered** on the page (not full-width text top-left).
- Card has visible internal padding; "Email" and "Password" field groups are stacked with a small label-to-input gap and spacing between groups.
- Inputs have visible padding (not 0-height native boxes); blue "Login" button is full-width and separated from the "Don't have an account? Register" footer.
Fail if: content is left-aligned unstyled text / inputs are bare / no card background.
 
## Test 2 — It should render the Register card with 3 spaced field groups
Steps: click "Register" link.
Pass criteria:
- Card shows Name, Email, Password groups each as label-above-input with `gap-1.5` and `mb-4` spacing; full-width "Register" button separated from "Already have an account? Login" footer.
Fail if: fields overlap or have no spacing.
 
## Test 3 — It should show the chat workspace shell after login
Steps: switch back to Login, log in with seeded creds.
Pass criteria:
- **Left sidebar is a fixed-width (~256px) full-height column** with "New Chat" at top, a "SESSIONS" list containing "Trip planning", and a "Logout" button **pinned to the bottom** of the sidebar.
- Main area fills remaining width to the right of the sidebar; a bottom input bar spans the main area with a top border, a text input, an "N/2000" counter, and a "Send" button **all on one row**.
Fail if: sidebar is not a distinct fixed column, logout is not at the bottom, or the input bar wraps/overlaps the feed.
 
## Test 4 — It should render chat bubbles capped and wrapped (core layout assertion)
Steps: click the "Trip planning" session.
Pass criteria:
- User messages are **right-aligned blue bubbles**; assistant message is a **left-aligned slate bubble**.
- Every bubble is capped at ~75% of the feed width (`max-w-[75%]`) — the long assistant paragraph wraps onto multiple lines and does NOT bleed past the right edge.
- The long unbroken-token user message wraps/breaks within its bubble (`break-words`) instead of forcing horizontal scroll.
Fail if: messages are full-width plain lines, left-aligned regardless of role, or overflow horizontally.
 
## Test 5 (Regression) — It should create a new session and show empty state
Steps: click "New Chat".
Pass criteria:
- A new session is added to the sidebar list; main feed shows centered "Start a conversation by sending a message"; input bar remains correctly positioned at the bottom.
Fail if: page blanks or layout breaks.
 
Note: Sending a brand-new message returns a real AI reply only with a valid GOOGLE_API_KEY; this run uses a throwaway key, so message-send round-trip / AI reply is OUT OF SCOPE here (covered separately by PR #1/#2 testing). Bubble rendering is proven via the seeded session instead.