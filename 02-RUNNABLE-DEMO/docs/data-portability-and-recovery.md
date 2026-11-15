# CYBERAWARE 3D — data portability, backup and recovery

## Learner quiz progress

The React app stores quiz attempts in the current browser profile; it does not upload learner records to the server or synchronize them between devices.

Use **Settings → Export quiz progress → Export JSON** to create a local backup. Keep the file private because it contains answer selections, correctness outcomes and timestamps. To move progress to another browser profile/device, open the app there and use **Settings → Import quiz progress**.

Import behavior is deliberately conservative:
- the file must use the supported CYBERAWARE 3D export format and be no larger than 2 MB;
- malformed or unknown records are rejected;
- each question ID, pathway, topic, answer choice and correctness value is checked against the current question bank;
- the user must confirm before existing quiz progress is replaced.

The quiz-progress export does not include Simulation Lab activity or browser preferences. The app has no cloud account or cross-device sync. A user who clears their browser profile without first exporting their progress cannot recover that browser-local data from the application server.

## Project deployment backup

The project archive is separate from learner-local progress. On a Linux host, install the backup script as part of the deployment and run it with permission to read `/opt/cyberaware` and write `/var/backups/cyberaware3d`:

```bash
sudo CYBERAWARE_ROOT=/opt/cyberaware \
  CYBERAWARE_BACKUP_DIR=/var/backups/cyberaware3d \
  deploy/backup-cyberaware.sh
```

The script:
- writes to a backup directory outside the source tree;
- uses restrictive directory/file permissions;
- serializes concurrent runs with `flock`;
- excludes VCS metadata, `node_modules`, test results, Playwright reports and `.env*` files;
- includes project content, deployment files, generated static app assets and any video assets already placed in the project (the script does not generate or modify video);
- validates the gzip archive before publishing it and writes a SHA-256 sidecar.

Copy completed archives and checksum sidecars to a separate protected storage location. Apply your organization's retention policy. Do not treat a backup on the same host as disaster recovery.

Verify an archive before restore:

```bash
sha256sum -c cyberaware3d-YYYYMMDDTHHMMSSZ.tar.gz.sha256
tar -tzf cyberaware3d-YYYYMMDDTHHMMSSZ.tar.gz | head
```

## Restore and rollback procedure

1. Create a staging directory on the target filesystem. Do not extract over the live deployment.
2. Extract with ownership restoration disabled; inspect the project tree and permissions.
3. Confirm the configuration and Node runtime match the target deployment. Recreate environment variables/secrets from the operator's secret store; `.env*` files are intentionally excluded.
4. Put the service in maintenance mode and stop it: `sudo systemctl stop cyberaware3d`.
5. Move the current `/opt/cyberaware` to a timestamped rollback directory, then move the staged project into `/opt/cyberaware`.
6. Restore ownership/permissions according to the deployment guide, start the service and verify `curl -fsS http://127.0.0.1:4173/healthz`.
7. Verify the public HTTPS endpoint, content routes, security headers, logs and monitoring before removing maintenance mode.
8. Keep the previous deployment directory until the new deployment is accepted. If checks fail, stop the service, move the failed deployment aside, restore the previous directory, start the service and re-run health checks.

## Operational checks still requiring the target host

This runbook does not itself configure a TLS ingress, certificate renewal, HSTS, monitoring, off-host backup replication, or a tested rollback on your actual host. Those must be exercised in the deployment environment. Learner quiz progress remains a separate browser-export responsibility.
