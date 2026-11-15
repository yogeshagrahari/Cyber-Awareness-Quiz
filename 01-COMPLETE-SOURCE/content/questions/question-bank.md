# CYBERAWARE 3D — Expanded Question Bank Draft

**Version:** 1.2.0  
**Status:** 115 core questions plus 18 Expert Challenge questions; all items pending cybersecurity and instructional-design review.  
**Topics:** 44 topic categories.  
**Video note:** Additional video work is deferred by project-owner direction; no MP4s are generated or claimed.

## Beginner (41 questions)

### PHISH-B01 — The urgent account warning

**Category:** Phishing indicators  
**Learning objective:** Identify urgency, unexpected requests and mismatched context in a suspicious message  
**Scenario:** A message says your learning-platform account will be disabled in 20 minutes unless you sign in through its embedded link. You were not expecting an account notice.  
**Question:** What is the safest first response?

- **A.** Reply and ask the sender to prove they are an administrator.
- **B.** Open the platform using a saved bookmark or typed known address, then check notices; report the message if suspicious. (correct)
- **C.** Forward the message to classmates to ask whether they received it.
- **D.** Use the link immediately so the account is not disabled.

**Option rationales:**
- **A:** Replying engages the sender and does not independently establish identity.
- **B:** Correct. Independently navigate to the known service instead of trusting the embedded link, and report suspicious mail through the approved channel.
- **C:** Wider forwarding can spread malicious links and expose recipients; use the approved reporting route.
- **D:** This follows the message’s pressure and may disclose credentials to a look-alike site.

**Key takeaway:** Pause when a message creates urgency; verify through a channel you already trust.  
**Recommended action:** Do not open the embedded link. Navigate independently to the service and report the message using the organization’s phishing-report process.  
**References:** [1], [6], [7], [25]  
**Explanation ID:** `EXPL-PHISH-B01`  
**Video ID:** `VIDEO-PHISH-B01` (deferred for new questions)  

### SENDER-B02 — The familiar display name

**Category:** Phishing indicators  
**Learning objective:** Check the actual sender address and domain rather than relying on display name  
**Scenario:** An email displays the name “Campus IT Helpdesk,” but the full sender address ends in an unrelated public email domain. It asks you to confirm your password.  
**Question:** Which detail is most useful for assessing the sender?

- **A.** The full sender address and domain, checked against a known official contact. (correct)
- **B.** The display name looks familiar.
- **C.** The email arrived during normal working hours.
- **D.** The message uses the school logo.

**Option rationales:**
- **A:** Correct. Inspect the full address and verify the domain using an independently known directory or channel.
- **B:** Display names are easy to choose or imitate and do not authenticate the sender.
- **C:** Timing is weak evidence; malicious messages can be sent at any time.
- **D:** Logos can be copied and are not proof of message origin.

**Key takeaway:** A familiar name or logo is not identity proof; inspect and independently verify the actual address.  
**Recommended action:** Expand sender details, inspect the full address and domain, and contact IT through the published helpdesk channel if a credential request is unexpected.  
**References:** [6], [7], [25]  
**Explanation ID:** `EXPL-SENDER-B02`  
**Video ID:** `VIDEO-SENDER-B02` (deferred for new questions)  

### LINK-B03 — The look-alike sign-in link

**Category:** Suspicious links  
**Learning objective:** Inspect a link destination before opening it and navigate independently when uncertain  
**Scenario:** A message says you must review a shared document. The visible text says “university portal,” but the underlying link points to a misspelled domain.  
**Question:** What should you do?

- **A.** Open it in a private browsing window.
- **B.** Do not use the link; open the known portal independently and locate the document there. (correct)
- **C.** Click because the visible text names the university.
- **D.** Copy the link into a search engine and open the first result.

**Option rationales:**
- **A:** Private browsing does not make a malicious destination safe.
- **B:** Correct. Independent navigation avoids relying on a potentially deceptive destination.
- **C:** Visible link text can conceal a different destination.
- **D:** Search results may include look-alike or sponsored destinations and do not validate the message.

**Key takeaway:** Treat a link’s actual destination—not its label—as the relevant address.  
**Recommended action:** Use a bookmark or manually enter the service’s known address. Report the suspicious message if it is unsolicited.  
**References:** [6], [16], [25]  
**Explanation ID:** `EXPL-LINK-B03`  
**Video ID:** `VIDEO-LINK-B03` (deferred for new questions)  

### PASS-UNIQ-B04 — One password, multiple accounts

**Category:** Password hygiene  
**Learning objective:** Avoid password reuse across services and understand credential-stuffing exposure  
**Scenario:** You use the same password for a shopping site and your school account. The shopping site reports a data breach.  
**Question:** What is the best response for your school account?

- **A.** Wait until the school sends a warning.
- **B.** Keep the password because the school account uses MFA.
- **C.** Change the reused password to a unique one and review other accounts where it was reused. (correct)
- **D.** Add an exclamation mark to the same password everywhere.

**Option rationales:**
- **A:** Waiting leaves an exposed credential in use; address the reuse promptly.
- **B:** MFA adds protection but does not make password reuse safe; stolen credentials can still be abused.
- **C:** Correct. A breach at one service can expose a password reused elsewhere; unique credentials limit cross-service compromise.
- **D:** A predictable minor variation still preserves password reuse and may be guessable.

**Key takeaway:** Use a unique password for every account so one service’s breach does not unlock another.  
**Recommended action:** Change the school password to a unique strong password, change other reused instances, and check account activity.  
**References:** [1], [16]  
**Explanation ID:** `EXPL-PASS-UNIQ-B04`  
**Video ID:** `VIDEO-PASS-UNIQ-B04` (deferred for new questions)  

### PASS-MGR-B05 — Managing unique passwords

**Category:** Password hygiene  
**Learning objective:** Use an approved password manager and unique generated credentials  
**Scenario:** You have many accounts and struggle to remember a different strong password for each one.  
**Question:** Which approach best balances security and usability?

- **A.** Use one memorable password for every service.
- **B.** Keep all passwords in a note on a shared computer desktop.
- **C.** Send passwords to yourself in email so you can search for them.
- **D.** Use an organization-approved password manager with a strong protected vault and unique generated passwords. (correct)

**Option rationales:**
- **A:** Reuse creates cross-account risk when any one service is breached.
- **B:** A shared, unprotected note exposes multiple accounts to anyone with access to the device.
- **C:** Email may be accessible to mailbox attackers and is not an appropriate password vault.
- **D:** Correct. An approved manager helps maintain distinct credentials without requiring people to memorize them all.

**Key takeaway:** A trusted password manager supports unique credentials; protect the vault itself carefully.  
**Recommended action:** Use an organization-approved password manager, secure its master authentication, and never store real passwords in the learning simulation.  
**References:** [1], [16]  
**Explanation ID:** `EXPL-PASS-MGR-B05`  
**Video ID:** `VIDEO-PASS-MGR-B05` (deferred for new questions)  

### OTP-B06 — The one-time code request

**Category:** Authentication  
**Learning objective:** Never disclose a one-time password or verification code to another person  
**Scenario:** A caller claiming to be bank support says a verification code has been sent to your phone and asks you to read it aloud to stop a suspicious transaction.  
**Question:** What should you do?

- **A.** Hang up and contact the bank using the number on your card or official app; never share the code. (correct)
- **B.** Read only the first half of the code.
- **C.** Read the code because the caller knows your name.
- **D.** Send the code by text instead of saying it aloud.

**Option rationales:**
- **A:** Correct. An unsolicited caller must not receive an authenticator output; independently contact the institution.
- **B:** Partial disclosure can still help an attacker complete an authentication flow.
- **C:** Knowing personal details does not authenticate the caller; the code may authorize an action.
- **D:** Changing the communication channel does not make disclosure safe.

**Key takeaway:** An OTP is an authenticator output. Do not disclose it to callers, chat contacts or anyone else.  
**Recommended action:** End the call and contact the bank through a known official channel. Review account activity and report the attempted social engineering.  
**References:** [16], [25]  
**Explanation ID:** `EXPL-OTP-B06`  
**Video ID:** `VIDEO-OTP-B06` (deferred for new questions)  

### MFA-B07 — An unexpected sign-in prompt

**Category:** Authentication  
**Learning objective:** Deny uninitiated authentication prompts and report repeated unexpected requests  
**Scenario:** You are not signing in, but your phone displays an approval request for your work account.  
**Question:** What is the safest action?

- **A.** Ignore it and approve the next prompt if it appears again.
- **B.** Deny the request and report it to the helpdesk or security team. (correct)
- **C.** Share a screenshot of the prompt publicly.
- **D.** Approve it to clear the notification.

**Option rationales:**
- **A:** Repeated prompts can be an authentication-fatigue tactic; approving a later one is unsafe.
- **B:** Correct. A prompt you did not initiate may indicate someone has your password or is attempting authentication.
- **C:** Public sharing may expose account identifiers or organizational information and does not report the incident appropriately.
- **D:** Approval may authorize an attacker’s login attempt.

**Key takeaway:** Only approve authentication you initiated and can confidently match to your sign-in.  
**Recommended action:** Deny the request, do not disclose any code, and report unexpected or repeated prompts through the organization’s support channel.  
**References:** [16], [25]  
**Explanation ID:** `EXPL-MFA-B07`  
**Video ID:** `VIDEO-MFA-B07` (deferred for new questions)  

### BROWSE-B08 — The browser certificate warning

**Category:** Safe browsing  
**Learning objective:** Respond safely to browser certificate and security warnings  
**Scenario:** While opening a site to pay a fee, the browser displays a certificate warning and says the connection may not be private.  
**Question:** What should you do?

- **A.** Choose “proceed anyway” because the page looks normal.
- **B.** Disable browser security checks for the session.
- **C.** Stop and access the service later through its known official address or contact its support team. (correct)
- **D.** Try the same page repeatedly until the warning disappears.

**Option rationales:**
- **A:** A familiar-looking page does not resolve a certificate or connection warning.
- **B:** Disabling protections increases exposure and is not an appropriate way to complete a payment.
- **C:** Correct. Do not bypass a browser security warning for a sensitive transaction; verify independently.
- **D:** Repeated attempts do not establish that the site is trustworthy.

**Key takeaway:** Do not bypass a security warning to complete a sensitive task.  
**Recommended action:** Close the page, avoid entering credentials or payment data, and verify the service through a known official route.  
**References:** [1], [17]  
**Explanation ID:** `EXPL-BROWSE-B08`  
**Video ID:** `VIDEO-BROWSE-B08` (deferred for new questions)  

### PRIVACY-B09 — The unexpected personal-data form

**Category:** Privacy  
**Learning objective:** Share only information necessary for a legitimate and verified purpose  
**Scenario:** A person claiming to organize a campus event sends a form requesting your ID number, date of birth, home address and bank details to “confirm attendance.”  
**Question:** What is the best response?

- **A.** Verify the organizer through the official event channel and ask which fields are necessary before sharing anything. (correct)
- **B.** Submit everything because the event sounds legitimate.
- **C.** Enter made-up details to get past the form.
- **D.** Send the information in a private social-media message instead.

**Option rationales:**
- **A:** Correct. Confirm purpose and legitimacy, then disclose only the minimum required information using an approved channel.
- **B:** A plausible event does not establish the form’s authenticity or justify collecting unrelated sensitive data.
- **C:** False information can create operational problems and still expose you to malicious links or follow-up requests.
- **D:** A different channel does not fix an unverified request or excessive data collection.

**Key takeaway:** Check purpose, legitimacy and necessity before disclosing personal information.  
**Recommended action:** Contact the event organizer using a published official channel. Do not submit unnecessary financial or identity data.  
**References:** [1], [17], [36]  
**Explanation ID:** `EXPL-PRIVACY-B09`  
**Video ID:** `VIDEO-PRIVACY-B09` (deferred for new questions)  

### ATTACH-B10 — The unexpected invoice attachment

**Category:** Malicious attachments  
**Learning objective:** Verify unexpected attachments through a trusted channel before opening  
**Scenario:** An email appears to come from a classmate and includes an unexpected file named “Updated_Grades.zip.” The classmate has not mentioned sending it.  
**Question:** What should you do first?

- **A.** Disable antivirus temporarily if the file is blocked.
- **B.** Open it to see whether the file is relevant.
- **C.** Verify with the classmate using a separate known contact method and report the message if unconfirmed. (correct)
- **D.** Forward the attachment to another student to test it.

**Option rationales:**
- **A:** Disabling protections to open an unexpected file increases risk.
- **B:** Opening an unexpected archive may expose the device to malicious content.
- **C:** Correct. A known account can be compromised; confirm an unexpected attachment independently.
- **D:** Forwarding can spread a malicious file to more people.

**Key takeaway:** An attachment from a familiar account can still be unsafe or unexpected.  
**Recommended action:** Do not open or forward the file. Verify with the sender using a previously known contact method and follow reporting procedures.  
**References:** [1], [7], [25]  
**Explanation ID:** `EXPL-ATTACH-B10`  
**Video ID:** `VIDEO-ATTACH-B10` (deferred for new questions)  

### UPDATE-B11 — The update link in an email

**Category:** Device security  
**Learning objective:** Install updates through trusted vendor or managed-device mechanisms  
**Scenario:** A pop-up email says your laptop is at risk and provides an attached “critical security update” installer.  
**Question:** Which action is safest?

- **A.** Search for a similar installer on a random download site.
- **B.** Download the update only through the operating system’s trusted update mechanism or the organization’s managed software portal. (correct)
- **C.** Run the attached installer immediately.
- **D.** Ask the sender to send the installer in a password-protected archive.

**Option rationales:**
- **A:** An unrelated download site may distribute tampered or malicious software.
- **B:** Correct. Updates should be obtained and authenticated through trusted vendor or managed channels.
- **C:** Email attachments are not a trusted update channel and may contain malware.
- **D:** A password-protected archive does not establish provenance or integrity.

**Key takeaway:** Install updates through trusted, authenticated update mechanisms—not unsolicited links or attachments.  
**Recommended action:** Ignore the email attachment and check the device’s built-in update service or your organization’s managed software portal.  
**References:** [17], [18], [34]  
**Explanation ID:** `EXPL-UPDATE-B11`  
**Video ID:** `VIDEO-UPDATE-B11` (deferred for new questions)  

### SOCIAL-B12 — The authority and urgency trick

**Category:** Social engineering  
**Learning objective:** Recognize manipulation using urgency, authority or familiarity  
**Scenario:** A caller says they are the principal’s assistant and demands your class portal password immediately because “the principal has approved it.”  
**Question:** What is the safest response?

- **A.** Send the password but change it after the call.
- **B.** Share it because the caller invokes a senior authority.
- **C.** Ask the caller to repeat the principal’s name.
- **D.** Refuse to disclose the password and verify the request through an official contact channel. (correct)

**Option rationales:**
- **A:** Temporary disclosure still compromises the account and may enable immediate access.
- **B:** Claims of authority are easy to make and do not justify password disclosure.
- **C:** Knowing a name is not independent identity verification.
- **D:** Correct. Authority pressure and urgency are common social-engineering cues; passwords should not be shared.

**Key takeaway:** Authority, familiarity and urgency are persuasion techniques—not proof of identity.  
**Recommended action:** Refuse credential disclosure. End the interaction and confirm any legitimate request through a published contact channel.  
**References:** [3], [4], [25], [26]  
**Explanation ID:** `EXPL-SOCIAL-B12`  
**Video ID:** `VIDEO-SOCIAL-B12` (deferred for new questions)  

### WIFI-B13 — The open public Wi-Fi network

**Category:** Network security  
**Learning objective:** Choose safer connection practices and avoid exposing sensitive data on untrusted networks  
**Scenario:** At an airport, several similarly named free Wi-Fi networks appear. You need to access a sensitive work account.  
**Question:** What is the safest option?

- **A.** Use any open network because HTTPS makes every activity safe.
- **B.** Join the network with the strongest signal.
- **C.** Use a personal or organization-approved hotspot, or a verified network with required protections. (correct)
- **D.** Turn off the device firewall to improve speed.

**Option rationales:**
- **A:** HTTPS protects data in transit to a valid site but does not authenticate the Wi-Fi operator or protect against every threat.
- **B:** Signal strength does not verify who operates the network.
- **C:** Correct. Prefer a trusted connection; public wireless networks can expose devices and traffic to additional risk.
- **D:** Disabling a security control does not improve trust in the network and increases exposure.

**Key takeaway:** Network names and signal strength do not prove that a Wi-Fi network is legitimate.  
**Recommended action:** Prefer mobile data or an organization-approved hotspot. Follow your organization’s VPN and remote-access requirements.  
**References:** [1], [17], [30]  
**Explanation ID:** `EXPL-WIFI-B13`  
**Video ID:** `VIDEO-WIFI-B13` (deferred for new questions)  

### REPORT-B14 — You clicked a suspicious link

**Category:** Incident reporting  
**Learning objective:** Report suspected phishing or accidental interaction promptly through the approved channel  
**Scenario:** You clicked a suspicious link and entered your work password before realizing the page was fake.  
**Question:** What should you do next?

- **A.** Post the phishing message on social media and ask what to do.
- **B.** Delete the email and say nothing because you feel embarrassed.
- **C.** Wait to see whether an alert appears.
- **D.** Report immediately through the approved security channel and follow instructions to secure the account from a trusted device. (correct)

**Option rationales:**
- **A:** Public posting may expose organizational details and does not trigger incident response.
- **B:** Non-reporting delays containment and may allow the account to be misused.
- **C:** Waiting can give an attacker more time to use exposed credentials.
- **D:** Correct. Prompt reporting enables the organization to contain possible credential compromise and assess impact.

**Key takeaway:** Fast, accurate reporting helps limit harm; do not hide accidental interaction.  
**Recommended action:** Contact the security/helpdesk team immediately. From a trusted device, follow their direction to reset credentials, revoke sessions and inspect account activity.  
**References:** [1], [17], [24], [28]  
**Explanation ID:** `EXPL-REPORT-B14`  
**Video ID:** `VIDEO-REPORT-B14` (deferred for new questions)  

### QR-B15 — The unexpected QR code

**Category:** QR-code safety  
**Learning objective:** Treat unexpected QR codes as links and verify the destination before proceeding  
**Scenario:** A sticker covers the QR code on a parking meter. The replacement code opens a page asking for card details and vehicle information.  
**Question:** What should you do?

- **A.** Use the official payment app or website reached independently and inspect/report the altered code. (correct)
- **B.** Send the QR code to friends so they can check whether it works.
- **C.** Scan and pay because the sticker is on the meter.
- **D.** Enter card details only if the page has the meter operator’s logo.

**Option rationales:**
- **A:** Correct. QR codes conceal URLs; use a known official payment route and report suspected tampering.
- **B:** Sharing can spread the malicious destination and does not verify its operator.
- **C:** A sticker can be placed over a legitimate QR code; physical placement does not prove authenticity.
- **D:** Logos can be copied and do not prove the destination is legitimate.

**Key takeaway:** A QR code is simply a link in a different format; inspect and verify it before acting.  
**Recommended action:** Do not enter details on the linked page. Use the operator’s official app or a known address and report the altered sticker.  
**References:** [1], [7], [27]  
**Explanation ID:** `EXPL-QR-B15`  
**Video ID:** `VIDEO-QR-B15` (deferred for new questions)  

### LIB-AIM-01 — AI-enabled impersonation: safest response

**Category:** AI-enabled impersonation  
**Learning objective:** Verify AI-assisted identity claims before authorizing consequential actions.  
**Scenario:** A finance team receives a video call that appears to show a senior executive requesting an urgent change to supplier bank details.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Accept the request as routine and complete it without a separate check.
- **B.** Pause the change, end the call, verify the request using a phone number already held in the official directory, and require the normal second-person approval. (correct)
- **C.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **D.** Share the full details with a broad group so others can decide informally.

**Option rationales:**
- **A:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **B:** This directly addresses synthetic voice, video or text can imitate a trusted colleague. The proposed action uses approved, independently verifiable controls: Pause the change, end the call, verify the request using a phone number already held in the official directory, and require the normal second-person approval.
- **C:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **D:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.

**Key takeaway:** A convincing face, voice or message is not independent proof of identity or authority.  
**Recommended action:** Use a known contact path and the documented dual-approval workflow for payment changes.  
**References:** [15], [29]  
**Explanation ID:** `EXPL-LIB-AIM-01`  
**Video ID:** `VIDEO-LIB-AIM-01` (deferred for new questions)  

### LIB-AIT-01 — AI-enabled threats: safest response

**Category:** AI-enabled threats  
**Learning objective:** Treat AI-generated content as untrusted until its provenance and requested action are independently checked.  
**Scenario:** A staff member receives a polished AI-written alert that claims to be from the security team and asks them to install a new “protection” tool from an attachment.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Accept the request as routine and complete it without a separate check.
- **B.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **C.** Share the full details with a broad group so others can decide informally.
- **D.** Do not run the attachment; verify the tool and notice through the organization’s published software catalogue or security channel, then report the message. (correct)

**Option rationales:**
- **A:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **B:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **C:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.
- **D:** This directly addresses AI-generated messages or media can make deceptive instructions look authentic. The proposed action uses approved, independently verifiable controls: Do not run the attachment; verify the tool and notice through the organization’s published software catalogue or security channel, then report the message.

**Key takeaway:** Fluent, personalized or synthetic content is not proof of source or safety.  
**Recommended action:** Verify provenance and software approval independently; report suspected AI-enabled impersonation.  
**References:** [15], [14], [29]  
**Explanation ID:** `EXPL-LIB-AIT-01`  
**Video ID:** `VIDEO-LIB-AIT-01` (deferred for new questions)  

### LIB-ACG-01 — Access governance: safest response

**Category:** Access governance  
**Learning objective:** Apply least privilege and periodic access review to organizational resources.  
**Scenario:** A project ends, but a temporary contractor account still has administrator access to a shared workspace.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Accept the request as routine and complete it without a separate check.
- **B.** Have the system owner review the account’s current business need, remove unnecessary privileges, set an expiry and record the change. (correct)
- **C.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **D.** Share the full details with a broad group so others can decide informally.

**Option rationales:**
- **A:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **B:** This directly addresses excessive or stale permissions can expose systems and data. The proposed action uses approved, independently verifiable controls: Have the system owner review the account’s current business need, remove unnecessary privileges, set an expiry and record the change.
- **C:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **D:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.

**Key takeaway:** Access should be tied to a current need, an accountable owner and a review date.  
**Recommended action:** Use least-privilege roles, time-bound access and documented recertification.  
**References:** [17], [31], [33]  
**Explanation ID:** `EXPL-LIB-ACG-01`  
**Video ID:** `VIDEO-LIB-ACG-01` (deferred for new questions)  

### LIB-REC-01 — Account recovery: safest response

**Category:** Account recovery  
**Learning objective:** Use an authenticated account-recovery process and review sessions after recovery.  
**Scenario:** A user receives an unexpected notice that recovery details for their learning account have changed, although they did not request recovery.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Accept the request as routine and complete it without a separate check.
- **B.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **C.** Share the full details with a broad group so others can decide informally.
- **D.** Open the service through its known official address, use its published account-recovery process, contact support through a known channel and review active sessions. (correct)

**Option rationales:**
- **A:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **B:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **C:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.
- **D:** This directly addresses an attacker may exploit weak recovery steps to take over an account. The proposed action uses approved, independently verifiable controls: Open the service through its known official address, use its published account-recovery process, contact support through a known channel and review active sessions.

**Key takeaway:** Recovery events deserve independent verification and a session review.  
**Recommended action:** Use only the official recovery flow, revoke unfamiliar sessions and report unauthorized recovery changes.  
**References:** [16], [24]  
**Explanation ID:** `EXPL-LIB-REC-01`  
**Video ID:** `VIDEO-LIB-REC-01` (deferred for new questions)  

### LIB-ATO-01 — Account takeover: safest response

**Category:** Account takeover  
**Learning objective:** Recognize account-takeover indicators and contain suspected unauthorized sessions.  
**Scenario:** A user sees a successful sign-in notification from an unfamiliar device and a location they do not recognize.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Accept the request as routine and complete it without a separate check.
- **B.** Use the official account portal to secure the account, revoke unfamiliar sessions, change the credential through the trusted flow, strengthen MFA and report the event. (correct)
- **C.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **D.** Share the full details with a broad group so others can decide informally.

**Option rationales:**
- **A:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **B:** This directly addresses an attacker may maintain access through stolen credentials or existing sessions. The proposed action uses approved, independently verifiable controls: Use the official account portal to secure the account, revoke unfamiliar sessions, change the credential through the trusted flow, strengthen MFA and report the event.
- **C:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **D:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.

**Key takeaway:** Unexpected sessions require account-level investigation, not just dismissal of one alert.  
**Recommended action:** Review sign-in history, revoke suspicious sessions, secure credentials and report possible compromise.  
**References:** [16], [25], [28]  
**Explanation ID:** `EXPL-LIB-ATO-01`  
**Video ID:** `VIDEO-LIB-ATO-01` (deferred for new questions)  

### LIB-AA-01 — Authentication architecture: safest response

**Category:** Authentication architecture  
**Learning objective:** Understand how origin binding and session context strengthen authentication.  
**Scenario:** An organization is reviewing a sign-in design that relies only on a generic push approval and does not show which service initiated the request.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Adopt a phishing-resistant, origin-bound authenticator flow and review session binding and recovery controls as part of the design. (correct)
- **B.** Accept the request as routine and complete it without a separate check.
- **C.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **D.** Share the full details with a broad group so others can decide informally.

**Option rationales:**
- **A:** This directly addresses an authentication flow can be relayed or approved without the user validating the intended service. The proposed action uses approved, independently verifiable controls: Adopt a phishing-resistant, origin-bound authenticator flow and review session binding and recovery controls as part of the design.
- **B:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **C:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **D:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.

**Key takeaway:** The presence of MFA alone does not describe the strength of the authenticator or the session binding.  
**Recommended action:** Evaluate authenticator phishing resistance, origin binding, recovery and session controls together.  
**References:** [16], [31], [33]  
**Explanation ID:** `EXPL-LIB-AA-01`  
**Video ID:** `VIDEO-LIB-AA-01` (deferred for new questions)  

### LIB-BRS-01 — Browser security: safest response

**Category:** Browser security  
**Learning objective:** Assess browser extensions by publisher, permissions and organizational approval.  
**Scenario:** A browser extension promises to summarize documents and requests permission to read and change data on every website.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Accept the request as routine and complete it without a separate check.
- **B.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **C.** Do not install it until its publisher, purpose and permissions are reviewed against the organization’s approved-extension policy. (correct)
- **D.** Share the full details with a broad group so others can decide informally.

**Option rationales:**
- **A:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **B:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **C:** This directly addresses a malicious or over-privileged extension can read or alter browser data. The proposed action uses approved, independently verifiable controls: Do not install it until its publisher, purpose and permissions are reviewed against the organization’s approved-extension policy.
- **D:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.

**Key takeaway:** Extension permissions and publisher provenance matter more than popularity or marketing claims.  
**Recommended action:** Install only approved extensions with permissions limited to a justified business need.  
**References:** [19], [25]  
**Explanation ID:** `EXPL-LIB-BRS-01`  
**Video ID:** `VIDEO-LIB-BRS-01` (deferred for new questions)  

### LIB-BEC-01 — Business email compromise: safest response

**Category:** Business email compromise  
**Learning objective:** Verify unusual payment and account-change requests through an independent established channel.  
**Scenario:** A supplier email thread requests that the next invoice payment be sent to a new bank account and asks for secrecy because the change is “time-sensitive.”  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Pause payment, call the supplier using a previously verified number, follow the organization’s bank-detail change procedure and require independent approval. (correct)
- **B.** Accept the request as routine and complete it without a separate check.
- **C.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **D.** Share the full details with a broad group so others can decide informally.

**Option rationales:**
- **A:** This directly addresses an attacker may impersonate a supplier or executive to redirect funds. The proposed action uses approved, independently verifiable controls: Pause payment, call the supplier using a previously verified number, follow the organization’s bank-detail change procedure and require independent approval.
- **B:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **C:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **D:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.

**Key takeaway:** A familiar email thread can be compromised; payment changes require out-of-band verification.  
**Recommended action:** Verify payment changes with a known supplier contact and preserve approval records.  
**References:** [26], [25]  
**Explanation ID:** `EXPL-LIB-BEC-01`  
**Video ID:** `VIDEO-LIB-BEC-01` (deferred for new questions)  

### LIB-CLD-01 — Cloud security: safest response

**Category:** Cloud security  
**Learning objective:** Reduce cloud exposure through least privilege, secure configuration and auditability.  
**Scenario:** A team discovers that a cloud storage container holding project files is configured for public access even though the files are intended for internal use.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Accept the request as routine and complete it without a separate check.
- **B.** Restrict public access using the approved configuration, preserve relevant audit logs, identify affected data and notify the cloud/security owner. (correct)
- **C.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **D.** Share the full details with a broad group so others can decide informally.

**Option rationales:**
- **A:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **B:** This directly addresses misconfigured cloud permissions or public storage can expose sensitive data. The proposed action uses approved, independently verifiable controls: Restrict public access using the approved configuration, preserve relevant audit logs, identify affected data and notify the cloud/security owner.
- **C:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **D:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.

**Key takeaway:** Obscure URLs and resource names do not replace explicit access controls.  
**Recommended action:** Apply least privilege, disable unintended public access and review cloud audit logs.  
**References:** [31], [33], [18]  
**Explanation ID:** `EXPL-LIB-CLD-01`  
**Video ID:** `VIDEO-LIB-CLD-01` (deferred for new questions)  

### LIB-CCR-01 — Credential compromise: safest response

**Category:** Credential compromise  
**Learning objective:** Respond to suspected credential exposure by securing identity and reviewing related activity.  
**Scenario:** A user accidentally enters their work password into a page that was reached through an unexpected message and then notices that the page address is unfamiliar.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Accept the request as routine and complete it without a separate check.
- **B.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **C.** Share the full details with a broad group so others can decide informally.
- **D.** Report the event immediately, change the password using the known official portal, revoke sessions, review MFA and check related account activity with IT. (correct)

**Option rationales:**
- **A:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **B:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **C:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.
- **D:** This directly addresses exposed credentials may be used to access other systems or maintain sessions. The proposed action uses approved, independently verifiable controls: Report the event immediately, change the password using the known official portal, revoke sessions, review MFA and check related account activity with IT.

**Key takeaway:** Treat suspected credential disclosure as a potential compromise even before misuse is visible.  
**Recommended action:** Secure the account through the official portal, revoke sessions and report the event promptly.  
**References:** [16], [25], [28]  
**Explanation ID:** `EXPL-LIB-CCR-01`  
**Video ID:** `VIDEO-LIB-CCR-01` (deferred for new questions)  

### LIB-DAT-01 — Data protection: safest response

**Category:** Data protection  
**Learning objective:** Handle information according to classification, purpose and approved storage requirements.  
**Scenario:** A project team wants to upload a spreadsheet containing personal details to a public file-conversion website to change its format.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Accept the request as routine and complete it without a separate check.
- **B.** Use an organization-approved tool and storage location, minimize the data to what is required and follow the applicable classification and sharing rules. (correct)
- **C.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **D.** Share the full details with a broad group so others can decide informally.

**Option rationales:**
- **A:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **B:** This directly addresses sensitive information can be exposed through unnecessary collection or unsafe sharing. The proposed action uses approved, independently verifiable controls: Use an organization-approved tool and storage location, minimize the data to what is required and follow the applicable classification and sharing rules.
- **C:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **D:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.

**Key takeaway:** A legitimate purpose does not justify an unapproved processing or sharing channel.  
**Recommended action:** Minimize personal data and use approved services with appropriate access and retention controls.  
**References:** [33], [36], [20]  
**Explanation ID:** `EXPL-LIB-DAT-01`  
**Video ID:** `VIDEO-LIB-DAT-01` (deferred for new questions)  

### LIB-LOG-01 — Evidence and logging: safest response

**Category:** Evidence and logging  
**Learning objective:** Preserve relevant incident evidence with integrity, timestamps and access control.  
**Scenario:** During a security review, an analyst finds suspicious login activity and wants to clean up the log export before sharing it with responders.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Accept the request as routine and complete it without a separate check.
- **B.** Preserve the original records, record collection time and source, calculate an integrity hash where available and share them through the approved restricted incident channel. (correct)
- **C.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **D.** Share the full details with a broad group so others can decide informally.

**Option rationales:**
- **A:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **B:** This directly addresses editing or discarding records can undermine incident reconstruction. The proposed action uses approved, independently verifiable controls: Preserve the original records, record collection time and source, calculate an integrity hash where available and share them through the approved restricted incident channel.
- **C:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **D:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.

**Key takeaway:** Keep original evidence intact and record how it was collected and handled.  
**Recommended action:** Preserve originals, maintain chain-of-custody notes and restrict evidence access to authorized responders.  
**References:** [28], [18], [33]  
**Explanation ID:** `EXPL-LIB-LOG-01`  
**Video ID:** `VIDEO-LIB-LOG-01` (deferred for new questions)  

### LIB-IR-01 — Incident response: safest response

**Category:** Incident response  
**Learning objective:** Contain suspected incidents proportionately while preserving evidence and following response roles.  
**Scenario:** A workstation begins encrypting files and triggers endpoint alerts while the user is still logged in.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Accept the request as routine and complete it without a separate check.
- **B.** Follow the incident plan: contact responders, isolate the affected endpoint using approved controls, preserve relevant evidence and avoid self-directed cleanup. (correct)
- **C.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **D.** Share the full details with a broad group so others can decide informally.

**Option rationales:**
- **A:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **B:** This directly addresses uncoordinated response can increase impact or destroy useful evidence. The proposed action uses approved, independently verifiable controls: Follow the incident plan: contact responders, isolate the affected endpoint using approved controls, preserve relevant evidence and avoid self-directed cleanup.
- **C:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **D:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.

**Key takeaway:** Contain through the approved response process and preserve evidence before destructive actions.  
**Recommended action:** Activate incident response, isolate affected systems proportionately and coordinate evidence preservation.  
**References:** [28], [35], [18]  
**Explanation ID:** `EXPL-LIB-IR-01`  
**Video ID:** `VIDEO-LIB-IR-01` (deferred for new questions)  

### LIB-INS-01 — Insider threat: safest response

**Category:** Insider threat  
**Learning objective:** Recognize reportable security indicators while avoiding assumptions based on personal characteristics.  
**Scenario:** A staff account downloads an unusual volume of restricted files outside the person’s normal work pattern shortly before a role change.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Accept the request as routine and complete it without a separate check.
- **B.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **C.** Record the objective access pattern and report it through the designated insider-risk or security process for a proportionate, authorized review. (correct)
- **D.** Share the full details with a broad group so others can decide informally.

**Option rationales:**
- **A:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **B:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **C:** This directly addresses misuse of authorized access can expose information, but ungrounded suspicion can harm people. The proposed action uses approved, independently verifiable controls: Record the objective access pattern and report it through the designated insider-risk or security process for a proportionate, authorized review.
- **D:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.

**Key takeaway:** Escalate observable, policy-relevant facts; do not profile or investigate colleagues independently.  
**Recommended action:** Use a confidential authorized reporting route and preserve objective access evidence.  
**References:** [32], [38], [33]  
**Explanation ID:** `EXPL-LIB-INS-01`  
**Video ID:** `VIDEO-LIB-INS-01` (deferred for new questions)  

### LIB-MOB-01 — Mobile application security: safest response

**Category:** Mobile application security  
**Learning objective:** Install mobile applications from trusted distribution channels and review their permissions.  
**Scenario:** A QR code on a poster opens a page offering a payment app download outside the device’s normal app store.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Accept the request as routine and complete it without a separate check.
- **B.** Do not install from the sideloaded link; find the app independently in the official store and verify the publisher and required permissions. (correct)
- **C.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **D.** Share the full details with a broad group so others can decide informally.

**Option rationales:**
- **A:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **B:** This directly addresses untrusted apps can harvest data or abuse excessive device permissions. The proposed action uses approved, independently verifiable controls: Do not install from the sideloaded link; find the app independently in the official store and verify the publisher and required permissions.
- **C:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **D:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.

**Key takeaway:** A QR destination does not establish app authenticity; verify publisher and permissions independently.  
**Recommended action:** Use official distribution channels and install only applications with justified permissions.  
**References:** [16], [19], [27]  
**Explanation ID:** `EXPL-LIB-MOB-01`  
**Video ID:** `VIDEO-LIB-MOB-01` (deferred for new questions)  

### LIB-PIR-01 — Privacy incident response: safest response

**Category:** Privacy incident response  
**Learning objective:** Contain a suspected privacy incident and notify the authorized privacy/security roles.  
**Scenario:** A staff member discovers that a shared folder containing personal records was accessible to people outside the intended team.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Accept the request as routine and complete it without a separate check.
- **B.** Restrict the unintended access, preserve access logs, notify the designated privacy/security contact and follow the organization’s incident assessment process. (correct)
- **C.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **D.** Share the full details with a broad group so others can decide informally.

**Option rationales:**
- **A:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **B:** This directly addresses unauthorized disclosure of personal data may require coordinated containment and assessment. The proposed action uses approved, independently verifiable controls: Restrict the unintended access, preserve access logs, notify the designated privacy/security contact and follow the organization’s incident assessment process.
- **C:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **D:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.

**Key takeaway:** Contain access and escalate promptly; do not erase evidence or decide impact alone.  
**Recommended action:** Use the privacy incident process, preserve evidence and let authorized roles assess notification obligations.  
**References:** [36], [28], [33]  
**Explanation ID:** `EXPL-LIB-PIR-01`  
**Video ID:** `VIDEO-LIB-PIR-01` (deferred for new questions)  

### LIB-QPH-01 — QR-code phishing: safest response

**Category:** QR-code phishing  
**Learning objective:** Treat QR destinations as links that must be independently checked before credentials or payment data are entered.  
**Scenario:** A printed QR code on a payment notice opens a page asking for bank credentials to complete a routine refund.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Accept the request as routine and complete it without a separate check.
- **B.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **C.** Share the full details with a broad group so others can decide informally.
- **D.** Do not enter credentials; verify the notice and payment process using the organization’s official website or a known contact. (correct)

**Option rationales:**
- **A:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **B:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **C:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.
- **D:** This directly addresses a QR code can conceal a substituted or malicious destination. The proposed action uses approved, independently verifiable controls: Do not enter credentials; verify the notice and payment process using the organization’s official website or a known contact.

**Key takeaway:** Scanning a QR code does not make its destination trustworthy.  
**Recommended action:** Inspect the destination, navigate independently and avoid entering secrets into unexpected QR-linked pages.  
**References:** [27], [25]  
**Explanation ID:** `EXPL-LIB-QPH-01`  
**Video ID:** `VIDEO-LIB-QPH-01` (deferred for new questions)  

### LIB-RAN-01 — Ransomware response: safest response

**Category:** Ransomware response  
**Learning objective:** Respond to ransomware indicators through coordinated containment, evidence preservation and recovery procedures.  
**Scenario:** A user sees ransom notes and unusual file renaming on a managed laptop while shared folders are still accessible.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Accept the request as routine and complete it without a separate check.
- **B.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **C.** Share the full details with a broad group so others can decide informally.
- **D.** Immediately report the incident and isolate the affected device from network connections using the approved procedure; do not delete files or negotiate independently. (correct)

**Option rationales:**
- **A:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **B:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **C:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.
- **D:** This directly addresses ransomware can spread and damage data while uncoordinated actions destroy evidence. The proposed action uses approved, independently verifiable controls: Immediately report the incident and isolate the affected device from network connections using the approved procedure; do not delete files or negotiate independently.

**Key takeaway:** Contain and coordinate; do not improvise recovery or destroy forensic evidence.  
**Recommended action:** Activate the ransomware response plan, isolate affected assets and recover only through approved procedures.  
**References:** [35], [28], [18]  
**Explanation ID:** `EXPL-LIB-RAN-01`  
**Video ID:** `VIDEO-LIB-RAN-01` (deferred for new questions)  

### LIB-REM-01 — Remote-work security: safest response

**Category:** Remote-work security  
**Learning objective:** Protect remote-work sessions, devices and information outside managed premises.  
**Scenario:** An employee leaves a company laptop unlocked in a shared co-working space while stepping away for a meeting.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Accept the request as routine and complete it without a separate check.
- **B.** Lock the screen before leaving, keep the device physically secured and use organization-approved remote access and storage. (correct)
- **C.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **D.** Share the full details with a broad group so others can decide informally.

**Option rationales:**
- **A:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **B:** This directly addresses remote work can expose systems through unmanaged networks, unlocked devices or unsafe sharing. The proposed action uses approved, independently verifiable controls: Lock the screen before leaving, keep the device physically secured and use organization-approved remote access and storage.
- **C:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **D:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.

**Key takeaway:** A short absence does not remove the risk of an unattended authenticated session.  
**Recommended action:** Lock devices, secure them physically and use managed remote-access controls.  
**References:** [30], [31], [33]  
**Explanation ID:** `EXPL-LIB-REM-01`  
**Video ID:** `VIDEO-LIB-REM-01` (deferred for new questions)  

### LIB-RISK-01 — Risk management: safest response

**Category:** Risk management  
**Learning objective:** Prioritize cyber risk using context, likelihood, impact, ownership and treatment options.  
**Scenario:** A team has a list of security findings but limited time; one low-impact issue is highly visible while a less visible issue affects a critical service.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Accept the request as routine and complete it without a separate check.
- **B.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **C.** Share the full details with a broad group so others can decide informally.
- **D.** Assess each issue’s likelihood, impact, exposure and existing controls, assign an accountable owner and prioritize treatment based on documented risk. (correct)

**Option rationales:**
- **A:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **B:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **C:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.
- **D:** This directly addresses decisions based only on urgency or anecdotes may misallocate security resources. The proposed action uses approved, independently verifiable controls: Assess each issue’s likelihood, impact, exposure and existing controls, assign an accountable owner and prioritize treatment based on documented risk.

**Key takeaway:** Risk prioritization needs documented context and accountable ownership.  
**Recommended action:** Use a consistent risk method and revisit decisions when threat or business context changes.  
**References:** [17], [18], [33]  
**Explanation ID:** `EXPL-LIB-RISK-01`  
**Video ID:** `VIDEO-LIB-RISK-01` (deferred for new questions)  

### LIB-SGV-01 — Security governance: safest response

**Category:** Security governance  
**Learning objective:** Connect security responsibilities, risk decisions and oversight to documented organizational governance.  
**Scenario:** A department introduces a new cloud service, but no one is assigned to approve access, review supplier controls or accept residual risk.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Accept the request as routine and complete it without a separate check.
- **B.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **C.** Share the full details with a broad group so others can decide informally.
- **D.** Assign accountable business and technical owners, document the risk decision and ensure the service passes the organization’s approval and oversight process. (correct)

**Option rationales:**
- **A:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **B:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **C:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.
- **D:** This directly addresses security controls can fail when ownership and accountability are unclear. The proposed action uses approved, independently verifiable controls: Assign accountable business and technical owners, document the risk decision and ensure the service passes the organization’s approval and oversight process.

**Key takeaway:** Security governance depends on assigned ownership and recorded decisions, not informal adoption.  
**Recommended action:** Use documented approval, risk ownership and ongoing oversight for new services.  
**References:** [17], [18], [33]  
**Explanation ID:** `EXPL-LIB-SGV-01`  
**Video ID:** `VIDEO-LIB-SGV-01` (deferred for new questions)  

### LIB-SPG-01 — Security programme governance: safest response

**Category:** Security programme governance  
**Learning objective:** Evaluate awareness programmes using meaningful measures and accountable improvement cycles.  
**Scenario:** A department reports 100% training completion, but staff rarely report suspicious messages and the organization has no evidence of improved decision quality.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Accept the request as routine and complete it without a separate check.
- **B.** Review behaviour-proximate measures such as reporting quality, simulated decision accuracy and false-positive rates, then improve controls and training based on evidence. (correct)
- **C.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **D.** Share the full details with a broad group so others can decide informally.

**Option rationales:**
- **A:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **B:** This directly addresses completion metrics alone can hide poor learning, ineffective controls or rising false positives. The proposed action uses approved, independently verifiable controls: Review behaviour-proximate measures such as reporting quality, simulated decision accuracy and false-positive rates, then improve controls and training based on evidence.
- **C:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **D:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.

**Key takeaway:** A learning metric is not the same as demonstrated security behaviour or control effectiveness.  
**Recommended action:** Use multiple outcome and process measures, interpret them cautiously and improve the programme iteratively.  
**References:** [1], [17], [18]  
**Explanation ID:** `EXPL-LIB-SPG-01`  
**Video ID:** `VIDEO-LIB-SPG-01` (deferred for new questions)  

### LIB-SMI-01 — Smishing: safest response

**Category:** Smishing  
**Learning objective:** Recognize SMS-based impersonation and verify unexpected requests independently.  
**Scenario:** A text message says a parcel is held and requests a small redelivery fee through a shortened link, although no delivery was expected.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Accept the request as routine and complete it without a separate check.
- **B.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **C.** Share the full details with a broad group so others can decide informally.
- **D.** Do not open the link or provide payment data; check the carrier using its official app or a known website and report the message if suspicious. (correct)

**Option rationales:**
- **A:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **B:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **C:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.
- **D:** This directly addresses text messages can use urgency and shortened links to solicit credentials or payments. The proposed action uses approved, independently verifiable controls: Do not open the link or provide payment data; check the carrier using its official app or a known website and report the message if suspicious.

**Key takeaway:** Unexpected SMS links should not be trusted based on personalization or sender labels.  
**Recommended action:** Verify deliveries through a known carrier channel and report suspicious texts.  
**References:** [25], [24]  
**Explanation ID:** `EXPL-LIB-SMI-01`  
**Video ID:** `VIDEO-LIB-SMI-01` (deferred for new questions)  

### LIB-SPR-01 — Spear phishing: safest response

**Category:** Spear phishing  
**Learning objective:** Evaluate targeted messages using request context, sender identity and independent verification.  
**Scenario:** A manager receives a message referencing a real project and asks them to review a confidential document using a new external sharing link.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Accept the request as routine and complete it without a separate check.
- **B.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **C.** Share the full details with a broad group so others can decide informally.
- **D.** Verify the request and document access through the project’s established collaboration platform or a known contact before opening the external link. (correct)

**Option rationales:**
- **A:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **B:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **C:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.
- **D:** This directly addresses targeted messages can use accurate personal or organizational details to appear legitimate. The proposed action uses approved, independently verifiable controls: Verify the request and document access through the project’s established collaboration platform or a known contact before opening the external link.

**Key takeaway:** Accurate context can be gathered or copied; verify unusual actions independently.  
**Recommended action:** Use known collaboration channels and report targeted messages that request unusual access or disclosure.  
**References:** [25], [26], [7]  
**Explanation ID:** `EXPL-LIB-SPR-01`  
**Video ID:** `VIDEO-LIB-SPR-01` (deferred for new questions)  

### LIB-TPR-01 — Third-party risk: safest response

**Category:** Third-party risk  
**Learning objective:** Assess supplier security before onboarding and throughout the relationship.  
**Scenario:** A department wants to give a new analytics vendor access to customer records before security review because a pilot deadline is approaching.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Accept the request as routine and complete it without a separate check.
- **B.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **C.** Share the full details with a broad group so others can decide informally.
- **D.** Pause onboarding until the supplier passes the organization’s risk review, contract and data-handling requirements, and least-privilege access design. (correct)

**Option rationales:**
- **A:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **B:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **C:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.
- **D:** This directly addresses a supplier can introduce security exposure through access, software or data processing. The proposed action uses approved, independently verifiable controls: Pause onboarding until the supplier passes the organization’s risk review, contract and data-handling requirements, and least-privilege access design.

**Key takeaway:** Supplier trust is a managed lifecycle decision, not a brand or sales claim.  
**Recommended action:** Perform proportionate due diligence, contract for required controls and monitor supplier risk over time.  
**References:** [37], [17], [33]  
**Explanation ID:** `EXPL-LIB-TPR-01`  
**Video ID:** `VIDEO-LIB-TPR-01` (deferred for new questions)  

### LIB-VIS-01 — Vishing: safest response

**Category:** Vishing  
**Learning objective:** Respond safely to voice-based impersonation and requests for authentication secrets.  
**Scenario:** A caller claiming to be the university helpdesk says a sign-in attack is underway and asks the student to read a one-time verification code aloud.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Accept the request as routine and complete it without a separate check.
- **B.** End the call and contact the helpdesk using the number on the official university website; never disclose the code. (correct)
- **C.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **D.** Share the full details with a broad group so others can decide informally.

**Option rationales:**
- **A:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **B:** This directly addresses callers can impersonate support or authority figures to solicit codes or actions. The proposed action uses approved, independently verifiable controls: End the call and contact the helpdesk using the number on the official university website; never disclose the code.
- **C:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **D:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.

**Key takeaway:** Caller ID, personal details and urgency do not authenticate a caller.  
**Recommended action:** Hang up, call a known official number and report attempts to solicit codes.  
**References:** [25], [24], [16]  
**Explanation ID:** `EXPL-LIB-VIS-01`  
**Video ID:** `VIDEO-LIB-VIS-01` (deferred for new questions)  

## Intermediate (38 questions)

### SPEAR-I01 — The targeted project request

**Category:** Spear phishing  
**Learning objective:** Use context, relationship and business-process checks to detect targeted deception  
**Scenario:** A message uses your real project name and mentions a current deadline. It asks you to open a shared document and sign in again, but the sender domain differs from the partner’s known domain.  
**Question:** Which verification approach is strongest?

- **A.** Verify the request with the partner using a previously established contact channel, and access the project system independently. (correct)
- **B.** Open the document on a personal phone instead of a work laptop.
- **C.** Reply to the message and ask whether it is genuine.
- **D.** Trust it because the project details are accurate.

**Option rationales:**
- **A:** Correct. Use relationship and workflow context as signals, but authenticate through an independent channel.
- **B:** Changing devices does not make a deceptive link or credential prompt trustworthy.
- **C:** A response goes to the potentially compromised sender and does not independently verify the request.
- **D:** Public or compromised information can make targeted deception convincing; context alone is not authentication.

**Key takeaway:** Targeted content can be accurate and still fraudulent; independently verify the sender and workflow.  
**Recommended action:** Pause the sign-in request, contact the partner through known contact details, and report the mismatch to the security team.  
**References:** [1], [7], [25]  
**Explanation ID:** `EXPL-SPEAR-I01`  
**Video ID:** `VIDEO-SPEAR-I01` (deferred for new questions)  

### SMISH-I02 — The delivery-fee text

**Category:** Smishing  
**Learning objective:** Identify fraudulent SMS requests and verify through independent channels  
**Scenario:** You receive an SMS claiming a parcel is held for a small delivery fee. It includes a shortened link and says the parcel will be returned today.  
**Question:** What is the best response?

- **A.** Reply with your full name and address to identify the parcel.
- **B.** Open the shortened link because the fee is small.
- **C.** Forward the SMS to another recipient to see if their parcel is also held.
- **D.** Use the courier’s official app or independently located website to check tracking; do not use the SMS link. (correct)

**Option rationales:**
- **A:** Providing personal information to an unverified sender creates additional exposure.
- **B:** A small payment request can be a pretext to harvest card details or credentials.
- **C:** Forwarding spreads the lure and does not verify its authenticity.
- **D:** Correct. Verify parcel status independently rather than following an unsolicited link.

**Key takeaway:** Unexpected delivery texts with short links and urgent fees should be checked independently.  
**Recommended action:** Open the courier app or enter its known address yourself. Report and delete the suspicious message according to local procedures.  
**References:** [1], [7], [25]  
**Explanation ID:** `EXPL-SMISH-I02`  
**Video ID:** `VIDEO-SMISH-I02` (deferred for new questions)  

### VISH-I03 — The “IT support” caller

**Category:** Vishing  
**Learning objective:** Verify caller identity and resist verbal pressure to disclose data or approve actions  
**Scenario:** A caller claiming to be IT support says your laptop is infected and asks you to install a remote-access tool and read out an authentication code.  
**Question:** What should you do?

- **A.** Share the code but refuse remote access.
- **B.** Install the tool because IT support needs to troubleshoot.
- **C.** End the call and contact IT using the organization’s published helpdesk route. (correct)
- **D.** Ask the caller to send a company badge photo.

**Option rationales:**
- **A:** The code may authorize account access even without remote-control software.
- **B:** Unverified remote access can give the caller control of the device.
- **C:** Correct. Independently verify support requests; never disclose authentication outputs to an unsolicited caller.
- **D:** A photo can be fabricated or copied and is not reliable identity verification.

**Key takeaway:** Caller ID, technical language and urgency are not proof that a caller is authorized.  
**Recommended action:** End the call. Contact the helpdesk using a known directory or portal and report the attempted remote-access and code request.  
**References:** [3], [4], [16], [25]  
**Explanation ID:** `EXPL-VISH-I03`  
**Video ID:** `VIDEO-VISH-I03` (deferred for new questions)  

### QUISH-I04 — The meeting-room QR login

**Category:** QR-code phishing  
**Learning objective:** Evaluate QR-linked destinations before authentication or payment  
**Scenario:** A QR code on a meeting-room poster promises access to the conference Wi-Fi. After scanning, it opens a sign-in page on a domain unrelated to the venue.  
**Question:** What should you do?

- **A.** Try the same credentials using a different browser.
- **B.** Enter your corporate credentials because the poster is inside the office.
- **C.** Check the displayed URL, close the page, and ask facilities/IT for the official network instructions. (correct)
- **D.** Use a coworker’s login instead.

**Option rationales:**
- **A:** A different browser still submits credentials to the same untrusted site.
- **B:** The physical location does not validate the QR destination or page operator.
- **C:** Correct. Verify the destination and obtain connection details through an approved internal source.
- **D:** Sharing credentials exposes the coworker’s account and does not validate the page.

**Key takeaway:** QR codes conceal destinations; assess the actual URL before authenticating.  
**Recommended action:** Do not enter credentials. Confirm the poster with facilities or IT and use the authorized network onboarding process.  
**References:** [1], [7], [27]  
**Explanation ID:** `EXPL-QUISH-I04`  
**Video ID:** `VIDEO-QUISH-I04` (deferred for new questions)  

### MFA-FATIGUE-I05 — Repeated MFA prompts

**Category:** Authentication  
**Learning objective:** Recognize repeated push prompts as possible account compromise and deny/report them  
**Scenario:** Over ten minutes, your authenticator sends repeated sign-in approval prompts. You are not attempting to sign in, and a coworker says to approve one to stop them.  
**Question:** What is the safest response?

- **A.** Turn off MFA permanently to stop the notifications.
- **B.** Share the prompt details in a public chat to ask for help.
- **C.** Approve one request and then change your password later.
- **D.** Deny the prompts, stop interacting with them and contact the security team immediately. (correct)

**Option rationales:**
- **A:** Disabling MFA removes a protection and does not address the attempted sign-in.
- **B:** Public disclosure may reveal account details and will not trigger formal incident response.
- **C:** Approving may complete an attacker’s login; later action may be too late.
- **D:** Correct. Repeated uninitiated prompts can be authentication fatigue and may indicate a password is already known to an attacker.

**Key takeaway:** Repeated uninitiated prompts are a possible compromise signal, not a harmless notification problem.  
**Recommended action:** Deny every uninitiated prompt and report immediately. Follow the identity team’s instructions for password reset, session revocation and authenticator review.  
**References:** [16], [25]  
**Explanation ID:** `EXPL-MFA-FATIGUE-I05`  
**Video ID:** `VIDEO-MFA-FATIGUE-I05` (deferred for new questions)  

### ATTACH-MACRO-I06 — The macro-enabled invoice

**Category:** Malicious attachments  
**Learning objective:** Avoid enabling active content in untrusted documents and verify the sender  
**Scenario:** A supplier sends an invoice document you were not expecting. When opened in a preview, it asks you to “Enable Content” to display the invoice.  
**Question:** What is the correct response?

- **A.** Enable content while disconnected from Wi-Fi.
- **B.** Verify the invoice with the supplier through known contact details and report the suspicious request; do not enable content. (correct)
- **C.** Upload the file to a public malware-scanning website.
- **D.** Enable content because invoices often require macros.

**Option rationales:**
- **A:** Disconnecting does not make untrusted active content safe; it may still alter or persist on the device.
- **B:** Correct. Unexpected documents and requests to enable active content require independent verification.
- **C:** Uploading a business document publicly may disclose confidential data; use organization-approved analysis channels.
- **D:** Unexpected active content can execute code and should not be enabled simply to view a document.

**Key takeaway:** Do not enable macros or active content in an unexpected document to reveal what it contains.  
**Recommended action:** Close the document without enabling content. Verify with the supplier using a known contact method and use approved security analysis if needed.  
**References:** [1], [7], [17], [25]  
**Explanation ID:** `EXPL-ATTACH-MACRO-I06`  
**Video ID:** `VIDEO-ATTACH-MACRO-I06` (deferred for new questions)  

### ATO-I07 — Signals of account takeover

**Category:** Account takeover  
**Learning objective:** Identify account-takeover signals and initiate trusted account-recovery steps  
**Scenario:** You receive an email alert for a successful login from an unfamiliar location. Your account recovery email and forwarding rules also appear to have changed.  
**Question:** What is the strongest next step?

- **A.** Click the alert email’s “secure account” link and sign in.
- **B.** Delete the forwarding rule and assume the account is safe.
- **C.** Use a known official account-recovery route from a trusted device, contact support/security and report the unauthorized changes. (correct)
- **D.** Wait for another alert to confirm the activity.

**Option rationales:**
- **A:** The alert itself may be spoofed; its link should not be trusted without verification.
- **B:** A single change does not address potentially stolen credentials, active sessions or other persistence.
- **C:** Correct. Treat the signals as possible account compromise and use trusted recovery and containment procedures.
- **D:** Waiting may allow the intruder to maintain access or intercept future messages.

**Key takeaway:** Unexpected logins plus changed recovery settings are strong account-compromise indicators.  
**Recommended action:** Contact the service or organizational identity team using a known route. Follow instructions to secure credentials, sessions, recovery methods and mailbox rules.  
**References:** [16], [17], [28]  
**Explanation ID:** `EXPL-ATO-I07`  
**Video ID:** `VIDEO-ATO-I07` (deferred for new questions)  

### DATA-SHARE-I08 — The broad sharing link

**Category:** Data protection  
**Learning objective:** Apply least-privilege and verify recipient, channel and classification before sharing  
**Scenario:** A project teammate asks you to upload a spreadsheet containing student IDs and contact details to a folder with “Anyone with the link can view” access.  
**Question:** What is the best response?

- **A.** Share only with the verified people who need it, using an approved restricted channel and minimum necessary data. (correct)
- **B.** Create the public link but remove the folder next week.
- **C.** Rename the spreadsheet so it no longer looks sensitive.
- **D.** Send the file to a personal email account instead.

**Option rationales:**
- **A:** Correct. Verify recipients and classification, then apply least privilege to access and content.
- **B:** Temporary broad exposure is still exposure; access should be appropriately restricted before sharing.
- **C:** Renaming does not remove sensitive content or limit access.
- **D:** A personal mailbox may bypass organizational controls and create a new disclosure path.

**Key takeaway:** Share the minimum necessary data with verified recipients using access controls appropriate to its sensitivity.  
**Recommended action:** Confirm the business need and recipient list, use the approved storage service, disable public access, and set access expiry or review where supported.  
**References:** [1], [17], [31], [33], [36]  
**Explanation ID:** `EXPL-DATA-SHARE-I08`  
**Video ID:** `VIDEO-DATA-SHARE-I08` (deferred for new questions)  

### REPORT-I-I09 — The suspected malware click

**Category:** Incident response  
**Learning objective:** Select appropriate reporting, containment and evidence-preservation steps  
**Scenario:** You opened a suspicious attachment on a managed laptop. The device is behaving unusually, and your organization has an incident-response number.  
**Question:** What should you do first?

- **A.** Post the suspicious file to a public forum for identification.
- **B.** Immediately follow the organization’s incident procedure, report the event, and isolate the device if policy or responders direct you to. (correct)
- **C.** Delete all suspicious files and clear event logs.
- **D.** Continue working and run random cleanup utilities.

**Option rationales:**
- **A:** Public upload may disclose confidential information and spread malware.
- **B:** Correct. Prompt reporting and coordinated containment are safer than improvising remediation.
- **C:** Deleting files or logs can destroy evidence needed for investigation.
- **D:** Continuing activity or using unapproved tools can worsen impact or interfere with response.

**Key takeaway:** Report quickly and follow the incident-response plan; do not improvise forensic actions.  
**Recommended action:** Contact the organization’s security team immediately. Follow their containment instructions and preserve the device and relevant details.  
**References:** [1], [17], [28]  
**Explanation ID:** `EXPL-REPORT-I-I09`  
**Video ID:** `VIDEO-REPORT-I-I09` (deferred for new questions)  

### EXTENSION-I10 — The productivity extension

**Category:** Browser security  
**Learning objective:** Evaluate extension permissions, provenance and necessity before installation  
**Scenario:** A browser extension promises to summarize every page. It requests permission to read and change all data on every website, including internal work portals.  
**Question:** What should you do?

- **A.** Use a coworker’s installed extension profile.
- **B.** Install it only in a private browser window.
- **C.** Check organizational approval, publisher provenance, necessity and permission scope before installation. (correct)
- **D.** Install it because it has many positive ratings.

**Option rationales:**
- **A:** Using another person’s profile does not resolve the extension’s access or policy risks.
- **B:** Private mode does not necessarily prevent an extension from accessing permitted page content.
- **C:** Correct. Broad access to every site creates significant data and account exposure and should be justified and approved.
- **D:** Ratings do not establish the publisher’s trustworthiness or justify broad permissions.

**Key takeaway:** An extension with broad permissions can access sensitive page data; assess source and scope before use.  
**Recommended action:** Do not install until the extension is approved and its permissions are proportionate to a documented need.  
**References:** [17], [18], [19]  
**Explanation ID:** `EXPL-EXTENSION-I10`  
**Video ID:** `VIDEO-EXTENSION-I10` (deferred for new questions)  

### CLOUD-I11 — The anonymous cloud folder

**Category:** Cloud security  
**Learning objective:** Configure sharing permissions and expiry consistent with data sensitivity  
**Scenario:** A team shares a folder containing internal project documents through an anonymous link that never expires. The folder is no longer being actively used.  
**Question:** Which control change is most appropriate?

- **A.** Restrict access to named authorized accounts, set an expiry/review date and remove obsolete access. (correct)
- **B.** Change the folder name and leave permissions unchanged.
- **C.** Post the link in a team chat so everyone knows where it is.
- **D.** Keep the link because it is convenient for former collaborators.

**Option rationales:**
- **A:** Correct. Restrict identities and duration, and review existing permissions according to data sensitivity.
- **B:** A folder name does not change who can access its content.
- **C:** Wider distribution increases exposure and does not establish authorization.
- **D:** Convenience does not justify indefinite anonymous access.

**Key takeaway:** Cloud sharing should be identity-bound, least-privilege and time-limited when appropriate.  
**Recommended action:** Remove anonymous access, grant only necessary users or groups, set expiry where available and periodically review permissions.  
**References:** [1], [17], [31], [33]  
**Explanation ID:** `EXPL-CLOUD-I11`  
**Video ID:** `VIDEO-CLOUD-I11` (deferred for new questions)  

### PAYMENT-I12 — The changed supplier bank account

**Category:** Business email compromise  
**Learning objective:** Independently verify changed payment instructions using a known contact method  
**Scenario:** A regular supplier emails an updated invoice with new bank details and says payment must be made today to avoid a penalty.  
**Question:** What should accounts payable do before changing the beneficiary?

- **A.** Call the supplier using the phone number printed in the new email.
- **B.** Reply to the email asking the sender to confirm the new details.
- **C.** Pay a small test amount to see whether the account is valid.
- **D.** Verify the change through a separately established phone number or approved vendor portal and follow dual-approval controls. (correct)

**Option rationales:**
- **A:** The email may provide an attacker-controlled number; use contact details already on file.
- **B:** If the account is compromised, the attacker may confirm their own fraudulent instructions.
- **C:** A test payment still sends funds to an unverified beneficiary and can create loss.
- **D:** Correct. Payment changes need independent verification through trusted records and the normal authorization process.

**Key takeaway:** Never trust changed payment instructions solely because they arrive in a familiar email thread.  
**Recommended action:** Freeze the change until independently verified using contact information already on file, and apply the organization’s payment authorization controls.  
**References:** [7], [17], [26]  
**Explanation ID:** `EXPL-PAYMENT-I12`  
**Video ID:** `VIDEO-PAYMENT-I12` (deferred for new questions)  

### RESET-I13 — The unsolicited password-reset link

**Category:** Account recovery  
**Learning objective:** Use official account-recovery paths and reject unsolicited reset links  
**Scenario:** You receive a password-reset SMS for a service while you are not attempting to reset your password. A second message asks you to approve the reset.  
**Question:** What should you do?

- **A.** Forward the reset code to the number that sent the SMS.
- **B.** Ignore the link, navigate independently to the service and review account security or contact support if needed. (correct)
- **C.** Approve the reset and immediately choose a new password.
- **D.** Tap the reset link to see which account it concerns.

**Option rationales:**
- **A:** The code may authorize an attacker-controlled reset.
- **B:** Correct. Unsolicited reset messages should be verified through the official service rather than followed.
- **C:** Approving a reset you did not request may give another party control of the account.
- **D:** The link could lead to a credential-harvesting site.

**Key takeaway:** Only initiate recovery yourself through the official service; do not approve an unsolicited reset.  
**Recommended action:** Do not open the SMS link or share a code. Access the service independently and report repeated or suspicious recovery activity.  
**References:** [16], [25]  
**Explanation ID:** `EXPL-RESET-I13`  
**Video ID:** `VIDEO-RESET-I13` (deferred for new questions)  

### REMOTE-I14 — The shared-space work session

**Category:** Remote-work security  
**Learning objective:** Protect remote sessions, devices and information in mixed work environments  
**Scenario:** You are working in a shared café. Your laptop is unlocked while you step away, a sensitive dashboard is visible, and you are connected to public Wi-Fi.  
**Question:** Which plan best reduces the combined risk?

- **A.** Leave the laptop open but minimize the dashboard.
- **B.** Lock the device before stepping away, keep it physically controlled, use a trusted connection and follow remote-access policy. (correct)
- **C.** Disable screen lock because the café is busy.
- **D.** Ask a nearby stranger to watch the laptop.

**Option rationales:**
- **A:** Minimizing a window does not protect the unattended device or session.
- **B:** Correct. Physical access, screen exposure and network risks require layered controls.
- **C:** Removing automatic locking increases the opportunity for unauthorized access.
- **D:** An unknown bystander is not an appropriate security control.

**Key takeaway:** Remote work combines physical, visual and network risks; use layered protection.  
**Recommended action:** Lock the screen whenever unattended, keep devices in your control, avoid exposing sensitive content and use the approved secure connection method.  
**References:** [1], [17], [30]  
**Explanation ID:** `EXPL-REMOTE-I14`  
**Video ID:** `VIDEO-REMOTE-I14` (deferred for new questions)  

### QR-APP-I15 — The QR-code APK download

**Category:** Mobile application security  
**Learning objective:** Assess app-store provenance and permission scope when QR prompts an app install  
**Scenario:** A QR code on a delivery notice opens a page asking you to download an Android package file directly because the “official app store is unavailable.”  
**Question:** What is the safest decision?

- **A.** Do not sideload it; verify the delivery through the courier’s official app or independently located website. (correct)
- **B.** Install the file because the QR code is printed on a delivery notice.
- **C.** Send the file to a friend to test on their phone.
- **D.** Install it but deny location permission.

**Option rationales:**
- **A:** Correct. Use an authenticated distribution channel and independently verify the delivery request.
- **B:** The printed notice does not authenticate the source or integrity of the installation file.
- **C:** This transfers risk to another person and may propagate malware.
- **D:** One permission choice does not make an untrusted package safe; it may request more later or contain malicious code.

**Key takeaway:** Do not install an unsolicited app package from a QR-linked page; use a trusted app distribution channel.  
**Recommended action:** Close the page, do not install the package, and verify shipment status through the courier’s independently accessed official service.  
**References:** [1], [17], [18], [27]  
**Explanation ID:** `EXPL-QR-APP-I15`  
**Video ID:** `VIDEO-QR-APP-I15` (deferred for new questions)  

### LIB-AIM-02 — AI-enabled impersonation: evidence check

**Category:** AI-enabled impersonation  
**Learning objective:** Verify AI-assisted identity claims before authorizing consequential actions.  
**Scenario:** During a review of a possible ai-enabled impersonation issue, the initial report is not sufficient to authorize the next step. The owner must validate synthetic voice, video or text can imitate a trusted colleague using evidence that does not depend on the original unverified claim.  
**Question:** Which evidence provides the strongest basis for that decision?

- **A.** The apparent executive looks and sounds like the person in the video.
- **B.** The caller ID displays the executive office number shown on the incoming call.
- **C.** A callback to a previously stored directory number plus the recorded approval of a second authorized finance approver. (correct)
- **D.** The requester forwards an email thread that repeats the same bank-change instruction.

**Option rationales:**
- **A:** This is a surface cue that can be copied, altered or misunderstood; it does not independently establish the relevant control.
- **B:** This information comes from the same source being assessed, so it cannot independently validate the claim.
- **C:** This evidence is strongest because it independently verifies the relevant facts for synthetic voice, video or text can imitate a trusted colleague and supports an auditable decision.
- **D:** This does not provide an authoritative record of synthetic voice, video or text can imitate a trusted colleague or verify the control that should govern the decision.

**Key takeaway:** A convincing face, voice or message is not independent proof of identity or authority.  
**Recommended action:** Use a known contact path and the documented dual-approval workflow for payment changes.  
**References:** [15], [29]  
**Explanation ID:** `EXPL-LIB-AIM-02`  
**Video ID:** `VIDEO-LIB-AIM-02` (deferred for new questions)  

### LIB-AIT-02 — AI-enabled threats: evidence check

**Category:** AI-enabled threats  
**Learning objective:** Treat AI-generated content as untrusted until its provenance and requested action are independently checked.  
**Scenario:** During a review of a possible ai-enabled threats issue, the initial report is not sufficient to authorize the next step. The owner must validate AI-generated messages or media can make deceptive instructions look authentic using evidence that does not depend on the original unverified claim.  
**Question:** Which evidence provides the strongest basis for that decision?

- **A.** A signed or otherwise authenticated software release in the organization’s approved catalogue, confirmed through the official security team channel. (correct)
- **B.** The message uses the organization’s logo and familiar writing style.
- **C.** The attachment description says that the software is security-approved.
- **D.** Several colleagues have forwarded the same message without checking it.

**Option rationales:**
- **A:** This evidence is strongest because it independently verifies the relevant facts for AI-generated messages or media can make deceptive instructions look authentic and supports an auditable decision.
- **B:** This is a surface cue that can be copied, altered or misunderstood; it does not independently establish the relevant control.
- **C:** This information comes from the same source being assessed, so it cannot independently validate the claim.
- **D:** This does not provide an authoritative record of AI-generated messages or media can make deceptive instructions look authentic or verify the control that should govern the decision.

**Key takeaway:** Fluent, personalized or synthetic content is not proof of source or safety.  
**Recommended action:** Verify provenance and software approval independently; report suspected AI-enabled impersonation.  
**References:** [15], [14], [29]  
**Explanation ID:** `EXPL-LIB-AIT-02`  
**Video ID:** `VIDEO-LIB-AIT-02` (deferred for new questions)  

### LIB-ACG-02 — Access governance: evidence check

**Category:** Access governance  
**Learning objective:** Apply least privilege and periodic access review to organizational resources.  
**Scenario:** During a review of a possible access governance issue, the initial report is not sufficient to authorize the next step. The owner must validate excessive or stale permissions can expose systems and data using evidence that does not depend on the original unverified claim.  
**Question:** Which evidence provides the strongest basis for that decision?

- **A.** The account has not generated a recent security alert.
- **B.** The contractor says the access may be useful for a future project.
- **C.** A current access review showing the named owner, approved role, business justification, expiry and revocation status. (correct)
- **D.** The account was created by an administrator, so it is assumed to remain approved.

**Option rationales:**
- **A:** This is a surface cue that can be copied, altered or misunderstood; it does not independently establish the relevant control.
- **B:** This information comes from the same source being assessed, so it cannot independently validate the claim.
- **C:** This evidence is strongest because it independently verifies the relevant facts for excessive or stale permissions can expose systems and data and supports an auditable decision.
- **D:** This does not provide an authoritative record of excessive or stale permissions can expose systems and data or verify the control that should govern the decision.

**Key takeaway:** Access should be tied to a current need, an accountable owner and a review date.  
**Recommended action:** Use least-privilege roles, time-bound access and documented recertification.  
**References:** [17], [31], [33]  
**Explanation ID:** `EXPL-LIB-ACG-02`  
**Video ID:** `VIDEO-LIB-ACG-02` (deferred for new questions)  

### LIB-AA-02 — Authentication architecture: evidence check

**Category:** Authentication architecture  
**Learning objective:** Understand how origin binding and session context strengthen authentication.  
**Scenario:** During a review of a possible authentication architecture issue, the initial report is not sufficient to authorize the next step. The owner must validate an authentication flow can be relayed or approved without the user validating the intended service using evidence that does not depend on the original unverified claim.  
**Question:** Which evidence provides the strongest basis for that decision?

- **A.** A screenshot of the login page with the company logo.
- **B.** The identity architecture specification and test results showing authenticator origin binding, verifier association and session protections. (correct)
- **C.** A count showing that most employees own smartphones.
- **D.** A policy statement that merely says MFA is enabled.

**Option rationales:**
- **A:** This is a surface cue that can be copied, altered or misunderstood; it does not independently establish the relevant control.
- **B:** This evidence is strongest because it independently verifies the relevant facts for an authentication flow can be relayed or approved without the user validating the intended service and supports an auditable decision.
- **C:** This information comes from the same source being assessed, so it cannot independently validate the claim.
- **D:** This does not provide an authoritative record of an authentication flow can be relayed or approved without the user validating the intended service or verify the control that should govern the decision.

**Key takeaway:** The presence of MFA alone does not describe the strength of the authenticator or the session binding.  
**Recommended action:** Evaluate authenticator phishing resistance, origin binding, recovery and session controls together.  
**References:** [16], [31], [33]  
**Explanation ID:** `EXPL-LIB-AA-02`  
**Video ID:** `VIDEO-LIB-AA-02` (deferred for new questions)  

### LIB-CCR-02 — Credential compromise: evidence check

**Category:** Credential compromise  
**Learning objective:** Respond to suspected credential exposure by securing identity and reviewing related activity.  
**Scenario:** During a review of a possible credential compromise issue, the initial report is not sufficient to authorize the next step. The owner must validate exposed credentials may be used to access other systems or maintain sessions using evidence that does not depend on the original unverified claim.  
**Question:** Which evidence provides the strongest basis for that decision?

- **A.** Identity-provider logs for sign-ins, password reset, MFA events and session revocation after the suspected exposure time. (correct)
- **B.** The page looked similar to the normal sign-in screen.
- **C.** The user has not yet received a password-reset warning.
- **D.** A browser history entry still shows the expected service name.

**Option rationales:**
- **A:** This evidence is strongest because it independently verifies the relevant facts for exposed credentials may be used to access other systems or maintain sessions and supports an auditable decision.
- **B:** This is a surface cue that can be copied, altered or misunderstood; it does not independently establish the relevant control.
- **C:** This information comes from the same source being assessed, so it cannot independently validate the claim.
- **D:** This does not provide an authoritative record of exposed credentials may be used to access other systems or maintain sessions or verify the control that should govern the decision.

**Key takeaway:** Treat suspected credential disclosure as a potential compromise even before misuse is visible.  
**Recommended action:** Secure the account through the official portal, revoke sessions and report the event promptly.  
**References:** [16], [25], [28]  
**Explanation ID:** `EXPL-LIB-CCR-02`  
**Video ID:** `VIDEO-LIB-CCR-02` (deferred for new questions)  

### LIB-DEV-01 — Device security: safest response

**Category:** Device security  
**Learning objective:** Keep endpoints updated through verified, supported vendor and organizational channels.  
**Scenario:** A laptop displays a pop-up from an unfamiliar website claiming that an urgent security update is required and offers a download button.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Accept the request as routine and complete it without a separate check.
- **B.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **C.** Share the full details with a broad group so others can decide informally.
- **D.** Close the pop-up and check for updates through the operating system’s built-in updater or the organization’s managed endpoint process. (correct)

**Option rationales:**
- **A:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **B:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **C:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.
- **D:** This directly addresses unpatched software can leave known vulnerabilities available to attackers. The proposed action uses approved, independently verifiable controls: Close the pop-up and check for updates through the operating system’s built-in updater or the organization’s managed endpoint process.

**Key takeaway:** Install updates through trusted system or managed channels, not unexpected pop-ups.  
**Recommended action:** Keep supported devices patched through official update mechanisms and report suspicious update prompts.  
**References:** [34], [30], [18]  
**Explanation ID:** `EXPL-LIB-DEV-01`  
**Video ID:** `VIDEO-LIB-DEV-01` (deferred for new questions)  

### LIB-LOG-02 — Evidence and logging: evidence check

**Category:** Evidence and logging  
**Learning objective:** Preserve relevant incident evidence with integrity, timestamps and access control.  
**Scenario:** During a review of a possible evidence and logging issue, the initial report is not sufficient to authorize the next step. The owner must validate editing or discarding records can undermine incident reconstruction using evidence that does not depend on the original unverified claim.  
**Question:** Which evidence provides the strongest basis for that decision?

- **A.** A screenshot of selected lines pasted into a chat message.
- **B.** A rewritten spreadsheet with suspicious rows removed.
- **C.** The original log source, collection metadata, timestamps, access history and integrity hash for the preserved export. (correct)
- **D.** An analyst’s memory of what the dashboard showed earlier.

**Option rationales:**
- **A:** This is a surface cue that can be copied, altered or misunderstood; it does not independently establish the relevant control.
- **B:** This information comes from the same source being assessed, so it cannot independently validate the claim.
- **C:** This evidence is strongest because it independently verifies the relevant facts for editing or discarding records can undermine incident reconstruction and supports an auditable decision.
- **D:** This does not provide an authoritative record of editing or discarding records can undermine incident reconstruction or verify the control that should govern the decision.

**Key takeaway:** Keep original evidence intact and record how it was collected and handled.  
**Recommended action:** Preserve originals, maintain chain-of-custody notes and restrict evidence access to authorized responders.  
**References:** [28], [18], [33]  
**Explanation ID:** `EXPL-LIB-LOG-02`  
**Video ID:** `VIDEO-LIB-LOG-02` (deferred for new questions)  

### LIB-IRP-01 — Incident reporting: safest response

**Category:** Incident reporting  
**Learning objective:** Report suspicious activity through the organization’s approved channel with useful context.  
**Scenario:** An employee receives an unexpected password-reset message and notices that two colleagues received similar messages.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Accept the request as routine and complete it without a separate check.
- **B.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **C.** Share the full details with a broad group so others can decide informally.
- **D.** Use the organization’s official report-phishing or security-incident channel and include the original message or permitted headers without forwarding it broadly. (correct)

**Option rationales:**
- **A:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **B:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **C:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.
- **D:** This directly addresses unreported suspicious messages and events can prevent timely detection of wider activity. The proposed action uses approved, independently verifiable controls: Use the organization’s official report-phishing or security-incident channel and include the original message or permitted headers without forwarding it broadly.

**Key takeaway:** Prompt, structured reporting helps responders correlate related events.  
**Recommended action:** Report through the approved channel and retain the original message as instructed by the security team.  
**References:** [1], [7], [25]  
**Explanation ID:** `EXPL-LIB-IRP-01`  
**Video ID:** `VIDEO-LIB-IRP-01` (deferred for new questions)  

### LIB-INS-02 — Insider threat: evidence check

**Category:** Insider threat  
**Learning objective:** Recognize reportable security indicators while avoiding assumptions based on personal characteristics.  
**Scenario:** During a review of a possible insider threat issue, the initial report is not sufficient to authorize the next step. The owner must validate misuse of authorized access can expose information, but ungrounded suspicion can harm people using evidence that does not depend on the original unverified claim.  
**Question:** Which evidence provides the strongest basis for that decision?

- **A.** A colleague says the employee has been unhappy at work.
- **B.** The employee belongs to a demographic group considered “high risk.”
- **C.** A single unusual login location without corroborating activity.
- **D.** Access logs and role/approval records showing the data accessed, time, volume, account permissions and business justification. (correct)

**Option rationales:**
- **A:** This is a surface cue that can be copied, altered or misunderstood; it does not independently establish the relevant control.
- **B:** This information comes from the same source being assessed, so it cannot independently validate the claim.
- **C:** This does not provide an authoritative record of misuse of authorized access can expose information, but ungrounded suspicion can harm people or verify the control that should govern the decision.
- **D:** This evidence is strongest because it independently verifies the relevant facts for misuse of authorized access can expose information, but ungrounded suspicion can harm people and supports an auditable decision.

**Key takeaway:** Escalate observable, policy-relevant facts; do not profile or investigate colleagues independently.  
**Recommended action:** Use a confidential authorized reporting route and preserve objective access evidence.  
**References:** [32], [38], [33]  
**Explanation ID:** `EXPL-LIB-INS-02`  
**Video ID:** `VIDEO-LIB-INS-02` (deferred for new questions)  

### LIB-NET-01 — Network security: safest response

**Category:** Network security  
**Learning objective:** Select trusted network connections and protect traffic when using public or unfamiliar networks.  
**Scenario:** At an airport, two Wi-Fi networks have similar names, and one is an open network that asks users to sign in through an unfamiliar captive portal.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Accept the request as routine and complete it without a separate check.
- **B.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **C.** Share the full details with a broad group so others can decide informally.
- **D.** Use the organization-approved connection method or a personal hotspot, verify the network with the venue through a known channel and avoid sensitive activity on the untrusted network. (correct)

**Option rationales:**
- **A:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **B:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **C:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.
- **D:** This directly addresses rogue or poorly secured networks can expose traffic and enable interception. The proposed action uses approved, independently verifiable controls: Use the organization-approved connection method or a personal hotspot, verify the network with the venue through a known channel and avoid sensitive activity on the untrusted network.

**Key takeaway:** Network names and signal strength do not authenticate a hotspot.  
**Recommended action:** Use verified networks, approved VPN access where required and disable automatic connection to unknown hotspots.  
**References:** [30], [31], [19]  
**Explanation ID:** `EXPL-LIB-NET-01`  
**Video ID:** `VIDEO-LIB-NET-01` (deferred for new questions)  

### LIB-PWD-01 — Password hygiene: safest response

**Category:** Password hygiene  
**Learning objective:** Use unique, long credentials and an approved password manager instead of reuse.  
**Scenario:** A user learns that a low-risk website they used has suffered a breach and realizes the same password is used for work and personal accounts.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Accept the request as routine and complete it without a separate check.
- **B.** Change the reused passwords to unique credentials, prioritize the work account and use the organization-approved password manager. (correct)
- **C.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **D.** Share the full details with a broad group so others can decide informally.

**Option rationales:**
- **A:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **B:** This directly addresses password reuse enables cross-service compromise after one breach. The proposed action uses approved, independently verifiable controls: Change the reused passwords to unique credentials, prioritize the work account and use the organization-approved password manager.
- **C:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **D:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.

**Key takeaway:** Unique credentials limit the damage from a breach at another service.  
**Recommended action:** Use unique passwords stored in an approved manager and never enter real credentials into training simulations.  
**References:** [16], [1]  
**Explanation ID:** `EXPL-LIB-PWD-01`  
**Video ID:** `VIDEO-LIB-PWD-01` (deferred for new questions)  

### LIB-PHI-01 — Phishing indicators: safest response

**Category:** Phishing indicators  
**Learning objective:** Assess message context, sender identity, requested action and destination rather than relying on one visual cue.  
**Scenario:** An email claims that a mailbox will be disabled today and asks the recipient to sign in through a shortened link.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Accept the request as routine and complete it without a separate check.
- **B.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **C.** Do not use the link; navigate independently to the service, check for a real notice and report the message if it is suspicious. (correct)
- **D.** Share the full details with a broad group so others can decide informally.

**Option rationales:**
- **A:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **B:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **C:** This directly addresses deceptive messages use urgency, impersonation and misleading destinations to solicit unsafe action. The proposed action uses approved, independently verifiable controls: Do not use the link; navigate independently to the service, check for a real notice and report the message if it is suspicious.
- **D:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.

**Key takeaway:** Evaluate sender, destination, context and requested action together.  
**Recommended action:** Verify independently and report suspicious messages through the approved process.  
**References:** [7], [25], [6]  
**Explanation ID:** `EXPL-LIB-PHI-01`  
**Video ID:** `VIDEO-LIB-PHI-01` (deferred for new questions)  

### LIB-PRI-01 — Privacy: safest response

**Category:** Privacy  
**Learning objective:** Apply data minimization and need-to-know access when handling personal information.  
**Scenario:** A workshop organizer asks participants to submit identity numbers and home addresses even though attendance only requires a name and institutional email.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Accept the request as routine and complete it without a separate check.
- **B.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **C.** Share the full details with a broad group so others can decide informally.
- **D.** Collect only the information required for the stated purpose, explain the purpose and retention, and use the approved protected form. (correct)

**Option rationales:**
- **A:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **B:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **C:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.
- **D:** This directly addresses collecting or sharing more personal data than necessary increases privacy exposure. The proposed action uses approved, independently verifiable controls: Collect only the information required for the stated purpose, explain the purpose and retention, and use the approved protected form.

**Key takeaway:** A legitimate event does not justify collecting unnecessary personal information.  
**Recommended action:** Minimize collection, limit access and retain personal data only for an approved period.  
**References:** [36], [33], [20]  
**Explanation ID:** `EXPL-LIB-PRI-01`  
**Video ID:** `VIDEO-LIB-PRI-01` (deferred for new questions)  

### LIB-PIR-02 — Privacy incident response: evidence check

**Category:** Privacy incident response  
**Learning objective:** Contain a suspected privacy incident and notify the authorized privacy/security roles.  
**Scenario:** During a review of a possible privacy incident response issue, the initial report is not sufficient to authorize the next step. The owner must validate unauthorized disclosure of personal data may require coordinated containment and assessment using evidence that does not depend on the original unverified claim.  
**Question:** Which evidence provides the strongest basis for that decision?

- **A.** The folder link is removed from the team chat but permissions stay public.
- **B.** The staff member deletes the folder before documenting its contents.
- **C.** The folder permission history, access logs, affected data inventory, exposure window and containment record. (correct)
- **D.** The team waits for affected people to complain before escalating.

**Option rationales:**
- **A:** This is a surface cue that can be copied, altered or misunderstood; it does not independently establish the relevant control.
- **B:** This information comes from the same source being assessed, so it cannot independently validate the claim.
- **C:** This evidence is strongest because it independently verifies the relevant facts for unauthorized disclosure of personal data may require coordinated containment and assessment and supports an auditable decision.
- **D:** This does not provide an authoritative record of unauthorized disclosure of personal data may require coordinated containment and assessment or verify the control that should govern the decision.

**Key takeaway:** Contain access and escalate promptly; do not erase evidence or decide impact alone.  
**Recommended action:** Use the privacy incident process, preserve evidence and let authorized roles assess notification obligations.  
**References:** [36], [28], [33]  
**Explanation ID:** `EXPL-LIB-PIR-02`  
**Video ID:** `VIDEO-LIB-PIR-02` (deferred for new questions)  

### LIB-QRS-01 — QR-code safety: safest response

**Category:** QR-code safety  
**Learning objective:** Check for QR-code tampering and verify the associated service before scanning.  
**Scenario:** A QR code on a campus poster appears to have a small sticker placed over the original printed code.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Accept the request as routine and complete it without a separate check.
- **B.** Do not scan the altered code; use the official campus site or ask the responsible office for the verified destination. (correct)
- **C.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **D.** Share the full details with a broad group so others can decide informally.

**Option rationales:**
- **A:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **B:** This directly addresses a malicious sticker or replacement code can redirect a legitimate physical sign. The proposed action uses approved, independently verifiable controls: Do not scan the altered code; use the official campus site or ask the responsible office for the verified destination.
- **C:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **D:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.

**Key takeaway:** Physical placement does not authenticate a QR code; check for tampering and verify the destination.  
**Recommended action:** Avoid altered codes and locate the service through a trusted official channel.  
**References:** [27], [25]  
**Explanation ID:** `EXPL-LIB-QRS-01`  
**Video ID:** `VIDEO-LIB-QRS-01` (deferred for new questions)  

### LIB-RAN-02 — Ransomware response: evidence check

**Category:** Ransomware response  
**Learning objective:** Respond to ransomware indicators through coordinated containment, evidence preservation and recovery procedures.  
**Scenario:** During a review of a possible ransomware response issue, the initial report is not sufficient to authorize the next step. The owner must validate ransomware can spread and damage data while uncoordinated actions destroy evidence using evidence that does not depend on the original unverified claim.  
**Question:** Which evidence provides the strongest basis for that decision?

- **A.** Endpoint alerts, file-change telemetry, network connections, affected asset inventory and incident-response timeline. (correct)
- **B.** The ransom note says paying is the only way to recover data.
- **C.** A single file opens successfully, so the device is treated as clean.
- **D.** The user deletes the ransom note and restarts the laptop to test recovery.

**Option rationales:**
- **A:** This evidence is strongest because it independently verifies the relevant facts for ransomware can spread and damage data while uncoordinated actions destroy evidence and supports an auditable decision.
- **B:** This is a surface cue that can be copied, altered or misunderstood; it does not independently establish the relevant control.
- **C:** This information comes from the same source being assessed, so it cannot independently validate the claim.
- **D:** This does not provide an authoritative record of ransomware can spread and damage data while uncoordinated actions destroy evidence or verify the control that should govern the decision.

**Key takeaway:** Contain and coordinate; do not improvise recovery or destroy forensic evidence.  
**Recommended action:** Activate the ransomware response plan, isolate affected assets and recover only through approved procedures.  
**References:** [35], [28], [18]  
**Explanation ID:** `EXPL-LIB-RAN-02`  
**Video ID:** `VIDEO-LIB-RAN-02` (deferred for new questions)  

### LIB-RISK-02 — Risk management: evidence check

**Category:** Risk management  
**Learning objective:** Prioritize cyber risk using context, likelihood, impact, ownership and treatment options.  
**Scenario:** During a review of a possible risk management issue, the initial report is not sufficient to authorize the next step. The owner must validate decisions based only on urgency or anecdotes may misallocate security resources using evidence that does not depend on the original unverified claim.  
**Question:** Which evidence provides the strongest basis for that decision?

- **A.** A current risk register with asset context, likelihood, impact, control effectiveness, owner and treatment decision. (correct)
- **B.** Choose the finding with the most dramatic wording.
- **C.** Prioritize the issue mentioned by the most senior person without assessing impact.
- **D.** Treat every finding as equal regardless of asset criticality or exposure.

**Option rationales:**
- **A:** This evidence is strongest because it independently verifies the relevant facts for decisions based only on urgency or anecdotes may misallocate security resources and supports an auditable decision.
- **B:** This is a surface cue that can be copied, altered or misunderstood; it does not independently establish the relevant control.
- **C:** This information comes from the same source being assessed, so it cannot independently validate the claim.
- **D:** This does not provide an authoritative record of decisions based only on urgency or anecdotes may misallocate security resources or verify the control that should govern the decision.

**Key takeaway:** Risk prioritization needs documented context and accountable ownership.  
**Recommended action:** Use a consistent risk method and revisit decisions when threat or business context changes.  
**References:** [17], [18], [33]  
**Explanation ID:** `EXPL-LIB-RISK-02`  
**Video ID:** `VIDEO-LIB-RISK-02` (deferred for new questions)  

### LIB-SFB-01 — Safe browsing: safest response

**Category:** Safe browsing  
**Learning objective:** Navigate to trusted services independently and keep browser protections current.  
**Scenario:** A search result advertises a free viewer for a document and the first result asks the user to download an installer from an unfamiliar domain.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Accept the request as routine and complete it without a separate check.
- **B.** Avoid the unknown installer; access the vendor or service through its known official address and use an approved download source. (correct)
- **C.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **D.** Share the full details with a broad group so others can decide informally.

**Option rationales:**
- **A:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **B:** This directly addresses deceptive pages and unsafe downloads can exploit trust in visible page design. The proposed action uses approved, independently verifiable controls: Avoid the unknown installer; access the vendor or service through its known official address and use an approved download source.
- **C:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **D:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.

**Key takeaway:** Search ranking and visual appearance do not establish download authenticity.  
**Recommended action:** Use known vendor sites, managed software catalogues and current browser protections.  
**References:** [25], [19], [20]  
**Explanation ID:** `EXPL-LIB-SFB-01`  
**Video ID:** `VIDEO-LIB-SFB-01` (deferred for new questions)  

### LIB-SGV-02 — Security governance: evidence check

**Category:** Security governance  
**Learning objective:** Connect security responsibilities, risk decisions and oversight to documented organizational governance.  
**Scenario:** During a review of a possible security governance issue, the initial report is not sufficient to authorize the next step. The owner must validate security controls can fail when ownership and accountability are unclear using evidence that does not depend on the original unverified claim.  
**Question:** Which evidence provides the strongest basis for that decision?

- **A.** The service approval record, named risk owner, security assessment, control responsibilities and accepted residual-risk statement. (correct)
- **B.** The product is widely used by other organizations.
- **C.** A team member has already created a trial account.
- **D.** The vendor’s marketing page describes strong security features.

**Option rationales:**
- **A:** This evidence is strongest because it independently verifies the relevant facts for security controls can fail when ownership and accountability are unclear and supports an auditable decision.
- **B:** This is a surface cue that can be copied, altered or misunderstood; it does not independently establish the relevant control.
- **C:** This information comes from the same source being assessed, so it cannot independently validate the claim.
- **D:** This does not provide an authoritative record of security controls can fail when ownership and accountability are unclear or verify the control that should govern the decision.

**Key takeaway:** Security governance depends on assigned ownership and recorded decisions, not informal adoption.  
**Recommended action:** Use documented approval, risk ownership and ongoing oversight for new services.  
**References:** [17], [18], [33]  
**Explanation ID:** `EXPL-LIB-SGV-02`  
**Video ID:** `VIDEO-LIB-SGV-02` (deferred for new questions)  

### LIB-SPG-02 — Security programme governance: evidence check

**Category:** Security programme governance  
**Learning objective:** Evaluate awareness programmes using meaningful measures and accountable improvement cycles.  
**Scenario:** During a review of a possible security programme governance issue, the initial report is not sufficient to authorize the next step. The owner must validate completion metrics alone can hide poor learning, ineffective controls or rising false positives using evidence that does not depend on the original unverified claim.  
**Question:** Which evidence provides the strongest basis for that decision?

- **A.** The total number of training slides delivered.
- **B.** A high completion percentage without outcome or reporting measures.
- **C.** A programme scorecard that combines completion, reporting quality, incident trends, false-positive measures, control coverage and action owners. (correct)
- **D.** A single quiz average treated as proof of real-world security competence.

**Option rationales:**
- **A:** This is a surface cue that can be copied, altered or misunderstood; it does not independently establish the relevant control.
- **B:** This information comes from the same source being assessed, so it cannot independently validate the claim.
- **C:** This evidence is strongest because it independently verifies the relevant facts for completion metrics alone can hide poor learning, ineffective controls or rising false positives and supports an auditable decision.
- **D:** This does not provide an authoritative record of completion metrics alone can hide poor learning, ineffective controls or rising false positives or verify the control that should govern the decision.

**Key takeaway:** A learning metric is not the same as demonstrated security behaviour or control effectiveness.  
**Recommended action:** Use multiple outcome and process measures, interpret them cautiously and improve the programme iteratively.  
**References:** [1], [17], [18]  
**Explanation ID:** `EXPL-LIB-SPG-02`  
**Video ID:** `VIDEO-LIB-SPG-02` (deferred for new questions)  

### LIB-SOC-01 — Social engineering: safest response

**Category:** Social engineering  
**Learning objective:** Resist manipulation by pausing, verifying authority and protecting sensitive information.  
**Scenario:** A caller claims to be a new senior manager and asks an employee to disclose a coworker’s schedule and internal contact details before an urgent meeting.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Accept the request as routine and complete it without a separate check.
- **B.** Do not disclose internal information; verify the caller’s identity and business need through an established directory or manager, then follow disclosure policy. (correct)
- **C.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **D.** Share the full details with a broad group so others can decide informally.

**Option rationales:**
- **A:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **B:** This directly addresses attackers exploit urgency, trust, authority and helpfulness to bypass normal controls. The proposed action uses approved, independently verifiable controls: Do not disclose internal information; verify the caller’s identity and business need through an established directory or manager, then follow disclosure policy.
- **C:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **D:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.

**Key takeaway:** Confidence, authority language and urgency are persuasion tactics, not identity proof.  
**Recommended action:** Pause, verify through known channels and disclose only information needed for an approved purpose.  
**References:** [3], [7], [25]  
**Explanation ID:** `EXPL-LIB-SOC-01`  
**Video ID:** `VIDEO-LIB-SOC-01` (deferred for new questions)  

### LIB-LNK-01 — Suspicious links: safest response

**Category:** Suspicious links  
**Learning objective:** Compare a link’s actual destination with the expected official domain before navigating.  
**Scenario:** A message displays “student portal” as the link text, but the browser preview shows a look-alike domain with an extra word.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Accept the request as routine and complete it without a separate check.
- **B.** Do not follow the link; open the portal from a saved bookmark or a known official address and report the message. (correct)
- **C.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **D.** Share the full details with a broad group so others can decide informally.

**Option rationales:**
- **A:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **B:** This directly addresses display text and shortened URLs can conceal the destination. The proposed action uses approved, independently verifiable controls: Do not follow the link; open the portal from a saved bookmark or a known official address and report the message.
- **C:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **D:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.

**Key takeaway:** The destination address matters more than the words displayed in a message.  
**Recommended action:** Navigate independently and report deceptive link destinations.  
**References:** [7], [25], [19]  
**Explanation ID:** `EXPL-LIB-LNK-01`  
**Video ID:** `VIDEO-LIB-LNK-01` (deferred for new questions)  

### LIB-TPR-02 — Third-party risk: evidence check

**Category:** Third-party risk  
**Learning objective:** Assess supplier security before onboarding and throughout the relationship.  
**Scenario:** During a review of a possible third-party risk issue, the initial report is not sufficient to authorize the next step. The owner must validate a supplier can introduce security exposure through access, software or data processing using evidence that does not depend on the original unverified claim.  
**Question:** Which evidence provides the strongest basis for that decision?

- **A.** A supplier assessment, data-processing terms, security requirements, remediation status and approved access plan. (correct)
- **B.** The supplier has a well-known logo on its website.
- **C.** The sales representative says other customers have approved it.
- **D.** The pilot uses only a small sample of customer records.

**Option rationales:**
- **A:** This evidence is strongest because it independently verifies the relevant facts for a supplier can introduce security exposure through access, software or data processing and supports an auditable decision.
- **B:** This is a surface cue that can be copied, altered or misunderstood; it does not independently establish the relevant control.
- **C:** This information comes from the same source being assessed, so it cannot independently validate the claim.
- **D:** This does not provide an authoritative record of a supplier can introduce security exposure through access, software or data processing or verify the control that should govern the decision.

**Key takeaway:** Supplier trust is a managed lifecycle decision, not a brand or sales claim.  
**Recommended action:** Perform proportionate due diligence, contract for required controls and monitor supplier risk over time.  
**References:** [37], [17], [33]  
**Explanation ID:** `EXPL-LIB-TPR-02`  
**Video ID:** `VIDEO-LIB-TPR-02` (deferred for new questions)  

## Advanced (36 questions)

### BEC-A01 — The executive payment exception

**Category:** Business email compromise  
**Learning objective:** Corroborate high-impact requests and payment or credential changes outside email  
**Scenario:** A senior executive emails finance from a plausible account and asks for an urgent confidential transfer to a new beneficiary. The message says normal approval can be bypassed because the deal is sensitive.  
**Question:** Which control response is strongest?

- **A.** Process it because the sender is senior and the request is confidential.
- **B.** Transfer a smaller amount first to test the beneficiary.
- **C.** Hold the transfer and verify through a pre-established independent channel and mandatory dual-authorization process. (correct)
- **D.** Reply to the email and request a voice confirmation.

**Option rationales:**
- **A:** Authority and secrecy are not substitutes for identity verification or delegated financial authorization.
- **B:** A smaller unverified transfer is still unauthorized and may confirm that the account is active.
- **C:** Correct. High-impact payment instructions require independent corroboration and policy-based approval, regardless of apparent seniority.
- **D:** A compromised mailbox can be controlled by the attacker, including replies in the same thread.

**Key takeaway:** For high-impact financial changes, verify identity and authorization outside the channel carrying the request.  
**Recommended action:** Pause payment, use contact details already held in trusted records, validate the beneficiary independently and retain the approval trail.  
**References:** [7], [17], [26]  
**Explanation ID:** `EXPL-BEC-A01`  
**Video ID:** `VIDEO-BEC-A01` (deferred for new questions)  

### DEEPFAKE-A02 — The executive voice instruction

**Category:** AI-enabled impersonation  
**Learning objective:** Use independent identity verification when voice or video may be synthetically generated  
**Scenario:** An audio message sounds like the CFO and requests an urgent transfer. The voice is convincing, but the request is unusual and asks you to bypass standard approvals.  
**Question:** What is the most defensible response?

- **A.** Ask a question about a public detail to test the caller.
- **B.** Forward the audio to colleagues and let them vote on whether it sounds real.
- **C.** Trust the voice because it resembles the CFO.
- **D.** Verify through a separate known channel and enforce normal payment approvals; treat the recording as untrusted evidence. (correct)

**Option rationales:**
- **A:** Public details may be available to an impersonator and provide weak authentication.
- **B:** Human familiarity is not reliable deepfake detection and crowdsourcing delays the control response.
- **C:** Voice similarity is not sufficient proof when synthetic impersonation is possible.
- **D:** Correct. Independent identity checks and process controls remain effective even when media appears convincing.

**Key takeaway:** Authentic-sounding audio or video is not a trusted authentication factor for a high-impact request.  
**Recommended action:** Use a known number or in-person confirmation, a pre-agreed verification phrase where appropriate, and standard dual controls; report the impersonation attempt.  
**References:** [15], [17], [29]  
**Explanation ID:** `EXPL-DEEPFAKE-A02`  
**Video ID:** `VIDEO-DEEPFAKE-A02` (deferred for new questions)  

### INSIDER-A03 — Unusual data exports

**Category:** Insider threat  
**Learning objective:** Distinguish observable policy-relevant indicators from unsupported assumptions about intent  
**Scenario:** A staff member with legitimate access downloads an unusually large volume of project files outside their normal work pattern. There is no evidence yet of data exfiltration or malicious intent.  
**Question:** What is the appropriate organizational response?

- **A.** Preserve relevant authorized telemetry and route the observable anomaly to the designated security/insider-risk process for proportionate review. (correct)
- **B.** Search the employee’s personal devices without authorization.
- **C.** Publicly accuse the employee of stealing data.
- **D.** Ignore it because the employee is authorized to access the files.

**Option rationales:**
- **A:** Correct. Focus on verifiable behavior, policy and authorized investigation, not unsupported personal assumptions.
- **B:** Unapproved surveillance or access can violate law, policy and privacy; follow authorized procedures.
- **C:** Anomalous activity is not proof of intent; public accusation can harm fairness and compromise an investigation.
- **D:** Authorized access can still be misused or become anomalous; the activity may warrant review.

**Key takeaway:** An indicator is a reason for proportionate review—not a diagnosis of motive or guilt.  
**Recommended action:** Preserve relevant logs according to policy, report through designated channels, limit information to need-to-know reviewers and involve HR/legal/privacy as required.  
**References:** [1], [17], [32], [36], [38]  
**Explanation ID:** `EXPL-INSIDER-A03`  
**Video ID:** `VIDEO-INSIDER-A03` (deferred for new questions)  

### CRED-COMP-A04 — The compromised privileged account

**Category:** Credential compromise  
**Learning objective:** Prioritize containment, credential revocation and trusted recovery after suspected compromise  
**Scenario:** A privileged administrator reports a suspicious login. Audit records show a new session and unfamiliar mailbox forwarding rule. The user’s password may be compromised.  
**Question:** Which response sequence is best?

- **A.** Delete all logs and forwarding rules before contacting security.
- **B.** Ask the administrator to change the password and continue normal work.
- **C.** Disable every employee account across the organization.
- **D.** Coordinate incident response: contain access, revoke affected sessions/tokens, secure credentials and recovery factors, preserve evidence, and investigate persistence. (correct)

**Option rationales:**
- **A:** Deleting evidence can obstruct investigation and may remove only visible indicators.
- **B:** Password change alone may leave active sessions, tokens, forwarding rules or attacker persistence in place.
- **C:** A broad disruptive response without scope assessment may cause unnecessary outage and is not proportionate.
- **D:** Correct. Account compromise requires coordinated containment and recovery, not only a password change.

**Key takeaway:** After suspected credential compromise, address sessions, tokens, recovery paths and persistence as well as the password.  
**Recommended action:** Activate the incident-response process, coordinate identity and system owners, contain the affected account, preserve evidence and verify recovery before restoring access.  
**References:** [16], [17], [28], [36]  
**Explanation ID:** `EXPL-CRED-COMP-A04`  
**Video ID:** `VIDEO-CRED-COMP-A04` (deferred for new questions)  

### IR-PRIORITY-A05 — Two competing incidents

**Category:** Incident response  
**Learning objective:** Prioritize incidents by impact, exposure, time sensitivity and containment needs  
**Scenario:** An organization has two alerts: (A) malware is actively encrypting files on a shared operational server; (B) a single employee received a suspicious email but did not open it. Both require triage.  
**Question:** Which prioritization is most defensible?

- **A.** Wait until both investigations are complete before taking action.
- **B.** Prioritize the email because phishing is the most common initial-access vector.
- **C.** Treat both as identical because each is a cybersecurity alert.
- **D.** Prioritize the active encryption event for immediate coordinated containment while ensuring the email is reported and triaged. (correct)

**Option rationales:**
- **A:** Delaying containment during active encryption may increase damage.
- **B:** General prevalence does not outweigh evidence of active encryption and immediate operational impact.
- **C:** Incidents differ in impact, scope, active harm and urgency; equal priority is not risk-based.
- **D:** Correct. Active disruption and potential spread represent immediate operational risk; the lower-impact email still needs handling.

**Key takeaway:** Prioritization considers current impact, scope, exposure, time sensitivity and containment opportunity.  
**Recommended action:** Activate the incident-response plan, coordinate containment of the actively affected system, assign triage to the email and document priority rationale.  
**References:** [17], [28], [35]  
**Explanation ID:** `EXPL-IR-PRIORITY-A05`  
**Video ID:** `VIDEO-IR-PRIORITY-A05` (deferred for new questions)  

### POLICY-A06 — The emergency MFA exception

**Category:** Security governance  
**Learning objective:** Apply policy exceptions through authorization, risk acceptance and documented controls  
**Scenario:** A product team requests a six-month MFA exception for a production administrator account to simplify deployment. No compensating controls or accountable risk owner are proposed.  
**Question:** What is the proper governance response?

- **A.** Approve it because project delivery is time-critical.
- **B.** Allow the team to use a shared administrator account instead.
- **C.** Require documented business justification, scoped duration, risk-owner approval, compensating controls, monitoring and an expiry/review date before any exception. (correct)
- **D.** Reject every exception without assessing context.

**Option rationales:**
- **A:** Schedule pressure alone does not justify accepting an undocumented security risk.
- **B:** Shared privileged accounts weaken accountability and do not solve the underlying control gap.
- **C:** Correct. A controlled exception process preserves accountability and makes residual risk explicit.
- **D:** Some exceptions may be justified, but they require formal risk assessment, approval and compensating controls.

**Key takeaway:** An exception is a governed risk decision, not an informal bypass.  
**Recommended action:** Use the organization’s exception workflow, define the account and period in scope, assess residual risk, assign an accountable approver and set a review/expiry date.  
**References:** [1], [17], [18], [19]  
**Explanation ID:** `EXPL-POLICY-A06`  
**Video ID:** `VIDEO-POLICY-A06` (deferred for new questions)  

### RISK-A07 — The risk register decision

**Category:** Risk management  
**Learning objective:** Evaluate likelihood, impact, existing controls and residual risk systematically  
**Scenario:** A risk register lists a low-likelihood event that could expose a large customer database. Existing controls are documented, but their current effectiveness has not been tested.  
**Question:** What is the most sound assessment approach?

- **A.** Mark the risk low because the event is unlikely.
- **B.** Assess likelihood and impact, validate existing control effectiveness, estimate residual risk and record assumptions and uncertainty. (correct)
- **C.** Mark the risk critical because all data incidents are critical.
- **D.** Remove it from the register because controls are documented.

**Option rationales:**
- **A:** Low likelihood alone ignores potentially severe impact and uncertainty about control effectiveness.
- **B:** Correct. Risk assessment should consider both likelihood and consequence, then evaluate how controls change residual exposure.
- **C:** Automatic maximum ratings do not provide a consistent or useful risk prioritization method.
- **D:** Documented controls are not necessarily effective; the risk remains until assessed and treated appropriately.

**Key takeaway:** Risk decisions require likelihood, impact, control evidence, residual risk and explicit assumptions.  
**Recommended action:** Validate control operation, document evidence and uncertainty, calculate or qualitatively rate residual risk, then assign treatment and ownership.  
**References:** [17], [36]  
**Explanation ID:** `EXPL-RISK-A07`  
**Video ID:** `VIDEO-RISK-A07` (deferred for new questions)  

### SUPPLIER-A08 — The vendor integration request

**Category:** Third-party risk  
**Learning objective:** Assess supplier access, assurance evidence and data-handling obligations  
**Scenario:** A supplier asks for broad administrator access to your cloud tenant to troubleshoot an integration. The contract does not clearly describe data processing, logging or access termination.  
**Question:** What should the organization require before granting access?

- **A.** Complete supplier/security review, define data and access scope, use named time-bound least-privilege accounts, log activity and document offboarding. (correct)
- **B.** Grant the requested access for convenience and review it later.
- **C.** Create a shared administrator password and send it over email.
- **D.** Ask the vendor to promise that it will not access unrelated data.

**Option rationales:**
- **A:** Correct. Supplier access should be constrained, attributable, monitored and governed by explicit contractual and technical controls.
- **B:** Broad access before due diligence expands exposure and can be difficult to unwind.
- **C:** Shared credentials reduce accountability and create an insecure secret-distribution path.
- **D:** A verbal promise without enforceable scope and technical controls is insufficient.

**Key takeaway:** Third-party trust must be supported by evidence, scoped access, monitoring and lifecycle controls.  
**Recommended action:** Delay access until procurement, security, privacy and system owners document the supplier’s need, safeguards, data terms, account scope and revocation plan.  
**References:** [17], [18], [19], [31], [33], [37]  
**Explanation ID:** `EXPL-SUPPLIER-A08`  
**Video ID:** `VIDEO-SUPPLIER-A08` (deferred for new questions)  

### PRIVACY-INC-A09 — The misdirected personal-data file

**Category:** Privacy incident response  
**Learning objective:** Limit exposure, preserve relevant facts and notify responsible privacy/security roles  
**Scenario:** A staff member emails a spreadsheet with personal identifiers to an external recipient with a similar name. The recipient has not yet confirmed deletion.  
**Question:** What is the best immediate response?

- **A.** Send a follow-up asking the recipient to delete it and close the matter.
- **B.** Notify the privacy/security incident channel promptly, preserve message details, request containment through approved procedures and let authorized roles assess notification obligations. (correct)
- **C.** Recall the email and delete the sent copy, then assume the risk is resolved.
- **D.** Send the file to a larger group so the error is transparent.

**Option rationales:**
- **A:** A deletion request may help but does not replace formal incident assessment, notification and evidence preservation.
- **B:** Correct. Prompt escalation allows the organization to assess exposure, legal/contractual duties and necessary containment.
- **C:** Recall may fail or the recipient may already have accessed or copied the file.
- **D:** Further disclosure increases exposure and is not an incident-response control.

**Key takeaway:** A misdirected data disclosure is an incident to assess even when accidental and even if recall is attempted.  
**Recommended action:** Report immediately, preserve relevant facts without unnecessary copying, request approved recipient-side containment and follow the privacy team’s incident process.  
**References:** [1], [17], [28], [36]  
**Explanation ID:** `EXPL-PRIVACY-INC-A09`  
**Video ID:** `VIDEO-PRIVACY-INC-A09` (deferred for new questions)  

### LOGS-A10 — The investigation log request

**Category:** Evidence and logging  
**Learning objective:** Use authorized logs and preserve relevant evidence without over-collecting personal data  
**Scenario:** During an investigation, a manager asks you to export all employee browsing history and personal messages, although the incident concerns access to one cloud folder.  
**Question:** What is the most defensible approach?

- **A.** Refuse to provide any logs under all circumstances.
- **B.** Modify timestamps to make the sequence easier to understand.
- **C.** Work with authorized investigators to identify relevant log sources, scope, retention and access controls; preserve integrity and document handling. (correct)
- **D.** Export everything because more data always helps an investigation.

**Option rationales:**
- **A:** Authorized, proportionate logs may be necessary for a legitimate investigation.
- **B:** Altering original evidence destroys integrity and undermines investigative reliability.
- **C:** Correct. Evidence collection should be authorized, relevant, minimized and handled with integrity.
- **D:** Over-collection creates privacy, security and proportionality risks and may exceed the investigation’s authorization.

**Key takeaway:** Collect the minimum authorized evidence needed, preserve integrity and record chain of handling.  
**Recommended action:** Confirm authority and scope, preserve source records, restrict access, record collection metadata and involve privacy/legal roles where required.  
**References:** [17], [18], [19], [36]  
**Explanation ID:** `EXPL-LOGS-A10`  
**Video ID:** `VIDEO-LOGS-A10` (deferred for new questions)  

### AI-CONTENT-A11 — The AI-generated incident advisory

**Category:** AI-enabled threats  
**Learning objective:** Review AI-generated security guidance for fabricated claims, bias and unsafe recommendations  
**Scenario:** An AI assistant produces an incident-response memo citing a non-existent CVE and recommending a command that would disable endpoint protection across all workstations.  
**Question:** What should the security lead do?

- **A.** Distribute it because the memo includes citations and technical language.
- **B.** Treat it as an unverified draft, validate every source and recommendation against authoritative advisories and approved procedures, and reject unsafe actions. (correct)
- **C.** Run the recommended command on a small sample of production devices.
- **D.** Ask the same AI model to confirm that its first answer was correct.

**Option rationales:**
- **A:** Citations and fluent technical prose do not establish factual accuracy or safety.
- **B:** Correct. AI output needs provenance, technical validation, and human approval before it informs operational response.
- **C:** Testing an unsafe command on production may still cause harm; validate in a controlled environment after expert review.
- **D:** Self-confirmation by the same model is not independent evidence and may reproduce the original error.

**Key takeaway:** Generative AI can produce plausible but false or unsafe security guidance; verify independently before action.  
**Recommended action:** Check identifiers in authoritative vulnerability databases and vendor advisories, test any safe proposed steps in a controlled environment, and require qualified human sign-off.  
**References:** [15], [17], [18]  
**Explanation ID:** `EXPL-AI-CONTENT-A11`  
**Video ID:** `VIDEO-AI-CONTENT-A11` (deferred for new questions)  

### RANSOM-A12 — The active ransomware event

**Category:** Ransomware response  
**Learning objective:** Prioritize isolation and incident escalation without destroying evidence or improvising recovery  
**Scenario:** A workstation displays a ransom note, and several shared files are becoming inaccessible. The user asks whether to reboot the machine and delete the note.  
**Question:** What should the incident coordinator prioritize?

- **A.** Isolate affected systems in a coordinated manner, activate the response plan and preserve evidence; follow recovery guidance from authorized responders. (correct)
- **B.** Connect an external backup drive to copy files from the affected workstation.
- **C.** Reboot all affected systems immediately.
- **D.** Delete the ransom note and pay from a personal account.

**Option rationales:**
- **A:** Correct. Containment is urgent, but should be coordinated; evidence and recovery decisions must be handled through incident response.
- **B:** Connecting removable media to a potentially infected machine may expose backups to compromise.
- **C:** Uncoordinated rebooting may destroy volatile evidence and does not reliably stop propagation.
- **D:** Deleting evidence is harmful, and payment is not a reliable recovery strategy or unilateral user decision.

**Key takeaway:** Contain ransomware safely and coordinate response; do not improvise recovery or destroy evidence.  
**Recommended action:** Activate the incident-response process, isolate affected systems as directed, protect clean backups, preserve evidence and involve system owners and authorities as appropriate.  
**References:** [17], [28], [35]  
**Explanation ID:** `EXPL-RANSOM-A12`  
**Video ID:** `VIDEO-RANSOM-A12` (deferred for new questions)  

### ACCESS-A13 — The over-privileged analyst

**Category:** Access governance  
**Learning objective:** Apply least privilege, segregation of duties and timely access review  
**Scenario:** A data analyst has permanent administrator access to payroll, identity management and production infrastructure, although their role only requires read-only access to one reporting dataset.  
**Question:** Which access-governance action is most appropriate?

- **A.** Replace the account with a shared team administrator account.
- **B.** Remove unnecessary privileges, grant a named read-only role for the required dataset and review access periodically. (correct)
- **C.** Keep the access because the analyst is trusted.
- **D.** Allow the analyst to retain admin access but ask them not to use it.

**Option rationales:**
- **A:** Shared privileged accounts reduce accountability and do not implement least privilege.
- **B:** Correct. Access should be limited to the minimum necessary resources and authorizations for assigned tasks.
- **C:** Trust does not replace role-based need, segregation of duties or periodic authorization review.
- **D:** Unused privilege remains available for accidental misuse or account compromise.

**Key takeaway:** Grant each identity only the access needed for its assigned function, and review it as roles change.  
**Recommended action:** Use named accounts and scoped roles, remove excess privileges, segregate incompatible duties and schedule access recertification.  
**References:** [17], [19], [31], [33], [36]  
**Explanation ID:** `EXPL-ACCESS-A13`  
**Video ID:** `VIDEO-ACCESS-A13` (deferred for new questions)  

### MFA-POLICY-A14 — Choosing authentication for high-risk administrators

**Category:** Authentication architecture  
**Learning objective:** Select phishing-resistant authentication for high-risk contexts and address fallback risks  
**Scenario:** An organization is redesigning authentication for privileged administrators. Options include password plus SMS OTP, push approval, or phishing-resistant public-key authentication, but legacy recovery remains weak.  
**Question:** Which design is strongest?

- **A.** Use push approval with unlimited prompts and no number/context matching.
- **B.** Use password plus SMS OTP for every administrator and leave recovery unchanged.
- **C.** Adopt phishing-resistant authentication such as FIDO/WebAuthn for privileged access and harden enrollment, recovery and fallback paths. (correct)
- **D.** Remove MFA and rely only on a longer password.

**Option rationales:**
- **A:** Unbounded prompts can enable fatigue attacks and do not provide strong phishing resistance.
- **B:** SMS OTP adds a factor but is not phishing-resistant and weak recovery can undermine the primary control.
- **C:** Correct. Strong primary authentication must be supported by secure lifecycle and recovery processes.
- **D:** A longer password alone does not provide the assurance or phishing resistance required for privileged access.

**Key takeaway:** Choose phishing-resistant authenticators for high-risk access and secure the entire account lifecycle, including recovery.  
**Recommended action:** Use standards-aligned phishing-resistant authenticators where feasible, tightly control fallback, bind credentials to legitimate verifiers and monitor recovery events.  
**References:** [16], [17]  
**Explanation ID:** `EXPL-MFA-POLICY-A14`  
**Video ID:** `VIDEO-MFA-POLICY-A14` (deferred for new questions)  

### BOARD-A15 — The board awareness report

**Category:** Security programme governance  
**Learning objective:** Translate security-awareness evidence into risk, outcome and investment decisions  
**Scenario:** A board dashboard reports only course completion and total quiz points. Leadership asks whether the programme has reduced risky behaviour and improved incident readiness.  
**Question:** Which additional evidence should be presented?

- **A.** A balanced measurement set: pre/post knowledge, delayed retention, novel-scenario decisions, reporting behaviour, qualitative feedback and incident context, with limitations. (correct)
- **B.** More course-completion percentages from the same learners.
- **C.** A statement that the programme prevents phishing because learners passed the quiz.
- **D.** A single top-performer leaderboard.

**Option rationales:**
- **A:** Correct. A defensible programme uses multiple measures and avoids claiming that quiz scores alone prove real-world competency.
- **B:** Completion is an activity measure and cannot by itself establish behaviour change or risk reduction.
- **C:** Passing a quiz does not demonstrate prevention of real attacks or causal impact on incident rates.
- **D:** A leaderboard may reflect participation or test-taking and does not show organizational risk outcomes.

**Key takeaway:** Measure knowledge, retention and observed decisions with context; do not equate completion or quiz scores with security outcomes.  
**Recommended action:** Report baseline and follow-up measures, delayed retention, scenario transfer, reporting quality and limitations. Use privacy-preserving aggregation and avoid unsupported causal claims.  
**References:** [1], [4], [5], [7], [17]  
**Explanation ID:** `EXPL-BOARD-A15`  
**Video ID:** `VIDEO-BOARD-A15` (deferred for new questions)  

### LIB-REC-02 — Account recovery: evidence check

**Category:** Account recovery  
**Learning objective:** Use an authenticated account-recovery process and review sessions after recovery.  
**Scenario:** During a review of a possible account recovery issue, the initial report is not sufficient to authorize the next step. The owner must validate an attacker may exploit weak recovery steps to take over an account using evidence that does not depend on the original unverified claim.  
**Question:** Which evidence provides the strongest basis for that decision?

- **A.** The account’s official recovery-event history, verified through the service’s authenticated support or security workflow. (correct)
- **B.** The sender’s display name matches the service name.
- **C.** A phone number included in the unexpected notice says the change is legitimate.
- **D.** The account still opens in one browser tab, so no action is needed.

**Option rationales:**
- **A:** This evidence is strongest because it independently verifies the relevant facts for an attacker may exploit weak recovery steps to take over an account and supports an auditable decision.
- **B:** This is a surface cue that can be copied, altered or misunderstood; it does not independently establish the relevant control.
- **C:** This information comes from the same source being assessed, so it cannot independently validate the claim.
- **D:** This does not provide an authoritative record of an attacker may exploit weak recovery steps to take over an account or verify the control that should govern the decision.

**Key takeaway:** Recovery events deserve independent verification and a session review.  
**Recommended action:** Use only the official recovery flow, revoke unfamiliar sessions and report unauthorized recovery changes.  
**References:** [16], [24]  
**Explanation ID:** `EXPL-LIB-REC-02`  
**Video ID:** `VIDEO-LIB-REC-02` (deferred for new questions)  

### LIB-ATO-02 — Account takeover: evidence check

**Category:** Account takeover  
**Learning objective:** Recognize account-takeover indicators and contain suspected unauthorized sessions.  
**Scenario:** During a review of a possible account takeover issue, the initial report is not sufficient to authorize the next step. The owner must validate an attacker may maintain access through stolen credentials or existing sessions using evidence that does not depend on the original unverified claim.  
**Question:** Which evidence provides the strongest basis for that decision?

- **A.** The display name in the notification looks familiar.
- **B.** A social-media post says the location is probably a mobile-network routing error.
- **C.** The identity provider’s sign-in and session records, including device, time, risk signals and session-revocation status. (correct)
- **D.** The user deletes the notification without checking account activity.

**Option rationales:**
- **A:** This is a surface cue that can be copied, altered or misunderstood; it does not independently establish the relevant control.
- **B:** This information comes from the same source being assessed, so it cannot independently validate the claim.
- **C:** This evidence is strongest because it independently verifies the relevant facts for an attacker may maintain access through stolen credentials or existing sessions and supports an auditable decision.
- **D:** This does not provide an authoritative record of an attacker may maintain access through stolen credentials or existing sessions or verify the control that should govern the decision.

**Key takeaway:** Unexpected sessions require account-level investigation, not just dismissal of one alert.  
**Recommended action:** Review sign-in history, revoke suspicious sessions, secure credentials and report possible compromise.  
**References:** [16], [25], [28]  
**Explanation ID:** `EXPL-LIB-ATO-02`  
**Video ID:** `VIDEO-LIB-ATO-02` (deferred for new questions)  

### LIB-AUTH-01 — Authentication: safest response

**Category:** Authentication  
**Learning objective:** Choose authentication methods that resist credential phishing and unsolicited approval prompts.  
**Scenario:** A service offers a passkey option, but a user is accustomed to approving ordinary push notifications and entering one-time codes into web pages.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Accept the request as routine and complete it without a separate check.
- **B.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **C.** Share the full details with a broad group so others can decide informally.
- **D.** Use the service’s supported phishing-resistant passkey or security key where available, and deny any unexpected authentication prompt. (correct)

**Option rationales:**
- **A:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **B:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **C:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.
- **D:** This directly addresses a password or one-time code can be captured and replayed by an attacker. The proposed action uses approved, independently verifiable controls: Use the service’s supported phishing-resistant passkey or security key where available, and deny any unexpected authentication prompt.

**Key takeaway:** Use phishing-resistant authentication where supported and never approve an unexpected prompt.  
**Recommended action:** Prefer passkeys or security keys, deny unexpected prompts and report repeated authentication requests.  
**References:** [16], [25]  
**Explanation ID:** `EXPL-LIB-AUTH-01`  
**Video ID:** `VIDEO-LIB-AUTH-01` (deferred for new questions)  

### LIB-BRS-02 — Browser security: evidence check

**Category:** Browser security  
**Learning objective:** Assess browser extensions by publisher, permissions and organizational approval.  
**Scenario:** During a review of a possible browser security issue, the initial report is not sufficient to authorize the next step. The owner must validate a malicious or over-privileged extension can read or alter browser data using evidence that does not depend on the original unverified claim.  
**Question:** Which evidence provides the strongest basis for that decision?

- **A.** The extension has many positive-looking ratings.
- **B.** The extension description says it improves productivity.
- **C.** A colleague installed it without noticing a problem.
- **D.** The managed browser’s extension inventory, publisher identity, permission scope and approval record. (correct)

**Option rationales:**
- **A:** This is a surface cue that can be copied, altered or misunderstood; it does not independently establish the relevant control.
- **B:** This information comes from the same source being assessed, so it cannot independently validate the claim.
- **C:** This does not provide an authoritative record of a malicious or over-privileged extension can read or alter browser data or verify the control that should govern the decision.
- **D:** This evidence is strongest because it independently verifies the relevant facts for a malicious or over-privileged extension can read or alter browser data and supports an auditable decision.

**Key takeaway:** Extension permissions and publisher provenance matter more than popularity or marketing claims.  
**Recommended action:** Install only approved extensions with permissions limited to a justified business need.  
**References:** [19], [25]  
**Explanation ID:** `EXPL-LIB-BRS-02`  
**Video ID:** `VIDEO-LIB-BRS-02` (deferred for new questions)  

### LIB-CLD-02 — Cloud security: evidence check

**Category:** Cloud security  
**Learning objective:** Reduce cloud exposure through least privilege, secure configuration and auditability.  
**Scenario:** During a review of a possible cloud security issue, the initial report is not sufficient to authorize the next step. The owner must validate misconfigured cloud permissions or public storage can expose sensitive data using evidence that does not depend on the original unverified claim.  
**Question:** Which evidence provides the strongest basis for that decision?

- **A.** The container name contains the word “private.”
- **B.** No one has reported downloading the files.
- **C.** Cloud configuration and access logs showing the resource policy, principal permissions, exposure window and remediation change. (correct)
- **D.** A teammate says the link is difficult to guess.

**Option rationales:**
- **A:** This is a surface cue that can be copied, altered or misunderstood; it does not independently establish the relevant control.
- **B:** This information comes from the same source being assessed, so it cannot independently validate the claim.
- **C:** This evidence is strongest because it independently verifies the relevant facts for misconfigured cloud permissions or public storage can expose sensitive data and supports an auditable decision.
- **D:** This does not provide an authoritative record of misconfigured cloud permissions or public storage can expose sensitive data or verify the control that should govern the decision.

**Key takeaway:** Obscure URLs and resource names do not replace explicit access controls.  
**Recommended action:** Apply least privilege, disable unintended public access and review cloud audit logs.  
**References:** [31], [33], [18]  
**Explanation ID:** `EXPL-LIB-CLD-02`  
**Video ID:** `VIDEO-LIB-CLD-02` (deferred for new questions)  

### LIB-DAT-02 — Data protection: evidence check

**Category:** Data protection  
**Learning objective:** Handle information according to classification, purpose and approved storage requirements.  
**Scenario:** During a review of a possible data protection issue, the initial report is not sufficient to authorize the next step. The owner must validate sensitive information can be exposed through unnecessary collection or unsafe sharing using evidence that does not depend on the original unverified claim.  
**Question:** Which evidence provides the strongest basis for that decision?

- **A.** The website says uploaded files are deleted after conversion.
- **B.** The spreadsheet is needed for a legitimate project.
- **C.** The data classification, approved-tool list, access policy and data-flow record for the intended processing. (correct)
- **D.** The team plans to remove the file from the website after a few minutes.

**Option rationales:**
- **A:** This is a surface cue that can be copied, altered or misunderstood; it does not independently establish the relevant control.
- **B:** This information comes from the same source being assessed, so it cannot independently validate the claim.
- **C:** This evidence is strongest because it independently verifies the relevant facts for sensitive information can be exposed through unnecessary collection or unsafe sharing and supports an auditable decision.
- **D:** This does not provide an authoritative record of sensitive information can be exposed through unnecessary collection or unsafe sharing or verify the control that should govern the decision.

**Key takeaway:** A legitimate purpose does not justify an unapproved processing or sharing channel.  
**Recommended action:** Minimize personal data and use approved services with appropriate access and retention controls.  
**References:** [33], [36], [20]  
**Explanation ID:** `EXPL-LIB-DAT-02`  
**Video ID:** `VIDEO-LIB-DAT-02` (deferred for new questions)  

### LIB-DEV-02 — Device security: evidence check

**Category:** Device security  
**Learning objective:** Keep endpoints updated through verified, supported vendor and organizational channels.  
**Scenario:** During a review of a possible device security issue, the initial report is not sufficient to authorize the next step. The owner must validate unpatched software can leave known vulnerabilities available to attackers using evidence that does not depend on the original unverified claim.  
**Question:** Which evidence provides the strongest basis for that decision?

- **A.** The endpoint management console or operating-system update history showing the approved update source, version and installation status. (correct)
- **B.** The pop-up uses the device manufacturer’s logo.
- **C.** The download page displays a recent publication date.
- **D.** A forum post says the update fixed a similar problem.

**Option rationales:**
- **A:** This evidence is strongest because it independently verifies the relevant facts for unpatched software can leave known vulnerabilities available to attackers and supports an auditable decision.
- **B:** This is a surface cue that can be copied, altered or misunderstood; it does not independently establish the relevant control.
- **C:** This information comes from the same source being assessed, so it cannot independently validate the claim.
- **D:** This does not provide an authoritative record of unpatched software can leave known vulnerabilities available to attackers or verify the control that should govern the decision.

**Key takeaway:** Install updates through trusted system or managed channels, not unexpected pop-ups.  
**Recommended action:** Keep supported devices patched through official update mechanisms and report suspicious update prompts.  
**References:** [34], [30], [18]  
**Explanation ID:** `EXPL-LIB-DEV-02`  
**Video ID:** `VIDEO-LIB-DEV-02` (deferred for new questions)  

### LIB-IRP-02 — Incident reporting: evidence check

**Category:** Incident reporting  
**Learning objective:** Report suspicious activity through the organization’s approved channel with useful context.  
**Scenario:** During a review of a possible incident reporting issue, the initial report is not sufficient to authorize the next step. The owner must validate unreported suspicious messages and events can prevent timely detection of wider activity using evidence that does not depend on the original unverified claim.  
**Question:** Which evidence provides the strongest basis for that decision?

- **A.** The official reporting ticket or security mailbox record with receipt time and preserved message metadata. (correct)
- **B.** Reply to the sender asking whether the request is genuine.
- **C.** Post the message in a large public group for quick opinions.
- **D.** Delete the message because no link was clicked.

**Option rationales:**
- **A:** This evidence is strongest because it independently verifies the relevant facts for unreported suspicious messages and events can prevent timely detection of wider activity and supports an auditable decision.
- **B:** This is a surface cue that can be copied, altered or misunderstood; it does not independently establish the relevant control.
- **C:** This information comes from the same source being assessed, so it cannot independently validate the claim.
- **D:** This does not provide an authoritative record of unreported suspicious messages and events can prevent timely detection of wider activity or verify the control that should govern the decision.

**Key takeaway:** Prompt, structured reporting helps responders correlate related events.  
**Recommended action:** Report through the approved channel and retain the original message as instructed by the security team.  
**References:** [1], [7], [25]  
**Explanation ID:** `EXPL-LIB-IRP-02`  
**Video ID:** `VIDEO-LIB-IRP-02` (deferred for new questions)  

### LIB-ATT-01 — Malicious attachments: safest response

**Category:** Malicious attachments  
**Learning objective:** Handle unexpected attachments safely without enabling active content or bypassing inspection.  
**Scenario:** An unexpected invoice arrives as an office document and displays a banner asking the recipient to enable macros to view the contents.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Do not enable macros or open the file outside approved handling; report it and let the security team inspect it with approved tools. (correct)
- **B.** Accept the request as routine and complete it without a separate check.
- **C.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **D.** Share the full details with a broad group so others can decide informally.

**Option rationales:**
- **A:** This directly addresses an attachment can execute malicious code or deliver a payload. The proposed action uses approved, independently verifiable controls: Do not enable macros or open the file outside approved handling; report it and let the security team inspect it with approved tools.
- **B:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **C:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **D:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.

**Key takeaway:** Do not enable active content because an attachment asks you to.  
**Recommended action:** Report unexpected attachments and use approved security inspection workflows.  
**References:** [25], [19], [28]  
**Explanation ID:** `EXPL-LIB-ATT-01`  
**Video ID:** `VIDEO-LIB-ATT-01` (deferred for new questions)  

### LIB-MOB-02 — Mobile application security: evidence check

**Category:** Mobile application security  
**Learning objective:** Install mobile applications from trusted distribution channels and review their permissions.  
**Scenario:** During a review of a possible mobile application security issue, the initial report is not sufficient to authorize the next step. The owner must validate untrusted apps can harvest data or abuse excessive device permissions using evidence that does not depend on the original unverified claim.  
**Question:** Which evidence provides the strongest basis for that decision?

- **A.** The download page uses the app’s brand colors.
- **B.** The QR code is printed on an official-looking poster.
- **C.** The official store listing, verified publisher identity, app signing/distribution information and permission set. (correct)
- **D.** The app requests broad permissions but says they improve convenience.

**Option rationales:**
- **A:** This is a surface cue that can be copied, altered or misunderstood; it does not independently establish the relevant control.
- **B:** This information comes from the same source being assessed, so it cannot independently validate the claim.
- **C:** This evidence is strongest because it independently verifies the relevant facts for untrusted apps can harvest data or abuse excessive device permissions and supports an auditable decision.
- **D:** This does not provide an authoritative record of untrusted apps can harvest data or abuse excessive device permissions or verify the control that should govern the decision.

**Key takeaway:** A QR destination does not establish app authenticity; verify publisher and permissions independently.  
**Recommended action:** Use official distribution channels and install only applications with justified permissions.  
**References:** [16], [19], [27]  
**Explanation ID:** `EXPL-LIB-MOB-02`  
**Video ID:** `VIDEO-LIB-MOB-02` (deferred for new questions)  

### LIB-NET-02 — Network security: evidence check

**Category:** Network security  
**Learning objective:** Select trusted network connections and protect traffic when using public or unfamiliar networks.  
**Scenario:** During a review of a possible network security issue, the initial report is not sufficient to authorize the next step. The owner must validate rogue or poorly secured networks can expose traffic and enable interception using evidence that does not depend on the original unverified claim.  
**Question:** Which evidence provides the strongest basis for that decision?

- **A.** The organization’s approved network profile and verified SSID/security configuration from an authorized source. (correct)
- **B.** The network name includes the airport brand.
- **C.** The signal is stronger than the other network.
- **D.** The captive portal displays a padlock icon in its page design.

**Option rationales:**
- **A:** This evidence is strongest because it independently verifies the relevant facts for rogue or poorly secured networks can expose traffic and enable interception and supports an auditable decision.
- **B:** This is a surface cue that can be copied, altered or misunderstood; it does not independently establish the relevant control.
- **C:** This information comes from the same source being assessed, so it cannot independently validate the claim.
- **D:** This does not provide an authoritative record of rogue or poorly secured networks can expose traffic and enable interception or verify the control that should govern the decision.

**Key takeaway:** Network names and signal strength do not authenticate a hotspot.  
**Recommended action:** Use verified networks, approved VPN access where required and disable automatic connection to unknown hotspots.  
**References:** [30], [31], [19]  
**Explanation ID:** `EXPL-LIB-NET-02`  
**Video ID:** `VIDEO-LIB-NET-02` (deferred for new questions)  

### LIB-PRI-02 — Privacy: evidence check

**Category:** Privacy  
**Learning objective:** Apply data minimization and need-to-know access when handling personal information.  
**Scenario:** During a review of a possible privacy issue, the initial report is not sufficient to authorize the next step. The owner must validate collecting or sharing more personal data than necessary increases privacy exposure using evidence that does not depend on the original unverified claim.  
**Question:** Which evidence provides the strongest basis for that decision?

- **A.** The documented processing purpose, data inventory, field justification, access list and retention schedule. (correct)
- **B.** The form is hosted by a well-known cloud provider.
- **C.** The organizer says the extra fields may be useful later.
- **D.** The information is requested from all attendees rather than a selected group.

**Option rationales:**
- **A:** This evidence is strongest because it independently verifies the relevant facts for collecting or sharing more personal data than necessary increases privacy exposure and supports an auditable decision.
- **B:** This is a surface cue that can be copied, altered or misunderstood; it does not independently establish the relevant control.
- **C:** This information comes from the same source being assessed, so it cannot independently validate the claim.
- **D:** This does not provide an authoritative record of collecting or sharing more personal data than necessary increases privacy exposure or verify the control that should govern the decision.

**Key takeaway:** A legitimate event does not justify collecting unnecessary personal information.  
**Recommended action:** Minimize collection, limit access and retain personal data only for an approved period.  
**References:** [36], [33], [20]  
**Explanation ID:** `EXPL-LIB-PRI-02`  
**Video ID:** `VIDEO-LIB-PRI-02` (deferred for new questions)  

### LIB-QPH-02 — QR-code phishing: evidence check

**Category:** QR-code phishing  
**Learning objective:** Treat QR destinations as links that must be independently checked before credentials or payment data are entered.  
**Scenario:** During a review of a possible qr-code phishing issue, the initial report is not sufficient to authorize the next step. The owner must validate a QR code can conceal a substituted or malicious destination using evidence that does not depend on the original unverified claim.  
**Question:** Which evidence provides the strongest basis for that decision?

- **A.** The resolved destination domain checked against the official service address obtained independently of the QR code. (correct)
- **B.** The QR code is printed clearly and scans without an error.
- **C.** The landing page repeats the company name and logo.
- **D.** The code is placed beside an official-looking payment notice.

**Option rationales:**
- **A:** This evidence is strongest because it independently verifies the relevant facts for a QR code can conceal a substituted or malicious destination and supports an auditable decision.
- **B:** This is a surface cue that can be copied, altered or misunderstood; it does not independently establish the relevant control.
- **C:** This information comes from the same source being assessed, so it cannot independently validate the claim.
- **D:** This does not provide an authoritative record of a QR code can conceal a substituted or malicious destination or verify the control that should govern the decision.

**Key takeaway:** Scanning a QR code does not make its destination trustworthy.  
**Recommended action:** Inspect the destination, navigate independently and avoid entering secrets into unexpected QR-linked pages.  
**References:** [27], [25]  
**Explanation ID:** `EXPL-LIB-QPH-02`  
**Video ID:** `VIDEO-LIB-QPH-02` (deferred for new questions)  

### LIB-QRS-02 — QR-code safety: evidence check

**Category:** QR-code safety  
**Learning objective:** Check for QR-code tampering and verify the associated service before scanning.  
**Scenario:** During a review of a possible qr-code safety issue, the initial report is not sufficient to authorize the next step. The owner must validate a malicious sticker or replacement code can redirect a legitimate physical sign using evidence that does not depend on the original unverified claim.  
**Question:** Which evidence provides the strongest basis for that decision?

- **A.** The sticker is neatly aligned and looks professionally printed.
- **B.** The code is positioned on a campus noticeboard.
- **C.** A verified destination published by the campus through its official website or a known staff contact. (correct)
- **D.** Other students say they scanned it without an obvious issue.

**Option rationales:**
- **A:** This is a surface cue that can be copied, altered or misunderstood; it does not independently establish the relevant control.
- **B:** This information comes from the same source being assessed, so it cannot independently validate the claim.
- **C:** This evidence is strongest because it independently verifies the relevant facts for a malicious sticker or replacement code can redirect a legitimate physical sign and supports an auditable decision.
- **D:** This does not provide an authoritative record of a malicious sticker or replacement code can redirect a legitimate physical sign or verify the control that should govern the decision.

**Key takeaway:** Physical placement does not authenticate a QR code; check for tampering and verify the destination.  
**Recommended action:** Avoid altered codes and locate the service through a trusted official channel.  
**References:** [27], [25]  
**Explanation ID:** `EXPL-LIB-QRS-02`  
**Video ID:** `VIDEO-LIB-QRS-02` (deferred for new questions)  

### LIB-REM-02 — Remote-work security: evidence check

**Category:** Remote-work security  
**Learning objective:** Protect remote-work sessions, devices and information outside managed premises.  
**Scenario:** During a review of a possible remote-work security issue, the initial report is not sufficient to authorize the next step. The owner must validate remote work can expose systems through unmanaged networks, unlocked devices or unsafe sharing using evidence that does not depend on the original unverified claim.  
**Question:** Which evidence provides the strongest basis for that decision?

- **A.** The employee is away for only a few minutes.
- **B.** The laptop is on a table where colleagues can see it.
- **C.** Endpoint compliance status, screen-lock configuration, device encryption and approved remote-access logs. (correct)
- **D.** The user hides the browser window but leaves the session active.

**Option rationales:**
- **A:** This is a surface cue that can be copied, altered or misunderstood; it does not independently establish the relevant control.
- **B:** This information comes from the same source being assessed, so it cannot independently validate the claim.
- **C:** This evidence is strongest because it independently verifies the relevant facts for remote work can expose systems through unmanaged networks, unlocked devices or unsafe sharing and supports an auditable decision.
- **D:** This does not provide an authoritative record of remote work can expose systems through unmanaged networks, unlocked devices or unsafe sharing or verify the control that should govern the decision.

**Key takeaway:** A short absence does not remove the risk of an unattended authenticated session.  
**Recommended action:** Lock devices, secure them physically and use managed remote-access controls.  
**References:** [30], [31], [33]  
**Explanation ID:** `EXPL-LIB-REM-02`  
**Video ID:** `VIDEO-LIB-REM-02` (deferred for new questions)  

### LIB-SFB-02 — Safe browsing: evidence check

**Category:** Safe browsing  
**Learning objective:** Navigate to trusted services independently and keep browser protections current.  
**Scenario:** During a review of a possible safe browsing issue, the initial report is not sufficient to authorize the next step. The owner must validate deceptive pages and unsafe downloads can exploit trust in visible page design using evidence that does not depend on the original unverified claim.  
**Question:** Which evidence provides the strongest basis for that decision?

- **A.** The search result is at the top of the page.
- **B.** The download page has a polished design and user testimonials.
- **C.** The official vendor domain, signed release or approved software catalogue entry and its published version details. (correct)
- **D.** The installer file name includes the vendor’s name.

**Option rationales:**
- **A:** This is a surface cue that can be copied, altered or misunderstood; it does not independently establish the relevant control.
- **B:** This information comes from the same source being assessed, so it cannot independently validate the claim.
- **C:** This evidence is strongest because it independently verifies the relevant facts for deceptive pages and unsafe downloads can exploit trust in visible page design and supports an auditable decision.
- **D:** This does not provide an authoritative record of deceptive pages and unsafe downloads can exploit trust in visible page design or verify the control that should govern the decision.

**Key takeaway:** Search ranking and visual appearance do not establish download authenticity.  
**Recommended action:** Use known vendor sites, managed software catalogues and current browser protections.  
**References:** [25], [19], [20]  
**Explanation ID:** `EXPL-LIB-SFB-02`  
**Video ID:** `VIDEO-LIB-SFB-02` (deferred for new questions)  

### LIB-SMI-02 — Smishing: evidence check

**Category:** Smishing  
**Learning objective:** Recognize SMS-based impersonation and verify unexpected requests independently.  
**Scenario:** During a review of a possible smishing issue, the initial report is not sufficient to authorize the next step. The owner must validate text messages can use urgency and shortened links to solicit credentials or payments using evidence that does not depend on the original unverified claim.  
**Question:** Which evidence provides the strongest basis for that decision?

- **A.** The delivery status inside the official carrier account accessed independently of the SMS. (correct)
- **B.** The text includes the recipient’s first name.
- **C.** The link is shortened to fit the SMS.
- **D.** The sender name resembles the carrier brand.

**Option rationales:**
- **A:** This evidence is strongest because it independently verifies the relevant facts for text messages can use urgency and shortened links to solicit credentials or payments and supports an auditable decision.
- **B:** This is a surface cue that can be copied, altered or misunderstood; it does not independently establish the relevant control.
- **C:** This information comes from the same source being assessed, so it cannot independently validate the claim.
- **D:** This does not provide an authoritative record of text messages can use urgency and shortened links to solicit credentials or payments or verify the control that should govern the decision.

**Key takeaway:** Unexpected SMS links should not be trusted based on personalization or sender labels.  
**Recommended action:** Verify deliveries through a known carrier channel and report suspicious texts.  
**References:** [25], [24]  
**Explanation ID:** `EXPL-LIB-SMI-02`  
**Video ID:** `VIDEO-LIB-SMI-02` (deferred for new questions)  

### LIB-SOC-02 — Social engineering: evidence check

**Category:** Social engineering  
**Learning objective:** Resist manipulation by pausing, verifying authority and protecting sensitive information.  
**Scenario:** During a review of a possible social engineering issue, the initial report is not sufficient to authorize the next step. The owner must validate attackers exploit urgency, trust, authority and helpfulness to bypass normal controls using evidence that does not depend on the original unverified claim.  
**Question:** Which evidence provides the strongest basis for that decision?

- **A.** The caller speaks confidently and uses internal terminology.
- **B.** The caller knows the department name.
- **C.** An independently verified identity and an approved business-purpose record for the requested information. (correct)
- **D.** The caller says that asking questions would delay an urgent task.

**Option rationales:**
- **A:** This is a surface cue that can be copied, altered or misunderstood; it does not independently establish the relevant control.
- **B:** This information comes from the same source being assessed, so it cannot independently validate the claim.
- **C:** This evidence is strongest because it independently verifies the relevant facts for attackers exploit urgency, trust, authority and helpfulness to bypass normal controls and supports an auditable decision.
- **D:** This does not provide an authoritative record of attackers exploit urgency, trust, authority and helpfulness to bypass normal controls or verify the control that should govern the decision.

**Key takeaway:** Confidence, authority language and urgency are persuasion tactics, not identity proof.  
**Recommended action:** Pause, verify through known channels and disclose only information needed for an approved purpose.  
**References:** [3], [7], [25]  
**Explanation ID:** `EXPL-LIB-SOC-02`  
**Video ID:** `VIDEO-LIB-SOC-02` (deferred for new questions)  

### LIB-SPR-02 — Spear phishing: evidence check

**Category:** Spear phishing  
**Learning objective:** Evaluate targeted messages using request context, sender identity and independent verification.  
**Scenario:** During a review of a possible spear phishing issue, the initial report is not sufficient to authorize the next step. The owner must validate targeted messages can use accurate personal or organizational details to appear legitimate using evidence that does not depend on the original unverified claim.  
**Question:** Which evidence provides the strongest basis for that decision?

- **A.** The request and file permissions recorded in the organization’s approved collaboration platform, confirmed through a known project owner. (correct)
- **B.** The message correctly names the project and internal deadline.
- **C.** The sender uses the manager’s usual signature format.
- **D.** The link preview displays the project name.

**Option rationales:**
- **A:** This evidence is strongest because it independently verifies the relevant facts for targeted messages can use accurate personal or organizational details to appear legitimate and supports an auditable decision.
- **B:** This is a surface cue that can be copied, altered or misunderstood; it does not independently establish the relevant control.
- **C:** This information comes from the same source being assessed, so it cannot independently validate the claim.
- **D:** This does not provide an authoritative record of targeted messages can use accurate personal or organizational details to appear legitimate or verify the control that should govern the decision.

**Key takeaway:** Accurate context can be gathered or copied; verify unusual actions independently.  
**Recommended action:** Use known collaboration channels and report targeted messages that request unusual access or disclosure.  
**References:** [25], [26], [7]  
**Explanation ID:** `EXPL-LIB-SPR-02`  
**Video ID:** `VIDEO-LIB-SPR-02` (deferred for new questions)  

### LIB-LNK-02 — Suspicious links: evidence check

**Category:** Suspicious links  
**Learning objective:** Compare a link’s actual destination with the expected official domain before navigating.  
**Scenario:** During a review of a possible suspicious links issue, the initial report is not sufficient to authorize the next step. The owner must validate display text and shortened URLs can conceal the destination using evidence that does not depend on the original unverified claim.  
**Question:** Which evidence provides the strongest basis for that decision?

- **A.** The link text says “student portal.”
- **B.** The page preview includes the official portal logo.
- **C.** The fully resolved destination domain compared with the service’s official domain obtained independently. (correct)
- **D.** A colleague has forwarded the same link.

**Option rationales:**
- **A:** This is a surface cue that can be copied, altered or misunderstood; it does not independently establish the relevant control.
- **B:** This information comes from the same source being assessed, so it cannot independently validate the claim.
- **C:** This evidence is strongest because it independently verifies the relevant facts for display text and shortened URLs can conceal the destination and supports an auditable decision.
- **D:** This does not provide an authoritative record of display text and shortened URLs can conceal the destination or verify the control that should govern the decision.

**Key takeaway:** The destination address matters more than the words displayed in a message.  
**Recommended action:** Navigate independently and report deceptive link destinations.  
**References:** [7], [25], [19]  
**Explanation ID:** `EXPL-LIB-LNK-02`  
**Video ID:** `VIDEO-LIB-LNK-02` (deferred for new questions)  

### LIB-VIS-02 — Vishing: evidence check

**Category:** Vishing  
**Learning objective:** Respond safely to voice-based impersonation and requests for authentication secrets.  
**Scenario:** During a review of a possible vishing issue, the initial report is not sufficient to authorize the next step. The owner must validate callers can impersonate support or authority figures to solicit codes or actions using evidence that does not depend on the original unverified claim.  
**Question:** Which evidence provides the strongest basis for that decision?

- **A.** The caller knows the student’s name and department.
- **B.** The incoming number displays the university name.
- **C.** A callback to the helpdesk number independently obtained from the official directory and a matching support-ticket record. (correct)
- **D.** The caller says the code will expire in one minute.

**Option rationales:**
- **A:** This is a surface cue that can be copied, altered or misunderstood; it does not independently establish the relevant control.
- **B:** This information comes from the same source being assessed, so it cannot independently validate the claim.
- **C:** This evidence is strongest because it independently verifies the relevant facts for callers can impersonate support or authority figures to solicit codes or actions and supports an auditable decision.
- **D:** This does not provide an authoritative record of callers can impersonate support or authority figures to solicit codes or actions or verify the control that should govern the decision.

**Key takeaway:** Caller ID, personal details and urgency do not authenticate a caller.  
**Recommended action:** Hang up, call a known official number and report attempts to solicit codes.  
**References:** [25], [24], [16]  
**Explanation ID:** `EXPL-LIB-VIS-02`  
**Video ID:** `VIDEO-LIB-VIS-02` (deferred for new questions)  

## Expert Challenge (18 questions)

### IR-E01 — Containment Under Uncertainty

**Category:** Incident response governance  
**Learning objective:** Prioritize coordinated containment, evidence preservation and decision ownership during an active multi-system incident.  
**Scenario:** At 09:10, the security operations centre receives three correlated alerts: an endpoint has begun encrypting files, a service account has authenticated from an unusual location, and outbound traffic from a file server has increased sharply. The incident commander has not yet confirmed the initial access path. A business unit asks to power off every server immediately.  
**Question:** What is the strongest first coordinated decision for the incident commander?

- **A.** Declare a major incident, activate the response plan, isolate confirmed affected systems using approved procedures, preserve relevant telemetry, and scope related accounts and hosts before broader disruptive action. (correct)
- **B.** Power off every server and workstation immediately, then begin evidence collection after systems restart.
- **C.** Wait until the initial access path is proven before changing any network or account state.
- **D.** Ask the affected business unit to negotiate directly with the suspected attacker while IT investigates.

**Option rationales:**
- **A:** Correct. Coordinated activation, proportionate containment, evidence preservation and scoping support an informed response while limiting unnecessary operational disruption.
- **B:** A blanket shutdown can destroy volatile evidence and disrupt unaffected services. Review the evidence, use approved organizational controls and avoid treating an alert or familiar message as proof.
- **C:** Waiting for attribution can allow active damage to continue. Review the evidence, use approved organizational controls and avoid treating an alert or familiar message as proof.
- **D:** Direct uncoordinated contact bypasses the authorized response structure. Review the evidence, use approved organizational controls and avoid treating an alert or familiar message as proof.

**Key takeaway:** Act on credible indicators through the incident plan; do not wait for perfect attribution or take uncontrolled disruptive action.  
**Recommended action:** Activate the approved incident-response process, appoint a decision owner, preserve logs and volatile evidence where feasible, isolate confirmed affected assets, scope identity and network activity, and record decisions and uncertainties.  
**References:** [17], [28]  
**Explanation ID:** `EXPL-IR-E01`  
**Video ID:** `VIDEO-IR-E01` (deferred for new questions)  

### SUP-E02 — The Critical Supplier Component

**Category:** Supply-chain risk governance  
**Learning objective:** Prioritize a supplier vulnerability using exposure, exploitability, criticality, provenance and compensating controls.  
**Scenario:** A supplier notifies the organization that a widely used authentication component has a critical vulnerability. The component appears in the software bill of materials for six services. Two services are internet-facing; one supports payroll. There is no confirmed exploitation in your environment, and the vendor has published a mitigation plus a target patch date.  
**Question:** Which response best balances urgency, evidence and business continuity?

- **A.** Immediately disable all six services, regardless of exposure or business impact, and defer risk review.
- **B.** Record the notification as informational until the vendor confirms exploitation against your organization.
- **C.** Use the SBOM and asset inventory to identify deployed versions and reachable exposure, prioritize critical services, apply the vendor mitigation or approved compensating controls, test and deploy the patch through change control, and track residual risk. (correct)
- **D.** Ask each service owner to independently decide whether the component matters, without central coordination or an owner for remediation.

**Option rationales:**
- **A:** Disabling every service without triage can cause avoidable business harm. Review the evidence, use approved organizational controls and avoid treating an alert or familiar message as proof.
- **B:** Waiting for confirmed compromise delays preventive risk treatment. Review the evidence, use approved organizational controls and avoid treating an alert or familiar message as proof.
- **C:** Correct. Component inventory, exposure and criticality support defensible prioritization; mitigation, controlled patching and residual-risk tracking maintain accountability.
- **D:** Uncoordinated service-owner decisions can create remediation gaps. Review the evidence, use approved organizational controls and avoid treating an alert or familiar message as proof.

**Key takeaway:** A component inventory becomes actionable when it is connected to deployed assets, exposure, criticality and accountable remediation.  
**Recommended action:** Correlate SBOM entries with asset and service inventories; validate affected versions; rank by exposure and business criticality; apply vendor guidance; test patches; coordinate change windows; document residual risk and supplier follow-up.  
**References:** [17], [18], [37]  
**Explanation ID:** `EXPL-SUP-E02`  
**Video ID:** `VIDEO-SUP-E02` (deferred for new questions)  

### INS-E03 — An Insider-Risk Signal

**Category:** Insider risk and governance  
**Learning objective:** Respond to potential insider-risk indicators using objective evidence, privacy safeguards, least privilege and authorized processes.  
**Scenario:** A manager reports that an employee has downloaded an unusually large number of project files shortly before transferring teams. The employee’s role includes legitimate access to many of those files. A second alert shows that a removable device was connected, but the device contents are not yet known.  
**Question:** What is the most defensible organizational response?

- **A.** Publicly accuse the employee and ask colleagues to search their personal accounts for evidence.
- **B.** Treat the alerts as a confirmed malicious insider incident and terminate access permanently without review.
- **C.** Ignore the alerts because the employee’s role permits access to the files.
- **D.** Preserve relevant audit records, validate the activity against role and business context, involve the authorized security, HR, privacy and legal stakeholders under policy, and apply proportionate, approved access controls while the facts are assessed. (correct)

**Option rationales:**
- **A:** Public accusation and informal searches can violate privacy and compromise evidence. Review the evidence, use approved organizational controls and avoid treating an alert or familiar message as proof.
- **B:** Alerts alone do not establish malicious intent. Review the evidence, use approved organizational controls and avoid treating an alert or familiar message as proof.
- **C:** Authorized access does not make anomalous activity automatically benign. Review the evidence, use approved organizational controls and avoid treating an alert or familiar message as proof.
- **D:** Correct. Objective validation, evidence preservation, multidisciplinary oversight and proportionate controls protect both the organization and individual rights.

**Key takeaway:** Insider-risk indicators require evidence-led assessment, not assumptions about intent or identity.  
**Recommended action:** Preserve relevant logs, validate activity against job duties and approved work, restrict access only when authorized and proportionate, and coordinate with designated security, HR, privacy and legal functions.  
**References:** [32], [33], [38]  
**Explanation ID:** `EXPL-INS-E03`  
**Video ID:** `VIDEO-INS-E03` (deferred for new questions)  

### BEC-E04 — The Executive Payment Change

**Category:** Business email compromise and financial controls  
**Learning objective:** Interrupt payment diversion using independent verification, separation of duties and timely financial institution notification.  
**Scenario:** Finance receives an email in an existing supplier thread requesting that a large invoice be paid to a new bank account. The message appears to come from the supplier’s known address. The CFO separately messages the finance lead asking for the payment to be expedited and says the supplier is waiting.  
**Question:** What is the correct control response before any payment is released?

- **A.** Reply to the email thread asking the sender to confirm the new account number.
- **B.** Pause the payment and verify the change through a previously established, independently sourced supplier contact; require the organization’s documented dual-approval process and report the suspicious request through security and finance channels. (correct)
- **C.** Release a small test payment to the new account, then wait for the supplier to confirm receipt.
- **D.** Accept the change because the email is part of a legitimate historical supplier thread and the CFO requested urgency.

**Option rationales:**
- **A:** A compromised mailbox can control replies in the same email thread. Review the evidence, use approved organizational controls and avoid treating an alert or familiar message as proof.
- **B:** Correct. A trusted out-of-band verification path and separation of duties reduce the risk of payment diversion and create an auditable approval trail.
- **C:** A test transfer can still be lost without authenticating the new account. Review the evidence, use approved organizational controls and avoid treating an alert or familiar message as proof.
- **D:** A familiar thread and executive urgency do not authenticate changed bank details. Review the evidence, use approved organizational controls and avoid treating an alert or familiar message as proof.

**Key takeaway:** A payment-detail change is a high-risk request even when it arrives inside a familiar email conversation.  
**Recommended action:** Place the payment on hold, call a previously verified supplier contact using a trusted directory or existing contract record, follow dual authorization, retain evidence and notify the organization’s security/finance process. If money has already moved, contact the bank immediately and report through the appropriate channels.  
**References:** [17], [26]  
**Explanation ID:** `EXPL-BEC-E04`  
**Video ID:** `VIDEO-BEC-E04` (deferred for new questions)  

### GOV-E05 — The Board Risk Briefing

**Category:** Governance and risk communication  
**Learning objective:** Communicate incident facts, uncertainty, business impact and decisions to leadership without overstating attribution or assurance.  
**Scenario:** A board meeting is scheduled two hours after a suspected compromise of a customer-facing platform. The response team has isolated two hosts, but the scope of data access is still under investigation. The board chair asks for a definitive statement that no customer data was accessed and wants an exact recovery time.  
**Question:** What should the incident lead present?

- **A.** State that no data was accessed because no exfiltration has been confirmed, and promise the service will be restored within two hours.
- **B.** Avoid briefing the board until forensic analysis has established the attacker’s identity and complete timeline.
- **C.** Provide verified facts, known business impacts, containment already taken, current unknowns and confidence levels; explain next decision points, accountable owners, communication/legal review paths and a time for the next update rather than making unsupported assurances. (correct)
- **D.** Share raw security logs and speculate about the likely attacker to demonstrate technical transparency.

**Option rationales:**
- **A:** No confirmed exfiltration does not prove that data was not accessed. Review the evidence, use approved organizational controls and avoid treating an alert or familiar message as proof.
- **B:** Leadership needs timely decision-ready information before attribution is complete. Review the evidence, use approved organizational controls and avoid treating an alert or familiar message as proof.
- **C:** Correct. Clear separation of verified facts, assumptions and unknowns supports governance decisions without overstating certainty.
- **D:** Raw logs and attacker speculation can expose sensitive information and mislead leaders. Review the evidence, use approved organizational controls and avoid treating an alert or familiar message as proof.

**Key takeaway:** Good incident governance makes uncertainty visible and assigns decisions; it does not conceal uncertainty or turn it into assurance.  
**Recommended action:** Use a structured incident briefing: what happened, what is confirmed, what remains unknown, business impact, actions taken, decisions needed, owner and next update time. Coordinate external and regulatory communications with authorized stakeholders.  
**References:** [17], [28]  
**Explanation ID:** `EXPL-GOV-E05`  
**Video ID:** `VIDEO-GOV-E05` (deferred for new questions)  

### REC-E06 — Recovering After Ransomware

**Category:** Ransomware recovery and resilience  
**Learning objective:** Sequence recovery using containment, clean restoration sources, identity assurance, validation and monitored return to service.  
**Scenario:** A ransomware incident has been contained. Several production servers are encrypted, the backup platform was reachable from part of the affected environment, and an offline backup set is available. Executives want the customer portal restored first. The incident team has not yet validated the backup set or rotated potentially exposed credentials.  
**Question:** Which recovery sequence is most defensible?

- **A.** Validate and protect clean backup sources, establish a trusted recovery environment, address compromised identities and access paths, restore prioritized services in a controlled order, test integrity and security, then monitor closely before declaring recovery. (correct)
- **B.** Restore the customer portal immediately from the most recent backup, then investigate whether the backup was affected.
- **C.** Pay the ransom first so the attacker can provide a decryption key, then use it as the primary recovery plan.
- **D.** Reconnect all affected servers at once after encryption stops, because the incident is already contained.

**Option rationales:**
- **A:** Correct. Recovery depends on trustworthy restoration sources, a clean environment, identity/access remediation, prioritized validation and monitoring.
- **B:** The newest backup may also be encrypted, compromised or contaminated. Review the evidence, use approved organizational controls and avoid treating an alert or familiar message as proof.
- **C:** Payment does not guarantee decryption, recovery or prevention of data disclosure. Review the evidence, use approved organizational controls and avoid treating an alert or familiar message as proof.
- **D:** Stopped encryption does not prove attacker access or persistence is gone. Review the evidence, use approved organizational controls and avoid treating an alert or familiar message as proof.

**Key takeaway:** Recovery is not simply restoring files; it is returning services to a known-good, validated and monitored state.  
**Recommended action:** Follow the organization’s recovery plan, validate offline or otherwise trusted backups, rebuild or restore in a clean environment, reset affected credentials and tokens as appropriate, prioritize services by business impact, test security and integrity, and monitor after restoration.  
**References:** [28], [35]  
**Explanation ID:** `EXPL-REC-E06`  
**Video ID:** `VIDEO-REC-E06` (deferred for new questions)  

### LIB-IRG-01 — Incident response governance: safest response

**Category:** Incident response governance  
**Learning objective:** Coordinate incident command, proportionate containment, evidence preservation and business decisions.  
**Scenario:** An incident commander receives correlated endpoint encryption, unusual service-account sign-in and outbound data-transfer alerts while the initial access path remains unknown.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Accept the request as routine and complete it without a separate check.
- **B.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **C.** Share the full details with a broad group so others can decide informally.
- **D.** Declare and coordinate the incident, isolate confirmed affected assets using approved procedures, preserve telemetry and scope identities and systems before broader disruptive action. (correct)

**Option rationales:**
- **A:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **B:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **C:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.
- **D:** This directly addresses multiple correlated alerts require coordinated response before the full cause is known. The proposed action uses approved, independently verifiable controls: Declare and coordinate the incident, isolate confirmed affected assets using approved procedures, preserve telemetry and scope identities and systems before broader disruptive action.

**Key takeaway:** Incident command manages uncertainty through recorded decisions, proportionate containment and evidence.  
**Recommended action:** Activate the response plan, appoint decision owners and preserve an auditable timeline.  
**References:** [17], [28]  
**Explanation ID:** `EXPL-LIB-IRG-01`  
**Video ID:** `VIDEO-LIB-IRG-01` (deferred for new questions)  

### LIB-IRG-02 — Incident response governance: evidence check

**Category:** Incident response governance  
**Learning objective:** Coordinate incident command, proportionate containment, evidence preservation and business decisions.  
**Scenario:** During a review of a possible incident response governance issue, the initial report is not sufficient to authorize the next step. The owner must validate multiple correlated alerts require coordinated response before the full cause is known using evidence that does not depend on the original unverified claim.  
**Question:** Which evidence provides the strongest basis for that decision?

- **A.** A time-stamped incident record with command ownership, affected assets, containment decisions, evidence sources, scope and unresolved assumptions. (correct)
- **B.** A complete attribution report before declaring an incident.
- **C.** A blanket shutdown of every system without scoping or business coordination.
- **D.** A verbal update that has no decision owner or action log.

**Option rationales:**
- **A:** This evidence is strongest because it independently verifies the relevant facts for multiple correlated alerts require coordinated response before the full cause is known and supports an auditable decision.
- **B:** This is a surface cue that can be copied, altered or misunderstood; it does not independently establish the relevant control.
- **C:** This information comes from the same source being assessed, so it cannot independently validate the claim.
- **D:** This does not provide an authoritative record of multiple correlated alerts require coordinated response before the full cause is known or verify the control that should govern the decision.

**Key takeaway:** Incident command manages uncertainty through recorded decisions, proportionate containment and evidence.  
**Recommended action:** Activate the response plan, appoint decision owners and preserve an auditable timeline.  
**References:** [17], [28]  
**Explanation ID:** `EXPL-LIB-IRG-02`  
**Video ID:** `VIDEO-LIB-IRG-02` (deferred for new questions)  

### LIB-SCG-01 — Supply-chain risk governance: safest response

**Category:** Supply-chain risk governance  
**Learning objective:** Make supplier decisions using criticality, evidence, contractual controls and lifecycle oversight.  
**Scenario:** A critical supplier requests persistent administrator access to a production environment and cannot provide a current security assessment before a renewal deadline.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Accept the request as routine and complete it without a separate check.
- **B.** Do not grant persistent broad access until risk owners review evidence, define a time-bound least-privilege alternative and record residual-risk acceptance through governance. (correct)
- **C.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **D.** Share the full details with a broad group so others can decide informally.

**Option rationales:**
- **A:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **B:** This directly addresses a supplier with privileged access or sensitive data can create systemic organizational exposure. The proposed action uses approved, independently verifiable controls: Do not grant persistent broad access until risk owners review evidence, define a time-bound least-privilege alternative and record residual-risk acceptance through governance.
- **C:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **D:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.

**Key takeaway:** Criticality increases the need for governance; it does not waive supplier controls.  
**Recommended action:** Tie supplier access to assessed need, contract terms, least privilege and ongoing monitoring.  
**References:** [17], [18], [37]  
**Explanation ID:** `EXPL-LIB-SCG-01`  
**Video ID:** `VIDEO-LIB-SCG-01` (deferred for new questions)  

### LIB-SCG-02 — Supply-chain risk governance: evidence check

**Category:** Supply-chain risk governance  
**Learning objective:** Make supplier decisions using criticality, evidence, contractual controls and lifecycle oversight.  
**Scenario:** During a review of a possible supply-chain risk governance issue, the initial report is not sufficient to authorize the next step. The owner must validate a supplier with privileged access or sensitive data can create systemic organizational exposure using evidence that does not depend on the original unverified claim.  
**Question:** Which evidence provides the strongest basis for that decision?

- **A.** The supplier has renewed the contract for several years.
- **B.** The supplier promises to provide evidence after receiving access.
- **C.** A current supplier assessment, privileged-access architecture, contractual security obligations, remediation plan and named residual-risk approver. (correct)
- **D.** A business sponsor says the service is operationally important.

**Option rationales:**
- **A:** This is a surface cue that can be copied, altered or misunderstood; it does not independently establish the relevant control.
- **B:** This information comes from the same source being assessed, so it cannot independently validate the claim.
- **C:** This evidence is strongest because it independently verifies the relevant facts for a supplier with privileged access or sensitive data can create systemic organizational exposure and supports an auditable decision.
- **D:** This does not provide an authoritative record of a supplier with privileged access or sensitive data can create systemic organizational exposure or verify the control that should govern the decision.

**Key takeaway:** Criticality increases the need for governance; it does not waive supplier controls.  
**Recommended action:** Tie supplier access to assessed need, contract terms, least privilege and ongoing monitoring.  
**References:** [17], [18], [37]  
**Explanation ID:** `EXPL-LIB-SCG-02`  
**Video ID:** `VIDEO-LIB-SCG-02` (deferred for new questions)  

### LIB-IGV-01 — Insider risk and governance: safest response

**Category:** Insider risk and governance  
**Learning objective:** Govern insider-risk response with objective evidence, privacy safeguards and authorized oversight.  
**Scenario:** A sensitive-data access alert coincides with an employee’s role change; a manager asks the security team to inspect personal communications without a documented basis.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Accept the request as routine and complete it without a separate check.
- **B.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **C.** Share the full details with a broad group so others can decide informally.
- **D.** Preserve the objective access records, refer the concern through the authorized insider-risk process and require legal/privacy and HR governance before any intrusive review. (correct)

**Option rationales:**
- **A:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **B:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **C:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.
- **D:** This directly addresses uncoordinated monitoring or profiling can harm individuals and undermine legitimate investigation. The proposed action uses approved, independently verifiable controls: Preserve the objective access records, refer the concern through the authorized insider-risk process and require legal/privacy and HR governance before any intrusive review.

**Key takeaway:** Insider-risk governance must be evidence-based, proportionate, authorized and privacy-aware.  
**Recommended action:** Use designated cross-functional governance and restrict investigation to approved evidence and scope.  
**References:** [32], [33], [38]  
**Explanation ID:** `EXPL-LIB-IGV-01`  
**Video ID:** `VIDEO-LIB-IGV-01` (deferred for new questions)  

### LIB-IGV-02 — Insider risk and governance: evidence check

**Category:** Insider risk and governance  
**Learning objective:** Govern insider-risk response with objective evidence, privacy safeguards and authorized oversight.  
**Scenario:** During a review of a possible insider risk and governance issue, the initial report is not sufficient to authorize the next step. The owner must validate uncoordinated monitoring or profiling can harm individuals and undermine legitimate investigation using evidence that does not depend on the original unverified claim.  
**Question:** Which evidence provides the strongest basis for that decision?

- **A.** A documented case record showing objective indicators, lawful authority, approvals, access controls and review outcomes. (correct)
- **B.** A manager’s personal impression that the employee seems unhappy.
- **C.** A broad search of private communications before authorization.
- **D.** A demographic or personal characteristic treated as a risk indicator.

**Option rationales:**
- **A:** This evidence is strongest because it independently verifies the relevant facts for uncoordinated monitoring or profiling can harm individuals and undermine legitimate investigation and supports an auditable decision.
- **B:** This is a surface cue that can be copied, altered or misunderstood; it does not independently establish the relevant control.
- **C:** This information comes from the same source being assessed, so it cannot independently validate the claim.
- **D:** This does not provide an authoritative record of uncoordinated monitoring or profiling can harm individuals and undermine legitimate investigation or verify the control that should govern the decision.

**Key takeaway:** Insider-risk governance must be evidence-based, proportionate, authorized and privacy-aware.  
**Recommended action:** Use designated cross-functional governance and restrict investigation to approved evidence and scope.  
**References:** [32], [33], [38]  
**Explanation ID:** `EXPL-LIB-IGV-02`  
**Video ID:** `VIDEO-LIB-IGV-02` (deferred for new questions)  

### LIB-BECG-01 — Business email compromise and financial controls: safest response

**Category:** Business email compromise and financial controls  
**Learning objective:** Govern high-risk payment changes with independent verification, segregation of duties and audit trails.  
**Scenario:** A finance controller receives an urgent request to change a major supplier’s settlement account. The email thread is genuine but the supplier mailbox may be compromised.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Accept the request as routine and complete it without a separate check.
- **B.** Freeze the change, verify using an independently sourced supplier contact, require dual approval and reconcile the change in the controlled vendor-master workflow. (correct)
- **C.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **D.** Share the full details with a broad group so others can decide informally.

**Option rationales:**
- **A:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **B:** This directly addresses a compromised communication channel can redirect payments despite apparently valid correspondence. The proposed action uses approved, independently verifiable controls: Freeze the change, verify using an independently sourced supplier contact, require dual approval and reconcile the change in the controlled vendor-master workflow.
- **C:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **D:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.

**Key takeaway:** A compromised mailbox can preserve a convincing thread; financial controls must be independent of email.  
**Recommended action:** Require out-of-band verification, segregation of duties and an auditable vendor-master process.  
**References:** [17], [26], [28]  
**Explanation ID:** `EXPL-LIB-BECG-01`  
**Video ID:** `VIDEO-LIB-BECG-01` (deferred for new questions)  

### LIB-BECG-02 — Business email compromise and financial controls: evidence check

**Category:** Business email compromise and financial controls  
**Learning objective:** Govern high-risk payment changes with independent verification, segregation of duties and audit trails.  
**Scenario:** During a review of a possible business email compromise and financial controls issue, the initial report is not sufficient to authorize the next step. The owner must validate a compromised communication channel can redirect payments despite apparently valid correspondence using evidence that does not depend on the original unverified claim.  
**Question:** Which evidence provides the strongest basis for that decision?

- **A.** The request is in the original email thread.
- **B.** The invoice and bank letter contain matching new details.
- **C.** An independently verified supplier callback, authenticated vendor-master change request, dual approval and audit record linking the change to the invoice. (correct)
- **D.** The supplier’s display name and signature are unchanged.

**Option rationales:**
- **A:** This is a surface cue that can be copied, altered or misunderstood; it does not independently establish the relevant control.
- **B:** This information comes from the same source being assessed, so it cannot independently validate the claim.
- **C:** This evidence is strongest because it independently verifies the relevant facts for a compromised communication channel can redirect payments despite apparently valid correspondence and supports an auditable decision.
- **D:** This does not provide an authoritative record of a compromised communication channel can redirect payments despite apparently valid correspondence or verify the control that should govern the decision.

**Key takeaway:** A compromised mailbox can preserve a convincing thread; financial controls must be independent of email.  
**Recommended action:** Require out-of-band verification, segregation of duties and an auditable vendor-master process.  
**References:** [17], [26], [28]  
**Explanation ID:** `EXPL-LIB-BECG-02`  
**Video ID:** `VIDEO-LIB-BECG-02` (deferred for new questions)  

### LIB-GRC-01 — Governance and risk communication: safest response

**Category:** Governance and risk communication  
**Learning objective:** Communicate cyber risk with impact, uncertainty, accountable ownership and explicit decisions.  
**Scenario:** A board briefing states that a cyber incident is “under control” but does not disclose affected services, known data exposure, confidence level or decisions needed.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Accept the request as routine and complete it without a separate check.
- **B.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **C.** Share the full details with a broad group so others can decide informally.
- **D.** Reframe the briefing around business impact, confirmed facts versus assumptions, response status, options, accountable owners and the specific decisions required. (correct)

**Option rationales:**
- **A:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **B:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **C:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.
- **D:** This directly addresses executives may make poor decisions when risk reports omit uncertainty or decision requests. The proposed action uses approved, independently verifiable controls: Reframe the briefing around business impact, confirmed facts versus assumptions, response status, options, accountable owners and the specific decisions required.

**Key takeaway:** Risk communication should make uncertainty and decision ownership explicit.  
**Recommended action:** Use concise, evidence-based risk reporting that separates facts, assumptions and decisions.  
**References:** [17], [28], [18]  
**Explanation ID:** `EXPL-LIB-GRC-01`  
**Video ID:** `VIDEO-LIB-GRC-01` (deferred for new questions)  

### LIB-GRC-02 — Governance and risk communication: evidence check

**Category:** Governance and risk communication  
**Learning objective:** Communicate cyber risk with impact, uncertainty, accountable ownership and explicit decisions.  
**Scenario:** During a review of a possible governance and risk communication issue, the initial report is not sufficient to authorize the next step. The owner must validate executives may make poor decisions when risk reports omit uncertainty or decision requests using evidence that does not depend on the original unverified claim.  
**Question:** Which evidence provides the strongest basis for that decision?

- **A.** A decision-oriented incident report with impact, confidence, scope, treatment options, residual risk and action owners. (correct)
- **B.** A technical dashboard screenshot without business impact.
- **C.** A single red/green status label without assumptions or scope.
- **D.** A long list of alerts with no ownership or requested decision.

**Option rationales:**
- **A:** This evidence is strongest because it independently verifies the relevant facts for executives may make poor decisions when risk reports omit uncertainty or decision requests and supports an auditable decision.
- **B:** This is a surface cue that can be copied, altered or misunderstood; it does not independently establish the relevant control.
- **C:** This information comes from the same source being assessed, so it cannot independently validate the claim.
- **D:** This does not provide an authoritative record of executives may make poor decisions when risk reports omit uncertainty or decision requests or verify the control that should govern the decision.

**Key takeaway:** Risk communication should make uncertainty and decision ownership explicit.  
**Recommended action:** Use concise, evidence-based risk reporting that separates facts, assumptions and decisions.  
**References:** [17], [28], [18]  
**Explanation ID:** `EXPL-LIB-GRC-02`  
**Video ID:** `VIDEO-LIB-GRC-02` (deferred for new questions)  

### LIB-RCR-01 — Ransomware recovery and resilience: safest response

**Category:** Ransomware recovery and resilience  
**Learning objective:** Coordinate resilient recovery using verified backups, clean restoration and prioritized business services.  
**Scenario:** After a ransomware event, a business unit asks to restore critical services immediately from the most recent backup, but backup integrity and the attacker’s persistence are not yet assessed.  
**Question:** Which response is the safest and most appropriate next step?

- **A.** Accept the request as routine and complete it without a separate check.
- **B.** Prioritize recovery with the incident commander, validate backup integrity and isolation, confirm clean recovery infrastructure, address persistence and obtain service-owner approval before restoration. (correct)
- **C.** Wait until a confirmed loss, outage or policy violation appears before acting.
- **D.** Share the full details with a broad group so others can decide informally.

**Option rationales:**
- **A:** A routine-looking request does not establish the source’s identity or the action’s authorization; independent verification is still required.
- **B:** This directly addresses restoring too early or from compromised backups can reintroduce malware and data loss. The proposed action uses approved, independently verifiable controls: Prioritize recovery with the incident commander, validate backup integrity and isolation, confirm clean recovery infrastructure, address persistence and obtain service-owner approval before restoration.
- **C:** Waiting for visible harm can extend the exposure and delay proportionate prevention, containment or reporting.
- **D:** Broad circulation can expose sensitive information or spread unsafe content; use an approved need-to-know process.

**Key takeaway:** A completed backup job is not proof that a backup is clean, complete or safe to restore.  
**Recommended action:** Use tested, protected backups and a governed recovery sequence tied to business priorities.  
**References:** [28], [35], [17]  
**Explanation ID:** `EXPL-LIB-RCR-01`  
**Video ID:** `VIDEO-LIB-RCR-01` (deferred for new questions)  

### LIB-RCR-02 — Ransomware recovery and resilience: evidence check

**Category:** Ransomware recovery and resilience  
**Learning objective:** Coordinate resilient recovery using verified backups, clean restoration and prioritized business services.  
**Scenario:** During a review of a possible ransomware recovery and resilience issue, the initial report is not sufficient to authorize the next step. The owner must validate restoring too early or from compromised backups can reintroduce malware and data loss using evidence that does not depend on the original unverified claim.  
**Question:** Which evidence provides the strongest basis for that decision?

- **A.** The backup job completed successfully last night.
- **B.** A sample file can be opened from the backup.
- **C.** Backup immutability and restore-test records, clean-environment validation, recovery-point data, identity hardening and documented service-owner sign-off. (correct)
- **D.** The business unit confirms that it needs the service urgently.

**Option rationales:**
- **A:** This is a surface cue that can be copied, altered or misunderstood; it does not independently establish the relevant control.
- **B:** This information comes from the same source being assessed, so it cannot independently validate the claim.
- **C:** This evidence is strongest because it independently verifies the relevant facts for restoring too early or from compromised backups can reintroduce malware and data loss and supports an auditable decision.
- **D:** This does not provide an authoritative record of restoring too early or from compromised backups can reintroduce malware and data loss or verify the control that should govern the decision.

**Key takeaway:** A completed backup job is not proof that a backup is clean, complete or safe to restore.  
**Recommended action:** Use tested, protected backups and a governed recovery sequence tied to business priorities.  
**References:** [28], [35], [17]  
**Explanation ID:** `EXPL-LIB-RCR-02`  
**Video ID:** `VIDEO-LIB-RCR-02` (deferred for new questions)  
