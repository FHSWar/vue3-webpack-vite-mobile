module.exports = {
  extends: [
    'stylelint-config-recess-order',
    'stylelint-config-standard-scss',
    'stylelint-config-recommended-vue/scss',
    'stylelint-config-tailwindcss/scss'
  ],
  plugins: ['stylelint-order'],
  rules: {
    'no-duplicate-selectors': null,
    'declaration-block-no-shorthand-property-overrides': null,
    'no-empty-source': null
  }
}
