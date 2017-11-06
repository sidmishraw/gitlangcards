/**
* webpack.config.js
* @author Sidharth Mishra
* @description Webpack configuration, will export the library into one big bundle.
* @created Fri Nov 03 2017 23:06:11 GMT-0700 (PDT)
* @copyright 2017 Sidharth Mishra
* @last-modified Fri Nov 03 2017 23:06:11 GMT-0700 (PDT)
*/

//# imports CommonJS style
const path = require("path");
const webpack = require("webpack");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");
//# imports CommonJS style

//# HTMLWebpackPlugin configuration for injecting code into the app.html's body
const HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  template: path.join(__dirname, "/src/app.html"),
  filename: "./bin/app.html",
  inject: "body"
});
//# HTMLWebpackPlugin configuration for injecting code into the app.html's body

/**
 * The Webpack configuration object, configures Webpack for the project.
 */
const webpackConfig = {
  //# entry points, can be multiple files if multiple JS files are needed in the library/project
  // The key names are used for naming the outputs which use the `[name]` to resolve themselves.
  entry: {
    materialize: "materialize-loader!./materialize.config.js", // entry point for materialize.config.js; used for materialize-css
    gitlangcards: path.join(__dirname, "/src/index.js") // the entry point of the dependency graph
  },
  //# entry points, can be multiple files if multiple JS files are needed in the library/project

  //# output, I compile this JS code as a library
  // the `filename` signifies the name of the output bundle. The `[name]` is resolved from the names
  // or keys provided in the `entry` property of the `webpackConfig`.
  //
  // The `libraryTarget` field represents the consumer's module system, I chose UMD
  // or the `Universal Module Definition`. This type of library can be consumed by all the module systems:
  // `amd`, `commonjs`, `commonjs2`, and `root`.
  //
  // The `library` field represents the name of the library it
  // (name of the global variable in case of `root` or `var` mode;
  // export variable's property in commonjs module system; module.exports.default
  // variable's property in commonjs2; and define([`name-of-library`, function(`name-of-library`)]...) in
  // the case of an AMD module system)
  //
  // `umdNamedDefine: true` <--- This will name the AMD module of the UMD build.
  // Otherwise an anonymous `define` is used. That is -- define(['name-of-lib', function(`name-of-lib`)...]) is used
  output: {
    filename: "./bin/[name].bundle.js",
    libraryTarget: "umd",
    library: ["[name]"],
    umdNamedDefine: true // use the `library` field's value for define in AMD module systems
  },
  //# output, I compile this JS code as a library

  //# External dependencies
  // This option is used to definedependencies that should be resolved in the target environment(consumer side)
  // These are used by the library but not included in the bundle
  // Following is a simple explanation for my understanding(I'm super forgetful :/):
  // `react` key is used to denote how the external library - in this case `React.js`
  // is being used in this library.
  // The object corressponding to the `react` key has elements:
  // `root`: "React" <--- This represents the form in which the react namespace(variable/module) is available
  //                      as a global variable. This is used when the consumer includes React.js in the
  //                      HTML's script tag(for eg: CDN)
  //                      When I include "React.js" as an external script in my HTMl, it is available to me
  //                      in the form of the global "React" variable, hence in "root" it is "React"
  //                      Note: This is the default setting for all externals
  //
  // `commonjs`: "react" <--- This represents the form in which the `React.js` library is available in the
  //                          scenario the consumer is using a CommonJS module system(for eg: Node.js).
  //                          It is resolved as `const React = require("react");`
  //                          In ES6 format, it is also resolved as import React from "react";
  //  Note: Since, I'm using `require("react")` -- the value of the mapping is "react"
  // [Since ES6's import system plays well with CommonJS, AMD and CommonJS2 styles]
  //
  // `commonjs2`: "react" <--- Similar to the `commonjs`(CommonJS) scenario, the consumer is using a
  //                           module system that is `CommonJS2` style imports, so the `React.js`
  //                           module is available in the enviroment through a
  //                           `const React = require("react")`
  // It is similar to commonjs but in commonjs2, exports are in the form of `module.exports.default = ?`
  //  Note: Since, I'm using `require("react")` -- the value of the mapping is "react"
  //                           In ES6 format, it is also resolved as import React from "react";
  // [Since ES6's import system plays well with CommonJS, AMD and CommonJS2 styles]
  //
  // `amd`: "react" <--- Similar to the `commonjs` and `commonjs2` scenarios but the consumer is using
  //                     a `Asynchronous Module Definition` (AMD) module system.
  //                     The `React.js` library is available as something like the following:
  //                     `define(["react"], function(react){
  //                          return function() {};
  //                      });`
  //  Note: Since, I'm using `define(["react"]...) inside AMD modules, `amd` style external
  // dependency maps to "react", as it will be used to resolve it.
  //                     In ES6 format, it is also resolved as import React from "react";
  // [Since ES6's import system plays well with CommonJS, AMD and CommonJS2 styles]
  //
  // For jquery, I use `import jQuery from "jquery"` in my ES6 code
  // so the key is `jquery`. In `root` (global variable mode), it is available as "jQuery" global variable
  // but in other cases I need to import the module as "jquery", hence the values are "jquery".
  //
  // For `react-dom`, I use it as `import {render} from "react-dom"` in my ES6 code
  // but globally(root mode) it is available as "ReactDOM" global variable
  // hence, the value is "ReactDOM" for `root`.
  // In other cases, I need to do a `require("react-dom")` like in my ES6 code, so they have the same values
  // that is -- "react-dom"
  //
  // In case of materialize-css, I do a `import "materialize-css"` in the ES6 code to
  // import materialize-css module, but, in case of `root` mode -- `materialize-css` is available
  // as the "materialize" global variable. In case of `commonjs`, `commonjs2`, and `amd` `materialize-css`
  // is imported as in my ES6 code -- and the name hence is "materialize-css"
  externals: [
    {
      react: {
        root: "React",
        commonjs2: "react",
        commonjs: "react",
        amd: "react"
      }
    },
    {
      "react-dom": {
        root: "ReactDOM",
        commonjs: "react-dom",
        commonjs2: "react-dom",
        amd: "react-dom"
      }
    },
    {
      jquery: {
        root: "jQuery",
        commonjs: "jquery",
        commonjs2: "jquery",
        amd: "jquery"
      }
    },
    {
      "materialize-css": {
        root: "materialize",
        commonjs: "materialize-css",
        commonjs2: "materialize-css",
        amd: "materialize-css"
      }
    }
  ],
  //# External dependencies

  //# module specific configurations, and loaders
  module: {
    loaders: [
      //# for materialize-css
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: "url-loader?limit=10000&mimetype=application/font-woff",
            options: {
              outputPath: "./bin/"
            }
          }
        ]
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "./bin/"
            }
          }
        ]
      },
      //# for materialize-css
      {
        test: /\.css$/i,
        loaders: ExtractTextWebpackPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
        test: /\.jsx{0,1}$/i, // matches files ending with js or jsx
        loader: "babel-loader",
        exclude: /node_modules/i,
        query: {
          presets: ["env", "react"] // babel loader used for transpiling ES6 code and JSX
        }
      }
    ]
  },
  //# module specific configurations, and loaders

  //# plugin configurations
  plugins: [
    //# Extract text webpack plugin
    // This is used for extracting text content and printing them as is.
    // Useful for CSS files, since Webpack doesn't understand CSS, it is a JS module bundler.
    // Hence this plugin is used.
    new ExtractTextWebpackPlugin({ filename: "./bin/gitlangcards-styles.css", allChunks: true }),
    //# Extract text webpack plugin

    //# HTML webpack plugin
    // This plugin is used for easy generation of HTML content
    HTMLWebpackPluginConfig,
    //# HTML webpack plugin

    //# ProvidePlugin configuration
    // The ProvidePlugin is used for providing variables, imports automatically.
    // Because of this plugin, the moment `$` or `jQuery` or `window.jQuery` etc
    // variables are required in my code, they are resolved by Webpack by importing the "jquery"
    // library automatically for me.
    // So, I don't need to write `import jQuery from "jquery"` in my ES6 code,
    // rather I can directly use `jQuery`. Webpack will take care of resolutions :)
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
      "window.$": "jquery",
      "this.jQuery": "jquery",
      "this.$": "jquery"
    })
    //# ProvidePlugin configuration
  ]
  //# plugin configurations
};

//# export webpack configuration
module.exports = webpackConfig;
//# export webpack configuration
