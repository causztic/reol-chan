worker: DEBUG=* xvfb-run --server-args="-screen 0 1280x1028x24 -ac +extension GLX +render" node ./lib/index.js
release: npm run migrate up && node ./lib/release.js