export declare const Fs: {
    files: (path: any) => string[];
    mkdir: (path: any) => void;
    write: (path: any, text?: string | Function, func?: Function) => void;
    readChar(path: string, callback: Function, callback2?: Function): void;
    copy: (from: string, destination: string) => void;
    isDir: (path: any) => {
        isDirectory: boolean;
        isFile: boolean;
    };
    content: (path: any) => string;
    name: (link: string, ext?: string) => string;
    ext(name: string): string;
    dirname(link: string): string;
    basedir(link: any): string;
    stats: (path: any) => import("fs").Stats;
    exists: (path: any) => boolean;
    watchFile: (link: any, caller: any) => void;
    unwatchFile: (link: string) => void;
    join: (path1: string, path2: string) => string;
    deleteFile(path: string): void;
    deleteFolder: (link: any) => void;
    breakChar(text: string, callback: Function, callback2?: Function): void;
    readChar2(path: string, callback: Function, callback2?: Function): void;
};
