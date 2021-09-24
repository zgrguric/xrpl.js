import { assert } from 'chai'
import _ from 'lodash'

import { LedgerEntryRequest, LedgerEntryResponse } from 'xrpl-local'

import serverUrl from '../serverUrl'
import { setupClient, suiteClientSetup, teardownClient } from '../setup'
import { verifySuccessfulResponse } from '../utils'

// how long before each test case times out
const TIMEOUT = 20000

describe('ledger_entry', function () {
  this.timeout(TIMEOUT)

  before(suiteClientSetup)
  beforeEach(_.partial(setupClient, serverUrl))
  afterEach(teardownClient)

  it('base', async function () {
    const validatedLedgerResponse = await this.client.request({
      command: 'ledger_data',
      ledger_index: 'validated',
    })

    verifySuccessfulResponse(validatedLedgerResponse)
    const ledgerEntryIndex = validatedLedgerResponse.result.state[0].index

    const ledgerEntryRequest: LedgerEntryRequest = {
      command: 'ledger_entry',
      index: ledgerEntryIndex,
    }

    const ledgerEntryResponse = await this.client.request(ledgerEntryRequest)

    const expectedResponse: LedgerEntryResponse = {
      id: ledgerEntryResponse.id,
      status: 'success',
      type: 'response',
      result: {
        index: ledgerEntryIndex,
        ledger_current_index: ledgerEntryResponse.result.ledger_current_index,
        node: ledgerEntryResponse.result.node,
        validated: false,
      },
    }

    verifySuccessfulResponse(ledgerEntryResponse)
    assert.deepEqual(ledgerEntryResponse, expectedResponse)
  })
})
