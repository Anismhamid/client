const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const VERSION_FILE = path.join(ROOT, 'version.json');

const VERSION_TYPES = {
    PATCH: 'patch',
    MINOR: 'minor',
    MAJOR: 'major',
};

function run(command) {
    try {
        return execSync(command, {
            cwd: ROOT,
            encoding: 'utf8',
            stdio: ['pipe', 'pipe', 'pipe'],
        }).trim();
    } catch (error) {
        console.error(`\nCommand failed: ${command}\n`);
        console.error(error.stderr || error.message);
        process.exit(1);
    }
}

function readVersion() {
    if (!fs.existsSync(VERSION_FILE)) {
        console.error('❌ version.json not found.');
        process.exit(1);
    }

    try {
        return JSON.parse(fs.readFileSync(VERSION_FILE, 'utf8'));
    } catch (error) {
        console.error('❌ Invalid version.json');
        console.error(error.message);
        process.exit(1);
    }
}

function validateVersion(version) {
    if (!Number.isInteger(version.versionCode) || version.versionCode < 1) {
        throw new Error('versionCode must be a positive integer.');
    }

    if (
        typeof version.versionName !== 'string' ||
        !/^\d+\.\d+\.\d+$/.test(version.versionName)
    ) {
        throw new Error('versionName must use MAJOR.MINOR.PATCH format.');
    }
}

function getGitChanges() {
    const staged = run('git diff --cached --name-status');

    const unstaged = run('git diff --name-status');

    const untracked = run('git ls-files --others --exclude-standard');

    return [
        staged,
        unstaged,
        untracked
            .split('\n')
            .filter(Boolean)
            .map((file) => `??\t${file}`)
            .join('\n'),
    ]
        .filter(Boolean)
        .join('\n');
}

function getGitCommitMessages() {
    try {
        return run('git log -20 --pretty=format:%s');
    } catch {
        return '';
    }
}

function classifyChange(changes, commits) {
    const text = `${changes}\n${commits}`.toLowerCase();

    /*
     * Explicit MAJOR indicators
     */
    const majorPatterns = [
        /breaking[\s_-]?change/,
        /breaking:/,
        /major:/,
        /feat!:/,
        /fix!:/,
        /refactor!:/,
    ];

    if (majorPatterns.some((pattern) => pattern.test(text))) {
        return VERSION_TYPES.MAJOR;
    }

    /*
     * Files that usually represent breaking changes
     */
    const majorFiles = [
        'android/app/build.gradle',
        'android/app/build.gradle.kts',
        'capacitor.config.ts',
        'capacitor.config.json',
    ];

    const changedFiles = changes
        .split('\n')
        .map((line) => line.split('\t').pop())
        .filter(Boolean);

    if (changedFiles.some((file) => majorFiles.includes(file))) {
        /*
         * build.gradle itself does not always mean
         * a breaking release, so only classify as major
         * when accompanied by breaking language.
         */
    }

    /*
     * MINOR indicators
     */
    const minorPatterns = [
        /^feat(\(.+\))?:/m,
        /\bfeature\b/,
        /\bnew category\b/,
        /\bnew categories\b/,
        /\badd(ed|s|ing)?\b/,
        /\bintroduc(e|ed|ing)\b/,
        /\bjobs\b/,
        /\bnew section\b/,
        /\bnew screen\b/,
        /\bnew page\b/,
        /\bnew api\b/,
    ];

    if (minorPatterns.some((pattern) => pattern.test(text))) {
        return VERSION_TYPES.MINOR;
    }

    /*
     * Files that strongly suggest a new feature
     */
    const featurePaths = [
        '/pages/',
        '/screens/',
        '/features/',
        '/jobs/',
        '/categories/',
    ];

    const hasFeatureFile = changedFiles.some(
        (file) =>
            featurePaths.some((pathPart) =>
                file.toLowerCase().includes(pathPart),
            ) && !file.toLowerCase().includes('.test.'),
    );

    if (hasFeatureFile) {
        return VERSION_TYPES.MINOR;
    }

    /*
     * Everything else is PATCH:
     *
     * bug fixes
     * UI fixes
     * refactoring
     * performance
     * notifications
     * styling
     * translations
     */
    return VERSION_TYPES.PATCH;
}

function incrementVersion(version, type) {
    const [major, minor, patch] = version.versionName.split('.').map(Number);

    let newMajor = major;
    let newMinor = minor;
    let newPatch = patch;

    switch (type) {
        case VERSION_TYPES.MAJOR:
            newMajor += 1;
            newMinor = 0;
            newPatch = 0;
            break;

        case VERSION_TYPES.MINOR:
            newMinor += 1;
            newPatch = 0;
            break;

        case VERSION_TYPES.PATCH:
        default:
            newPatch += 1;
            break;
    }

    return {
        versionCode: version.versionCode + 1,
        versionName: `${newMajor}.${newMinor}.${newPatch}`,
    };
}

function writeVersion(version) {
    fs.writeFileSync(
        VERSION_FILE,
        `${JSON.stringify(version, null, 2)}\n`,
        'utf8',
    );
}

function updateAndroidVersion(version) {
    const gradleFile = path.join(ROOT, 'android', 'app', 'build.gradle');

    if (!fs.existsSync(gradleFile)) {
        throw new Error(`Android Gradle file not found: ${gradleFile}`);
    }

    let content = fs.readFileSync(gradleFile, 'utf8');

    const versionCodeRegex = /versionCode\s+\d+/;

    const versionNameRegex = /versionName\s+["'][^"']+["']/;

    if (!versionCodeRegex.test(content)) {
        throw new Error(
            'Could not find versionCode in android/app/build.gradle',
        );
    }

    if (!versionNameRegex.test(content)) {
        throw new Error(
            'Could not find versionName in android/app/build.gradle',
        );
    }

    content = content.replace(
        versionCodeRegex,
        `versionCode ${version.versionCode}`,
    );

    content = content.replace(
        versionNameRegex,
        `versionName "${version.versionName}"`,
    );

    fs.writeFileSync(gradleFile, content, 'utf8');

    console.log(`✅ Android versionCode updated to ${version.versionCode}`);

    console.log(`✅ Android versionName updated to ${version.versionName}`);
}

function main() {
    console.log('\n========================================');
    console.log('       SAFQA AUTO VERSION');
    console.log('========================================\n');

    const version = readVersion();

    validateVersion(version);

    console.log(`Current version: ${version.versionName}`);

    console.log(`Current versionCode: ${version.versionCode}`);

    const changes = getGitChanges();
    const commits = getGitCommitMessages();

    if (!changes && !commits) {
        console.log('\n⚠️ No Git changes detected.');

        console.log('No version was changed.');

        process.exit(0);
    }

    const type = classifyChange(changes, commits);

    const nextVersion = incrementVersion(version, type);

    console.log(`\nDetected release type: ${type.toUpperCase()}`);

    console.log(`New version: ${nextVersion.versionName}`);

    console.log(`New versionCode: ${nextVersion.versionCode}`);

    writeVersion(nextVersion);

    updateAndroidVersion(nextVersion);

    console.log('\n✅ version.json updated successfully.');

    console.log('\nAndroid will now use:');

    console.log(`versionCode ${nextVersion.versionCode}`);

    console.log(`versionName "${nextVersion.versionName}"`);

    console.log('\n========================================\n');
}

main();
