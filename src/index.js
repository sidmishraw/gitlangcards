/**
* index.js
* @author Sidharth Mishra
* @description This is going to be the entry point for the dependency graph which will be explored by Webpack.
* @created Fri Nov 03 2017 23:30:06 GMT-0700 (PDT)
* @copyright 2017 Sidharth Mishra
* @last-modified Fri Nov 03 2017 23:30:06 GMT-0700 (PDT)
*/

//# imports ES6
import { GitHubLangColors } from "./components/gitlangcards.js";
import "./css/styles.css";
//# imports ES6

//# export
/**
 * The consumer can access the library by the name of my library `gitlangcards`.
 * `gitlangcards` will have a field called `GitHubLanguageColors` which resolves to the
 * `GitHubLangColors` class defined and exported from the `gitlangcards.js` module or
 * "./components/gitlangcards.js" file. 
 * 
 * Note: JS files are modules [just like in Python]
 * 
 * Consumer side usage:
 * 
 * let langCards = new gitlangcards.GitHubLanguageColors(); // langCards is a GitHubLangColors object
 * langCards.render("sidmishraw", "root", () => console.log("Done!")); // calling the `render()` the of GitHubLangColors object.
 */
export const GitHubLanguageColors = GitHubLangColors;
// I export the GitHubLanguageColors just to provide the `GitHubLangColors` to the consumer
// I don't want the consumer to have access to anyother things. This is used to encapsulate stuff(?)
// Since GitHubLangColors is already used, I can simply use another name to export it.
//
// This index.js serves the same purpose as `__init__.py` in Python packages.
// This is the `entry` point that is used by Webpack for creating the dependency graph.
//
// Also, this can be used by the library creator -- that is I; to export only the stuff I want
// for my consumer to use from a centralized location. All my library js files are bundled and
// this file acts as the entry point to my libraries.
//# export
