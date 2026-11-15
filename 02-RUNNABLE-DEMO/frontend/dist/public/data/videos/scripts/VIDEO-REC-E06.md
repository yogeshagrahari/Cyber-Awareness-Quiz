# Recovering After Ransomware

**Video ID:** `VIDEO-REC-E06`  
**Question ID:** `REC-E06`  
**Level:** Expert Challenge  
**Target duration:** 60 seconds  
**Status:** Narration, storyboard, generation prompt and caption draft; MP4 not generated.

## Learning objective
Sequence recovery using containment, clean restoration sources, identity assurance, validation and monitored return to service.

## Scenario
A ransomware incident has been contained. Several production servers are encrypted, the backup platform was reachable from part of the affected environment, and an offline backup set is available. Executives want the customer portal restored first. The incident team has not yet validated the backup set or rotated potentially exposed credentials.

## Narration transcript
Scenario: Ransomware encrypted production servers. An offline backup exists, but it has not been validated; credentials may be exposed. Safest response: validate clean backups, establish a trusted recovery environment, remediate identities, restore prioritized services, test and monitor. Option B is unsafe because The newest backup may also be encrypted, compromised or contaminated. Option C is unsafe because Payment does not guarantee decryption, recovery or prevention of data disclosure. Option D is unsafe because Stopped encryption does not prove attacker access or persistence is gone. In practice: follow the recovery plan and confirm integrity and security before return to service. Key takeaway: restore only to a known-good, monitored state.

## Correct response
A. Validate and protect clean backup sources, establish a trusted recovery environment, address compromised identities and access paths, restore prioritized services in a controlled order, test integrity and security, then monitor closely before declaring recovery.

## Option-specific teaching notes
- **A (correct):** Correct. Recovery depends on trustworthy restoration sources, a clean environment, identity/access remediation, prioritized validation and monitoring.
- **B:** The newest backup may also be encrypted, compromised or contaminated. Review the evidence, use approved organizational controls and avoid treating an alert or familiar message as proof.
- **C:** Payment does not guarantee decryption, recovery or prevention of data disclosure. Review the evidence, use approved organizational controls and avoid treating an alert or familiar message as proof.
- **D:** Stopped encryption does not prove attacker access or persistence is gone. Review the evidence, use approved organizational controls and avoid treating an alert or familiar message as proof.

## Key takeaway
Recovery is not simply restoring files; it is returning services to a known-good, validated and monitored state.

## Recommended defensive action
Follow the organization’s recovery plan, validate offline or otherwise trusted backups, rebuild or restore in a clean environment, reset affected credentials and tokens as appropriate, prioritize services by business impact, test security and integrity, and monitor after restoration.

## On-screen text sequence
- **0-12s — Scenario:** Fictional organizational scenario
- **12-24s — Decision frame:** Ransomware recovery and resilience
- **24-38s — Recommended response:** Safest response: A
- **38-52s — Trade-offs:** Why the alternatives fail
- **52-60s — Takeaway:** Recovery is not simply restoring files; it is returning services to a known-good, validated and monitored state.

## Research references
- [28]
- [35]

## Planned output
`public/videos/expert/rec-e06.mp4`

## Production status
Production draft only; no AI-generated or rendered MP4 is included or claimed. Human expert review and media rendering are required before release.
