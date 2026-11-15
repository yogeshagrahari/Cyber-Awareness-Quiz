# Literature Review and Critical Synthesis

**CYBERAWARE 3D — Initial rapid scoping review**  
**Search cut-off:** 12 November 2026

## 1. Review purpose and boundaries

This review examines cybersecurity awareness learning, phishing education, game-based/scenario-based instruction, immersive visualization, AI-generated teaching videos, adaptation and evaluation. The emphasis is on non-specialist users and practical defensive decisions, while recognizing that much cybersecurity-game research targets computing students or industry professionals.

The search is a rapid scoping synthesis, not a completed systematic review. It prioritizes peer-reviewed reviews and primary studies, with official standards used for technical content and vendor pages used only for descriptive comparison.

## 2. Human behaviour, awareness and training design

### 2.1 Awareness is not the same as secure behaviour

Parsons et al. developed the Human Aspects of Information Security Questionnaire (HAIS-Q) to examine knowledge, attitudes and behaviour related to security policy [4]. Their 2014 work, involving 500 Australian employees, reported that knowledge had a stronger influence on attitude than on self-reported behaviour. The implication is that content should explain both **what to do** and **why**, and awareness scores cannot be treated as direct proxies for behaviour.

Parsons et al. later conducted two further validation studies. In one, 112 university students completed the HAIS-Q and a lab-based phishing task; higher HAIS-Q scores were associated with better phishing-task performance [5]. This supports combining validated or carefully adapted measures with task-based assessment, without claiming that a short quiz predicts behaviour in every setting.

Puhakainen and Siponen used action research to develop and evaluate theory-based information-systems security training [3]. Their reported results support active learner processing and continued communication rather than treating training as a one-off content-delivery event. NIST SP 800-50 Rev. 1 frames cybersecurity and privacy learning as a lifecycle programme intended to encourage behaviour change and security culture, with measurement and iterative improvement [1].

A significant counterpoint is Liu et al.'s 2025 IEEE Symposium on Security and Privacy study [7]. It examined an eight-month randomized field experiment, ten simulated phishing campaigns and more than 19,500 employees at a healthcare organization. The authors found no significant relationship between recent annual training completion and subsequent phishing-simulation failure, and only very small differences for embedded training. Their paper cautions against assuming that common training formats produce practical risk reduction. CyberAware 3D must therefore not use course completion, video views or quiz percentages as standalone evidence of improved security behaviour.

**Design implication:** instruction should require active decisions, provide immediate explanatory feedback, include spaced retrieval and new scenarios, and be evaluated with delayed retention and transfer tasks. These are propositions to test, not guaranteed outcomes.

### 2.2 Phishing education and transfer

Kumaraguru et al. studied anti-phishing education designed to attract user attention by embedding training in a primary task, explicitly examining retention and transfer [6]. This motivates short, contextual explanations close to the decision being taught. It does not justify assuming that every just-in-time training implementation works: the later field RCT [7] highlights that real-world engagement with embedded training can be limited.

Phishing should be taught as a decision process rather than a checklist of visual red flags. Relevant signals include sender identity and domain alignment, unexpected context, urgency, requests for credentials or payment, unusual attachments, destination mismatch, and verification through an independent channel. Learners should also be told that polished language, HTTPS, familiar branding or a known sender display name do not establish legitimacy.

### 2.3 Authentication, passwords, OTP and MFA fatigue

NIST SP 800-63B-4 (2025) defines phishing resistance in protocol terms: the authentication protocol protects authentication secrets from an impostor verifier without relying solely on user vigilance. The guidance notes that manually entered OTP authenticator outputs are not phishing-resistant because the value is not cryptographically bound to the specific session. It also discusses authentication-fatigue attacks in which repeated push requests may induce a user to approve one [16].

This creates a useful curriculum distinction:
- Never disclose passwords, OTPs, recovery codes or authentication approvals to another person.
- Deny an unexpected approval prompt; report repeated prompts and secure the account through a trusted channel.
- Where available and appropriate, passkeys/WebAuthn or other verifier-bound authenticators offer stronger phishing resistance than manually relayed one-time codes.
- Password education should prioritize unique passwords, password managers and account-recovery hygiene rather than treating simplistic composition rules as a complete solution.

Simulations must never accept real passwords, OTPs or tokens. Credential interactions use fictional values in isolated training scenarios.

## 3. Serious games, gamification and scenario-based learning

### 3.1 Review-level evidence

Ng and Hasan reviewed cybersecurity serious-game development from 2014 to early 2024, identifying 53 papers using a PRISMA-informed review process [8]. The review spans serious games, gamification and entertainment games across general cybersecurity knowledge and specialized topics. Game-based cybersecurity education is therefore an established research stream, not a novelty claim of this project.

Weeratunge, Hjelsvold and Katt's 2026 systematic scoping review searched IEEE Xplore, ACM Digital Library and SpringerLink for 2018–2024 studies and included 230 primary studies; the authors also applied a game taxonomy to 57 games [9]. Most identified approaches targeted industry professionals and undergraduate students, with emerging activity for children and the general public. The review categorizes evaluation into UX/UI, educational effectiveness, engagement/motivation, comparative and mixed-method evaluation; it also notes studies with no formal evaluation. It recommends standardized tests and comparison with control or existing teaching methods. The authors acknowledge limitations related to search terms, subjective quality scoring and the lack of formal inter-rater agreement statistics.

Pramod's 2024 review examines gamification platforms, mechanics, benefits and challenges in cybersecurity education [21]. It supports investigating gamification, but broad claims that one instructional mode is superior should not be adopted without examining study quality and outcomes.

### 3.2 Representative systems and prototypes

Khan et al. describe a game-based cybersecurity education platform with a web portal, learning material, challenges and a virtual lab, using an adapted ARCS motivational model [10]. It demonstrates that self-paced game-based cybersecurity environments and hands-on practice have been explored. Its emphasis includes computing learners and technical challenges, so it is not a direct substitute for a non-specialist, behaviour-oriented awareness curriculum.

Alqahtani and Kavakli-Thorne present CybAR, an augmented-reality mobile game for cybersecurity awareness [11]. Its design uses feedback to demonstrate consequences of cyberattacks; the authors report a survey evaluation with 91 participants and positive perceptions of usefulness. The sample and survey-oriented evidence should not be equated with a large controlled assessment of retained real-world behaviour.

### 3.3 Critical conclusion

Game mechanics can create motivation and repeated practice opportunities, but points, badges and 3D scenery are not instructional objectives. The 2026 review makes the evaluation requirement explicit: separate usability and engagement from learning effectiveness, and compare performance with an alternative instructional condition [9]. CyberAware 3D should make rewards subordinate to accuracy, explanation review and mastery evidence; guessing for XP should be discouraged.

## 4. Three-dimensional visualization and immersive learning

Conrad, Kablitz and Schumann's 2024 systematic review analyzed 30 studies of immersive virtual reality in education and training [12]. The review reports positive learning effects relative to other media in the studies examined and argues that IVR can fit learning requiring active engagement and practical application.

This is **adjacent**, not direct, evidence for CyberAware 3D. A browser-based WebGL scene rendered on a flat monitor is not the same treatment as immersive head-mounted VR. The review cannot establish that a 3D cybersecurity globe, holographic threat path or network scene produces better learning than a clear 2D diagram. Three-dimensional elements should therefore be reserved for concepts where spatial relationships are pedagogically meaningful (for example, a trust boundary or multi-stage incident path), with 2D equivalents and performance fallbacks.

A defensible evaluation should compare matched 2D and 3D versions of the same lesson, with equivalent content, time and interaction. Outcome measures should include concept understanding, decision quality, cognitive load, task completion and accessibility barriers.

## 5. AI-generated educational videos

Netland et al. compared human-made and AI-generated teaching videos in an online experiment with 447 participants and four topics [13]. The study reports similar exam learning outcomes across video conditions, while human-made videos had a small advantage in perceived learning experience. This supports AI video as a potentially efficient production method, not as inherently superior teaching.

Shu et al.'s 2025 systematic review retained 12 studies of AI-generated instructional videos from 143 records [14]. It reports that generated video quality may be adequate for educational use, while identifying limitations in motivation and social presence and concluding that AI video should not simply replace human-produced video. The described workflow includes script generation, image generation, speech synthesis, animation and post-production.

Most directly relevant, Arpaci et al.'s 2026 systematic mapping study included 60 peer-reviewed studies on generative AI in cybersecurity education, training and awareness [15]. Reviewed use cases include generating materials, phishing-awareness support, cyber-range scenarios, tutoring and assessment. It also reports concerns about hallucination, accuracy, bias, overreliance and weak empirical validation; many studies assess content quality, usability, engagement or short-term performance rather than sustained learning or transfer to authentic tasks.

**Design implication:** each question-level video must be a reviewed educational artefact, not an unreviewed LLM response. The canonical source of truth is the approved question/explanation record. A video pipeline should generate from a locked script, attach citations in the companion panel/transcript, require human review, record provider/model/version and generation status, and publish captions and transcript. Video availability must never gate access to the written explanation.

## 6. Adaptive learning and analytics

The 2026 mapping study identifies limited personalization and insufficient adaptive feedback as problems addressed by emerging GenAI work in cybersecurity education [15]. The game-based scoping review recommends stronger standardized evaluation [9]. These sources motivate adaptive recommendations, but do not validate one particular rule engine for this project.

The initial design should use a transparent, explainable rule-based policy:
1. Track performance by learning objective and difficulty.
2. Separate first-attempt correctness from repeated-attempt correctness.
3. Use delayed retrieval on previously missed concepts.
4. Recommend remediation linked to the exact explanation and video IDs.
5. Unlock the next level only after a configurable mastery rule is met across multiple distinct items.
6. Show learners why an activity was recommended.
7. Do not infer real-world competency from quiz data alone.

The recommendation logic should be versioned and evaluated against a non-adaptive baseline. A machine-learning learner model is not justified until enough valid data exist, consent and privacy controls are defined, and the baseline policy has been measured.

## 7. Existing platform comparison

The following is a feature-orientation comparison based on accessible public descriptions, not a commercial procurement evaluation or independent usability test.

| Platform / system | Target and modality | Publicly described strengths | Boundaries relevant to this project |
|---|---|---|---|
| Google Be Internet Awesome / Interland [22] | Free browser game; particularly designed for children ages 7–12 | Four game areas include detecting fakes, sharing carefully, kindness and protecting secrets; game-based guided internet-safety lessons | Its published objective/audience is youth internet safety. The public overview does not establish the complete adult four-level curriculum, research citation traceability per item, question-level video manifest or adaptive analytics proposed here. This is a scope observation, not a claim that no other Google learning resources exist. |
| CybAR [11] | Mobile augmented-reality cybersecurity awareness game | Uses AR and feedback to explain cyberattack consequences; evaluated with a 91-participant survey | A research prototype with a small, survey-oriented evaluation; not evidence of long-term transfer or a complete question-by-question cited video system. |
| Khan et al. game-based platform [10] | Web portal, games/challenges and virtual lab | Self-paced challenges, adapted ARCS motivational model and virtual-lab practice | Emphasizes cybersecurity education/skills and a university setting; different target and scope from a progressive public-awareness curriculum. |
| KnowBe4 Security Awareness Training [23] | Commercial enterprise security-awareness service | Vendor materials describe role/risk/behaviour personalization, phishing/vishing simulations, real-time coaching, AI-generated content/video and reporting | Commercial feature statements and performance figures are vendor claims, not independent validation. Designed for organizational human-risk operations rather than an openly documented research intervention. |
| Research-game literature [8], [9] | Diverse prototypes, serious games and gamified methods | Many approaches exist, and a taxonomy supports classification across game types and target audiences | Recent scoping review finds varied evaluation practices, including no formal evaluation in some studies; standardized comparison and mixed-method evaluation remain important. |

## 8. Critical synthesis

1. **Instructional design before decoration.** Content must activate learners and explain rationale, not merely present security rules [3], [4].
2. **Measure behaviour-relevant transfer.** Standard completion and simple click-rate metrics are insufficient; large field evidence challenges commonly deployed formats [7].
3. **Treat games as an instructional delivery mechanism.** Serious-game research is established, but methods and evaluations vary [8], [9].
4. **Use 3D selectively.** Immersive learning evidence is promising but cannot be transferred uncritically to desktop WebGL [12].
5. **Treat AI media as a reviewable aid.** AI videos may support comparable short-term exam outcomes in an adjacent subject, but accuracy, learner experience and sustained transfer require scrutiny [13]–[15].

The resulting research contribution is not the claim that any one of these techniques is unprecedented. It is the design and evaluation of a traceable, progressive awareness framework that combines them under explicit content governance and tests their incremental value against appropriate baselines.
