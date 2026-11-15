import test from 'node:test';
import assert from 'node:assert/strict';
import { parseVtt, validateNarrationAssets, validateProbe, validateProject } from '../scripts/video-pipeline.mjs';
import { assertVideoProvider, UnconfiguredVideoProvider } from '../src/services/video-provider.js';

const entry = {
  videoId: 'VIDEO-TEST-B01', questionId: 'TEST-B01', wordCount: 12,
  targetDurationSeconds: { min: 30, max: 60, estimated: 30 }
};
const narration = 'Pause and verify the request through a trusted channel before taking action.';
const script = `# Test\n\n## Narration transcript\n${narration}\n\n## Next section\nNotes`;
const storyboard = {
  videoId: entry.videoId, questionId: entry.questionId, targetDurationSeconds: 30,
  narration, scenes: [{ time: '0-15s' }, { time: '15-30s' }]
};
const vtt = `WEBVTT\n\n1\n00:00:00.000 --> 00:00:15.000\nPause and verify the request through a trusted channel\n\n2\n00:00:15.000 --> 00:00:30.000\nbefore taking action.\n`;

test('parses valid WebVTT cues and preserves timing', () => {
  const cues = parseVtt(vtt);
  assert.equal(cues.length, 2);
  assert.equal(cues[1].end, 30);
});

test('rejects malformed WebVTT headers', () => {
  assert.throws(() => parseVtt('NOT VTT\n'), /WEBVTT/);
});

test('rejects overlapping or out-of-order WebVTT cues', () => {
  const bad = `WEBVTT\n\n1\n00:00:00.000 --> 00:00:20.000\nOne\n\n2\n00:00:19.000 --> 00:00:30.000\nTwo\n`;
  assert.throws(() => parseVtt(bad), /overlap|out of order/);
});

test('validates canonical script, storyboard and caption synchronization', () => {
  const result = validateNarrationAssets({ script, storyboard, captions: vtt, entry });
  assert.deepEqual(result.errors, []);
  assert.equal(result.narrationWordCount, 12);
  assert.ok(result.captionCoverage >= 0.95);
});

test('rejects storyboard narration drift', () => {
  const result = validateNarrationAssets({ script, storyboard: { ...storyboard, narration: 'A different voiceover.' }, captions: vtt, entry });
  assert.ok(result.errors.some(x => /drifted/.test(x)));
});

test('rejects caption omissions even when cue timing is valid', () => {
  const short = `WEBVTT\n\n1\n00:00:00.000 --> 00:00:30.000\nPause and verify.\n`;
  const result = validateNarrationAssets({ script, storyboard, captions: short, entry });
  assert.ok(result.errors.some(x => /cover/.test(x)));
});

test('accepts an H.264/AAC 16:9 1080p MP4 probe', () => {
  const probe = { format: { format_name: 'mov,mp4,m4a', duration: '45.0' }, streams: [
    { codec_type: 'video', codec_name: 'h264', width: 1920, height: 1080, pix_fmt: 'yuv420p' },
    { codec_type: 'audio', codec_name: 'aac' }
  ] };
  assert.deepEqual(validateProbe(probe, entry, 8_000_000).errors, []);
});

test('rejects media that is not browser-compatible', () => {
  const probe = { format: { format_name: 'matroska,webm', duration: '18' }, streams: [
    { codec_type: 'video', codec_name: 'vp9', width: 640, height: 360, pix_fmt: 'yuv444p' }
  ] };
  const result = validateProbe(probe, entry, 160_000_000);
  assert.ok(result.errors.length >= 5);
});

test('all question-to-video mappings validate while owner-deferred video work remains ungenerated', async () => {
  const result = await validateProject();
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.totals, {
    questions: 133, videos: 133, scripts: 51, storyboards: 51,
    captions: 51, prompts: 51, imported: 0, ready: 0
  });
  assert.equal(result.rows.filter(row => row.status === 'deferred_by_owner_request').length, 82);
  assert.equal(result.rows.filter(row => row.status !== 'deferred_by_owner_request').length, 51);
});

test('provider adapter contract accepts the three required backend methods', () => {
  const provider = { createJob() {}, getJob() {}, downloadAsset() {} };
  assert.equal(assertVideoProvider(provider), provider);
  assert.throws(() => assertVideoProvider({ createJob() {} }), /getJob, downloadAsset/);
});

test('unconfigured provider fails safely without making a network call', async () => {
  const provider = new UnconfiguredVideoProvider();
  await assert.rejects(() => provider.createJob(), /No video provider is configured/);
});
