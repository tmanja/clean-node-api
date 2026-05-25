module.exports = (async function config() {
  const { default: love } = await import('eslint-config-love')

  return [
    {
      // Global ignores (must be in an object by itself)
      ignores: ['node_modules/', 'dist/'],
    },
    {
      ...love,
      files: ['**/*.ts'],
    },
  ]
})()
