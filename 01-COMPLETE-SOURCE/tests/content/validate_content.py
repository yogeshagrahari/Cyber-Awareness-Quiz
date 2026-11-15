#!/usr/bin/env python3
"""Strict CyberAware 3D content, citation, script and traceability validator."""
import csv, json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
errors = []
def fail(message): errors.append(message)
def read_json(path):
    try: return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        fail(f"Cannot parse JSON {path.relative_to(ROOT)}: {exc}"); return {}
def words(text): return re.findall(r"\b[\w’'-]+\b", text)
def first_sentence(raw, correct=False):
    s = raw.strip()
    if correct and s.startswith("Correct."): s = s[len("Correct."):].strip()
    m = re.search(r"^(.+?[.!?])(?:\s|$)", s)
    return m.group(1).strip() if m else s

def parse_vtt(path):
    text = path.read_text(encoding="utf-8")
    if not text.startswith("WEBVTT\n"): fail(f"{path.relative_to(ROOT)}: invalid WEBVTT header")
    cues=[]
    ts_re=re.compile(r"^(\d{2}):(\d{2}):(\d{2})\.(\d{3})$")
    def ms(ts):
        m=ts_re.fullmatch(ts.strip())
        if not m: return None
        h,mi,se,frac=map(int,m.groups())
        return ((h*60+mi)*60+se)*1000+frac
    for block in re.split(r"\n\s*\n",text.strip())[1:]:
        lines=block.splitlines()
        if len(lines)<3 or " --> " not in lines[1]:
            fail(f"{path.relative_to(ROOT)}: malformed cue block {block[:50]!r}"); continue
        a,b=lines[1].split(" --> ",1); start,end=ms(a),ms(b)
        if start is None or end is None or end<=start:
            fail(f"{path.relative_to(ROOT)}: invalid cue timing {lines[1]}"); continue
        cues.append((start,end," ".join(lines[2:])))
    for prev,cur in zip(cues,cues[1:]):
        if cur[0] < prev[0]: fail(f"{path.relative_to(ROOT)}: cue start times are not chronological")
        if cur[0] < prev[1]: fail(f"{path.relative_to(ROOT)}: caption cues overlap")
    return cues

qdoc=read_json(ROOT/"content/questions/question-bank.json")
expdoc=read_json(ROOT/"content/explanations/explanations.json")
manifest=read_json(ROOT/"content/video-manifest.json")
registry=read_json(ROOT/"research/reference-registry.json")
questions=qdoc.get("questions",[])

# Keep formal JSON Schema contracts synchronized with the canonical datasets.
def check_schema_contract(data_path, schema_path, label):
    data=read_json(data_path); schema=read_json(schema_path)
    root_props=schema.get("properties",{})
    for field in schema.get("required",[]):
        if field not in root_props: fail(f"{label}: root required field {field} has no schema property")
        if field not in data: fail(f"{label}: required root field {field} missing from data")
    if schema.get("additionalProperties") is False:
        extra=set(data)-set(root_props)
        if extra: fail(f"{label}: root schema rejects data fields {sorted(extra)}")
    item_schema=schema.get("properties",{}).get("questions",{}).get("items",{})
    item_props=item_schema.get("properties",{})
    for field in item_schema.get("required",[]):
        if field not in item_props: fail(f"{label}: question required field {field} has no schema property")
    for i,item in enumerate(data.get("questions",[])):
        missing=set(item_schema.get("required",[]))-set(item)
        if missing: fail(f"{label}: question {i+1} missing schema-required fields {sorted(missing)}")
        if item_schema.get("additionalProperties") is False:
            extra=set(item)-set(item_props)
            if extra: fail(f"{label}: question {i+1} has schema-rejected fields {sorted(extra)}")

check_schema_contract(ROOT/"content/questions/question-bank.json", ROOT/"content/questions/question-schema.json", "Core bank")
check_schema_contract(ROOT/"content/questions/expert-challenge.json", ROOT/"content/questions/expert-challenge-schema.json", "Expert bank")

# Question bank integrity
if len(questions)!=qdoc.get('questionCount'): fail(f"Core questionCount metadata mismatch: {len(questions)} records vs {qdoc.get('questionCount')} declared")
ids=[q.get("questionId") for q in questions]
if len(ids)!=len(set(ids)): fail("Duplicate question IDs")
for level in ("Beginner","Intermediate","Advanced"):
    n=sum(q.get("level")==level for q in questions)
    if n < 1: fail(f"Core bank has no {level} questions")
    declared=qdoc.get("levels",{}).get(level)
    if declared != n: fail(f"Core bank level metadata mismatch for {level}: {declared} vs {n}")
positions={letter:sum(q.get("correctOptionId")==letter for q in questions) for letter in "ABCD"}
if min(positions.values()) == 0: fail(f"Correct-answer positions are not varied across the expanded core bank: {positions}")
for q in questions:
    qid=q.get("questionId","<missing>")
    options=q.get("options",[])
    opt_ids={o.get("id") for o in options}
    if len(options)!=4 or opt_ids!={"A","B","C","D"}: fail(f"{qid}: options must be exactly A/B/C/D")
    rationale=q.get("optionExplanations",{})
    if set(rationale)!={"A","B","C","D"}: fail(f"{qid}: option explanations incomplete")
    if sum(bool(v.get("isCorrect")) for v in rationale.values())!=1: fail(f"{qid}: exactly one option rationale must be correct")
    if q.get("correctOptionId") not in opt_ids: fail(f"{qid}: correct option missing")
    if q.get("correctAnswer") != next((o.get("text") for o in options if o.get("id")==q.get("correctOptionId")),None): fail(f"{qid}: correct answer text mismatch")
    if q.get("explanationId") != "EXPL-"+qid: fail(f"{qid}: explanation ID mismatch")
    if q.get("videoId") != "VIDEO-"+qid: fail(f"{qid}: video ID mismatch")
    if len(q.get("referenceIds",[]))!=len(set(q.get("referenceIds",[]))): fail(f"{qid}: duplicate reference IDs")
    for ref in q.get("referenceIds",[]):
        if not re.fullmatch(r"\[\d+\]",ref): fail(f"{qid}: malformed reference {ref}")
    for field in ("learningObjective","scenario","question","keyTakeaway","recommendedDefensiveAction"):
        if not q.get(field): fail(f"{qid}: empty required field {field}")
    for oid,reason in rationale.items():
        if not reason.get("explanation","").strip(): fail(f"{qid}: empty rationale {oid}")

# Reference numbering, BibTeX keys and structured registry parity
paper=(ROOT/"research/research-paper.md").read_text(encoding="utf-8")
numbered=[int(x) for x in re.findall(r"(?m)^\[(\d+)\]",paper)]
if numbered != list(range(1,len(numbered)+1)): fail("IEEE references are not sequential or contain duplicated/missing numbers")
bib=(ROOT/"research/references.bib").read_text(encoding="utf-8")
bib_keys=re.findall(r"@\w+\s*\{\s*([^,\s]+)\s*,",bib)
if len(bib_keys)!=len(set(bib_keys)): fail("Duplicate BibTeX keys")
ref_list=registry.get("references",[])
ref_ids=[r.get("id") for r in ref_list]
if ref_ids != [str(i) for i in range(1,len(numbered)+1)]: fail("Reference registry IDs do not match sequential IEEE bibliography")
if len(bib_keys)!=len(ref_list): fail(f"BibTeX/reference registry count mismatch: {len(bib_keys)} keys vs {len(ref_list)} records")
for idx,r in enumerate(ref_list):
    if r.get("key") != (bib_keys[idx] if idx<len(bib_keys) else None): fail(f"Reference [{idx+1}] BibTeX key/order mismatch")
    if not r.get("fullCitation"): fail(f"Reference [{idx+1}] missing full citation")
    if idx>=24 and not r.get("url"): fail(f"Newly added reference [{idx+1}] missing direct/official URL")
    if r.get("verificationStatus","").lower().startswith("unverified"): fail(f"Reference [{idx+1}] marked unverified")
ref_set={f"[{rid}]" for rid in ref_ids}
for q in questions:
    for ref in q.get("referenceIds",[]):
        if ref not in ref_set: fail(f"{q['questionId']}: unresolved registry reference {ref}")
        if not re.search(rf"(?m)^\[{re.escape(ref[1:-1])}\]",paper): fail(f"{q['questionId']}: reference {ref} missing in manuscript bibliography")

# Explanation/question parity
explanations=expdoc.get("explanations",[])
if len(explanations)!=len(questions): fail(f"Expected {len(questions)} core explanations, found {len(explanations)}")
exp_by_q={e.get("questionId"):e for e in explanations}
if set(exp_by_q)!=set(ids): fail("Explanation question IDs do not match question bank")
for q in questions:
    e=exp_by_q.get(q["questionId"],{})
    for field in ("explanationId","videoId","correctOptionId","optionExplanations","referenceIds"):
        if e.get(field)!=q.get(field): fail(f"{q['questionId']}: explanation {field} differs from canonical question")

# Video manifest, script, storyboard, captions and prompt integrity
entries=manifest.get("entries",[])
if len(entries)!=len(questions): fail(f"Expected {len(questions)} core video manifest entries, found {len(entries)}")
by_video={e.get("questionId"):e for e in entries}
if set(by_video)!=set(ids): fail("Question/video manifest mapping set mismatch")
for q in questions:
    qid=q["questionId"]; e=by_video.get(qid,{})
    if e.get("videoId")!=q.get("videoId"): fail(f"{qid}: manifest video ID mismatch")
    if e.get("referenceIds")!=q.get("referenceIds"): fail(f"{qid}: manifest reference IDs differ from question")
    if e.get("mediaFileExists") is not False: fail(f"{qid}: MP4 must not be marked present unless validated")
    media=ROOT/e.get("plannedOutputPath","__missing__")
    if media.exists(): fail(f"{qid}: MP4 file exists but manifest is not reviewed; review/update status explicitly")
    if e.get("status")=="deferred_by_owner_request":
        if e.get("reviewStatus")!="deferred_by_owner_request": fail(f"{qid}: deferred video review status mismatch")
        for field in ("scriptPath","storyboardPath","transcriptPath","captionsPath","promptPath"):
            if e.get(field) is not None: fail(f"{qid}: deferred video must not claim {field}")
        continue
    for field in ("scriptPath","storyboardPath","captionsPath","promptPath"):
        target=ROOT/e.get(field,"__missing__")
        if not target.is_file(): fail(f"{qid}: missing {field} file {e.get(field)}")
    if e.get("status")=="ready" or "ready" in str(e.get("status","")).lower(): fail(f"{qid}: ungenerated video marked ready")
    sp=ROOT/e["scriptPath"]
    script=sp.read_text(encoding="utf-8") if sp.is_file() else ""
    if "…" in script or "..." in script: fail(f"{qid}: script contains ellipsis/truncation marker")
    # Extract narration transcript and compare with storyboard narration.
    match=re.search(r"## Narration transcript\n(.*?)\n\n## Correct response",script,re.S)
    narration=match.group(1).strip() if match else ""
    sbp=ROOT/e["storyboardPath"]
    storyboard=read_json(sbp) if sbp.is_file() else {}
    if storyboard.get("questionId")!=qid or storyboard.get("videoId")!=q.get("videoId"): fail(f"{qid}: storyboard ID mapping mismatch")
    if storyboard.get("references")!=q.get("referenceIds"): fail(f"{qid}: storyboard citations differ from question")
    if storyboard.get("narration")!=narration: fail(f"{qid}: script transcript and storyboard narration differ")
    if "…" in json.dumps(storyboard,ensure_ascii=False) or "..." in json.dumps(storyboard,ensure_ascii=False): fail(f"{qid}: storyboard contains ellipsis/truncation marker")
    if len(storyboard.get("scenes",[]))!=5: fail(f"{qid}: expected five storyboard scenes")
    expected_reasons=[]
    for opt in q["options"]:
        oid=opt["id"]
        if oid==q["correctOptionId"]: continue
        reason=first_sentence(q["optionExplanations"][oid]["explanation"])
        expected_reasons.append(f"Option {oid} is unsafe because {reason}")
    for reason in expected_reasons:
        if reason not in narration: fail(f"{qid}: narration omits complete concise rationale: {reason}")
    if not narration: fail(f"{qid}: missing narration transcript")
    vtt_path=ROOT/e["captionsPath"]
    cues=parse_vtt(vtt_path) if vtt_path.is_file() else []
    if cues:
        cap_words=words(" ".join(c[2] for c in cues))
        narr_words=words(narration)
        if [w.lower() for w in cap_words] != [w.lower() for w in narr_words]: fail(f"{qid}: VTT text does not reproduce narration exactly")
        duration=e.get("targetDurationSeconds",{}).get("estimated",0)
        if cues[-1][1] > (duration*1000+10): fail(f"{qid}: VTT extends beyond planned video duration")
        if not (30<=duration<=60): fail(f"{qid}: target video duration outside 30–60s")

# Traceability matrix, every row must point to the same sources and assets.
with (ROOT/"research/traceability-matrix.csv").open(newline="",encoding="utf-8") as fh: rows=list(csv.DictReader(fh))
if len(rows)!=len(questions): fail(f"Expected {len(questions)} core traceability rows, found {len(rows)}")
if {r.get("question_id") for r in rows}!=set(ids): fail("Traceability question IDs differ from question bank")
row_by_id={r.get("question_id"):r for r in rows}
for q in questions:
    r=row_by_id.get(q["questionId"],{})
    refs=[x for x in r.get("reference_ids","").split(";") if x]
    if refs!=q.get("referenceIds",[]): fail(f"{q['questionId']}: traceability reference IDs differ")
    if r.get("explanation_id")!=q.get("explanationId"): fail(f"{q['questionId']}: traceability explanation ID differs")
    if r.get("video_id")!=q.get("videoId"): fail(f"{q['questionId']}: traceability video ID differs")
    if r.get("question_bank_status") not in ("full_draft", "draft_pending_cybersecurity_and_instructional_design_review"): fail(f"{q['questionId']}: question review status is missing or unrecognized")

# Frontend's published copy must be in sync with canonical data.
for canonical, public in [
    (ROOT/"content/questions/question-bank.json", ROOT/"frontend/public/data/question-bank.json"),
    (ROOT/"content/explanations/explanations.json", ROOT/"frontend/public/data/explanations.json"),
    (ROOT/"content/video-manifest.json", ROOT/"frontend/public/data/video-manifest.json"),
]:
    if not public.is_file() or json.loads(canonical.read_text()) != json.loads(public.read_text()):
        fail(f"Frontend public copy is stale: {public.relative_to(ROOT)}")
public_refs=read_json(ROOT/"frontend/public/data/references.json")
if len(public_refs)!=len(ref_list): fail("Frontend reference library count differs from registry")

# Separate Expert Challenge module integrity (kept outside the 45-item core bank).
expert=read_json(ROOT/"content/questions/expert-challenge.json")
expert_exp=read_json(ROOT/"content/explanations/expert-explanations.json")
expert_manifest=read_json(ROOT/"content/expert-video-manifest.json")
expert_questions=expert.get("questions",[])
if len(expert_questions)!=expert.get("questionCount"): fail(f"Expert Challenge questionCount metadata mismatch: {len(expert_questions)} records vs {expert.get('questionCount')} declared")
from collections import Counter
combined_topic_counts=Counter(q.get("category") for q in questions+expert_questions)
if len(combined_topic_counts)!=44: fail(f"Expected 44 topic categories, found {len(combined_topic_counts)}")
for topic,count in combined_topic_counts.items():
    if count<3: fail(f"Topic {topic} has only {count} question(s); minimum library coverage is three")
# The owner's supplied PDF is preserved unchanged in the source tree and served by both app modes.
paper_pdf=ROOT/"research/attachments/research-paper-preview.pdf"
public_pdf=ROOT/"frontend/public/data/research-paper-preview.pdf"
if not paper_pdf.is_file() or paper_pdf.stat().st_size<100_000: fail("Attached research paper PDF is missing or unexpectedly small")
if not public_pdf.is_file() or public_pdf.read_bytes()!=paper_pdf.read_bytes(): fail("Public research-paper PDF differs from the canonical attachment")
expert_ids=[q.get("questionId") for q in expert_questions]
if len(expert_ids)!=len(set(expert_ids)) or set(expert_ids)&set(ids): fail("Expert Challenge question IDs are duplicated or collide with core IDs")
expert_ref_set={f"[{rid}]" for rid in ref_ids}
expert_exp_by_q={e.get("questionId"):e for e in expert_exp.get("explanations",[])}
expert_video_by_q={e.get("questionId"):e for e in expert_manifest.get("entries",[])}
if len(expert_exp_by_q)!=len(expert_questions): fail("Expert Challenge explanation count must match the question bank")
if len(expert_video_by_q)!=len(expert_questions): fail("Expert Challenge video manifest count must match the question bank")
if expert_manifest.get("mediaGenerationClaim") is not False: fail("Expert Challenge manifest must not claim generated video")
for q in expert_questions:
    qid=q.get("questionId","<missing>")
    if q.get("level")!="Expert Challenge": fail(f"{qid}: wrong Expert Challenge level")
    options=q.get("options",[]); opt_ids={o.get("id") for o in options}; rationale=q.get("optionExplanations",{})
    if len(options)!=4 or opt_ids!={"A","B","C","D"}: fail(f"{qid}: Expert Challenge options must be exactly A/B/C/D")
    if set(rationale)!={"A","B","C","D"}: fail(f"{qid}: Expert Challenge option explanations incomplete")
    if sum(bool(v.get("isCorrect")) for v in rationale.values())!=1: fail(f"{qid}: Expert Challenge must have exactly one correct rationale")
    if q.get("correctOptionId") not in opt_ids: fail(f"{qid}: Expert Challenge correct answer missing")
    if q.get("correctAnswer")!=next((o.get("text") for o in options if o.get("id")==q.get("correctOptionId")),None): fail(f"{qid}: Expert Challenge correct answer text mismatch")
    if not q.get("stageCount",0)>=2: fail(f"{qid}: Expert Challenge must be multi-stage")
    for ref in q.get("referenceIds",[]):
        if ref not in expert_ref_set: fail(f"{qid}: unresolved Expert Challenge reference {ref}")
        if not re.search(rf"(?m)^\[{re.escape(ref[1:-1])}\]",paper): fail(f"{qid}: Expert Challenge reference {ref} missing in IEEE references")
    ee=expert_exp_by_q.get(qid,{})
    for field in ("explanationId","videoId","correctOptionId","optionExplanations","referenceIds"):
        if ee.get(field)!=q.get(field): fail(f"{qid}: Expert Challenge explanation {field} mismatch")
    ve=expert_video_by_q.get(qid,{})
    if ve.get("videoId")!=q.get("videoId") or ve.get("referenceIds")!=q.get("referenceIds"): fail(f"{qid}: Expert Challenge video manifest mapping mismatch")
    if ve.get("mediaFileExists") is not False: fail(f"{qid}: Expert Challenge media must not be marked present")
    if ve.get("status")=="deferred_by_owner_request":
        if ve.get("reviewStatus")!="deferred_by_owner_request": fail(f"{qid}: Expert Challenge deferred review status mismatch")
        for field in ("scriptPath","storyboardPath","transcriptPath","captionsPath","promptPath"):
            if ve.get(field) is not None: fail(f"{qid}: deferred Expert Challenge video must not claim {field}")
        continue
    for field in ("scriptPath","storyboardPath","captionsPath","promptPath"):
        target=ROOT/ve.get(field,"__missing__")
        if not target.is_file(): fail(f"{qid}: missing Expert Challenge {field} {ve.get(field)}")
    if ve.get("status")=="ready": fail(f"{qid}: ungenerated Expert Challenge video marked ready")
    script_path=ROOT/ve.get("scriptPath","__missing__")
    script=script_path.read_text(encoding="utf-8") if script_path.is_file() else ""
    match=re.search(r"## Narration transcript\n(.*?)\n\n## Correct response",script,re.S)
    narration=match.group(1).strip() if match else ""
    sb=read_json(ROOT/ve.get("storyboardPath","__missing__"))
    if not narration or sb.get("narration")!=narration: fail(f"{qid}: Expert Challenge narration/storyboard mismatch")
    if sb.get("questionId")!=qid or sb.get("videoId")!=q.get("videoId") or sb.get("references")!=q.get("referenceIds"): fail(f"{qid}: Expert Challenge storyboard identity/reference mismatch")
    if len(sb.get("scenes",[]))!=5: fail(f"{qid}: Expert Challenge storyboard must contain five scenes")
    for opt in options:
        oid=opt["id"]
        if oid==q["correctOptionId"]: continue
        reason=first_sentence(q["optionExplanations"][oid]["explanation"])
        if f"Option {oid} is unsafe because {reason}" not in narration: fail(f"{qid}: Expert Challenge narration omits option {oid} rationale")
    cap_path=ROOT/ve.get("captionsPath","__missing__")
    cues=parse_vtt(cap_path) if cap_path.is_file() else []
    if cues:
        if [w.lower() for w in words(" ".join(c[2] for c in cues))] != [w.lower() for w in words(narration)]: fail(f"{qid}: Expert Challenge captions do not match narration")
        duration=ve.get("targetDurationSeconds",{}).get("estimated",0)
        if not (30<=duration<=60) or cues[-1][1]>(duration*1000+10): fail(f"{qid}: Expert Challenge caption timing outside video duration")
for canonical, public in [
    (ROOT/"content/questions/expert-challenge.json",ROOT/"frontend/public/data/expert-challenge.json"),
    (ROOT/"content/explanations/expert-explanations.json",ROOT/"frontend/public/data/expert-explanations.json"),
    (ROOT/"content/expert-video-manifest.json",ROOT/"frontend/public/data/expert-video-manifest.json")
]:
    if not public.is_file() or json.loads(canonical.read_text())!=json.loads(public.read_text()):
        fail(f"Frontend Expert Challenge copy is stale: {public.relative_to(ROOT)}")
for q in expert_questions:
    ve=expert_video_by_q.get(q.get("questionId"),{})
    if ve.get('status') == 'deferred_by_owner_request': continue
    for field in ("scripts","storyboards","prompts","captions"):
        ext={"scripts":"md","storyboards":"json","prompts":"txt","captions":"vtt"}[field]
        src=ROOT/f"content/videos/{field}/{q['videoId']}.{ext}"
        dst=ROOT/f"frontend/public/data/videos/{field}/{q['videoId']}.{ext}"
        if not src.is_file() or not dst.is_file() or src.read_bytes()!=dst.read_bytes(): fail(f"{q['questionId']}: stale/missing frontend Expert Challenge {field} asset")

if errors:
    print("CONTENT QA: FAIL")
    for message in errors: print(" -",message)
    sys.exit(1)
print("CONTENT QA: PASS")
print("Core and Expert Challenge JSON Schema root/item contracts are synchronized.")
print(f"{len(questions)} core questions + {len(expert_questions)} Expert Challenge scenarios; {(len(questions)+len(expert_questions))*4} answer-option rationales; {len(questions)+len(expert_questions)} matching explanations; {len(ref_list)} sequential IEEE references mapped to {len(bib_keys)} BibTeX keys.")
print("All question/explanation/manifest/reference mappings match. Existing video scripts, storyboards and captions validate; newly added media records are explicitly deferred without placeholder assets.")
print("MP4 files generated: 0 (correctly not claimed). Human expert review remains pending.")
