import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { mediaRoute, scriptRoute, captionsRoute, validateLearningData } from '../src/data.ts';
import type { LearningData, Question, VideoEntry } from '../src/types.ts';

test('learning data validator rejects malformed top-level payloads', () => {
  assert.throws(() => validateLearningData({} as LearningData), /incomplete or malformed/);
});

const projectRoot = resolve(process.cwd(), '../..');
const readJson = async <T>(path: string): Promise<T> => JSON.parse(await readFile(resolve(projectRoot, path), 'utf8')) as T;

test('expanded 133-question data validates for the React application', async () => {
  const [core, expert, coreExplanations, expertExplanations, coreVideos, expertVideos, references] = await Promise.all([
    readJson<{questions:Question[]}>('content/questions/question-bank.json'),
    readJson<{questions:Question[]}>('content/questions/expert-challenge.json'),
    readJson<{explanations:LearningData['explanations']}>('content/explanations/explanations.json'),
    readJson<{explanations:LearningData['explanations']}>('content/explanations/expert-explanations.json'),
    readJson<{entries:LearningData['videos']}>('content/video-manifest.json'),
    readJson<{entries:LearningData['videos']}>('content/expert-video-manifest.json'),
    readJson<LearningData['references']>('frontend/public/data/references.json')
  ]);
  const result = validateLearningData({
    questions:[...core.questions,...expert.questions], explanations:[...coreExplanations.explanations,...expertExplanations.explanations],
    videos:[...coreVideos.entries,...expertVideos.entries], references
  });
  assert.equal(result.questions.length,133);
  const topicCounts = new Map<string, number>();
  for (const question of result.questions) topicCounts.set(question.category, (topicCounts.get(question.category) || 0) + 1);
  assert.equal(topicCounts.size,44);
  for (const [topic, count] of topicCounts) assert.ok(count >= 3, `${topic} has fewer than three questions`);
  assert.equal(result.references.length,38);
  assert.ok(result.videos.some(entry => entry.status === 'deferred_by_owner_request'));
});

test('learning data rejects duplicate or orphaned explanation and video mappings', async () => {
  const [core, expert, coreExplanations, expertExplanations, coreVideos, expertVideos, references] = await Promise.all([
    readJson<{questions:Question[]}>('content/questions/question-bank.json'),
    readJson<{questions:Question[]}>('content/questions/expert-challenge.json'),
    readJson<{explanations:LearningData['explanations']}>('content/explanations/explanations.json'),
    readJson<{explanations:LearningData['explanations']}>('content/explanations/expert-explanations.json'),
    readJson<{entries:LearningData['videos']}>('content/video-manifest.json'),
    readJson<{entries:LearningData['videos']}>('content/expert-video-manifest.json'),
    readJson<LearningData['references']>('frontend/public/data/references.json')
  ]);
  const canonical: LearningData = {
    questions:[...core.questions,...expert.questions],
    explanations:[...coreExplanations.explanations,...expertExplanations.explanations],
    videos:[...coreVideos.entries,...expertVideos.entries], references
  };
  assert.throws(() => validateLearningData({...canonical, explanations:[...canonical.explanations, canonical.explanations[0]]}), /counts do not match/);
  const duplicate = {...canonical, explanations: canonical.explanations.map((row, index) => index === 1 ? {...row, questionId: canonical.explanations[0].questionId} : row)};
  assert.throws(() => validateLearningData(duplicate), /Duplicate explanation/);
  const orphan = {...canonical, videos: canonical.videos.map((row, index) => index === 0 ? {...row, questionId: 'UNKNOWN-QUESTION'} : row)};
  assert.throws(() => validateLearningData(orphan), /inconsistent video mapping|unknown question/);
});

test('learning data rejects unsafe research links and false media-ready claims', async () => {
  const [core, expert, coreExplanations, expertExplanations, coreVideos, expertVideos, references] = await Promise.all([
    readJson<{questions:Question[]}>('content/questions/question-bank.json'),
    readJson<{questions:Question[]}>('content/questions/expert-challenge.json'),
    readJson<{explanations:LearningData['explanations']}>('content/explanations/explanations.json'),
    readJson<{explanations:LearningData['explanations']}>('content/explanations/expert-explanations.json'),
    readJson<{entries:LearningData['videos']}>('content/video-manifest.json'),
    readJson<{entries:LearningData['videos']}>('content/expert-video-manifest.json'),
    readJson<LearningData['references']>('frontend/public/data/references.json')
  ]);
  const canonical: LearningData = {
    questions:[...core.questions,...expert.questions],
    explanations:[...coreExplanations.explanations,...expertExplanations.explanations],
    videos:[...coreVideos.entries,...expertVideos.entries], references
  };
  assert.throws(() => validateLearningData({...canonical, references: canonical.references.map((row, index) => index === 0 ? {...row, url: 'javascript:alert(1)'} : row)}), /invalid URL/);
  assert.throws(() => validateLearningData({...canonical, videos: canonical.videos.map((row, index) => index === 0 ? {...row, mediaFileExists: true, status: 'ready', reviewStatus: 'pending'} : row)}), /claims media exists/);
});

test('media only becomes visible when rendered, validated and approved', () => {
  const entry: VideoEntry = {videoId:'V1',questionId:'Q1',status:'ready',mediaFileExists:true,plannedOutputPath:'public/videos/beginner/a.mp4',scriptPath:'content/videos/scripts/a.md',captionsPath:'content/videos/captions/a.vtt',reviewStatus:'approved',mediaValidated:true,title:'A'};
  assert.equal(mediaRoute(entry),'/videos/beginner/a.mp4');
  assert.equal(mediaRoute({...entry,reviewStatus:'pending'}),null);
  assert.equal(mediaRoute({...entry,mediaValidated:false}),null);
  assert.equal(mediaRoute({...entry,plannedOutputPath:'public/../../etc/passwd'}),null);
  assert.equal(mediaRoute({...entry,plannedOutputPath:'public/videos/bad.mp4?x=1'}),null);
});

test('script and caption URL builders accept only canonical authoring roots', () => {
  assert.equal(scriptRoute('content/videos/scripts/VIDEO-A.md'), '/data/videos/scripts/VIDEO-A.md');
  assert.equal(captionsRoute('content/videos/captions/VIDEO-A.vtt'), '/data/videos/captions/VIDEO-A.vtt');
  assert.throws(() => scriptRoute('content/videos/scripts/../../../../secret.txt'), /Invalid video script path/);
  assert.throws(() => captionsRoute('https://example.invalid/file.vtt'), /Invalid caption path/);
});

test('owner-deferred video entries do not require fake script or caption paths', async () => {
  const [core, expert, coreExplanations, expertExplanations, coreVideos, expertVideos, references] = await Promise.all([
    readJson<{questions:Question[]}>('content/questions/question-bank.json'),
    readJson<{questions:Question[]}>('content/questions/expert-challenge.json'),
    readJson<{explanations:LearningData['explanations']}>('content/explanations/explanations.json'),
    readJson<{explanations:LearningData['explanations']}>('content/explanations/expert-explanations.json'),
    readJson<{entries:LearningData['videos']}>('content/video-manifest.json'),
    readJson<{entries:LearningData['videos']}>('content/expert-video-manifest.json'),
    readJson<LearningData['references']>('frontend/public/data/references.json')
  ]);
  const canonical: LearningData = { questions:[...core.questions,...expert.questions], explanations:[...coreExplanations.explanations,...expertExplanations.explanations], videos:[...coreVideos.entries,...expertVideos.entries], references };
  const deferred = canonical.videos.find(entry => entry.status === 'deferred_by_owner_request');
  assert.ok(deferred);
  assert.equal(deferred.scriptPath, null);
  assert.equal(deferred.captionsPath, null);
  assert.doesNotThrow(() => validateLearningData(canonical));
  assert.throws(() => validateLearningData({...canonical, videos: canonical.videos.map(entry => entry.videoId === deferred.videoId ? {...entry, mediaFileExists:true} : entry)}), /owner-deferred/);
});
