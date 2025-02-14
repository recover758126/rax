/**
 * Attention:
 *   The later registered module is called early in parse, but later in generate.
 */
module.exports = [
  // Generate JSON config.
  require('./config'),
  // Extract css from files.
  require('./css'),
  // Handle js code.
  require('./code'),
  // Handle template attrs
  require('./element'),
  // Handle template style attr
  require('./style'),
  // Directive a:for
  require('./list'),
  // Directive a:if
  require('./condition'),
  // JSX+ Directives
  require('./directive'),
  // Handle Rax base components.
  require('./components'),
  // Parse and generate template.
  require('./template'),
];
