package main

import (
    "alpha.dagger.io/dagger"
    "alpha.dagger.io/os"
    "alpha.dagger.io/docker"
)

// Source directory of the repository. We'll connect this from the CLI using `dagger input`
source: dagger.#Artifact

// Here we define a test phase.
// We're using `os.#Container`, a built-in package that will spawn a container
// We're also using `docker.#Pull` to execute the container from a Docker image
// coming from a registry.
test: os.#Container & {
    image: docker.#Pull & {
        from: "node:lts-gallium"
    }
    mount: "/app": from: source
    command: """
      npm ci
      npm test
    """
    dir:     "/app"
}

// Likewise, here we define a lint phase.
lint: os.#Container & {
    image: docker.#Pull & {
        from: "node:lts-gallium"
    }
    mount: "/app": from: source
    command: """
      npm ci
      npm run lint
    """
    dir:     "/app"
}