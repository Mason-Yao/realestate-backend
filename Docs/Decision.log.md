# Agent Registration Flow

0. Open 'crm.cyberlark.com.au/XXXX' (any sub-pages too), go directly to /signin

- in every subpage, you check if authorized?

1. (Somehow) Agent sign up in Auth0 in a Auth0 db

   - Signup always enable, anyone can signup
   - Once signed up and login, CRM system checks the email in our db via /profile end point with a token
   - If the user has a role(user/agent) returned, then go to front page,
   - Otherwise, return to sigin page, promotes "Please contact Admin for auth."

2. Agent setup password by themselves, and verify their email

3. Agent login with email

4. CRM System get email, check within our CRM db, and get the role, and see dashboard

---

Authentication (who can login)

- Auth0 db handles it

Authorization (Who can do what)

---

Client ID is Source of trueth!
So when you want to audit (user histroy, user action), save client id.
In other words, client email / name can be changed, and all history will remine the same!

---

Client id, client name,
User

- id\* (auto generated)
- email\*
- relationship (auto generate, downstream agent)

# User and Group

Group, a set of users, has the same role and see the same clients

A client must have a relationship of User/Agent

The group which the user belongs to have the same level, and see all clients under the group.

User A,B,C > GROUP 1
User A,D,E > GROUP 2

So User A can see all clients under
