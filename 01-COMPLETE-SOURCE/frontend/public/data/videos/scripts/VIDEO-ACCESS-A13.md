# The over-privileged analyst

**Video ID:** `VIDEO-ACCESS-A13`  
**Question ID:** `ACCESS-A13`  
**Level:** Advanced  
**Target duration:** 54 seconds  
**Status:** Script, storyboard, generation prompt and captions drafted; MP4 not generated.

## Learning objective
Apply least privilege, segregation of duties and timely access review

## Scenario
A data analyst has permanent administrator access to payroll, identity management and production infrastructure, although their role only requires read-only access to one reporting dataset.

## Narration transcript
Scenario: A data analyst has permanent administrator access to payroll, identity management and production infrastructure, although their role only requires read-only access to one reporting dataset. Safest response: Option B: Remove unnecessary privileges, grant a named read-only role for the required dataset and review access periodically. Access should be limited to the minimum necessary resources and authorizations for assigned tasks. Option A is unsafe because Shared privileged accounts reduce accountability and do not implement least privilege. Option C is unsafe because Trust does not replace role-based need, segregation of duties or periodic authorization review. Option D is unsafe because Unused privilege remains available for accidental misuse or account compromise. In practice: Use named accounts and scoped roles, remove excess privileges, segregate incompatible duties and schedule access recertification. Key takeaway: Grant each identity only the access needed for its assigned function, and review it as roles change.

## Correct response
B. Remove unnecessary privileges, grant a named read-only role for the required dataset and review access periodically.

## Option-specific teaching notes
- **A:** Shared privileged accounts reduce accountability and do not implement least privilege.
- **B (correct):** Correct. Access should be limited to the minimum necessary resources and authorizations for assigned tasks.
- **C:** Trust does not replace role-based need, segregation of duties or periodic authorization review.
- **D:** Unused privilege remains available for accidental misuse or account compromise.

## Key takeaway
Grant each identity only the access needed for its assigned function, and review it as roles change.

## Recommended defensive action
Use named accounts and scoped roles, remove excess privileges, segregate incompatible duties and schedule access recertification.

## On-screen text sequence
- **0-10s — Scenario setup:** Fictional scenario
- **10-19s — Learning objective and risk cue:** Access governance — key cue
- **19-32s — Recommended response:** Safest response: B
- **32-45s — Why the other options fail:** Why the alternatives are unsafe
- **45-54s — Defensive takeaway:** Grant each identity only the access needed for its assigned function, and review it as roles change.

## Research references
- [17]
- [19]
- [31]
- [33]
- [36]

## Planned output
`public/videos/advanced/access-a13.mp4`

## Production status
This is a production-ready draft, not a generated video. No MP4 is included or claimed. Update the manifest only after the rendered file has been tested and human-reviewed.
