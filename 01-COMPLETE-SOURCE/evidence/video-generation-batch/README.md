# CYBERAWARE 3D — video generation batch

Each folder contains one question-bound generation package: narration, script, storyboard, visual prompt, WebVTT draft and `job.json`. Do not submit a job while its status is `blocked_pending_human_review`. Keep the script transcript as the only narration source. Generated output must be H.264/AAC MP4, 16:9, 720p or higher, 30–60 seconds. Import with `npm run video:import -- --video-id VIDEO-ID --file /path/to/render.mp4`, then complete human validation and `npm run video:approve`.
