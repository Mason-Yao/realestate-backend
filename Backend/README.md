# Welcome to Backend project

# Project Structure

API > Service Layer > Business Logic Layer > Database Layer

For example, Add a client

POST/PUT /client/ with body { id: 1234, name: "David" }

addClient({ id: 1234, name: "David" })

db.dbPut({ id: 1234, name: "David" })

dynaomdb add a item.

# Testing

Integration Test

```
npm run test:integration
```

Mock Test (Requires JRE ver 8.0 or above )

```
npm run test:mock
```
