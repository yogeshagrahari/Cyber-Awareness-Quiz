#!/usr/bin/env python3
"""Expand the topic library so every topic has at least three unique questions.

New items are first-draft educational content, mapped to existing verified
research IDs. New video entries are explicitly deferred at the project owner's
request; this script does not generate video scripts, captions, or MP4 files.
"""
from __future__ import annotations
import csv, json, re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CORE_PATH = ROOT / 'content/questions/question-bank.json'
EXPERT_PATH = ROOT / 'content/questions/expert-challenge.json'
CORE_EXP_PATH = ROOT / 'content/explanations/explanations.json'
EXPERT_EXP_PATH = ROOT / 'content/explanations/expert-explanations.json'
CORE_VIDEO_PATH = ROOT / 'content/video-manifest.json'
EXPERT_VIDEO_PATH = ROOT / 'content/expert-video-manifest.json'

# Each record adds a distinct decision question and an evidence/control question.
# The library expansion draws only on reference IDs already present in the
# attached manuscript/reference registry; it does not introduce new citations.
SPECS = {
'AI-enabled impersonation': dict(code='AIM', refs=['[15]','[29]'], objective='Verify AI-assisted identity claims before authorizing consequential actions.', risk='synthetic voice, video or text can imitate a trusted colleague', scenario='A finance team receives a video call that appears to show a senior executive requesting an urgent change to supplier bank details.', action='Pause the change, end the call, verify the request using a phone number already held in the official directory, and require the normal second-person approval.', evidence='A callback to a previously stored directory number plus the recorded approval of a second authorized finance approver.', badEvidence=['The apparent executive looks and sounds like the person in the video.','The caller ID displays the executive office number shown on the incoming call.','The requester forwards an email thread that repeats the same bank-change instruction.'], takeaway='A convincing face, voice or message is not independent proof of identity or authority.', defensive='Use a known contact path and the documented dual-approval workflow for payment changes.'),
'AI-enabled threats': dict(code='AIT', refs=['[15]','[14]','[29]'], objective='Treat AI-generated content as untrusted until its provenance and requested action are independently checked.', risk='AI-generated messages or media can make deceptive instructions look authentic', scenario='A staff member receives a polished AI-written alert that claims to be from the security team and asks them to install a new “protection” tool from an attachment.', action='Do not run the attachment; verify the tool and notice through the organization’s published software catalogue or security channel, then report the message.', evidence='A signed or otherwise authenticated software release in the organization’s approved catalogue, confirmed through the official security team channel.', badEvidence=['The message uses the organization’s logo and familiar writing style.','The attachment description says that the software is security-approved.','Several colleagues have forwarded the same message without checking it.'], takeaway='Fluent, personalized or synthetic content is not proof of source or safety.', defensive='Verify provenance and software approval independently; report suspected AI-enabled impersonation.'),
'Access governance': dict(code='ACG', refs=['[17]','[31]','[33]'], objective='Apply least privilege and periodic access review to organizational resources.', risk='excessive or stale permissions can expose systems and data', scenario='A project ends, but a temporary contractor account still has administrator access to a shared workspace.', action='Have the system owner review the account’s current business need, remove unnecessary privileges, set an expiry and record the change.', evidence='A current access review showing the named owner, approved role, business justification, expiry and revocation status.', badEvidence=['The account has not generated a recent security alert.','The contractor says the access may be useful for a future project.','The account was created by an administrator, so it is assumed to remain approved.'], takeaway='Access should be tied to a current need, an accountable owner and a review date.', defensive='Use least-privilege roles, time-bound access and documented recertification.'),
'Account recovery': dict(code='REC', refs=['[16]','[24]'], objective='Use an authenticated account-recovery process and review sessions after recovery.', risk='an attacker may exploit weak recovery steps to take over an account', scenario='A user receives an unexpected notice that recovery details for their learning account have changed, although they did not request recovery.', action='Open the service through its known official address, use its published account-recovery process, contact support through a known channel and review active sessions.', evidence='The account’s official recovery-event history, verified through the service’s authenticated support or security workflow.', badEvidence=['The sender’s display name matches the service name.','A phone number included in the unexpected notice says the change is legitimate.','The account still opens in one browser tab, so no action is needed.'], takeaway='Recovery events deserve independent verification and a session review.', defensive='Use only the official recovery flow, revoke unfamiliar sessions and report unauthorized recovery changes.'),
'Account takeover': dict(code='ATO', refs=['[16]','[25]','[28]'], objective='Recognize account-takeover indicators and contain suspected unauthorized sessions.', risk='an attacker may maintain access through stolen credentials or existing sessions', scenario='A user sees a successful sign-in notification from an unfamiliar device and a location they do not recognize.', action='Use the official account portal to secure the account, revoke unfamiliar sessions, change the credential through the trusted flow, strengthen MFA and report the event.', evidence='The identity provider’s sign-in and session records, including device, time, risk signals and session-revocation status.', badEvidence=['The display name in the notification looks familiar.','A social-media post says the location is probably a mobile-network routing error.','The user deletes the notification without checking account activity.'], takeaway='Unexpected sessions require account-level investigation, not just dismissal of one alert.', defensive='Review sign-in history, revoke suspicious sessions, secure credentials and report possible compromise.'),
'Authentication': dict(code='AUTH', refs=['[16]','[25]'], objective='Choose authentication methods that resist credential phishing and unsolicited approval prompts.', risk='a password or one-time code can be captured and replayed by an attacker', scenario='A service offers a passkey option, but a user is accustomed to approving ordinary push notifications and entering one-time codes into web pages.', action='Use the service’s supported phishing-resistant passkey or security key where available, and deny any unexpected authentication prompt.', evidence='The service’s documented authenticator configuration and the authentication event’s origin-bound or phishing-resistant method record.', badEvidence=['A push notification arrived on the user’s phone.','The login page displays the service logo.','The user received a one-time code, even though they did not initiate a sign-in.'], takeaway='Use phishing-resistant authentication where supported and never approve an unexpected prompt.', defensive='Prefer passkeys or security keys, deny unexpected prompts and report repeated authentication requests.'),
'Authentication architecture': dict(code='AA', refs=['[16]','[31]','[33]'], objective='Understand how origin binding and session context strengthen authentication.', risk='an authentication flow can be relayed or approved without the user validating the intended service', scenario='An organization is reviewing a sign-in design that relies only on a generic push approval and does not show which service initiated the request.', action='Adopt a phishing-resistant, origin-bound authenticator flow and review session binding and recovery controls as part of the design.', evidence='The identity architecture specification and test results showing authenticator origin binding, verifier association and session protections.', badEvidence=['A screenshot of the login page with the company logo.','A count showing that most employees own smartphones.','A policy statement that merely says MFA is enabled.'], takeaway='The presence of MFA alone does not describe the strength of the authenticator or the session binding.', defensive='Evaluate authenticator phishing resistance, origin binding, recovery and session controls together.'),
'Browser security': dict(code='BRS', refs=['[19]','[25]'], objective='Assess browser extensions by publisher, permissions and organizational approval.', risk='a malicious or over-privileged extension can read or alter browser data', scenario='A browser extension promises to summarize documents and requests permission to read and change data on every website.', action='Do not install it until its publisher, purpose and permissions are reviewed against the organization’s approved-extension policy.', evidence='The managed browser’s extension inventory, publisher identity, permission scope and approval record.', badEvidence=['The extension has many positive-looking ratings.','The extension description says it improves productivity.','A colleague installed it without noticing a problem.'], takeaway='Extension permissions and publisher provenance matter more than popularity or marketing claims.', defensive='Install only approved extensions with permissions limited to a justified business need.'),
'Business email compromise': dict(code='BEC', refs=['[26]','[25]'], objective='Verify unusual payment and account-change requests through an independent established channel.', risk='an attacker may impersonate a supplier or executive to redirect funds', scenario='A supplier email thread requests that the next invoice payment be sent to a new bank account and asks for secrecy because the change is “time-sensitive.”', action='Pause payment, call the supplier using a previously verified number, follow the organization’s bank-detail change procedure and require independent approval.', evidence='A supplier confirmation obtained through a known contact record plus an approved change ticket and dual authorization.', badEvidence=['The email is in an existing supplier thread.','The new bank details are repeated in a signed-looking PDF attached to the email.','The sender says the old contact is unavailable and asks staff not to call.'], takeaway='A familiar email thread can be compromised; payment changes require out-of-band verification.', defensive='Verify payment changes with a known supplier contact and preserve approval records.'),
'Cloud security': dict(code='CLD', refs=['[31]','[33]','[18]'], objective='Reduce cloud exposure through least privilege, secure configuration and auditability.', risk='misconfigured cloud permissions or public storage can expose sensitive data', scenario='A team discovers that a cloud storage container holding project files is configured for public access even though the files are intended for internal use.', action='Restrict public access using the approved configuration, preserve relevant audit logs, identify affected data and notify the cloud/security owner.', evidence='Cloud configuration and access logs showing the resource policy, principal permissions, exposure window and remediation change.', badEvidence=['The container name contains the word “private.”','No one has reported downloading the files.','A teammate says the link is difficult to guess.'], takeaway='Obscure URLs and resource names do not replace explicit access controls.', defensive='Apply least privilege, disable unintended public access and review cloud audit logs.'),
'Credential compromise': dict(code='CCR', refs=['[16]','[25]','[28]'], objective='Respond to suspected credential exposure by securing identity and reviewing related activity.', risk='exposed credentials may be used to access other systems or maintain sessions', scenario='A user accidentally enters their work password into a page that was reached through an unexpected message and then notices that the page address is unfamiliar.', action='Report the event immediately, change the password using the known official portal, revoke sessions, review MFA and check related account activity with IT.', evidence='Identity-provider logs for sign-ins, password reset, MFA events and session revocation after the suspected exposure time.', badEvidence=['The page looked similar to the normal sign-in screen.','The user has not yet received a password-reset warning.','A browser history entry still shows the expected service name.'], takeaway='Treat suspected credential disclosure as a potential compromise even before misuse is visible.', defensive='Secure the account through the official portal, revoke sessions and report the event promptly.'),
'Data protection': dict(code='DAT', refs=['[33]','[36]','[20]'], objective='Handle information according to classification, purpose and approved storage requirements.', risk='sensitive information can be exposed through unnecessary collection or unsafe sharing', scenario='A project team wants to upload a spreadsheet containing personal details to a public file-conversion website to change its format.', action='Use an organization-approved tool and storage location, minimize the data to what is required and follow the applicable classification and sharing rules.', evidence='The data classification, approved-tool list, access policy and data-flow record for the intended processing.', badEvidence=['The website says uploaded files are deleted after conversion.','The spreadsheet is needed for a legitimate project.','The team plans to remove the file from the website after a few minutes.'], takeaway='A legitimate purpose does not justify an unapproved processing or sharing channel.', defensive='Minimize personal data and use approved services with appropriate access and retention controls.'),
'Device security': dict(code='DEV', refs=['[34]','[30]','[18]'], objective='Keep endpoints updated through verified, supported vendor and organizational channels.', risk='unpatched software can leave known vulnerabilities available to attackers', scenario='A laptop displays a pop-up from an unfamiliar website claiming that an urgent security update is required and offers a download button.', action='Close the pop-up and check for updates through the operating system’s built-in updater or the organization’s managed endpoint process.', evidence='The endpoint management console or operating-system update history showing the approved update source, version and installation status.', badEvidence=['The pop-up uses the device manufacturer’s logo.','The download page displays a recent publication date.','A forum post says the update fixed a similar problem.'], takeaway='Install updates through trusted system or managed channels, not unexpected pop-ups.', defensive='Keep supported devices patched through official update mechanisms and report suspicious update prompts.'),
'Evidence and logging': dict(code='LOG', refs=['[28]','[18]','[33]'], objective='Preserve relevant incident evidence with integrity, timestamps and access control.', risk='editing or discarding records can undermine incident reconstruction', scenario='During a security review, an analyst finds suspicious login activity and wants to clean up the log export before sharing it with responders.', action='Preserve the original records, record collection time and source, calculate an integrity hash where available and share them through the approved restricted incident channel.', evidence='The original log source, collection metadata, timestamps, access history and integrity hash for the preserved export.', badEvidence=['A screenshot of selected lines pasted into a chat message.','A rewritten spreadsheet with suspicious rows removed.','An analyst’s memory of what the dashboard showed earlier.'], takeaway='Keep original evidence intact and record how it was collected and handled.', defensive='Preserve originals, maintain chain-of-custody notes and restrict evidence access to authorized responders.'),
'Incident reporting': dict(code='IRP', refs=['[1]','[7]','[25]'], objective='Report suspicious activity through the organization’s approved channel with useful context.', risk='unreported suspicious messages and events can prevent timely detection of wider activity', scenario='An employee receives an unexpected password-reset message and notices that two colleagues received similar messages.', action='Use the organization’s official report-phishing or security-incident channel and include the original message or permitted headers without forwarding it broadly.', evidence='The official reporting ticket or security mailbox record with receipt time and preserved message metadata.', badEvidence=['Reply to the sender asking whether the request is genuine.','Post the message in a large public group for quick opinions.','Delete the message because no link was clicked.'], takeaway='Prompt, structured reporting helps responders correlate related events.', defensive='Report through the approved channel and retain the original message as instructed by the security team.'),
'Incident response': dict(code='IR', refs=['[28]','[35]','[18]'], objective='Contain suspected incidents proportionately while preserving evidence and following response roles.', risk='uncoordinated response can increase impact or destroy useful evidence', scenario='A workstation begins encrypting files and triggers endpoint alerts while the user is still logged in.', action='Follow the incident plan: contact responders, isolate the affected endpoint using approved controls, preserve relevant evidence and avoid self-directed cleanup.', evidence='The incident timeline, endpoint detection events, containment action log and preserved system/network telemetry.', badEvidence=['Immediately wipe the workstation before responders assess it.','Wait until every affected file is confirmed before reporting.','Reconnect the workstation to test whether the alerts have stopped.'], takeaway='Contain through the approved response process and preserve evidence before destructive actions.', defensive='Activate incident response, isolate affected systems proportionately and coordinate evidence preservation.'),
'Insider threat': dict(code='INS', refs=['[32]','[38]','[33]'], objective='Recognize reportable security indicators while avoiding assumptions based on personal characteristics.', risk='misuse of authorized access can expose information, but ungrounded suspicion can harm people', scenario='A staff account downloads an unusual volume of restricted files outside the person’s normal work pattern shortly before a role change.', action='Record the objective access pattern and report it through the designated insider-risk or security process for a proportionate, authorized review.', evidence='Access logs and role/approval records showing the data accessed, time, volume, account permissions and business justification.', badEvidence=['A colleague says the employee has been unhappy at work.','The employee belongs to a demographic group considered “high risk.”','A single unusual login location without corroborating activity.'], takeaway='Escalate observable, policy-relevant facts; do not profile or investigate colleagues independently.', defensive='Use a confidential authorized reporting route and preserve objective access evidence.'),
'Malicious attachments': dict(code='ATT', refs=['[25]','[19]','[28]'], objective='Handle unexpected attachments safely without enabling active content or bypassing inspection.', risk='an attachment can execute malicious code or deliver a payload', scenario='An unexpected invoice arrives as an office document and displays a banner asking the recipient to enable macros to view the contents.', action='Do not enable macros or open the file outside approved handling; report it and let the security team inspect it with approved tools.', evidence='The original message and attachment metadata, file hash and results from the organization’s approved malware-analysis workflow.', badEvidence=['The invoice uses a familiar supplier logo.','The sender says the document cannot be viewed unless macros are enabled.','The file name ends with a common office-document extension.'], takeaway='Do not enable active content because an attachment asks you to.', defensive='Report unexpected attachments and use approved security inspection workflows.'),
'Mobile application security': dict(code='MOB', refs=['[16]','[19]','[27]'], objective='Install mobile applications from trusted distribution channels and review their permissions.', risk='untrusted apps can harvest data or abuse excessive device permissions', scenario='A QR code on a poster opens a page offering a payment app download outside the device’s normal app store.', action='Do not install from the sideloaded link; find the app independently in the official store and verify the publisher and required permissions.', evidence='The official store listing, verified publisher identity, app signing/distribution information and permission set.', badEvidence=['The download page uses the app’s brand colors.','The QR code is printed on an official-looking poster.','The app requests broad permissions but says they improve convenience.'], takeaway='A QR destination does not establish app authenticity; verify publisher and permissions independently.', defensive='Use official distribution channels and install only applications with justified permissions.'),
'Network security': dict(code='NET', refs=['[30]','[31]','[19]'], objective='Select trusted network connections and protect traffic when using public or unfamiliar networks.', risk='rogue or poorly secured networks can expose traffic and enable interception', scenario='At an airport, two Wi-Fi networks have similar names, and one is an open network that asks users to sign in through an unfamiliar captive portal.', action='Use the organization-approved connection method or a personal hotspot, verify the network with the venue through a known channel and avoid sensitive activity on the untrusted network.', evidence='The organization’s approved network profile and verified SSID/security configuration from an authorized source.', badEvidence=['The network name includes the airport brand.','The signal is stronger than the other network.','The captive portal displays a padlock icon in its page design.'], takeaway='Network names and signal strength do not authenticate a hotspot.', defensive='Use verified networks, approved VPN access where required and disable automatic connection to unknown hotspots.'),
'Password hygiene': dict(code='PWD', refs=['[16]','[1]'], objective='Use unique, long credentials and an approved password manager instead of reuse.', risk='password reuse enables cross-service compromise after one breach', scenario='A user learns that a low-risk website they used has suffered a breach and realizes the same password is used for work and personal accounts.', action='Change the reused passwords to unique credentials, prioritize the work account and use the organization-approved password manager.', evidence='The password-manager configuration and account-specific password-change records, without exposing or collecting the passwords themselves.', badEvidence=['The work account has MFA, so the reused password can remain.','Add one punctuation mark to the reused password on each site.','Wait until the breached website confirms whether the password was accessed.'], takeaway='Unique credentials limit the damage from a breach at another service.', defensive='Use unique passwords stored in an approved manager and never enter real credentials into training simulations.'),
'Phishing indicators': dict(code='PHI', refs=['[7]','[25]','[6]'], objective='Assess message context, sender identity, requested action and destination rather than relying on one visual cue.', risk='deceptive messages use urgency, impersonation and misleading destinations to solicit unsafe action', scenario='An email claims that a mailbox will be disabled today and asks the recipient to sign in through a shortened link.', action='Do not use the link; navigate independently to the service, check for a real notice and report the message if it is suspicious.', evidence='The full sender domain and actual link destination compared with independently known official service details.', badEvidence=['The email uses the correct company logo.','The sender display name says “IT Support.”','The message arrived during normal business hours.'], takeaway='Evaluate sender, destination, context and requested action together.', defensive='Verify independently and report suspicious messages through the approved process.'),
'Privacy': dict(code='PRI', refs=['[36]','[33]','[20]'], objective='Apply data minimization and need-to-know access when handling personal information.', risk='collecting or sharing more personal data than necessary increases privacy exposure', scenario='A workshop organizer asks participants to submit identity numbers and home addresses even though attendance only requires a name and institutional email.', action='Collect only the information required for the stated purpose, explain the purpose and retention, and use the approved protected form.', evidence='The documented processing purpose, data inventory, field justification, access list and retention schedule.', badEvidence=['The form is hosted by a well-known cloud provider.','The organizer says the extra fields may be useful later.','The information is requested from all attendees rather than a selected group.'], takeaway='A legitimate event does not justify collecting unnecessary personal information.', defensive='Minimize collection, limit access and retain personal data only for an approved period.'),
'Privacy incident response': dict(code='PIR', refs=['[36]','[28]','[33]'], objective='Contain a suspected privacy incident and notify the authorized privacy/security roles.', risk='unauthorized disclosure of personal data may require coordinated containment and assessment', scenario='A staff member discovers that a shared folder containing personal records was accessible to people outside the intended team.', action='Restrict the unintended access, preserve access logs, notify the designated privacy/security contact and follow the organization’s incident assessment process.', evidence='The folder permission history, access logs, affected data inventory, exposure window and containment record.', badEvidence=['The folder link is removed from the team chat but permissions stay public.','The staff member deletes the folder before documenting its contents.','The team waits for affected people to complain before escalating.'], takeaway='Contain access and escalate promptly; do not erase evidence or decide impact alone.', defensive='Use the privacy incident process, preserve evidence and let authorized roles assess notification obligations.'),
'QR-code phishing': dict(code='QPH', refs=['[27]','[25]'], objective='Treat QR destinations as links that must be independently checked before credentials or payment data are entered.', risk='a QR code can conceal a substituted or malicious destination', scenario='A printed QR code on a payment notice opens a page asking for bank credentials to complete a routine refund.', action='Do not enter credentials; verify the notice and payment process using the organization’s official website or a known contact.', evidence='The resolved destination domain checked against the official service address obtained independently of the QR code.', badEvidence=['The QR code is printed clearly and scans without an error.','The landing page repeats the company name and logo.','The code is placed beside an official-looking payment notice.'], takeaway='Scanning a QR code does not make its destination trustworthy.', defensive='Inspect the destination, navigate independently and avoid entering secrets into unexpected QR-linked pages.'),
'QR-code safety': dict(code='QRS', refs=['[27]','[25]'], objective='Check for QR-code tampering and verify the associated service before scanning.', risk='a malicious sticker or replacement code can redirect a legitimate physical sign', scenario='A QR code on a campus poster appears to have a small sticker placed over the original printed code.', action='Do not scan the altered code; use the official campus site or ask the responsible office for the verified destination.', evidence='A verified destination published by the campus through its official website or a known staff contact.', badEvidence=['The sticker is neatly aligned and looks professionally printed.','The code is positioned on a campus noticeboard.','Other students say they scanned it without an obvious issue.'], takeaway='Physical placement does not authenticate a QR code; check for tampering and verify the destination.', defensive='Avoid altered codes and locate the service through a trusted official channel.'),
'Ransomware response': dict(code='RAN', refs=['[35]','[28]','[18]'], objective='Respond to ransomware indicators through coordinated containment, evidence preservation and recovery procedures.', risk='ransomware can spread and damage data while uncoordinated actions destroy evidence', scenario='A user sees ransom notes and unusual file renaming on a managed laptop while shared folders are still accessible.', action='Immediately report the incident and isolate the affected device from network connections using the approved procedure; do not delete files or negotiate independently.', evidence='Endpoint alerts, file-change telemetry, network connections, affected asset inventory and incident-response timeline.', badEvidence=['The ransom note says paying is the only way to recover data.','A single file opens successfully, so the device is treated as clean.','The user deletes the ransom note and restarts the laptop to test recovery.'], takeaway='Contain and coordinate; do not improvise recovery or destroy forensic evidence.', defensive='Activate the ransomware response plan, isolate affected assets and recover only through approved procedures.'),
'Remote-work security': dict(code='REM', refs=['[30]','[31]','[33]'], objective='Protect remote-work sessions, devices and information outside managed premises.', risk='remote work can expose systems through unmanaged networks, unlocked devices or unsafe sharing', scenario='An employee leaves a company laptop unlocked in a shared co-working space while stepping away for a meeting.', action='Lock the screen before leaving, keep the device physically secured and use organization-approved remote access and storage.', evidence='Endpoint compliance status, screen-lock configuration, device encryption and approved remote-access logs.', badEvidence=['The employee is away for only a few minutes.','The laptop is on a table where colleagues can see it.','The user hides the browser window but leaves the session active.'], takeaway='A short absence does not remove the risk of an unattended authenticated session.', defensive='Lock devices, secure them physically and use managed remote-access controls.'),
'Risk management': dict(code='RISK', refs=['[17]','[18]','[33]'], objective='Prioritize cyber risk using context, likelihood, impact, ownership and treatment options.', risk='decisions based only on urgency or anecdotes may misallocate security resources', scenario='A team has a list of security findings but limited time; one low-impact issue is highly visible while a less visible issue affects a critical service.', action='Assess each issue’s likelihood, impact, exposure and existing controls, assign an accountable owner and prioritize treatment based on documented risk.', evidence='A current risk register with asset context, likelihood, impact, control effectiveness, owner and treatment decision.', badEvidence=['Choose the finding with the most dramatic wording.','Prioritize the issue mentioned by the most senior person without assessing impact.','Treat every finding as equal regardless of asset criticality or exposure.'], takeaway='Risk prioritization needs documented context and accountable ownership.', defensive='Use a consistent risk method and revisit decisions when threat or business context changes.'),
'Safe browsing': dict(code='SFB', refs=['[25]','[19]','[20]'], objective='Navigate to trusted services independently and keep browser protections current.', risk='deceptive pages and unsafe downloads can exploit trust in visible page design', scenario='A search result advertises a free viewer for a document and the first result asks the user to download an installer from an unfamiliar domain.', action='Avoid the unknown installer; access the vendor or service through its known official address and use an approved download source.', evidence='The official vendor domain, signed release or approved software catalogue entry and its published version details.', badEvidence=['The search result is at the top of the page.','The download page has a polished design and user testimonials.','The installer file name includes the vendor’s name.'], takeaway='Search ranking and visual appearance do not establish download authenticity.', defensive='Use known vendor sites, managed software catalogues and current browser protections.'),
'Security governance': dict(code='SGV', refs=['[17]','[18]','[33]'], objective='Connect security responsibilities, risk decisions and oversight to documented organizational governance.', risk='security controls can fail when ownership and accountability are unclear', scenario='A department introduces a new cloud service, but no one is assigned to approve access, review supplier controls or accept residual risk.', action='Assign accountable business and technical owners, document the risk decision and ensure the service passes the organization’s approval and oversight process.', evidence='The service approval record, named risk owner, security assessment, control responsibilities and accepted residual-risk statement.', badEvidence=['The product is widely used by other organizations.','A team member has already created a trial account.','The vendor’s marketing page describes strong security features.'], takeaway='Security governance depends on assigned ownership and recorded decisions, not informal adoption.', defensive='Use documented approval, risk ownership and ongoing oversight for new services.'),
'Security programme governance': dict(code='SPG', refs=['[1]','[17]','[18]'], objective='Evaluate awareness programmes using meaningful measures and accountable improvement cycles.', risk='completion metrics alone can hide poor learning, ineffective controls or rising false positives', scenario='A department reports 100% training completion, but staff rarely report suspicious messages and the organization has no evidence of improved decision quality.', action='Review behaviour-proximate measures such as reporting quality, simulated decision accuracy and false-positive rates, then improve controls and training based on evidence.', evidence='A programme scorecard that combines completion, reporting quality, incident trends, false-positive measures, control coverage and action owners.', badEvidence=['The total number of training slides delivered.','A high completion percentage without outcome or reporting measures.','A single quiz average treated as proof of real-world security competence.'], takeaway='A learning metric is not the same as demonstrated security behaviour or control effectiveness.', defensive='Use multiple outcome and process measures, interpret them cautiously and improve the programme iteratively.'),
'Smishing': dict(code='SMI', refs=['[25]','[24]'], objective='Recognize SMS-based impersonation and verify unexpected requests independently.', risk='text messages can use urgency and shortened links to solicit credentials or payments', scenario='A text message says a parcel is held and requests a small redelivery fee through a shortened link, although no delivery was expected.', action='Do not open the link or provide payment data; check the carrier using its official app or a known website and report the message if suspicious.', evidence='The delivery status inside the official carrier account accessed independently of the SMS.', badEvidence=['The text includes the recipient’s first name.','The link is shortened to fit the SMS.','The sender name resembles the carrier brand.'], takeaway='Unexpected SMS links should not be trusted based on personalization or sender labels.', defensive='Verify deliveries through a known carrier channel and report suspicious texts.'),
'Social engineering': dict(code='SOC', refs=['[3]','[7]','[25]'], objective='Resist manipulation by pausing, verifying authority and protecting sensitive information.', risk='attackers exploit urgency, trust, authority and helpfulness to bypass normal controls', scenario='A caller claims to be a new senior manager and asks an employee to disclose a coworker’s schedule and internal contact details before an urgent meeting.', action='Do not disclose internal information; verify the caller’s identity and business need through an established directory or manager, then follow disclosure policy.', evidence='An independently verified identity and an approved business-purpose record for the requested information.', badEvidence=['The caller speaks confidently and uses internal terminology.','The caller knows the department name.','The caller says that asking questions would delay an urgent task.'], takeaway='Confidence, authority language and urgency are persuasion tactics, not identity proof.', defensive='Pause, verify through known channels and disclose only information needed for an approved purpose.'),
'Spear phishing': dict(code='SPR', refs=['[25]','[26]','[7]'], objective='Evaluate targeted messages using request context, sender identity and independent verification.', risk='targeted messages can use accurate personal or organizational details to appear legitimate', scenario='A manager receives a message referencing a real project and asks them to review a confidential document using a new external sharing link.', action='Verify the request and document access through the project’s established collaboration platform or a known contact before opening the external link.', evidence='The request and file permissions recorded in the organization’s approved collaboration platform, confirmed through a known project owner.', badEvidence=['The message correctly names the project and internal deadline.','The sender uses the manager’s usual signature format.','The link preview displays the project name.'], takeaway='Accurate context can be gathered or copied; verify unusual actions independently.', defensive='Use known collaboration channels and report targeted messages that request unusual access or disclosure.'),
'Suspicious links': dict(code='LNK', refs=['[7]','[25]','[19]'], objective='Compare a link’s actual destination with the expected official domain before navigating.', risk='display text and shortened URLs can conceal the destination', scenario='A message displays “student portal” as the link text, but the browser preview shows a look-alike domain with an extra word.', action='Do not follow the link; open the portal from a saved bookmark or a known official address and report the message.', evidence='The fully resolved destination domain compared with the service’s official domain obtained independently.', badEvidence=['The link text says “student portal.”','The page preview includes the official portal logo.','A colleague has forwarded the same link.'], takeaway='The destination address matters more than the words displayed in a message.', defensive='Navigate independently and report deceptive link destinations.'),
'Third-party risk': dict(code='TPR', refs=['[37]','[17]','[33]'], objective='Assess supplier security before onboarding and throughout the relationship.', risk='a supplier can introduce security exposure through access, software or data processing', scenario='A department wants to give a new analytics vendor access to customer records before security review because a pilot deadline is approaching.', action='Pause onboarding until the supplier passes the organization’s risk review, contract and data-handling requirements, and least-privilege access design.', evidence='A supplier assessment, data-processing terms, security requirements, remediation status and approved access plan.', badEvidence=['The supplier has a well-known logo on its website.','The sales representative says other customers have approved it.','The pilot uses only a small sample of customer records.'], takeaway='Supplier trust is a managed lifecycle decision, not a brand or sales claim.', defensive='Perform proportionate due diligence, contract for required controls and monitor supplier risk over time.'),
'Vishing': dict(code='VIS', refs=['[25]','[24]','[16]'], objective='Respond safely to voice-based impersonation and requests for authentication secrets.', risk='callers can impersonate support or authority figures to solicit codes or actions', scenario='A caller claiming to be the university helpdesk says a sign-in attack is underway and asks the student to read a one-time verification code aloud.', action='End the call and contact the helpdesk using the number on the official university website; never disclose the code.', evidence='A callback to the helpdesk number independently obtained from the official directory and a matching support-ticket record.', badEvidence=['The caller knows the student’s name and department.','The incoming number displays the university name.','The caller says the code will expire in one minute.'], takeaway='Caller ID, personal details and urgency do not authenticate a caller.', defensive='Hang up, call a known official number and report attempts to solicit codes.'),
# Expert-only topics: two additional multi-stage challenge items per topic.
'Incident response governance': dict(code='IRG', expert=True, refs=['[17]','[28]'], objective='Coordinate incident command, proportionate containment, evidence preservation and business decisions.', risk='multiple correlated alerts require coordinated response before the full cause is known', scenario='An incident commander receives correlated endpoint encryption, unusual service-account sign-in and outbound data-transfer alerts while the initial access path remains unknown.', action='Declare and coordinate the incident, isolate confirmed affected assets using approved procedures, preserve telemetry and scope identities and systems before broader disruptive action.', evidence='A time-stamped incident record with command ownership, affected assets, containment decisions, evidence sources, scope and unresolved assumptions.', badEvidence=['A complete attribution report before declaring an incident.','A blanket shutdown of every system without scoping or business coordination.','A verbal update that has no decision owner or action log.'], takeaway='Incident command manages uncertainty through recorded decisions, proportionate containment and evidence.', defensive='Activate the response plan, appoint decision owners and preserve an auditable timeline.'),
'Supply-chain risk governance': dict(code='SCG', expert=True, refs=['[17]','[18]','[37]'], objective='Make supplier decisions using criticality, evidence, contractual controls and lifecycle oversight.', risk='a supplier with privileged access or sensitive data can create systemic organizational exposure', scenario='A critical supplier requests persistent administrator access to a production environment and cannot provide a current security assessment before a renewal deadline.', action='Do not grant persistent broad access until risk owners review evidence, define a time-bound least-privilege alternative and record residual-risk acceptance through governance.', evidence='A current supplier assessment, privileged-access architecture, contractual security obligations, remediation plan and named residual-risk approver.', badEvidence=['The supplier has renewed the contract for several years.','The supplier promises to provide evidence after receiving access.','A business sponsor says the service is operationally important.'], takeaway='Criticality increases the need for governance; it does not waive supplier controls.', defensive='Tie supplier access to assessed need, contract terms, least privilege and ongoing monitoring.'),
'Insider risk and governance': dict(code='IGV', expert=True, refs=['[32]','[33]','[38]'], objective='Govern insider-risk response with objective evidence, privacy safeguards and authorized oversight.', risk='uncoordinated monitoring or profiling can harm individuals and undermine legitimate investigation', scenario='A sensitive-data access alert coincides with an employee’s role change; a manager asks the security team to inspect personal communications without a documented basis.', action='Preserve the objective access records, refer the concern through the authorized insider-risk process and require legal/privacy and HR governance before any intrusive review.', evidence='A documented case record showing objective indicators, lawful authority, approvals, access controls and review outcomes.', badEvidence=['A manager’s personal impression that the employee seems unhappy.','A broad search of private communications before authorization.','A demographic or personal characteristic treated as a risk indicator.'], takeaway='Insider-risk governance must be evidence-based, proportionate, authorized and privacy-aware.', defensive='Use designated cross-functional governance and restrict investigation to approved evidence and scope.'),
'Business email compromise and financial controls': dict(code='BECG', expert=True, refs=['[17]','[26]','[28]'], objective='Govern high-risk payment changes with independent verification, segregation of duties and audit trails.', risk='a compromised communication channel can redirect payments despite apparently valid correspondence', scenario='A finance controller receives an urgent request to change a major supplier’s settlement account. The email thread is genuine but the supplier mailbox may be compromised.', action='Freeze the change, verify using an independently sourced supplier contact, require dual approval and reconcile the change in the controlled vendor-master workflow.', evidence='An independently verified supplier callback, authenticated vendor-master change request, dual approval and audit record linking the change to the invoice.', badEvidence=['The request is in the original email thread.','The invoice and bank letter contain matching new details.','The supplier’s display name and signature are unchanged.'], takeaway='A compromised mailbox can preserve a convincing thread; financial controls must be independent of email.', defensive='Require out-of-band verification, segregation of duties and an auditable vendor-master process.'),
'Governance and risk communication': dict(code='GRC', expert=True, refs=['[17]','[28]','[18]'], objective='Communicate cyber risk with impact, uncertainty, accountable ownership and explicit decisions.', risk='executives may make poor decisions when risk reports omit uncertainty or decision requests', scenario='A board briefing states that a cyber incident is “under control” but does not disclose affected services, known data exposure, confidence level or decisions needed.', action='Reframe the briefing around business impact, confirmed facts versus assumptions, response status, options, accountable owners and the specific decisions required.', evidence='A decision-oriented incident report with impact, confidence, scope, treatment options, residual risk and action owners.', badEvidence=['A technical dashboard screenshot without business impact.','A single red/green status label without assumptions or scope.','A long list of alerts with no ownership or requested decision.'], takeaway='Risk communication should make uncertainty and decision ownership explicit.', defensive='Use concise, evidence-based risk reporting that separates facts, assumptions and decisions.'),
'Ransomware recovery and resilience': dict(code='RCR', expert=True, refs=['[28]','[35]','[17]'], objective='Coordinate resilient recovery using verified backups, clean restoration and prioritized business services.', risk='restoring too early or from compromised backups can reintroduce malware and data loss', scenario='After a ransomware event, a business unit asks to restore critical services immediately from the most recent backup, but backup integrity and the attacker’s persistence are not yet assessed.', action='Prioritize recovery with the incident commander, validate backup integrity and isolation, confirm clean recovery infrastructure, address persistence and obtain service-owner approval before restoration.', evidence='Backup immutability and restore-test records, clean-environment validation, recovery-point data, identity hardening and documented service-owner sign-off.', badEvidence=['The backup job completed successfully last night.','A sample file can be opened from the backup.','The business unit confirms that it needs the service urgently.'], takeaway='A completed backup job is not proof that a backup is clean, complete or safe to restore.', defensive='Use tested, protected backups and a governed recovery sequence tied to business priorities.'),
}

CORE_EXISTING = json.loads(CORE_PATH.read_text(encoding='utf-8'))
EXPERT_EXISTING = json.loads(EXPERT_PATH.read_text(encoding='utf-8'))
CORE_Q = CORE_EXISTING['questions']
EXPERT_Q = EXPERT_EXISTING['questions']
COUNTS = Counter(q['category'] for q in CORE_Q + EXPERT_Q)

# Existing authentication already had three questions; add one advanced item so
# the library contains a more even spread of its subtopic coverage.
TARGETS = {}
for category, meta in SPECS.items():
    current = COUNTS[category]
    if meta.get('expert'):
        TARGETS[category] = ['action', 'evidence']
    elif category == 'Authentication':
        TARGETS[category] = ['action']
    elif current == 1:
        TARGETS[category] = ['action', 'evidence']
    elif current == 2:
        TARGETS[category] = ['action']
    elif current >= 3:
        TARGETS[category] = []
    else:
        raise RuntimeError(f'Unexpected existing count for {category}: {current}')

# Validate that every represented topic is covered by a curated spec.
all_categories = set(COUNTS)
if all_categories != set(SPECS):
    raise RuntimeError(f'Topic spec mismatch: missing={sorted(all_categories-set(SPECS))}; extra={sorted(set(SPECS)-all_categories)}')

letters = ['A','B','C','D']
wrong_actions = [
    ('Accept the request as routine and complete it without a separate check.', 'A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.'),
    ('Wait until a confirmed loss, outage or policy violation appears before acting.', 'Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.'),
    ('Share the full details with a broad group so others can decide informally.', 'Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.'),
]

def create_question(category, meta, kind, level, ordinal, global_index):
    code = meta['code']
    qid = f"LIB-{code}-{ordinal:02d}"
    vid = 'VIDEO-' + qid
    refs = meta['refs']
    if kind == 'action':
        scenario = meta['scenario']
        prompt = 'Which response is the safest and most appropriate next step?'
        answer = meta['action']
        choices = [(answer, f"This directly addresses {meta['risk']}. The proposed action uses approved, independently verifiable controls: {answer}", True)]
        choices += [(text, rationale, False) for text, rationale in wrong_actions]
        objective = meta['objective']
        duration = 120 if level == 'Expert Challenge' else (90 if level == 'Advanced' else 75)
        diff = {'Beginner':'Foundation-level: recognize and apply the primary protective action in a single-step situation.', 'Intermediate':'Intermediate: select an appropriate response while considering verification and reporting context.', 'Advanced':'Advanced: choose a proportionate response that preserves governance, evidence and operational context.', 'Expert Challenge':'Expert-level: integrate governance, evidence, risk ownership and defensive response across a multi-stage scenario.'}[level]
    else:
        scenario = (f"During a review of a possible {category.lower()} issue, the initial report is not sufficient to authorize the next step. "
                    f"The owner must validate {meta['risk']} using evidence that does not depend on the original unverified claim.")
        prompt = 'Which evidence provides the strongest basis for that decision?'
        answer = meta['evidence']
        distractors = meta['badEvidence']
        rationales = [
            'This is a surface cue that can be copied, altered or misunderstood; it does not independently establish the relevant control.',
            'This information comes from the same source being assessed, so it cannot independently validate the claim.',
            f'This does not provide an authoritative record of {meta["risk"]} or verify the control that should govern the decision.'
        ]
        choices = [(answer, f"This evidence is strongest because it independently verifies the relevant facts for {meta['risk']} and supports an auditable decision.", True)]
        choices += [(text, rationale, False) for text, rationale in zip(distractors, rationales)]
        objective = meta['objective']
        duration = 120 if level == 'Expert Challenge' else (90 if level == 'Advanced' else 75)
        diff = {'Beginner':'Foundation-level: identify the most relevant trustworthy evidence for a single-step decision.', 'Intermediate':'Intermediate: distinguish authoritative evidence from superficial or self-asserted signals.', 'Advanced':'Advanced: evaluate evidence quality and auditability before an organizational decision.', 'Expert Challenge':'Expert-level: evaluate evidence sufficiency, governance authority and residual risk in a multi-stage scenario.'}[level]
    correct_letter = letters[global_index % 4]
    # Rotate the complete option/rationale tuples so correct positions remain varied.
    wrong = [item for item in choices if not item[2]]
    final = []
    wi = 0
    for letter in letters:
        if letter == correct_letter:
            final.append((answer, next(item[1] for item in choices if item[2]), True))
        else:
            final.append(wrong[wi]); wi += 1
    options = [{'id': letter, 'text': item[0]} for letter, item in zip(letters, final)]
    option_explanations = {letter: {'isCorrect': item[2], 'explanation': item[1]} for letter, item in zip(letters, final)}
    correct_text = next(o['text'] for o in options if o['id'] == correct_letter)
    title = (f"{category}: safest response" if kind == 'action' else f"{category}: evidence check")
    takeaway = meta['takeaway']
    defensive = meta['defensive']
    q = {
        'questionId': qid,
        'level': level,
        'category': category,
        'title': title,
        'learningObjective': objective,
        'scenario': scenario,
        'question': prompt,
        'options': options,
        'correctOptionId': correct_letter,
        'correctAnswer': correct_text,
        'optionExplanations': option_explanations,
        'explanation': option_explanations[correct_letter]['explanation'],
        'explanationId': 'EXPL-' + qid,
        'videoId': vid,
        'keyTakeaway': takeaway,
        'recommendedDefensiveAction': defensive,
        'referenceIds': refs,
        'estimatedCompletionSeconds': duration,
        'difficultyRationale': diff,
            }
    if meta.get('expert'):
        q['stageCount'] = 2 if kind == 'action' else 3
    return q

new_core, new_expert = [], []
new_core_expl, new_expert_expl = [], []
new_core_video, new_expert_video = [], []
index = 0
for category, kinds in TARGETS.items():
    meta = SPECS[category]
    existing_levels = {q['level'] for q in CORE_Q if q['category'] == category}
    # For a singleton topic, add the two absent core levels; for two-item topics,
    # select an accessible missing level; for Authentication, add Advanced.
    if meta.get('expert'):
        assigned_levels = ['Expert Challenge', 'Expert Challenge']
    elif category == 'Authentication':
        assigned_levels = ['Advanced']
    elif COUNTS[category] == 1:
        assigned_levels = [level for level in ['Beginner','Intermediate','Advanced'] if level not in existing_levels]
    else:
        missing = [level for level in ['Beginner','Intermediate','Advanced'] if level not in existing_levels]
        assigned_levels = [missing[0] if missing else 'Intermediate']
    if len(assigned_levels) != len(kinds):
        raise RuntimeError(f'Level allocation mismatch for {category}: {assigned_levels} vs {kinds}')
    for ordinal, (kind, level) in enumerate(zip(kinds, assigned_levels), start=1):
        index += 1
        q = create_question(category, meta, kind, level, ordinal, index)
        if meta.get('expert'):
            new_expert.append(q)
            new_expert_expl.append({
                'questionId': q['questionId'], 'explanationId': q['explanationId'], 'videoId': q['videoId'],
                'correctOptionId': q['correctOptionId'], 'optionExplanations': q['optionExplanations'],
                'explanation': q['explanation'], 'referenceIds': q['referenceIds'],
                'reviewStatus': 'pending_cybersecurity_and_instructional_design_review'
            })
            target_manifest = new_expert_video
        else:
            new_core.append(q)
            new_core_expl.append({
                'explanationId': q['explanationId'], 'questionId': q['questionId'], 'level': q['level'], 'category': q['category'],
                'correctOptionId': q['correctOptionId'], 'overallExplanation': q['explanation'],
                'optionExplanations': q['optionExplanations'], 'keyTakeaway': q['keyTakeaway'],
                'recommendedDefensiveAction': q['recommendedDefensiveAction'], 'referenceIds': q['referenceIds'],
                'videoId': q['videoId'], 'reviewStatus': 'deferred_video_work_pending_content_review'
            })
            target_manifest = new_core_video
        target_manifest.append({
            'videoId': q['videoId'], 'questionId': q['questionId'], 'level': q['level'],
            'title': f"Question explanation: {q['title']}",
            'status': 'deferred_by_owner_request',
            'scriptPath': None, 'storyboardPath': None, 'transcriptPath': None, 'captionsPath': None, 'promptPath': None,
            'plannedOutputPath': f"public/videos/{'expert' if meta.get('expert') else level.lower()}/{q['questionId'].lower()}.mp4",
            'mediaFileExists': False, 'reviewStatus': 'deferred_by_owner_request', 'referenceIds': q['referenceIds'],
            'targetDurationSeconds': {'min': 30, 'max': 60, 'estimated': None},
            'notes': 'Video creation, script, storyboard and captions intentionally deferred by project owner; written question explanation remains available.'
        })

# Merge question sets and explanation records.
CORE_Q.extend(new_core)
CORE_EXISTING['questionCount'] = len(CORE_Q)
CORE_EXISTING['levels'] = {level: sum(q['level'] == level for q in CORE_Q) for level in ['Beginner','Intermediate','Advanced']}
CORE_EXISTING['revisionNotes'] = '2026-11-13: expanded the topic library to at least three questions per core topic; added an extra Advanced Authentication item. Library topic practice now includes locked-pathway items without counting them toward pathway mastery.'
CORE_PATH.write_text(json.dumps(CORE_EXISTING, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

EXPERT_Q.extend(new_expert)
EXPERT_EXISTING['questionCount'] = len(EXPERT_Q)
EXPERT_EXISTING['status'] = 'expanded_expert_challenge_draft_pending_expert_review'
EXPERT_EXISTING['questions'] = EXPERT_Q
EXPERT_PATH.write_text(json.dumps(EXPERT_EXISTING, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

# Add parallel explanation records.
core_expl = json.loads(CORE_EXP_PATH.read_text(encoding='utf-8'))
core_expl['explanations'].extend(new_core_expl)
CORE_EXP_PATH.write_text(json.dumps(core_expl, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
expert_expl = json.loads(EXPERT_EXP_PATH.read_text(encoding='utf-8'))
expert_expl['explanations'].extend(new_expert_expl)
EXPERT_EXP_PATH.write_text(json.dumps(expert_expl, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

# Create manifest records only. No video production assets or MP4s are created.
for path, additions in [(CORE_VIDEO_PATH, new_core_video), (EXPERT_VIDEO_PATH, new_expert_video)]:
    doc = json.loads(path.read_text(encoding='utf-8'))
    doc['entries'].extend(additions)
    doc['questionCount'] = len(doc['entries'])
    doc['scriptCount'] = sum(bool(e.get('scriptPath')) for e in doc['entries'])
    doc['storyboardCount'] = sum(bool(e.get('storyboardPath')) for e in doc['entries'])
    doc['captionFileCount'] = sum(bool(e.get('captionsPath')) for e in doc['entries'])
    doc['contentReviewApprovedCount'] = sum(e.get('contentReviewStatus') == 'approved_for_generation' for e in doc['entries'])
    doc['pendingContentReviewCount'] = len(doc['entries']) - doc['contentReviewApprovedCount']
    doc['importedMediaCount'] = sum(e.get('mediaFileExists') is True for e in doc['entries'])
    doc['readyVideoCount'] = sum(e.get('status') == 'ready' for e in doc['entries'])
    doc['mediaGenerationClaim'] = doc['importedMediaCount'] > 0
    doc['status'] = 'video_work_partially_prepared_and_new_items_deferred_by_owner_request'
    doc['ownerDirection'] = 'Do not generate new scripts, storyboards, captions or MP4 files for the added library questions in this update.'
    path.write_text(json.dumps(doc, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

# Extend core traceability matrix for new core questions.
trace_path = ROOT / 'research/traceability-matrix.csv'
with trace_path.open(newline='', encoding='utf-8') as fh:
    reader = csv.DictReader(fh); fieldnames = reader.fieldnames; rows = list(reader)
for q in new_core:
    values = {
        'question_id': q['questionId'], 'level': q['level'], 'category': q['category'],
        'learning_objective': q['learningObjective'], 'feature_or_scenario_anchor': q['scenario'],
        'explanation_id': q['explanationId'], 'video_id': q['videoId'],
        'reference_ids': ';'.join(q['referenceIds']),
        'evaluation_method': 'Content schema, option-rationale and reference-mapping validation',
        'question_bank_status': 'draft_pending_cybersecurity_and_instructional_design_review',
        'video_status': 'deferred_by_owner_request', 'video_file_path': '',
        'notes': 'New library item; SME review pending; no video asset generated by owner direction.',
        'planned_output_path': f"public/videos/{q['level'].lower()}/{q['questionId'].lower()}.mp4"
    }
    rows.append({key: values.get(key, '') for key in fieldnames})
with trace_path.open('w', newline='', encoding='utf-8') as fh:
    writer = csv.DictWriter(fh, fieldnames=fieldnames); writer.writeheader(); writer.writerows(rows)

# Extend Expert Challenge traceability matrix.
expert_trace = ROOT / 'research/expert-challenge-traceability.csv'
if expert_trace.exists():
    with expert_trace.open(newline='', encoding='utf-8') as fh:
        reader = csv.DictReader(fh); expert_fields = reader.fieldnames; expert_rows = list(reader)
else:
    expert_fields = ['question_id','level','category','learning_objective','explanation_id','video_id','reference_ids','question_bank_status']; expert_rows=[]
for q in new_expert:
    row = {k:'' for k in expert_fields}
    values = {'question_id':q['questionId'],'research_reference_ids':';'.join(q['referenceIds']),'learning_objective':q['learningObjective'],'application_feature':'Expert Challenge scenario library','explanation_id':q['explanationId'],'video_id':q['videoId'],'testing_method':'Content schema, option-rationale and reference-mapping validation','content_status':'draft_pending_cybersecurity_and_instructional_design_review','media_status':'deferred_by_owner_request'}
    row.update({k:v for k,v in values.items() if k in row})
    expert_rows.append(row)
with expert_trace.open('w', newline='', encoding='utf-8') as fh:
    writer = csv.DictWriter(fh, fieldnames=expert_fields); writer.writeheader(); writer.writerows(expert_rows)

# Regenerate the human-readable bank from canonical JSON so it cannot drift.
md = ['# CYBERAWARE 3D — Expanded Question Bank Draft', '',
      f"**Version:** 1.2.0  ", f"**Status:** {len(CORE_Q)} core questions plus {len(EXPERT_Q)} Expert Challenge questions; all items pending cybersecurity and instructional-design review.  ",
      f"**Topics:** {len(set(q['category'] for q in CORE_Q + EXPERT_Q))} topic categories.  ",
      '**Video note:** Additional video work is deferred by project-owner direction; no MP4s are generated or claimed.', '']
for level in ['Beginner','Intermediate','Advanced','Expert Challenge']:
    subset = [q for q in CORE_Q + EXPERT_Q if q['level']==level]
    md += [f'## {level} ({len(subset)} questions)', '']
    for q in subset:
        md += [f"### {q['questionId']} — {q['title']}", '', f"**Category:** {q['category']}  ", f"**Learning objective:** {q['learningObjective']}  ", f"**Scenario:** {q['scenario']}  ", f"**Question:** {q['question']}", '']
        for o in q['options']:
            suffix = ' (correct)' if o['id']==q['correctOptionId'] else ''
            md.append(f"- **{o['id']}.** {o['text']}{suffix}")
        md += ['', '**Option rationales:**']
        for o in q['options']:
            r = q['optionExplanations'][o['id']]['explanation']
            md.append(f"- **{o['id']}:** {r}")
        md += ['', f"**Key takeaway:** {q['keyTakeaway']}  ", f"**Recommended action:** {q['recommendedDefensiveAction']}  ", f"**References:** {', '.join(q['referenceIds'])}  ", f"**Explanation ID:** `{q['explanationId']}`  ", f"**Video ID:** `{q['videoId']}` (deferred for new questions)  ", '']
(ROOT / 'content/questions/question-bank.md').write_text('\n'.join(md), encoding='utf-8')

# Rebuild a library coverage report with all categories and level counts.
all_q = CORE_Q + EXPERT_Q
by_cat = Counter(q['category'] for q in all_q)
report = ['# Topic library coverage', '', f'Total questions: **{len(all_q)}** ({len(CORE_Q)} core + {len(EXPERT_Q)} Expert Challenge).', f'Topic categories: **{len(by_cat)}**.', '', '| Topic | Questions | Beginner | Intermediate | Advanced | Expert Challenge |', '|---|---:|---:|---:|---:|---:|']
for category in sorted(by_cat):
    c = [sum(q['category']==category and q['level']==level for q in all_q) for level in ['Beginner','Intermediate','Advanced','Expert Challenge']]
    report.append(f"| {category} | {by_cat[category]} | {c[0]} | {c[1]} | {c[2]} | {c[3]} |")
report += ['', 'Topic practice in the Library includes all questions regardless of pathway unlock status. First attempts on locked-level questions are retained as optional practice and do not count toward pathway mastery. The formal pathway unlock rules remain unchanged.', '']
(ROOT / 'docs/topic-library-coverage.md').write_text('\n'.join(report), encoding='utf-8')

# Update canonical content data copies used by the legacy app and React loader.
public_data = ROOT / 'frontend/public/data'
for source, target in [
    (CORE_PATH, public_data/'question-bank.json'),
    (EXPERT_PATH, public_data/'expert-challenge.json'),
    (CORE_EXP_PATH, public_data/'explanations.json'),
    (EXPERT_EXP_PATH, public_data/'expert-explanations.json'),
    (CORE_VIDEO_PATH, public_data/'video-manifest.json'),
    (EXPERT_VIDEO_PATH, public_data/'expert-video-manifest.json')]:
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(source.read_bytes())

print(f'Expanded library: {len(CORE_Q)} core + {len(EXPERT_Q)} Expert Challenge = {len(all_q)} questions across {len(by_cat)} topics.')
print(f'New questions: {len(new_core)} core + {len(new_expert)} Expert Challenge; additional video work remains deferred.')
print('Per-topic counts:', ', '.join(f'{name}: {count}' for name, count in sorted(by_cat.items())))
