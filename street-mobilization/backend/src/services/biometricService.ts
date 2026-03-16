import crypto from 'crypto';

/**
 * @title BiometricService
 * @dev Service for handling biometric data processing and verification.
 */
class BiometricService {
  /**
   * Generates a SHA256 hash from a fingerprint/biometric template.
   * @param template The biometric template data (string or buffer).
   * @returns The SHA256 hash as a hex string.
   */
  public static generateHash(template: string | Buffer): string {
    return crypto.createHash('sha256').update(template).digest('hex');
  }

  /**
   * Verifies if a given template matches a recorded hash.
   * @param template The biometric template to verify.
   * @param recordedHash The hash stored on the blockchain/database.
   * @returns Boolean indicating if it's a match.
   */
  public static verifyMatch(template: string | Buffer, recordedHash: string): boolean {
    const currentHash = this.generateHash(template);
    return currentHash === recordedHash;
  }
}

export default BiometricService;
