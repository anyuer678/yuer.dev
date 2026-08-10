// 列出 anyuer678 的公开仓库
const { execSync } = require('child_process');
const raw = execSync('gh api "users/anyuer678/repos?per_page=100&sort=updated"', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }).replace(/^\uFEFF/, '');
const repos = JSON.parse(raw);
for (const r of repos) {
  const desc = (r.description || '').slice(0, 60);
  console.log(
    r.name.padEnd(22),
    '|', (r.language || '-').padEnd(11),
    '|', r.created_at.slice(0, 10),
    '|', desc
  );
}
console.log('--- 共', repos.length, '个仓库 ---');
