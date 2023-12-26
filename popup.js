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
  
    let commitInterval;
    let commitCount = 0;
  
    function startCommit() {
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
  