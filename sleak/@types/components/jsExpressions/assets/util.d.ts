import * as ts from 'typescript';
import { Linter } from 'eslint';
export declare function getEnv(env: _Variables[], name: string): _Variables;
export declare function convertEnv(env: _Variables[]): string;
export declare function tsCompile(source: string, options?: ts.TranspileOptions): string;
export declare function expLint(source: string, linter?: Linter): Linter.FixReport;
