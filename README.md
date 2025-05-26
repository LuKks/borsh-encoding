# borsh-encoding

Binary Object Representation Serializer for Hashing

```
npm i borsh-encoding
```

Meant to be used on common cases for Solana.

## Usage

```js
const Borsh = require('borsh-encoding')

const IDL_SPL_TOKEN = require('./spl-token.json')
const borsh = new Borsh(IDL_SPL_TOKEN)

const accountInfo = {
  data: Buffer.from(
    'AAAAAAbFwc5jjSVn0mRosF65UdGijcxuEjSCtcZ1FJdw5ivyEyZQoUCNAwAGAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==',
    'base64'
  )
}

const account = borsh.decode(accountInfo.data, ['accounts', 'Mint'])
/* => {
  mintAuthorityOption: 0,
  mintAuthority: 'TSLvdd1pWpHVjahSpsvCXUbgwsL3JAcvokwaKt1eokM',
  supply: 999733653939731n,
  decimals: 6,
  isInitialized: true,
  freezeAuthorityOption: 0,
  freezeAuthority: '11111111111111111111111111111111'
} */
```

Calculate any discriminator, e.g.:

```js
const prefix = Borsh.discriminator('global', 'buy')
```

## License

MIT
