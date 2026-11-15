# Choosing authentication for high-risk administrators

**Video ID:** `VIDEO-MFA-POLICY-A14`  
**Question ID:** `MFA-POLICY-A14`  
**Level:** Advanced  
**Target duration:** 58 seconds  
**Status:** Script, storyboard, generation prompt and captions drafted; MP4 not generated.

## Learning objective
Select phishing-resistant authentication for high-risk contexts and address fallback risks

## Scenario
An organization is redesigning authentication for privileged administrators. Options include password plus SMS OTP, push approval, or phishing-resistant public-key authentication, but legacy recovery remains weak.

## Narration transcript
Scenario: An organization is redesigning authentication for privileged administrators. Options include password plus SMS OTP, push approval, or phishing-resistant public-key authentication, but legacy recovery remains weak. Safest response: Option C: Adopt phishing-resistant authentication such as FIDO/WebAuthn for privileged access and harden enrollment, recovery and fallback paths. Strong primary authentication must be supported by secure lifecycle and recovery processes. Option A is unsafe because Unbounded prompts can enable fatigue attacks and do not provide strong phishing resistance. Option B is unsafe because SMS OTP adds a factor but is not phishing-resistant and weak recovery can undermine the primary control. Option D is unsafe because A longer password alone does not provide the assurance or phishing resistance required for privileged access. In practice: Use standards-aligned phishing-resistant authenticators where feasible, tightly control fallback, bind credentials to legitimate verifiers and monitor recovery events. Key takeaway: Choose phishing-resistant authenticators for high-risk access and secure the entire account lifecycle, including recovery.

## Correct response
C. Adopt phishing-resistant authentication such as FIDO/WebAuthn for privileged access and harden enrollment, recovery and fallback paths.

## Option-specific teaching notes
- **A:** Unbounded prompts can enable fatigue attacks and do not provide strong phishing resistance.
- **B:** SMS OTP adds a factor but is not phishing-resistant and weak recovery can undermine the primary control.
- **C (correct):** Correct. Strong primary authentication must be supported by secure lifecycle and recovery processes.
- **D:** A longer password alone does not provide the assurance or phishing resistance required for privileged access.

## Key takeaway
Choose phishing-resistant authenticators for high-risk access and secure the entire account lifecycle, including recovery.

## Recommended defensive action
Use standards-aligned phishing-resistant authenticators where feasible, tightly control fallback, bind credentials to legitimate verifiers and monitor recovery events.

## On-screen text sequence
- **0-10s — Scenario setup:** Fictional scenario
- **10-21s — Learning objective and risk cue:** Authentication architecture — key cue
- **21-35s — Recommended response:** Safest response: C
- **35-49s — Why the other options fail:** Why the alternatives are unsafe
- **49-58s — Defensive takeaway:** Choose phishing-resistant authenticators for high-risk access and secure the entire account lifecycle, including recovery.

## Research references
- [16]
- [17]

## Planned output
`public/videos/advanced/mfa-policy-a14.mp4`

## Production status
This is a production-ready draft, not a generated video. No MP4 is included or claimed. Update the manifest only after the rendered file has been tested and human-reviewed.
