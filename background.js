// Background script to handle GitHub commits
chrome.runtime.onInstalled.addListener(function () {
    // Set your initial settings or perform any setup here
  });
  
  const { Octokit } = require('@octokit/rest');
  const config = require('./config.json');
  
  let commitInterval;
  
  function randomLetters(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
  
  function commitToGitHub() {
    const octokit = new Octokit({
      auth: config.personal_token
    });
  
    octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: config.owner,
      repo: config.repo,
      path: `${randomLetters(10)}.txt`,
      message: config.commit_message,
      content: Buffer.from(config.file_content).toString('base64')
    }).then(res => {
      console.log(res.data.commit.url);
    }).catch(err => console.log(err));
  }
  
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'startCommit') {
      commitInterval = setInterval(commitToGitHub, config.interval);
    } else if (request.action === 'stopCommit') {
      clearInterval(commitInterval);
    }
  });
  