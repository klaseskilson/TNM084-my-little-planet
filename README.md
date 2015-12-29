# My little planet

Procedural planet generator using WebGL made for the course TNM084 (Procedural
Methods for Images) at Linköping University.

### Setup

Install dependencies using:

```bash
npm install
```

### Run

Run the application for development:

```bash
grunt dev
```

### Deploy

Build it for deployment:

```bash
grunt deploy
```

This builds, minifies and hashes the JS, followed by appending the hash to the
file name. This busts the cache if the file has changed. (It also changes the
reference to the js file in [`index.html`](index.html).)
