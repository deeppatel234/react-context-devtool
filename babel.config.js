module.exports = {
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    [
      '@babel/plugin-transform-runtime',
      {
        regenerator: true,
      },
    ],
    [
      'babel-plugin-styled-components',
      {
        displayName: true,
      },
    ],
  ],
  presets: [
    [
      '@babel/preset-env',
      {
        loose: true,
        modules: process.env.BABEL_ENV === 'cjs' ? 'commonjs' : false,
        targets: {
          node: 10,
        },
      },
    ],
    '@babel/preset-react',
  ],
};
