const fs = require('fs');
const { execSync } = require('child_process');

function getPackageVersion() {
  var pkg = require('./package.json');
  return pkg.version;
}

function getLastCommit() {
  var message = null;
  message = execSync('git log -n 1', {timeout: 30000, encoding: 'utf-8'})
//  message = message.replace(/\n/g, '<br>')
  return message;
}

var output = {
    lastBuild: new Date(),
    lastCommit: getLastCommit(),
    version: getPackageVersion()
};

const content = JSON.stringify(output);

fs.writeFile("./public/versions.json", content, 'utf8', function (err) {
    if (err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});
