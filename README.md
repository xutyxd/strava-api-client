# Strava API Client (JavaScript)

A modern JavaScript client for the [Strava v3 REST API](https://developers.strava.com/docs/reference/), based on the official [Swagger definition](https://developers.strava.com/swagger/swagger.json). This wrapper simplifies working with Strava’s endpoints, providing a consistent and promise-friendly interface for Node.js or browser-based apps.

> ⚡ Built on OpenAPI, fully type-safe (if used with TypeScript), and ideal for automation, fitness dashboards, or custom Strava integrations.

---

## 🚀 Features

- 🔐 OAuth2 token handling (access/refresh support)
- 🏃 Full coverage of the Strava v3 API
- 📦 Lightweight and dependency-friendly
- 📘 Full TypeScript support
- 📈 Promise-based interface
- 🌐 Works in both Node.js and browsers

---

## 📦 Installation

```bash
npm install strava-api-client
```

## 🛠️ Usage
Initialize the client
```ts
import Strava from 'strava-api-client';

const strava = new Strava({
    client_id: 'your_client_id', // Strava API client ID
    client_secret: 'your_client_secret', // Strava API client secret
    redirect_uri: 'your_redirect_uri', // Strava API redirect URI
    scopes: ['view_private', 'read_all'], // Strava API scopes
});
```

Login
```ts
// Get the authorization URL
const url = strava.oauth.authorize();
// Redirect the user to the URL
window.location.href = url;
// Handle the authorization callback
const authorization = await strava.oauth.token(window.location.hash.split('?')[1]);
// Your Strava access token
console.log(authorization.access_token); 
```

Example: Get Athlete Profile
```ts
const profile = await strava.athlete.me();
console.log(profile.username); // your Strava username
```

Example: List Activities
```ts
const activities = await strava.athlete.activities({
  per_page: 10,
});

activities.forEach(activity => {
  console.log(activity.name, activity.distance);
});
```

## 🔐 Authentication
This client assumes you already have a valid Strava OAuth2 access token. To obtain one:

Register your app: Strava Developer Portal

Use Strava’s OAuth flow to get an access token

Optionally handle token refreshing via your backend

Note: This library does not handle the OAuth2 authorization code flow directly.

## 📘 API Reference
This client wraps the official Strava OpenAPI spec. All endpoints and parameters are mapped 1:1.

See the Strava API Docs for full endpoint definitions.

## ✅ TypeScript Support
This client includes full TypeScript types generated from the OpenAPI spec.

```ts
const athlete: Athlete = await strava.athlete.me();
```

🧭 Roadmap
 - Token refresh helper

 - Browser support via fetch-based HTTP adapter

 - Webhooks & push subscriptions
