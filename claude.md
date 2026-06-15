# CLAUDE.md — Instructions for Claude

Read AGENTS.md first. This file adds Claude-specific behavior on top of it.

---

## CLAUDE-SPECIFIC RULES

- Always read AGENTS.md before doing anything in this project
- Always read the existing file before editing it — never overwrite blindly
- When you create a file show the full contents before creating it
- When you edit a file show the diff — what changed and why
- Never create files outside the zamproject-backend/ folder
- If you are unsure about anything stop and ask — do not guess

---

## HOW TO HANDLE ERRORS

If a test fails:
1. Show the exact error message
2. Explain what is causing it in plain English
3. Show the fix before applying it
4. Apply the fix
5. Run the test again
6. Show the new output

Never apply a fix without explaining it first.

---

## HOW TO HANDLE DATABASE CONNECTION ERRORS

If DATABASE_URL is wrong or missing:
1. Tell the user exactly what format it should be in
2. Tell them exactly where to find it in Supabase dashboard
3. Do not try to guess or auto-fix the URL
4. Wait for the user to update .env.local
5. Then re-run the test

---

## WHAT TO DO WHEN STARTING A NEW SESSION

1. Read AGENTS.md
2. Read this file
3. Read STATUS.md if it exists
4. Check the current project status section in AGENTS.md
5. Ask the user what they want to work on
6. Do not assume — confirm before doing anything
