document.addEventListener('DOMContentLoaded', function () {
    const startCommitButton = document.getElementById('startCommit');
    const stopCommitButton = document.getElementById('stopCommit');
    const personalTokenInput = document.getElementById('personalToken');
    const ownerInput = document.getElementById('owner');
    const repoInput = document.getElementById('repo');
    const commitMessageInput = document.getElementById('commitMessage');
    const fileContentInput = document.getElementById('fileContent');
    const intervalInput = document.getElementById('interval');
    const commitCountInput = document.getElementById('commitCount');
    const commitCounterSpan = document.getElementById('commitCounter');
  
    let commitInterval;
    let commitCount = 0;
  
    // Load user settings from storage
  chrome.storage.sync.get(
    {
      personalToken: '',
      owner: '',
      repo: '',
      commitMessage: '',
      fileContent: '',
      interval: 1000,
    },
    function (data) {
      personalTokenInput.value = data.personalToken;
      ownerInput.value = data.owner;
      repoInput.value = data.repo;
      commitMessageInput.value = data.commitMessage;
      fileContentInput.value = data.fileContent;
      intervalInput.value = data.interval;
    }
  );

  function startCommit() {
    // Save user settings to storage
    chrome.storage.sync.set({
      personalToken: personalTokenInput.value,
      owner: ownerInput.value,
      repo: repoInput.value,
      commitMessage: commitMessageInput.value,
      fileContent: fileContentInput.value,
      interval: intervalInput.value,
    });

    commitCount = 0;
    updateCommitCounter();

    commitInterval = setInterval(function () {
      commitCount++;
      updateCommitCounter();
      commitToGitHub();
    }, parseInt(intervalInput.value, 10) || 1000);
  }

  function stopCommit() {
    clearInterval(commitInterval);
  }

  function updateCommitCounter() {
    commitCounterSpan.textContent = commitCount;
  }
  
    function commitToGitHub() {
      const octokit = new Octokit({
        auth: personalTokenInput.value,
      });
  
      octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner: ownerInput.value,
        repo: repoInput.value,
        path: `${randomLetters(10)}.txt`,
        message: commitMessageInput.value,
        content: Buffer.from(fileContentInput.value).toString('base64'),
      }).then((res) => {
        console.log(res.data.commit.url);
      }).catch((err) => console.log(err));
    }
  
    startCommitButton.addEventListener('click', startCommit);
    stopCommitButton.addEventListener('click', stopCommit);
  });
  