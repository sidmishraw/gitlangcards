/**
* gitlangcards.js
* @author Sidharth Mishra
* @description GitHub language cards are defined here
* @created Fri Nov 03 2017 23:31:17 GMT-0700 (PDT)
* @copyright 2017 Sidharth Mishra
* @last-modified Fri Nov 03 2017 23:31:17 GMT-0700 (PDT)
*/

//# ES6 style imports
import { GITHUB_LANG_COLORS } from "./gitlangcolors.js";
import React, { Component } from "react";
import ReactDOM, { render } from "react-dom";
// import jQuery from "jquery"; // importing the entire module as jQuery since jQuery uses UMD format
// jQuery is implicitly provided by webpack though the ProvidePlugin, no need to reimport
import "materialize-css";
//# ES6 style imports

/**
 * GitHub language card component
 * 
 * https://github.com/${user}?utf8=%E2%9C%93&tab=repositories&q=&type=&language=${the language}
 */
class GitLangCard extends Component {
  //# constructor
  constructor(props) {
    super(props);
    this.langColor = this.__getMyLangColor(this.props.language);
  }
  //# constructor

  /**
   * Fetches the color of the language used in GitHub's website
   * 
   * @param {string} language The language to get GitHub's color for
   */
  __getMyLangColor(language) {
    return GITHUB_LANG_COLORS[language]["color"];
  }

  /**
   * Renders the component
   */
  render() {
    return (
      <div className="carousel-item col s12 m7" style={{ width: "24%" }}>
        <div className="card horizontal">
          <div className="card-image">
            <span className="left-color-img" style={{ backgroundColor: this.langColor }} />
          </div>
          <div className="card-stacked">
            <div className="card-content">
              <p>{this.props.language}</p>
            </div>
            <div className="card-action">
              <a style={{ color: "dark-orange" }} href={this.props.projectsURL}>
                Projects with this language
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * GitLangCards is the container for the GitLangCard components.
 * 
 * It provides the carousel effect for the cards.
 */
class GitLangCards extends Component {
  //# constructor
  constructor(props) {
    super(props);
    //# state, list of GitLangCard components
    this.state = {
      languageCards: []
    };
    //# state, list of GitLangCard components
    this.__fetchGitHubLangs(this.props.username);
  }
  //# constructor

  /**
   * Fetches the list of languages the User has dabbled in from GitHub
   * @param {*} username The Github user name
   */
  __fetchGitHubLangs(username) {
    if (!username) {
      throw new Error("User name is not mentioned, Bailing out...");
    }

    //# component-this protection
    // since the `this` inside the callback is not the component anymore,
    // need to close over it
    let component = this;
    //# component-this protection
    //# AJAX for fetching data from GitHub
    jQuery.ajax({
      url: `https://api.github.com/users/${username}/repos?per_page=1000`,
      jsonp: true,
      method: "GET",
      dataType: "json",
      //# AJAX success callback
      success: function(res) {
        if (typeof res === "object") {
          // console.log(res);
          let languages = component.__myLanguages(username, res);
          // console.log(languages);
          //# update State after receiving information from GitHub.com
          component.setState({
            languageCards: component.__generateCards(languages)
          });
          //# update State after receiving information from GitHub.com
        } else {
          console.log("Not a valid response, please contact Sid :)");
        }
      },
      //# AJAX success callback
      error: function(e, status) {
        console.log(e, status);
      }
    });
    //# AJAX for fetching data from GitHub
  }

  /**
   * Generates the list of GitLangCard components for the given languages
   * @param {object} languages The object has the mapping for each language to the link of projects with that language on GitHub
   */
  __generateCards(languages) {
    let langCards = [];
    Object.keys(languages).forEach(lang => {
      // console.log(lang);
      langCards.push(<GitLangCard key={lang} language={lang} projectsURL={languages[lang]} />);
    });
    return langCards;
  }

  /**
   * List of all the languages I like to dabble in!
   * 
   * @param {string} username The GitHub user name
   * @param {[object]} projects The list of projects (repos) obtained from GitHub
   */
  __myLanguages(username, projects) {
    let languagesString = "";
    let langs = {};
    projects.map(prj => {
      if (prj["language"] && prj["language"] !== "null") {
        langs[
          prj["language"]
        ] = `https://github.com/${username}?utf8=%E2%9C%93&tab=repositories&q=&type=&language=${encodeURIComponent(
          prj["language"]
        )}`;
      }
    });
    return langs;
  }

  /**
   * Called when the component is going to be unmounted from the DOM
   */
  componentWillUnmount() {
    jQuery(".carousel").carousel("destroy"); // destroy the carousel
  }

  /**
   * Called after the component has and updated on the DOM (?)
   */
  componentDidUpdate() {
    jQuery(".carousel").carousel(); // enable the carousel
    this.props.callback(); // call the callback asked by user
  }

  /**
   * Renders the GitLangCards component on UI
   */
  render() {
    return <div className="carousel">{this.state.languageCards}</div>;
  }
}

/**
 * The only class visible to the user, it will be the only point of interaction with my library
 */
export class GitHubLangColors {
  /**
   * Renders the GitLangCards component in the elementId asked
   * 
   * @param {string} userName The GitHub user name of the consumer
   * @param {string} elementId The element ID of the DOM element where the GitLangCards component will be rendered
   * @param {function} callback The callback the consumer wants to execute after GitLangCards component has been rendered
   */
  renderOnScreen(userName, elementId, callback) {
    render(<GitLangCards username={userName} callback={callback} />, jQuery(`#${elementId}`).get(0));
  }
}
