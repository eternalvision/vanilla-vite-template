/**
 * Splits third-party code into a single long-lived `vendor` chunk.
 *
 * A chunk per package fragments caching into dozens of tiny requests and stalls
 * the first paint behind a waterfall; one vendor chunk stays cached across app
 * releases and costs a single request.
 *
 * @param {string} id absolute module id
 * @returns {string | undefined} chunk name, or undefined to leave placement to the bundler
 */
export const chunkSplitter = (id) => (id.includes('node_modules') ? 'vendor' : undefined);
