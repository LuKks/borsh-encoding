const { sha256 } = require('@noble/hashes/sha256')
const bs58 = maybeDefaultModule(require('bs58'))
const b4a = require('b4a')

module.exports = class Borsh {
  constructor (idl) {
    this.idl = idl
    this.discriminators = discriminatorsToNames(idl)
  }

  static discriminator (prefix, name) {
    // Types: account, event, global, state
    const hash = b4a.from(sha256(prefix + ':' + name))

    return hash.slice(0, 8)
  }

  layout (data) {
    if (Array.isArray(data)) data = b4a.from(data[0], data[1] || 'base64')
    if (typeof data === 'string') data = b4a.from(data, 'base64')

    const hash = b4a.toString(data.slice(0, 8), 'hex')
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
  }

  decode (data, id) {
    if (!data) {
      return null
    }

    if (Array.isArray(data)) data = b4a.from(data[0], data[1] || 'base64')
    if (typeof data === 'string') data = b4a.from(data, 'base64')

    let [sub, name] = id

    // Normally for events, need to guess the event name
    if (!name) {
      const tmp = this.layout(data)

      if (tmp) {
        name = tmp.name
      }
    }

    let layout = this.idl[sub].find(ix => ix.name === name)

    if (!layout) {
      throw new Error('Layout not found for: ' + sub + ' and ' + name)
    }

    // We set offset here because layout can be overwritten below
    let discriminator = layout.discriminator || null

    // Try to find it somewhere else
    if (!discriminator && sub === 'types') {
      const ix = this.idl.instructions.find(ix => ix.name === name)
      const acc = this.idl.accounts.find(ix => ix.name === name)
      const evt = this.idl.events.find(ix => ix.name === name)

      if (ix) discriminator = ix.discriminator
      if (acc) discriminator = acc.discriminator
      if (evt) discriminator = evt.discriminator
    }

    let offset = discriminator ? 8 : 0

    if (discriminator) {
      const hash = b4a.toString(data.slice(0, 8), 'hex')

      if (hash !== b4a.toString(b4a.from(discriminator), 'hex')) {
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
            const definition = this.idl.types.find(t => t.name === field.type.defined.name ? field.type.defined.name : field.type.defined)

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

        // Skip new extra fields when parsing old data
        if (input.byteLength === 0) {
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
      if (typeof field.type.defined === 'string') {
        return field.type.defined.slice(0, 7) === 'COption'
      } else {
        return false
      }
    }

    function getOptionType (field) {
      return field.type.defined.slice(8, field.type.defined.length - 1)
    }

    // TODO
    /* function isOptionEmpty (tag) {
      if (tag.equals(b4a.from([0, 0, 0, 0]))) return true
      else if (tag.equals(b4a.from([1, 0, 0, 0]))) return false

      throw new Error('Option tag is invalid: ' + tag)
    } */
  }

  read (type, data) {
    switch (type) {
      case 'u8': return [data.readUInt8(0), 1]
      case 'u16': return [data.readUInt16LE(0), 2]
      case 'u32': return [data.readUInt32LE(0), 4]
      case 'u64': return [readU64LE(data.slice(0, 8)), 8]
      case 'u128': return [readU128LE(data.slice(0, 16)), 16]

      case 'i8': return [data.readInt8(0), 1]
      case 'i16': return [data.readInt16LE(0), 2]
      case 'i32': return [data.readInt32LE(0), 4]
      case 'i64': return [readI64LE(data.slice(0, 8)), 8]
      case 'i128': return [readI128LE(data.slice(0, 16)), 16]

      case 'bool': return [data.readUInt8(0) === 1, 1]

      // TODO
      // case 'enum': return [layout.type.variants[data.readUInt8(0)].name, 1]
      case 'enum': return [data.readUInt8(0), 1]

      case 'publicKey':
      case 'pubkey':
      case 'Pubkey':
        return [bs58.encode(data.slice(0, 32)), 32]

      case 'string': {
        const length = data.readUInt32LE(0)
        const value = b4a.toString(data.slice(4, 4 + length), 'utf8')

        return [value, 4 + length]
      }
    }

    if (type && typeof type === 'object') {
      if (type.array) {
        const $type = type.array[0]
        const size = type.array[1]

        const arr = []
        let offset = 0

        for (let i = 0; i < size; i++) {
          const [value, bytes] = this.read($type, data.slice(offset))

          arr.push(value)

          offset += bytes
        }

        return [arr, offset]
      }
    }

    throw new Error('Unsupported field type: ' + type)
  }
}

function readU64LE (buffer) {
  return new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength).getBigUint64(0, true)
}

function readU128LE (buffer) {
  const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength)

  const low = view.getBigUint64(0, true)
  const high = view.getBigUint64(8, true)

  return (high << 64n) + low
}

function readI64LE (buffer) {
  return new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength).getBigInt64(0, true)
}

function readI128LE (buffer) {
  const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength)

  const low = view.getBigUint64(0, true)
  const high = view.getBigInt64(8, true)

  return (high << 64n) + BigInt.asUintN(64, low)
}

function discriminatorsToNames (idl) {
  const discriminators = new Map()

  for (const prefix of ['instructions', 'accounts', 'events']) {
    if (!idl[prefix]) {
      continue
    }

    for (const ix of idl[prefix]) {
      if (!ix.discriminator) continue

      const key = b4a.toString(b4a.from(ix.discriminator), 'hex')
      const value = { prefix, name: ix.name }

      discriminators.set(key, value)
    }
  }

  return discriminators
}

function maybeDefaultModule (mod) {
  return mod.default ? mod.default : mod
}
