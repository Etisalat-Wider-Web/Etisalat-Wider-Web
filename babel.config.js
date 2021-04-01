
module.exports = {
    presets: [
        ["@babel/preset-env", {
            useBuiltIns: 'entry',
            corejs: 3,
            "targets": {
                "esmodules": true
            }
        }],
    ],
    plugins: [
        ["@babel/plugin-transform-runtime", {
            useESModules: false,
        }],
        ["@babel/plugin-proposal-class-properties"]
    ]
};
