# InLeads

Server side implementation of [InLeads](https://inleads.ai)'s Event Log module.

## Install(npm)

```bash
npm install @inleads/event-logger --save
```

## Install(yarn)

```bash
yarn add @inleads/event-logger
```

## Basic Usage

```javascript
const InLeads = require('@inleads/event-logger')
// The only required field is the api token
InLeads.init('api-token');
// track should only be called once init is completed
// event-type and contact-email are mandatory
InLeads.track('event-type', 'contact-email', 'contact-name');
```

#### or

```javascript
import { init, track } from '@inleads/event-logger'
// The only required field is the api token
init('api-token');
// track should only be called once init is completed
// event-type and contact-email are mandatory
track('event-type', 'contact-email', 'contact-name');
```
