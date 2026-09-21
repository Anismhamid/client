import fs from 'node:fs';

const { nodeParts, nodeMetas } = JSON.parse(
    fs.readFileSync('stats/stats.json', 'utf8'),
);

const byChunk = new Map();

for (const meta of Object.values(nodeMetas)) {
    const id = meta.id.replace(/\\/g, '/');
    const i = id.lastIndexOf('node_modules/');

    let key;
    if (i !== -1) {
        const parts = id.slice(i + 13).split('/');
        key = parts[0].startsWith('@') ? `${parts[0]}/${parts[1]}` : parts[0];
    } else {
        const s = id.indexOf('/src/');
        key = s === -1 ? 'other' : 'src/' + id.slice(s + 5).split('/')[0];
    }

    for (const [chunk, partUid] of Object.entries(meta.moduleParts)) {
        const part = nodeParts[partUid];
        if (!part) continue;

        const chunkMap = byChunk.get(chunk) ?? new Map();
        const cur = chunkMap.get(key) ?? { gzip: 0, size: 0 };

        cur.gzip += part.gzipLength ?? 0;
        cur.size += part.renderedLength ?? 0;

        chunkMap.set(key, cur);
        byChunk.set(chunk, chunkMap);
    }
}

const total = (m) => [...m.values()].reduce((s, v) => s + v.size, 0);
const arg = process.argv[2];

const chunk = arg
    ? [...byChunk.keys()].find((c) => c.includes(arg))
    : [...byChunk.keys()].sort(
          (a, b) => total(byChunk.get(b)) - total(byChunk.get(a)),
      )[0];

console.log(`\nChunk: ${chunk}\n`);

console.table(
    [...byChunk.get(chunk)]
        .sort((a, b) => b[1].gzip - a[1].gzip)
        .slice(0, 25)
        .map(([name, v]) => ({
            package: name,
            'gzip KB': +(v.gzip / 1024).toFixed(1),
            'size KB': +(v.size / 1024).toFixed(1),
        })),
);
