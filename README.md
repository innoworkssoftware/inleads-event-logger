# InLeads

Server side implementation of [InLeads](https://inleads.ai)'s Event Log module.

## Getting Started

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Functions Reference](#functions-reference)

## Installation

### NPM

```bash
npm install @inleads/event-logger --save
```

## Yarn

```bash
yarn add @inleads/event-logger
```
## Script

```bash
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/innoworkssoftware/inleads-event-logger/dist/events.js"></script>
```

## Basic Usage

**Node.js**

```javascript
const InLeads = require('@inleads/event-logger')
// The only required field is the api token
InLeads.init('api-token');

// Only email is Mandatory
InLeads.setUser('email', 'name', { role: 'some-role' });

// track should only be called once init and setUser is completed
// event-type is mandatory
InLeads.track('event-type', { from: 'screen-name' });
```

**ES6 module**

```javascript
import { init, track, setUser } from '@inleads/event-logger'
// The only required field is the api token
init('api-token');

// Only email is Mandatory
setUser('email', 'name', { role: 'some-role' });

// track should only be called once init and setUser is completed
// event-type is mandatory
track('event-type', { from: 'screen-name' });
```

**General JavaScript (script tag)**

```javascript
// The only required field is the api token
inleadsEvents.init('api-token');

// Only email is Mandatory
inleadsEvents.setUser('email', 'name', { role: 'some-role' });

// track should only be called once init and setUser is completed
// event-type is mandatory
inleadsEvents.track('event-type', { from: 'screen-name' });
```
## Functions Reference

### init

```javascript
  init('api-token')
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api-token` | `string` | **Required**. Your API key |

### setUser

```javascript
  setUser('email', 'name', {role: "userRole"})
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`      | `string` | **Required**. Email Id of the contact / user |
| `name`      | `string` | **Optional**. Name of the contact / user |
| `options`      | `object` | **Optional**. JSON object can have any meta data to save with user data |

### track

```javascript
  track('event-type', {from: "screenName"})
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `event-type`      | `string` | **Required**. Name for the event can be any string |
| `options`      | `object` | **Optional**. JSON object can have any meta data to save with event data |
