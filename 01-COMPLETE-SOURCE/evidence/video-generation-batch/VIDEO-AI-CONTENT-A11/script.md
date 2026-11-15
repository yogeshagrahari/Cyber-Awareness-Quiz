# The AI-generated incident advisory

**Video ID:** `VIDEO-AI-CONTENT-A11`  
**Question ID:** `AI-CONTENT-A11`  
**Level:** Advanced  
**Target duration:** 60 seconds  
**Status:** Script, storyboard, generation prompt and captions drafted; MP4 not generated.

## Learning objective
Review AI-generated security guidance for fabricated claims, bias and unsafe recommendations

## Scenario
An AI assistant produces an incident-response memo citing a non-existent CVE and recommending a command that would disable endpoint protection across all workstations.

## Narration transcript
Scenario: An AI assistant produces an incident-response memo citing a non-existent CVE and recommending a command that would disable endpoint protection across all workstations. Safest response: Option B: Treat it as an unverified draft, validate every source and recommendation against authoritative advisories and approved procedures, and reject unsafe actions. AI output needs provenance, technical validation, and human approval before it informs operational response. Option A is unsafe because Citations and fluent technical prose do not establish factual accuracy or safety. Option C is unsafe because Testing an unsafe command on production may still cause harm; validate in a controlled environment after expert review. Option D is unsafe because Self-confirmation by the same model is not independent evidence and may reproduce the original error. In practice: Check identifiers in authoritative vulnerability databases and vendor advisories, test any safe proposed steps in a controlled environment, and require qualified human sign-off. Key takeaway: Generative AI can produce plausible but false or unsafe security guidance; verify independently before action.

## Correct response
B. Treat it as an unverified draft, validate every source and recommendation against authoritative advisories and approved procedures, and reject unsafe actions.

## Option-specific teaching notes
- **A:** Citations and fluent technical prose do not establish factual accuracy or safety.
- **B (correct):** Correct. AI output needs provenance, technical validation, and human approval before it informs operational response.
- **C:** Testing an unsafe command on production may still cause harm; validate in a controlled environment after expert review.
- **D:** Self-confirmation by the same model is not independent evidence and may reproduce the original error.

## Key takeaway
Generative AI can produce plausible but false or unsafe security guidance; verify independently before action.

## Recommended defensive action
Check identifiers in authoritative vulnerability databases and vendor advisories, test any safe proposed steps in a controlled environment, and require qualified human sign-off.

## On-screen text sequence
- **0-11s — Scenario setup:** Fictional scenario
- **11-22s — Learning objective and risk cue:** AI-enabled threats — key cue
- **22-36s — Recommended response:** Safest response: B
- **36-50s — Why the other options fail:** Why the alternatives are unsafe
- **50-60s — Defensive takeaway:** Generative AI can produce plausible but false or unsafe security guidance; verify independently before action.

## Research references
- [15]
- [17]
- [18]

## Planned output
`public/videos/advanced/ai-content-a11.mp4`

## Production status
This is a production-ready draft, not a generated video. No MP4 is included or claimed. Update the manifest only after the rendered file has been tested and human-reviewed.
