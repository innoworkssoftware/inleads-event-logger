# InLeads

Event Logger SDK for [InLeads](https://inleads.ai). The Smart Sales Management System.

## Getting Started

- [InLeads](#inleads)
  - [Getting Started](#getting-started)
  - [Installation](#installation)
    - [NPM](#npm)
    - [Yarn](#yarn)
    - [Script](#script)
  - [Basic Usage](#basic-usage)
  - [Functions Reference](#functions-reference)
    - [init](#init)
    - [setUser](#setuser)
    - [track](#track)
    - [unset](#unset)

## Installation

### NPM

```bash
npm install @inleads/event-logger --save
```

### Yarn

```bash
yarn add @inleads/event-logger
```
### Script

```bash
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@inleads/event-logger/dist/events.js"></script>
```

## Basic Usage

**Node.js**

```javascript
const InLeads = require('@inleads/event-logger')
// The only required field is the api token
InLeads.init('api-token');

// Should be called once to initialise user, email is Mandatory
InLeads.setUser('email', 'name', { role: 'some-role' });

// track should only be called once init and setUser is completed
// event-name is mandatory
InLeads.track('event-name', { from: 'screen-name' });
```

**ES6 module**

```javascript
import { init, track, setUser } from '@inleads/event-logger'
// The only required field is the api token
init('api-token');

// Should be called once to initialise user, email is Mandatory
setUser('email', 'name', { role: 'some-role' });

// track should only be called once init and setUser is completed
// event-name is mandatory
track('event-name', { from: 'screen-name' });
```

**General JavaScript (script tag)**

```javascript
// The only required field is the api token
inleadsEvents.init('api-token');

// Should be called once to initialise user, email is Mandatory
inleadsEvents.setUser('email', 'name', { role: 'some-role' });

// track should only be called once init and setUser is completed
// event-name is mandatory
inleadsEvents.track('event-name', { from: 'screen-name' });
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
  track('event-name', {from: "screenName"})
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `event-name`      | `string` | **Required**. Name for the event can be any string |
| `options`      | `object` | **Optional**. JSON object can have any meta data to save with event data |

### unset

```javascript
  unset()
```
No parameters required
