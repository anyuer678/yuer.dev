// 拉取指定仓库 README 并保存为 txt（base64 解码）
const { execSync } = require('child_process');
const fs = require('fs');
const repos = ['desktoppet', 'todo-list', 'cet6-vocabulary', 'cet6-vocabulary-eink', 'chatez', 'codedrill', 'polycodehub', 'evocode', '-SSM-PetStore-CMS-', '123'];
fs.mkdirSync('scripts/_readmes', { recursive: true });
for (const repo of repos) {
  try {
    const raw = execSync(`gh api "repos/anyuer678/${repo}/readme"`, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 }).replace(/^\uFEFF/, '');
    const data = JSON.parse(raw);
    const content = Buffer.from(data.content, 'base64').toString('utf8');
    fs.writeFileSync(`scripts/_readmes/${repo}.md`, content);
    console.log(repo.padEnd(24), content.length, 'chars, first line:', content.split('\n')[0].slice(0, 60));
  } catch (e) {
    console.log(repo.padEnd(24), 'NO README or error');
  }
}
