const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  console.error('dist directory does not exist. Run vite build first.');
  process.exit(1);
}

// Ensure .nojekyll and 404.html
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
if (fs.existsSync(path.join(distDir, 'index.html'))) {
  fs.copyFileSync(path.join(distDir, 'index.html'), path.join(distDir, '404.html'));
}

const remoteUrl = 'https://github.com/hvysgthye/AMORETERNO-.git';
const pushToken = process.env.GITHUB_TOKEN;
const authRemoteUrl = pushToken ? `https://${pushToken}@github.com/hvysgthye/AMORETERNO-.git` : remoteUrl;

try {
  console.log('Publishing build to gh-pages branch...');
  const gitDir = path.join(distDir, '.git');
  if (!fs.existsSync(gitDir)) {
    execSync('git init -b gh-pages', { cwd: distDir, stdio: 'inherit' });
  }
  execSync('git add .', { cwd: distDir, stdio: 'inherit' });
  try {
    execSync('git commit -m "deploy: update GitHub Pages build"', { cwd: distDir, stdio: 'inherit' });
  } catch (e) {
    console.log('No new changes to commit in dist.');
  }
  execSync(`git remote set-url origin ${authRemoteUrl} || git remote add origin ${authRemoteUrl}`, { cwd: distDir, stdio: 'ignore' });
  execSync('git push -f origin gh-pages', { cwd: distDir, stdio: 'inherit' });
  execSync(`git remote set-url origin ${remoteUrl}`, { cwd: distDir, stdio: 'ignore' });
  console.log('Successfully published to GitHub Pages!');
} catch (err) {
  console.error('Error during deployment:', err.message);
  process.exit(1);
}
