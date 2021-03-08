const vscode = require('vscode');
const path = require('path');
const child_process = require('child_process');
const formatDate = require('./functions/formatDate');

const subversion = {
    path: '',
    name: '',
    revisions: {},

    init(editor) {
        this.destroy();
        this.path = editor.document.fileName.replace(/\$/g, '\\$');
        this.name = path.basename(this.path);

        if (this.path === this.name) return vscode.window.showInformationMessage('Blamer: Cannot identify file');
        return this.blame();
    },

    destroy() {
        this.path = '';
        this.name = '';
        this.revisions = {};
    },

    blame() {
        return new Promise((resolve, reject) => {
            const script = `svn blame -x "-w --ignore-eol-style" "${this.path}"`;
            const process = child_process.spawn(script, { shell: true })

            let [stdout, stderr] = ['', ''];
            process.stderr.on('data', data => { stderr += data.toString() });
            process.stdout.on('data', data => { stdout += data.toString(); });
            process.stdout.on('close', code => {
                if (stderr || code) {
                    reject(stderr);
                } else {
                    resolve(this.getRevisions(stdout));
                }
            })
        })
    },

    getRevisions(data) {
        const lines = data.split(/\n/);

        lines.forEach((line, index) => {
            const revision = line.split(' ').filter(s => s)[0];
            if (revision && revision != '-') this.revisions[index] = parseInt(revision);
        });

        return this.revisions;
    },

    getLog(revision) {
        if (Object.keys(this.revisions).length === 0) return;

        return new Promise((resolve, reject) => {
            const script = `svn log -r${revision} "${this.path}" --xml`;
            const process = child_process.spawn(script, { shell: true });

            let [stdout, stderr] = ['', ''];
            process.stderr.on('data', data => stderr += data.toString());
            process.stdout.on('data', data => stdout += data.toString());
            process.stdout.on('close', code => {
                if (stderr || code) {
                    reject(stderr);
                } else {
                    const commit = {};
                    if (commit.revision = stdout.match(/revision="(.*)">/)) {
                        commit.revision = commit.revision[1];
                    }
                    if (commit.author = stdout.match(/<author>([^<]*)<\/author>/)) {
                        commit.author = commit.author[1];
                    }
                    if (commit.message = stdout.match(/<msg>([^<]*)<\/msg>/)) {
                        commit.message = commit.message[1];
                    }
                    if (commit.date = stdout.match(/<date>([^<]*)<\/date>/)) {
                        commit.date = formatDate(commit.date[1]);
                    }

                    resolve(commit);
                }
            });
        });
    },
};

module.exports = subversion;
