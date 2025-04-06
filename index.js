const crypto = require('crypto')
const { default: bs58 } = require('bs58')

module.exports = class Borsh {
  constructor (idl) {
    this.idl = idl
    this.discriminators = discriminatorsToNames(idl)
  }

  static discriminator (prefix, name) {
    // if (prefix === 'accounts' || prefix === 'events') prefix = prefix.slice(0, prefix.length - 1)

    // Types: account, event, global, state
    const hash = crypto.createHash('sha256').update(prefix + ':' + name).digest()

    return hash.slice(0, 8)
  }

  /* layout (data) {
    const hash = data.slice(0, 8).toString('hex')
    const discriminator = this.discriminators.get(hash)

    if (!discriminator) {
      throw new Error('Discriminator not found: ' + hash)
    }

    // TODO: It might need special handling for "instructions" prefix
    // TODO: I think I'm assuming Pumpfun IDL structure because of the final "types" usage
    const layout = this.idl.types.find(type => type.name === discriminator.name)

    if (!layout) {
      throw new Error('Layout not found for: ' + discriminator.prefix + ', name: ' + discriminator.name)
    }

    return layout
  } */

  decode (data, id) {
    if (!data) {
      return null
    }

    if (Array.isArray(data)) data = Buffer.from(data[0], data[1] || 'base64')
    if (typeof data === 'string') data = Buffer.from(data, 'base64')

    const [sub, name] = id
    let layout = this.idl[sub].find(ix => ix.name === name)

    if (!layout) {
      throw new Error('Layout not found for: ' + sub + ' and ' + name)
    }

    // We set offset here because layout can be overwritten below
    let offset = layout.discriminator ? 8 : 0

    if (layout.discriminator) {
      const hash = data.slice(0, 8).toString('hex')

      if (hash !== Buffer.from(layout.discriminator).toString('hex')) {
        throw new Error('Discriminator mismatch')
      }
    }

    if (!layout.type) {
      layout = this.idl.types.find(t => t.name === layout.name)

      if (!layout) {
        throw new Error('Type definition is not found')
      }
    }

    if (layout.type.kind === 'struct') {
      const struct = {}

      for (const field of layout.type.fields) {
        const input = data.slice(offset)

        if (isDefined(field)) {
          if (isOption(field)) {
            const type = getOptionType(field)

            const [tag, bytes1] = this.read('u32', input)
            const [body, bytes2] = this.read(type, input.slice(bytes1))

            struct[field.name + 'Option'] = tag
            struct[field.name] = body

            offset += bytes1
            offset += bytes2
          } else {
            const definition = this.idl.types.find(t => t.name === field.type.defined)

            const [value, bytes] = this.read(definition.type.kind, input)

            if (definition.type.kind === 'enum') {
              struct[field.name] = definition.type.variants[value]
            } else {
              struct[field.name] = value
            }

            offset += bytes
          }

          continue
        }

        const [value, bytes] = this.read(field.type, input)

        struct[field.name] = value

        offset += bytes
      }

      return struct
    }

    // TODO: We could support individual with .read(~layout, data)
    throw new Error('Layout should start with a struct')

    function isDefined (field) {
      return field.type && typeof field.type === 'object' && field.type.defined
    }

    function isOption (field) {
      return field.type.defined.slice(0, 7) === 'COption'
    }

    function getOptionType (field) {
      return field.type.defined.slice(8, field.type.defined.length - 1)
    }

    /* function isOptionEmpty (tag) {
      if (tag.equals(Buffer.from([0, 0, 0, 0]))) return true
      else if (tag.equals(Buffer.from([1, 0, 0, 0]))) return false

      throw new Error('Option tag is invalid: ' + tag)
    } */
  }

  read (type, data) {
    switch (type) {
      case 'u8': return [data.readUInt8(0), 1]
      case 'u16': return [data.readUInt16LE(0), 2]
      case 'u32': return [data.readUInt32LE(0), 4]
      case 'u64': return [readU64LE(data.slice(0, 8)), 8]
      case 'i64': return [readI64LE(data.slice(0, 8)), 8]

      case 'bool': return [data.readUInt8(0) === 1, 1]

      // case 'enum': return [layout.type.variants[data.readUInt8(0)].name, 1]
      case 'enum': return [data.readUInt8(0), 1]

      case 'publicKey':
      case 'pubkey':
      case 'Pubkey':
        return [bs58.encode(data.slice(0, 32)), 32]
    }

    throw new Error('Unsupported field type: ' + type)
  }
}

function readU64LE (buffer) {
  return new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength).getBigUint64(0, true)
}

function readI64LE (buffer) {
  return new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength).getBigInt64(0, true)
}

function discriminatorsToNames (idl) {
  const discriminators = new Map()

  for (const prefix of ['instructions', 'accounts', 'events']) {
    if (!idl[prefix]) {
      continue
    }

    for (const ix of idl[prefix]) {
      if (!ix.discriminator) continue

      const key = Buffer.from(ix.discriminator).toString('hex')
      const value = { prefix, name: ix.name }

      discriminators.set(key, value)
    }
  }

  return discriminators
}

/* function readU64LE_2 (buf) {
  return BigInt('0x' + Array.from(buf.slice(0, 8)).reverse().map(b => b.toString(16).padStart(2, '0')).join(''))
}

function readI64LE_2 (buf) {
  let u = readU64LE(buf)
  return u >= 2n ** 63n ? u - 2n ** 64n : u
} */
