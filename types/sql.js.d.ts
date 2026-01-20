declare module 'sql.js' {
    export interface Database {
        exec(sql: string): QueryExecResult[];
        close(): void;
    }

    export interface QueryExecResult {
        columns: string[];
        values: unknown[][];
    }

    export interface SqlJsStatic {
        Database: new (data?: ArrayLike<number> | Buffer | null) => Database;
    }

    export interface InitSqlJsOptions {
        locateFile?: (file: string) => string;
    }

    export default function initSqlJs(options?: InitSqlJsOptions): Promise<SqlJsStatic>;
}
