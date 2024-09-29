# Real Estate CRM System Backend

# JR student

Please read get started from [here](./Docs/JR.Backend.md).

# Database

Run `./createTable.sh` to create dynamodb table.
You need to setup aws environment first, check [This](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html) if haven't done so.

# FrontEnd

Run `make build_frontend`

# BackEnd

Run `make build_backend`

# Environment Variable

```
CRM_ENV: Required, and also need to setup config json for environment settings. Set to `prod` if production release
CRM_DEBUG: default `false`, set to `true` if you need debug logging
```

# Visual Code Extension

You need to install the following extension:

- Code Spell Checker
- Prettier - Code formatter
