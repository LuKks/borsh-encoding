const test = require('brittle')
const Borsh = require('../index.js')

const IDL_SPL_TOKEN = require('./spl-token.json')
const IDL_PUMP_AMM = require('./pump-amm.json')

test('Pump AMM - Account - Pool', async function (t) {
  const borsh = new Borsh(IDL_PUMP_AMM)

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
  const borsh = new Borsh(IDL_PUMP_AMM)

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
  const borsh = new Borsh(IDL_SPL_TOKEN)

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
  const borsh = new Borsh(IDL_SPL_TOKEN)

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
