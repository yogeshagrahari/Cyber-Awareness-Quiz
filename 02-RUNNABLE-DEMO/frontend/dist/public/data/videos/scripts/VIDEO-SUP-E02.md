# The Critical Supplier Component

**Video ID:** `VIDEO-SUP-E02`  
**Question ID:** `SUP-E02`  
**Level:** Expert Challenge  
**Target duration:** 60 seconds  
**Status:** Narration, storyboard, generation prompt and caption draft; MP4 not generated.

## Learning objective
Prioritize a supplier vulnerability using exposure, exploitability, criticality, provenance and compensating controls.

## Scenario
A supplier notifies the organization that a widely used authentication component has a critical vulnerability. The component appears in the software bill of materials for six services. Two services are internet-facing; one supports payroll. There is no confirmed exploitation in your environment, and the vendor has published a mitigation plus a target patch date.

## Narration transcript
Scenario: A vulnerable authentication component appears in six services; two are internet-facing and one supports payroll. A supplier has issued mitigation guidance and a patch date. Safest response: correlate the SBOM with live assets, prioritize by exposure and criticality, mitigate, patch through change control and track residual risk. Option A is unsafe because Disabling every service without triage can cause avoidable business harm. Option B is unsafe because Waiting for confirmed compromise delays preventive risk treatment. Option D is unsafe because Uncoordinated service-owner decisions can create remediation gaps. In practice: identify affected versions, apply vendor guidance, test updates and assign remediation owners. Key takeaway: turn component inventory into risk-prioritized action.

## Correct response
C. Use the SBOM and asset inventory to identify deployed versions and reachable exposure, prioritize critical services, apply the vendor mitigation or approved compensating controls, test and deploy the patch through change control, and track residual risk.

## Option-specific teaching notes
- **A:** Disabling every service without triage can cause avoidable business harm. Review the evidence, use approved organizational controls and avoid treating an alert or familiar message as proof.
- **B:** Waiting for confirmed compromise delays preventive risk treatment. Review the evidence, use approved organizational controls and avoid treating an alert or familiar message as proof.
- **C (correct):** Correct. Component inventory, exposure and criticality support defensible prioritization; mitigation, controlled patching and residual-risk tracking maintain accountability.
- **D:** Uncoordinated service-owner decisions can create remediation gaps. Review the evidence, use approved organizational controls and avoid treating an alert or familiar message as proof.

## Key takeaway
A component inventory becomes actionable when it is connected to deployed assets, exposure, criticality and accountable remediation.

## Recommended defensive action
Correlate SBOM entries with asset and service inventories; validate affected versions; rank by exposure and business criticality; apply vendor guidance; test patches; coordinate change windows; document residual risk and supplier follow-up.

## On-screen text sequence
- **0-12s — Scenario:** Fictional organizational scenario
- **12-24s — Decision frame:** Supply-chain risk governance
- **24-38s — Recommended response:** Safest response: C
- **38-52s — Trade-offs:** Why the alternatives fail
- **52-60s — Takeaway:** A component inventory becomes actionable when it is connected to deployed assets, exposure, criticality and accountable remediation.

## Research references
- [17]
- [18]
- [37]

## Planned output
`public/videos/expert/sup-e02.mp4`

## Production status
Production draft only; no AI-generated or rendered MP4 is included or claimed. Human expert review and media rendering are required before release.
