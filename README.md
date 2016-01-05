# My little planet

Procedural planet generator using WebGL made for the course TNM084 (Procedural
Methods for Images) at Linköping University.

### Setup

Make sure you have [Node.js](https://nodejs.org/en/) installed. Then, install 
`grunt-cli` and our our dependencies using:

```bash
npm install -g grunt-cli
npm install
```

### Run

Run the application for development:

```bash
grunt dev
```

Then open [`localhost:3000`](http://localhost:3000) in your browser (preferably 
Chrome(ium)).

### Build and Deploy

Build it for deployment:

```bash
grunt deploy
```

This builds, minifies and hashes the JS, followed by appending the hash to the
file name. This busts the cache if the file has changed. (It also changes the
reference to the js file in [`index.html`](index.html).)

Then deploy this to your favourite static hosting solution.
