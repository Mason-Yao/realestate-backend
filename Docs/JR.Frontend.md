# For JR students

## Get started

1. Setup your own environment

   - Typescript
   - React
   - node & npm

2. Build and run your project

   - Build & run

   ```
   cd Frontend
   make build
   make start
   ```

   - Once it run, open `http://localhost:5173/` in your browser.

3. Fun stuff starts!

## Debug

### Understand CRM_ENV and API URL

Read [this](../Docs/Environment.md)

You can use `CRM_API_URL` environment variable to redirect API call, something like

```
export CRM_API_URL=https://0cdax62lpb.execute-api.ap-southeast-2.amazonaws.com/
```

Our dev environment is:

```
export CRM_API_URL=https://api-crm-dev.cyberlark.com.au
```

## Learning Skills

- React
- Typescript
- Redux

## PR rules

0. You don't need to FORK my project, just do your work under this repository.

1. All work need to start in a branch. Under each 'Issue', there is a `Create branch` link to create the branch. Checkout the branch, and add your fix.

2. Commit your changes uner your branch

3. Push your branch

4. Create Pull Request. If you don't want other people to review it, Add `DRAFT` in PR title. Once you are happy your changes. Remove DRAFT, and move on.

5. In PR, please summary what you have fixed, or why you change it in a few sentence. Point to the problem in changes might help reviewers to approve. Also good code comment will also help. For Frontend fix, please attach a screenshot to the review.

6. Ask team member to review. Add at least 2 team remembers in the PR. Change your code, until all members are happy.

7. Assign the PR to me `CyberlarkCode`. I will do a final check, and merge the `main`. This might takes some time to finish.

8. During PR, if the comment has been fix. You can mark this comment as `Resolved`.

9. Once the PR is merged to `main`. Move on, and pick up the next issue.

## Q&A

1. ...

If you have any other questions, please ask me.
If this doc is confusing or not clear, please polish the doc after you have known the answer.

Thanks!
