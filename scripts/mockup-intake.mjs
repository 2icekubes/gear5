import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const inboxDir = path.join(root, 'mockups', 'inbox');
const requestPath = path.join(root, 'mockups', 'REQUEST.md');
const imagePattern = /\.(png|jpe?g|webp|gif|avif)$/i;

async function getImages() {
  const entries = await readdir(inboxDir, { withFileTypes: true });
  const files = await Promise.all(
    entries
      .filter((entry) => entry.isFile() && imagePattern.test(entry.name))
      .map(async (entry) => {
        const filePath = path.join(inboxDir, entry.name);
        const info = await stat(filePath);
        return {
          name: entry.name,
          modified: info.mtime,
          sizeKb: Math.round(info.size / 1024),
        };
      }),
  );

  return files.sort((a, b) => b.modified.getTime() - a.modified.getTime());
}

async function main() {
  const [request, images] = await Promise.all([
    readFile(requestPath, 'utf8').catch(() => ''),
    getImages().catch(() => []),
  ]);

  console.log('Visual mockup workflow');
  console.log('');
  console.log(`Request file: ${path.relative(root, requestPath)}`);
  console.log(`Inbox: ${path.relative(root, inboxDir)}`);
  console.log('');

  if (images.length === 0) {
    console.log('No image files found in mockups/inbox yet.');
  } else {
    console.log('Inbox images, newest first:');
    for (const image of images) {
      console.log(`- ${image.name} (${image.sizeKb} KB, ${image.modified.toLocaleString()})`);
    }
  }

  const routeMatch = request.match(/Route:\s*```text\s*([\s\S]*?)```/);
  const route = routeMatch?.[1]?.trim();
  if (route) {
    console.log('');
    console.log(`Current target route: ${route}`);
  }

  console.log('');
  console.log('Next: edit mockups/REQUEST.md, then ask Codex to apply the latest mockup request.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

