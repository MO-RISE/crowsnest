<img src="./static/crowsnest.png" alt="crowsnest logo" width="150">

# crowsnest

A reaserch platform for the digitalization of maritime operations.

## Overview

`crowsnest` is a microservice-based platform for researching digital solutions for maritime operations.

As a shore center, `crowsnest` will (eventually) allow:

- A VTS-like UI
- Remote sensing from test objects
- Recording and replaying of test scenarios
- Data fusion with sensor data from multiple test objects
- Remote control of test objects

As an onboard platform, `crowsnest` will (eventually) allow:

- A ECDIS-like UI
- Centralized and extensible sensor data platform
- Recording and replaying of scenarios
- Remote sensing using sensor inputs from other test objects
- Injection of control signals into the test object´s control system

To accomplish this, `crowsnest` has core focus on the following activitites:

- Real-time sensor data streaming
- Data logging
- Extensibility using data connectors
- Bridging of instances
- Modular frontend
- Simplistic developer experience

## Messaging solution

`crowsnest` leverages [MQTT](https://mqtt.org/) as its main messaging protocol, more specifically it tries to make use of MQTT v5.0 as much as possible to take advantage of the latest developments.

### Message format

`crowsnest` leverages [brefv](https://github.com/MO-RISE/brefv) as the data message format to ensure interoperability and readability.

### Topic structure

All microservices operating within a `crowsnest` ecosystem should adhere to the following topic structure:

```console
/<parent_type>/<parent_id>/<child_type>/<child_subtype>/<child_id>
```

As an example, a microservice interacting with a LIDAR sensor onboard the ship would publish its observations on the followig topic:

```console
/ship/<some_unique_id_for_this_ship>/observations/lidar/0
```

the `0` (zero) at the end signals that this is the first (of potentially several) lidar observers onboard this ship.

## Architecture

**TODO** - diagrams

## Get started

This repository is the main repository of `crowsnest`. It contains examples of docker-compose setups:

- `docker-compose.base.yml` - defines the base services needed for getting up and running
- `docker-compose.auth.yml` - defines the additional config required to get authentication/authorization going

The compose files build on each other according to the principles outlined [here](https://docs.docker.com/compose/extends/#multiple-compose-files). As such, the following `docker-compose` commands are all valid:

- `docker-compose -f docker-compose.base.yml up`
- `docker-compose -f docker-compose.base.yml -f docker-compose.auth.yml up`

The `.env` file included in this repository serve as an example of what parameters that can be changed in a `crowsnest` setup. It should **not** be used as-is in a production setup!
