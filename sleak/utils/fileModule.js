"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fs = void 0;
const func_1 = require("./func");
const api = {
    fs: require('fs'),
    path: require('path'),
    sass: require('sass')
};
exports.Fs = {
    files: function (path) {
        const fs = api.fs;
        if (exports.Fs.isDir(path).isDirectory) {
            return fs.readdirSync(path);
        }
        else {
            return null;
        }
    },
    mkdir: function (path) {
        api.fs.mkdirSync(path);
    },
    write: function (path, text, func) {
        //@ts-ignore
        let method = text;
        path = cleanPath(path);
        if ((0, func_1.is)(text).null)
            text = '';
        else if (typeof text == "function")
            text = '';
        else if (!(0, func_1.is)(func).null)
            method = func;
        api.fs.writeFile(path, text, (err) => {
            if (err) {
                console.log(err);
                if (typeof method == "function")
                    method(err);
                return;
            }
            else {
                if (typeof method == "function")
                    method(err);
            }
        });
    },
    readChar(path, callback, callback2 = () => '') {
        const { fs } = api;
        var readable = fs.createReadStream(path, {
            encoding: 'utf8',
            fd: null,
        });
        readable.on('readable', function () {
            var chunk;
            while (null !== (chunk = readable.read(1) /* here */)) {
                callback(chunk);
            }
        }).on('end', () => {
            callback2();
        });
    },
    copy: function (from, destination) {
        const fs = api.fs;
        if (fs.existsSync(from)) {
            const stats = exports.Fs.isDir(from);
            if (stats.isDirectory) {
                const name = exports.Fs.name(from);
                exports.Fs.mkdir(api.path.join(destination, name));
                var files = exports.Fs.files(from);
                files.forEach(file => {
                    const joined = api.path.join(from, file);
                    const to = api.path.join(destination, name);
                    exports.Fs.copy(joined, to);
                });
            }
            else if (stats.isFile) {
                //@ts-ignore
                let name = exports.Fs.name(from);
                fs.copyFileSync(from, api.path.join(destination, name));
            }
        }
    },
    isDir: function (path) {
        const fs = api.fs;
        try {
            fs.readdirSync(path);
        }
        catch (e) {
            return { isDirectory: false, isFile: true };
        }
        return { isDirectory: true, isFile: false };
    },
    content: function (path) {
        path = cleanPath(path);
        try {
            return api.fs.readFileSync(path, 'utf-8');
        }
        catch (err) {
            return undefined;
        }
    },
    name: function (link, ext) {
        const path = api.path;
        var file = '';
        if (ext !== undefined) {
            file = path.basename(link, ext).replace('%20', ' ');
        }
        else {
            file = path.basename(link).replace(/%20/g, ' ');
        }
        return file;
    },
    ext(name) {
        return api.path.extname(name);
    },
    dirname(link) {
        return api.path.dirname(link);
    },
    basedir(link) {
        return api.path.basename(exports.Fs.dirname(link));
    },
    stats: function (path) {
        try {
            const stats = api.fs.statSync(path);
            return stats;
        }
        catch (error) {
            return null;
        }
    },
    exists: function (path) {
        return api.fs.existsSync(path);
    },
    watchFile: (link, caller) => {
        if (typeof link == 'object') {
            if (Array.isArray(link)) {
                link.forEach(path => {
                    watch(path);
                });
            }
        }
        else {
            watch(link);
        }
        function watch(args) {
            args = args.replace('file:///', '');
            args = (args.replaceAll('/', '\\'));
            args = args.replaceAll('%20', ' ');
            // stop the watch to avoid double callbacks 
            api.fs.unwatchFile(args);
            // begin the watch 
            let fwait = false;
            api.fs.watch(args, (event, filename) => {
                if (filename) {
                    if (fwait)
                        return;
                    //@ts-ignore
                    fwait = setTimeout(() => {
                        fwait = false;
                    }, 100);
                    caller.fileURL = args;
                }
            });
        }
    },
    unwatchFile: function (link) {
        api.fs.unwatchFile(link);
    },
    join: function (path1, path2) {
        return api.path.join(path1, path2);
    },
    deleteFile(path) {
        (0, func_1.avoid)(e => {
            api.fs.unlinkSync(path);
        });
    },
    deleteFolder: (link) => {
        const { files, join, deleteFile, isDir } = exports.Fs;
        const fs = api.fs;
        function rmDir(dir) {
            var content = files(dir);
            //------
            if (content.length > 0) {
                for (let i = 0; i < content.length; i++) {
                    var filePath = join(dir, content[i]);
                    if (isDir(filePath).isFile) {
                        deleteFile(filePath);
                    }
                    else {
                        rmDir(filePath);
                    }
                }
            }
            fs.rmdirSync(dir);
        }
        rmDir(link);
    },
    breakChar(text, callback, callback2 = () => '') {
        const content = text.split('');
        content.forEach((char, index) => {
            callback(char);
            if ((content.length - 1) == index)
                callback2();
        });
    },
    readChar2(path, callback, callback2 = () => '') {
        const content = exports.Fs.content(path).split('');
        content.forEach((char, index) => {
            callback(char);
            if ((content.length - 1) == index)
                callback2();
        });
    }
};
function createPath(mainPath, item) {
    var result = '';
    // Strip off the other directories from where the files share a place of storage
    mainPath = cleanPath(mainPath);
    item = cleanPath(item);
    const arr1 = mainPath.split('\\');
    const arr2 = item.split('\\');
    const arr3 = mainPath.split('\\');
    const arr4 = item.split('\\');
    var size = arr1.length < arr2.length ? arr2.length : arr1.length;
    // ===========
    for (let i = 0; i < size; i++) {
        var temp1 = arr3[i];
        var temp2 = arr4[i];
        if (temp1 === temp2) {
            arr2.shift();
            arr1.shift();
        }
        else {
            break;
        }
    }
    let len = arr1.length;
    let dots = '';
    let pathB = arr2.join('/');
    if (len > 1) {
        // console.log(len);
        const size = len - 1;
        for (let i = 0; i < size; i++) {
            dots += '../';
        }
        result = dots + pathB;
    }
    else {
        result = pathB;
    }
    // ============
    return result;
}
function cleanPath(link, type) {
    if (type === null || type !== 'html') {
        link = link.replace('file:///', '');
        link = link.replace(/\//g, '\\');
        link = link.replace(/%20/g, ' ');
    }
    else {
        link = link.replace('file:///', '');
        link = link.replace(/\\/g, '\/');
        link = link.replace(/%20/g, ' ');
    }
    return link;
}
