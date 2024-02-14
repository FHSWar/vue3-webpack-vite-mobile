module.exports = {
  extends: [
    'stylelint-config-recess-order',
    'stylelint-config-standard',
    'stylelint-config-recommended-vue/scss'
  ],
  plugins: ['stylelint-order'],
  rules: {
    'no-duplicate-selectors': null,
    'declaration-block-no-shorthand-property-overrides': null
  }
}
