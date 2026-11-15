# The compromised privileged account

**Video ID:** `VIDEO-CRED-COMP-A04`  
**Question ID:** `CRED-COMP-A04`  
**Level:** Advanced  
**Target duration:** 58 seconds  
**Status:** Script, storyboard, generation prompt and captions drafted; MP4 not generated.

## Learning objective
Prioritize containment, credential revocation and trusted recovery after suspected compromise

## Scenario
A privileged administrator reports a suspicious login. Audit records show a new session and unfamiliar mailbox forwarding rule. The user’s password may be compromised.

## Narration transcript
Scenario: A privileged administrator reports a suspicious login. Audit records show a new session and unfamiliar mailbox forwarding rule. The user’s password may be compromised. Safest response: Option D: Coordinate incident response: contain access, revoke affected sessions/tokens, secure credentials and recovery factors, preserve evidence, and investigate persistence. Account compromise requires coordinated containment and recovery, not only a password change. Option A is unsafe because Deleting evidence can obstruct investigation and may remove only visible indicators. Option B is unsafe because Password change alone may leave active sessions, tokens, forwarding rules or attacker persistence in place. Option C is unsafe because A broad disruptive response without scope assessment may cause unnecessary outage and is not proportionate. In practice: Activate the incident-response process, coordinate identity and system owners, contain the affected account, preserve evidence and verify recovery before restoring access. Key takeaway: After suspected credential compromise, address sessions, tokens, recovery paths and persistence as well as the password.

## Correct response
D. Coordinate incident response: contain access, revoke affected sessions/tokens, secure credentials and recovery factors, preserve evidence, and investigate persistence.

## Option-specific teaching notes
- **A:** Deleting evidence can obstruct investigation and may remove only visible indicators.
- **B:** Password change alone may leave active sessions, tokens, forwarding rules or attacker persistence in place.
- **C:** A broad disruptive response without scope assessment may cause unnecessary outage and is not proportionate.
- **D (correct):** Correct. Account compromise requires coordinated containment and recovery, not only a password change.

## Key takeaway
After suspected credential compromise, address sessions, tokens, recovery paths and persistence as well as the password.

## Recommended defensive action
Activate the incident-response process, coordinate identity and system owners, contain the affected account, preserve evidence and verify recovery before restoring access.

## On-screen text sequence
- **0-10s — Scenario setup:** Fictional scenario
- **10-21s — Learning objective and risk cue:** Credential compromise — key cue
- **21-35s — Recommended response:** Safest response: D
- **35-49s — Why the other options fail:** Why the alternatives are unsafe
- **49-58s — Defensive takeaway:** After suspected credential compromise, address sessions, tokens, recovery paths and persistence as well as the password.

## Research references
- [16]
- [17]
- [28]
- [36]

## Planned output
`public/videos/advanced/cred-comp-a04.mp4`

## Production status
This is a production-ready draft, not a generated video. No MP4 is included or claimed. Update the manifest only after the rendered file has been tested and human-reviewed.
