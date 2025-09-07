const test = require('brittle')
const IDL = require('solana-idl')
const Borsh = require('../index.js')

test('Pump AMM - Account - Pool', async function (t) {
  const borsh = new Borsh(IDL.pump_amm)

  const accountInfo = {
    value: {
      data: [
        '8ZptBBGxbbz/AAAlcMWYIeY7+EFx23fd5zIM73sAytymXeRG5uKPtVl9rhi5ZV91jq2pcSMYqBYD8mOq8YV+zHL2akGskNa/4aMfBpuIV/6rgYT7aH9jRhjANdrEOdwa6ztVmKDwAAAAAAFL3QTJQUCVEj/ubeLFWmyrsjaWqcqSbMpl/bfzrv7rtc2OVHhArtRehoECAI9eet3DHssa5hX70Wxe14eR9hkOAw1DG5Zd1tZLeaQoUr+ABM9iJzyDbbA7wssN4DkLbTEISGtZ0AMAAA==',
        'base64'
      ]
    }
  }

  // Equivalent of borshCoder.accounts.decode('Pool', buffer)
  t.alike(borsh.decode(accountInfo.value.data, ['accounts', 'Pool']), {
    pool_bump: 255,
    index: 0,
    creator: '3X9pcDuzyVpN659g76tXYEhpCMR8vbM36faDeDBMGFnm',
    base_mint: '2fWkVf417bfxEgUemymkYNagXVitnmNxvq7dhUwnpump',
    quote_mint: 'So11111111111111111111111111111111111111112',
    lp_mint: '6793kQoqgH1B2ZDhrYLHTXJSC2JbjEiEBDhxDQYj8Ptx',
    pool_base_token_account: 'EqQTQtw3hpmyzWzxiAMwBceGb6i8e8Nsq7ZDLj8fcjJM',
    pool_quote_token_account: 'CuxEC31tUC4ZnydbUqM4XXuG8KZfMbcXJ6HanrGB2hW',
    lp_supply: 4193388283912n
  })
})

test('Pump AMM - Account - GlobalConfig', async function (t) {
  const borsh = new Borsh(IDL.pump_amm)

  const accountInfo = {
    value: {
      data: [
        'lQicyqD8sNnTu4yrNBzgUoRX8sOBfTJ4RBlj3NVf7Vi6JMmZ3awCqhQAAAAAAAAABQAAAAAAAAAASsL40N1cvJfjKJwZfLUGKlTz2Va5zm5RFfllZ6pcs+ZgjMwd/OlhtDt3nBkVBabi079F1aTbRhitdsgtYXVFNWODcwAOoiyyZNNK/2SgS176v7t03c0EiZexmBVH19EQg4R0KS5nWpS0NuywqZiJQjKKg93GIzgClhJnxc1hF8uNGBoMhJ+pN6bzSt7TCB75VwCqywybs9kJpLkUdSek69eqj7Bg2CkbTE1HXa/3Yslr3A2s6zbAEurRLtOpSEFh4ATIfOuY+lzkf4A4Bv0seUXSlSSVmuwA3tl4FPOPeEb/g4OBi6j6KMPNO21ek/n6uPCXm8NyFazFskaHe6jDyQ==',
        'base64'
      ]
    }
  }

  t.alike(borsh.decode(accountInfo.value.data, ['accounts', 'GlobalConfig']), {
    admin: 'FFWtrEQ4B4PKQoVuHYzZq8FabGkVatYzDpEVHsK5rrhF',
    lp_fee_basis_points: 20n,
    protocol_fee_basis_points: 5n,
    disable_flags: 0,
    protocol_fee_recipients: [
      '62qc2CNXwrYqQScmEdiZFFAnJR262PxWEuNQtxfafNgV',
      '7VtfL8fvgNfhz17qKRMjzQEXgbdpnHHHQRh54R9jP2RJ',
      '7hTckgnGnLQR6sdH7YkqFTAA7VwTfYFaZ6EhEsU3saCX',
      '9rPYyANsfQZw3DnDmKE3YCQF5E8oD89UXoHn9JFEhJUz',
      'AVmoTthdrX6tKt4nDjco2D775W2YK3sDhxPcMmzUAmTY',
      'FWsW1xNtWscwNmKv6wVsU1iTzRN6wmmk3MjxRP5tT7hz',
      'G5UZAVbAf46s7cKWoyKu8kYTip9DGTpbLZ2qa9Aq69dP',
      'JCRGumoE9Qi5BBgULTgdgTLjSgkCMSbF62ZZfGs84JeU'
    ]
  })
})

test('SPL Token - Accounts - Account', async function (t) {
  const borsh = new Borsh(IDL.spl_token)

  // 2fWkVf417bfxEgUemymkYNagXVitnmNxvq7dhUwnpump
  const accountInfo = {
    value: {
      data: [
        'AAAAAAbFwc5jjSVn0mRosF65UdGijcxuEjSCtcZ1FJdw5ivyEyZQoUCNAwAGAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==',
        'base64'
      ]
    }
  }

  // Equivalent of MintLayout.decode(buffer)
  t.alike(borsh.decode(accountInfo.value.data, ['accounts', 'Mint']), {
    mintAuthorityOption: 0,
    mintAuthority: 'TSLvdd1pWpHVjahSpsvCXUbgwsL3JAcvokwaKt1eokM',
    supply: 999733653939731n,
    decimals: 6,
    isInitialized: true,
    freezeAuthorityOption: 0,
    freezeAuthority: '11111111111111111111111111111111'
  })
})

test('SPL Token - Accounts - Account', async function (t) {
  const borsh = new Borsh(IDL.spl_token)

  // So11111111111111111111111111111111111111112
  const accountInfo = {
    value: {
      data: [
        'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==',
        'base64'
      ]
    }
  }

  // Equivalent of MintLayout.decode(buffer)
  t.alike(borsh.decode(accountInfo.value.data, ['accounts', 'Mint']), {
    mintAuthorityOption: 0,
    mintAuthority: '11111111111111111111111111111111',
    supply: 0n,
    decimals: 9,
    isInitialized: true,
    freezeAuthorityOption: 0,
    freezeAuthority: '11111111111111111111111111111111'
  })
})

test('decode events', function (t) {
  const borsh = new Borsh(IDL.pump_amm)

  const logs = [
    'Program 11111111111111111111111111111111 invoke [1]',
    'Program 11111111111111111111111111111111 success',
    'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [1]',
    'Program log: Instruction: InitializeAccount',
    'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 3443 of 605850 compute units',
    'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success',
    'Program pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA invoke [1]',
    'Program log: Instruction: Buy',
    'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]',
    'Program log: Instruction: TransferChecked',
    'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 6147 of 575875 compute units',
    'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success',
    'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]',
    'Program log: Instruction: TransferChecked',
    'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 6238 of 567061 compute units',
    'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success',
    'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]',
    'Program log: Instruction: TransferChecked',
    'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 6238 of 558171 compute units',
    'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success',
    'Program data: Z/RSHyz1d3ewGxRoAAAAAABwOTE0AAAAOqdyYAAAAAAAAAAAAAAAADqncmAAAAAASvlGiiZCAABvDoESdgAAAEE2cl0AAAAAFAAAAAAAAAAt2C8AAAAAAAUAAAAAAAAADPYLAAAAAABuDqJdAAAAAHoErl0AAAAAtEcjOrsZ7PQMJuPsYlLsz38tXk8EDpqWp2r4QOxTPsQSoqvEp1E+fjT+gGvNzkxTJBmsOSVGYUkpX73CWQ9Pi1yCtie9n9neTrs3dnZ7MUqTnonBt2E6De/WlhEcZmrcmDJlw4Nq065SRjx5NQlq4iX/IbWqcQuq/CeQPnhgEZ/Xqo+wYNgpG0xNR12v92LJa9wNrOs2wBLq0S7TqUhBYQHIIfOo8I/viNwxQkp2gK6MloFwTPHl9ciOJ5m3+YIh',
    'Program pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA invoke [2]',
    'Program pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA consumed 2004 of 546069 compute units',
    'Program pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA success',
    'Program pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA consumed 58881 of 602407 compute units',
    'Program pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA success',
    'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [1]',
    'Program log: Instruction: CloseAccount',
    'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 2915 of 543526 compute units',
    'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success',
    'Program 11111111111111111111111111111111 invoke [1]',
    'Program 11111111111111111111111111111111 success'
  ]

  const PROGRAM_DATA = 'Program data: '

  const log = logs.find(log => log.startsWith(PROGRAM_DATA))
  const data = Buffer.from(log.slice(PROGRAM_DATA.length), 'base64')

  const expected = {
    timestamp: 1746148272n,
    base_amount_out: 224164147200n,
    max_quote_amount_in: 1618126650n,
    user_base_token_reserves: 0n,
    user_quote_token_reserves: 1618126650n,
    pool_base_token_reserves: 72733296097610n,
    pool_quote_token_reserves: 507116588655n,
    quote_amount_in: 1567766081n,
    lp_fee_basis_points: 20n,
    lp_fee: 3135533n,
    protocol_fee_basis_points: 5n,
    protocol_fee: 783884n,
    quote_amount_in_with_lp_fee: 1570901614n,
    user_quote_amount_in: 1571685498n,
    pool: 'D8jJQR9BcBrfVhhnJ61Phok1YNfGhzwcFyKXLiLXGxYj',
    user: '2FkCvc2FqrPa5NS9r15JWqXcVUyWdUjEJXU1P7or6BvA',
    user_base_token_account: '7E87PXphaQ1hq96p39obiiPLJLeYmK55e2pS2TKVrAc3',
    user_quote_token_account: 'BF7YRsiaEH3c8ATFy85vshXhU1nEunUsWFRe1aEnHyYA',
    protocol_fee_recipient: 'FWsW1xNtWscwNmKv6wVsU1iTzRN6wmmk3MjxRP5tT7hz',
    protocol_fee_recipient_token_account: '7xQYoUjUJF1Kg6WVczoTAkaNhn5syQYcbvjmFrhjWpx'
  }

  t.alike(borsh.decode(data, ['events', 'BuyEvent']), expected)

  // Guess the name also
  t.alike(borsh.decode(data, ['events']), expected)
})

test('raydium launchpad', function (t) {
  const borsh = new Borsh(IDL.raydium_launchpad)

  const logs = [
    'Program LanMV9sAd7wArD4vJFi2qDdfnVhFxYSUg6eADduJ3uj invoke [1]',
    'Program log: Instruction: BuyExactIn',
    'Program data: vdt/007mYe57J0nr1ttuiFgOVMjM0EfMt3+fGYuNhZt8W2Z3HE3ggQB4xftR0QIA3nQOPunPAwDXrzD8BgAAAKblBzi8IwIAeHeB7wgAAAAwcQ7noS8CAJgb/WMJAAAAAGcEdgAAAACKiwav5QsAAPCHSwAAAAAAwB8uAQAAAAAwGw8AAAAAAAAAAAAAAAAAAAAB',
    'Program LanMV9sAd7wArD4vJFi2qDdfnVhFxYSUg6eADduJ3uj success',
    'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [1]'
  ]

  const PROGRAM_DATA = 'Program data: '

  const log = logs.find(log => log.startsWith(PROGRAM_DATA))
  const data = Buffer.from(log.slice(PROGRAM_DATA.length), 'base64')

  const expected = {
    pool_state: '9HjtrQriVJaxaTxszNsnxKM5yH55mpRVpD7dL2Sw58cx',
    total_base_sell: 793100000000000n,
    virtual_base: 1073025605596382n,
    virtual_quote: 30000852951n,
    real_base_before: 602241254286758n,
    real_quote_before: 38377977720n,
    real_base_after: 615322366144816n,
    real_quote_after: 40332237720n,
    amount_in: 1980000000n,
    amount_out: 13081111858058n,
    protocol_fee: 4950000n,
    platform_fee: 19800000n,
    creator_fee: 990000n,
    share_fee: 0n,
    trade_direction: { name: 'QuoteToken' },
    pool_status: { name: 'QuoteToken' },
    exact_in: true
  }

  t.alike(borsh.decode(data, ['events', 'TradeEvent']), expected)

  // Guess the name also
  t.alike(borsh.decode(data, ['events']), expected)
})

test('raydium launchpad', function (t) {
  const borsh = new Borsh(IDL.raydium_launchpad)

  const logs = [
    'Program LanMV9sAd7wArD4vJFi2qDdfnVhFxYSUg6eADduJ3uj invoke [1]',
    'Program log: Instruction: BuyExactIn',
    'Program data: vdt/007mYe57J0nr1ttuiFgOVMjM0EfMt3+fGYuNhZt8W2Z3HE3ggQB4xftR0QIA3nQOPunPAwDXrzD8BgAAAKblBzi8IwIAeHeB7wgAAAAwcQ7noS8CAJgb/WMJAAAAAGcEdgAAAACKiwav5QsAAPCHSwAAAAAAwB8uAQAAAAAwGw8AAAAAAAAAAAAAAAAAAAAB',
    'Program LanMV9sAd7wArD4vJFi2qDdfnVhFxYSUg6eADduJ3uj success',
    'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [1]'
  ]

  const PROGRAM_DATA = 'Program data: '

  const log = logs.find(log => log.startsWith(PROGRAM_DATA))
  const data = Buffer.from(log.slice(PROGRAM_DATA.length), 'base64')

  const expected = {
    pool_state: '9HjtrQriVJaxaTxszNsnxKM5yH55mpRVpD7dL2Sw58cx',
    total_base_sell: 793100000000000n,
    virtual_base: 1073025605596382n,
    virtual_quote: 30000852951n,
    real_base_before: 602241254286758n,
    real_quote_before: 38377977720n,
    real_base_after: 615322366144816n,
    real_quote_after: 40332237720n,
    amount_in: 1980000000n,
    amount_out: 13081111858058n,
    protocol_fee: 4950000n,
    platform_fee: 19800000n,
    creator_fee: 990000n,
    share_fee: 0n,
    trade_direction: { name: 'QuoteToken' },
    pool_status: { name: 'QuoteToken' },
    exact_in: true
  }

  t.alike(borsh.decode(data, ['events', 'TradeEvent']), expected)

  // Guess the name also
  t.alike(borsh.decode(data, ['events']), expected)
})
