import { randomBytes, scrypt as scryptCallback, timingSafeEqual, type ScryptOptions } from "node:crypto"
const COST = 1 << 15
const BLOCK_SIZE = 8
const PARALLEL = 1
const KEY_LENGTH = 64

function derive(password: string, salt: Buffer, length: number, options: ScryptOptions) {
  return new Promise<Buffer>((resolve, reject) => {
    scryptCallback(password, salt, length, options, (error, key) => error ? reject(error) : resolve(key as Buffer))
  })
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16)
  const derived = await derive(password, salt, KEY_LENGTH, { N: COST, r: BLOCK_SIZE, p: PARALLEL, maxmem: 128 * 1024 * 1024 })
  return `scrypt$${COST}$${BLOCK_SIZE}$${PARALLEL}$${salt.toString("hex")}$${derived.toString("hex")}`
}

export async function verifyPassword(password: string, encoded: string): Promise<boolean> {
  const [algorithm, cost, blockSize, parallel, saltHex, hashHex] = encoded.split("$")
  if (algorithm !== "scrypt" || !cost || !blockSize || !parallel || !saltHex || !hashHex) return false
  const salt = Buffer.from(saltHex, "hex")
  const expected = Buffer.from(hashHex, "hex")
  if (!salt.length || expected.length !== KEY_LENGTH) return false
  const actual = await derive(password, salt, expected.length, {
    N: Number(cost), r: Number(blockSize), p: Number(parallel), maxmem: 128 * 1024 * 1024,
  })
  return timingSafeEqual(actual, expected)
}
