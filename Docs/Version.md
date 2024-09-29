# Version

Both Frontend and Backend are using `package.json` version attribute to determine the version of the system.
However, the version in Backend and Frontend could be different.

## How it works?

For `prod` release, the github pipeline/action is going to bump the version.
Deployer must choose what version bump will be:

- Patch: bug fix
- Minor: new feature or enhancement
- Major: Broken changes, it means Backend and Frontend must be rebuilt, and it will impact on users

The action will push the version changes and tag the build as well

For other environment, the version is made by:
{version}-{env}-{deploy number}

## How can I see the version

### Frontend

The version can be view in Settings page

### Backend

The version can be retrieved by `/version` endpoint from api
