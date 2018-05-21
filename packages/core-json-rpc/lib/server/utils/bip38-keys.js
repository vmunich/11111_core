const ark = require('@arkecosystem/client')
const bip38 = require('bip38')
const BigInteger = require('bigi')
const database = require('../services/database')

module.exports = async (userId, bip38password) => {
  try {
    const wif = await database.getUTF8(ark.crypto.sha256(Buffer.from(userId)).toString('hex'))

    if (wif) {
      const decrypted = bip38.decrypt(wif.toString('hex'), bip38password + userId)
      const keys = new ark.ECPair(BigInteger.fromBuffer(decrypted.privateKey), null)

      return { keys, wif }
    }
  } catch (error) {
    throw Error('Could not find a matching WIF')
  }
}