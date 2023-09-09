# WebOS TV Integration for Unfolded Circle remotes

This integration allows the Unfolded Circle remotes to integrate with WebOS-based TVs (e.g. LG TVs) and directly control them with Websocket

Note: This repo is still in beta and is not fully stable yet. It's also missing some controls and can maybe break after updates. Please keep that in mind when you're trying to run it yourself

## Build

Run the following commands:

```
npm install
npm run build
```

## How to use the integration

### Running with node directly

You can immediately run the built Javascript file with node:

```
node dist/index.js
```

### Docker

This integration also comes with a Dockerfile. You can built this with the corresponding docker command:

```
docker build -t webostv-integration .
```

and then running it with the docker e.g.

```
docker run --detach --name=webostv-integration --network=host --restart=unless-stopped docker.io/library/webos-integration
```

Note that running it like this, you'll lose the authentication and configured entities after a container recreation. Set volumes for `/app/auth.json` and `/app/configured.json` to keep them on your filesystem.

#### Docker Compose

You can also run it with Docker Compose:

```
services:
  webostv-integration:
    container_name: webostv-integration
    build: .
    network_mode: host
    volumes:
      - ./webostv/auth.json:/app/auth.json
      - ./webostv/configured.json:/app/configured.json
```

This example already contains the volumes set for the corresponding authentication details and configured entities.

## To Do

- Typescript implementation is still not complete yet

* Add remaining commands
* Host Docker containers
* Add some environment variables
