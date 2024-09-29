# Entity

## Database

We use dynamodb to store all data, and use `PK` as entity type.

We split data into multiple tables:

- CRM Table: Stores Client and system data
- CRM Property Table: Stores business information

### CRM Table

In CRM table, we restore the following entity

#### PK

In the table, we have those entity for PK:

- User
- Client
- Reminder
- Template
- Settings

##### User

User, also known as `Agent`, people who can login to the system.
The attributes are:

- id
- email
- phone

TODO: It might have different permission levels.

See the detailed list can be found in [Profile](../Shared/Interface/profile.ts).

##### Client

Client entity stores client information, including but not limited to:

- id
- name
- gender
- email
- phones

See the detailed list can be found in [Client](../Shared/Interface/client.ts).

##### Reminder

Reminder entity stores reminder information that allow users to get a reminder:

- id
- name: Reminder title, brief on what to remind
- description: Detail description on what you need to remind
- reference: created two way reference
  - PK: From which entity, eg: Client
  - id: The id of the entity
- createdBy: who created
- lastModifiedDate: The date should be reminded
- repeat: NOT USED!

See the detailed list can be found in [Reminder](../Shared/Interface/reminder.ts).

##### Template

Template entity stores email template information for marketing, including but not limited to:

- id
- name: name of the template
- subject: email subject
- template: HTML format template
- createdDate
- lastModifiedDate

See the detailed list can be found in [EmailTemplate](../Shared/Interface/email.ts).

##### Settings

Settings entity stores system configuration. Usually we use them as 'Key - Value' pair.
The attributes are:

- id
- name
- value
- createdDate
- lastModifiedDate

See the detailed list can be found in [Settings](../Shared/Interface/settings.ts).

### CRM Property Table

In CRM table, we restore the property information.

#### PK

In the table, we have those entity for PK:

- Property

##### Property

Property entity stores property information, including but not limited to:

- id
- property info (bathrooms, sourceType, type, description, price, area, )
- coordinates: google location (lng and lat)
- createdBy
- createdDate
- lastModifiedDate
- POI: place of interest (google, location, distance, etc)
- files: photos or pdf for the property

See the detailed list can be found in [Property](../Shared/Interface/property.ts).

## Seed Data

The CRM table seed data can be found in [here](../Database/insertInitialData.sh)

The Property table seed data can be found in [here](../Database/Property/insertPropertyData.sh)

## Terminology

### Client Types

`Client` - Customers whose information logged inside of our system
`User` - also known as `Agent`, people who can login to the system
`Admin` - Full access, who pay for the system, and can add user/agents and clients
