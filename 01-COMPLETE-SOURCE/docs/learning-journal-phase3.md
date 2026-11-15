# Learning Journal — Phase 3 Engineering Concepts

## 1. Content-driven application architecture

**Concept:** Keep question, explanation and video mappings in versioned data files, separate from presentation code.  
**Importance:** Content changes should not require editing application logic, and stable identifiers support research traceability.  
**Implementation:** The frontend loads the canonical question bank, explanation records and video manifest from JSON.  
**Challenge:** Preserve the exact relationship between 45 questions, 45 explanations, 45 video entries and their references.  
**Solution:** Validate IDs and mapping sets in automated tests and the existing Python validator.  
**Learning outcome:** Data contracts are a core system boundary, not merely a content authoring convenience.

## 2. First-attempt scoring and adaptive rules

**Concept:** Distinguish the learner's first response from repeated practice.  
**Importance:** Repeated attempts can inflate a naive accuracy score and make progression misleading.  
**Implementation:** The first attempt for each unique question counts toward mastery; repeated attempts remain separately recorded.  
**Challenge:** Avoid allowing the score to change simply because the learner retries the same item.  
**Solution:** Tag progress attempts with `countedForMastery` and derive mastery from unique first attempts.  
**Learning outcome:** A transparent scoring definition is necessary before calculating progress or making recommendations.

## 3. Progressive enhancement and WebGL fallback

**Concept:** Treat 3D visualization as an enhancement, not as a dependency for essential learning tasks.  
**Importance:** GPU availability, device performance, motion sensitivity and assistive technology support vary.  
**Implementation:** A WebGL globe is used for the dashboard visual with a CSS/2D fallback; core quiz controls remain semantic HTML.  
**Challenge:** Provide a meaningful visual without forcing learners to use a complex 3D interface.  
**Solution:** Keep the illustration decorative and the core content navigable using standard controls.  
**Learning outcome:** A 3D feature should not create an accessibility or availability failure for the learning experience.

## 4. Local-first privacy model

**Concept:** Minimize data collection and avoid an account backend when persistence needs are limited to a single-device demonstrator.  
**Importance:** Learner activity can be sensitive in workplace training contexts.  
**Implementation:** Browser local storage contains only question IDs, answer outcomes, level/category and session summary fields; no PII or credentials are requested.  
**Challenge:** Make progress persistent without creating a server-side identity store.  
**Solution:** Use versioned local storage keys and a defensive parser.  
**Learning outcome:** Local-first storage reduces backend exposure but does not encrypt or synchronize data and must be explained to users.

## 5. Video readiness and honest asset states

**Concept:** A planned video is not a generated video.  
**Importance:** Academic and product integrity requires a real, validated asset before a player is shown as ready.  
**Implementation:** The application checks both manifest readiness and media presence before rendering a video player; otherwise it offers the narration script.  
**Challenge:** Preserve the promised question-to-video mapping while no MP4 files exist.  
**Solution:** Maintain stable video IDs and explicit `mediaFileExists`/review states.  
**Learning outcome:** Media lifecycle states need clear contracts, verification and human approval.
