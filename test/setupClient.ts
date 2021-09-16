/* eslint-disable no-param-reassign -- Necessary for test setup */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- Necessary for test setup */
import { Client, BroadcastClient } from 'xrpl-local'

import createMockRippled, { createBroadcastMockRippled } from './mockRippled'
import { getFreePort } from './testUtils'

async function setupMockRippledConnection(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Typing is too complicated
  testcase: any,
  port: number,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    testcase.mockRippled = createMockRippled(port)
    testcase._mockedServerPort = port
    testcase.client = new Client(`ws://localhost:${port}`)
    testcase.client.connect().then(resolve).catch(reject)
  })
}

async function setupMockRippledConnectionForBroadcast(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Typing is too complicated
  testcase: any,
  ports: number[],
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const servers = ports.map((port) => `ws://localhost:${port}`)
    testcase.mockRippled = createBroadcastMockRippled(ports)
    testcase.client = new BroadcastClient(servers)
    testcase.client.connect().then(resolve).catch(reject)
  })
}

async function setupClient(this: unknown): Promise<void> {
  return getFreePort().then(async (port) => {
    return setupMockRippledConnection(this, port)
  })
}

async function setupBroadcast(this: unknown): Promise<void> {
  return Promise.all([getFreePort(), getFreePort()]).then(async (ports) => {
    return setupMockRippledConnectionForBroadcast(this, ports)
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Typing is too complicated
function teardownClient(this: any, done: () => void): void {
  this.client
    .disconnect()
    .then(() => {
      this.mockRippled.close()
      setImmediate(done)
    })
    .catch(done)
}

export {
  setupBroadcast,
  teardownClient,
  setupBroadcast as setupClient,
  setupClient as setupClientActual,
  createMockRippled,
}
