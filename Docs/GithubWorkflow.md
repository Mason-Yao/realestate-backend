# Github Workflow Actions

We use github action to build our CI/CD pipeline.
We have designed 3 workflows

- Build
- Deploy
- Release

## Build

This workflow is designed for building application and checking automatic testing.
It should be run for all PRs and all branches automatically

## Deploy

This workflow is designed for deploying branch into cloud.
The deploy workflow need to be run manually with the parameters:

- Branch name
- Environment: Which cloud environment? Check [Environment](./Environment.md) doc for more information
- Frontend or Backend project? or both? This allow you to deploy Backend first, so you can do Frontend testing on your own device.

## Release

This workflow is designed for releasing software to production.
The deploy workflow need to be run manually with the parameters:

- Branch name
- Version: Check [Version](./Version.md) doc for more information

It will release in the order:

- Bump the version for both Frontend and Backend
- Push version changes
- Git tag the version
- Build
- Deploy both the Frontend and Backend
