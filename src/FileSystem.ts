/**
 * @since 0.6.0
 */
import * as E from 'fp-ts/Either'
import { flow, pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import * as fs from 'fs-extra'
import { glob, GlobOptions } from 'glob'

import { toErrorMsg } from './Logger'

/**
 * Represents operations that can be performed on a file system.
 *
 * @category model
 * @since 0.6.0
 */
export interface FileSystem {
  readonly readFile: (path: string) => TE.TaskEither<string, string>
  /**
   * If the parent directory does not exist, it's created.
   */
  readonly writeFile: (path: string, content: string) => TE.TaskEither<string, void>
  readonly exists: (path: string) => TE.TaskEither<string, boolean>
  /**
   * Removes a file or directory based upon the specified pattern. The directory can have contents.
   * If the path does not exist, silently does nothing.
   */
  readonly remove: (pattern: string) => TE.TaskEither<string, void>
  /**
   * Searches for files matching the specified glob pattern.
   */
  readonly search: (pattern: string, exclude: readonly string[]) => TE.TaskEither<string, string[]>
}

/**
 * Represents a file which can be optionally overwriteable.
 *
 * @category model
 * @since 0.6.0
 */
export interface File {
  readonly path: string
  readonly content: string
  readonly overwrite: boolean
}

/**
 * By default files are readonly (`overwrite = false`).
 *
 * @category constructors
 * @since 0.6.0
 */
export const File = (path: string, content: string, overwrite = false): File => ({
  path,
  content,
  overwrite
})

const readFile: (path: string, encoding: BufferEncoding) => TE.TaskEither<Error, string> = TE.tryCatchK(
  (path, encoding) => fs.readFile(path, { encoding }),
  E.toError
)

const writeFile: (
  path: string,
  data: string,
  options: {
    readonly encoding?: BufferEncoding
    readonly flag?: string
    readonly mode?: number
  }
) => TE.TaskEither<Error, void> = TE.tryCatchK((path, data, options) => fs.outputFile(path, data, options), E.toError)

const exists = TE.tryCatchK((path: string) => fs.pathExists(path), E.toError)

const remove: (path: string) => TE.TaskEither<Error, void> = TE.tryCatchK((path) => fs.remove(path), E.toError)

const search = TE.tryCatchK(
  (pattern: string, options: GlobOptions) => glob(pattern, { ...options, withFileTypes: false }),
  E.toError
)

/**
 * @category instances
 * @since 0.6.0
 */
export const FileSystem: FileSystem = {
  readFile: (path) => pipe(readFile(path, 'utf8'), TE.mapLeft(toErrorMsg)),
  writeFile: (path, content) => pipe(writeFile(path, content, { encoding: 'utf8' }), TE.mapLeft(toErrorMsg)),
  exists: flow(exists, TE.mapLeft(toErrorMsg)),
  remove: (pattern) => pipe(remove(pattern), TE.mapLeft(toErrorMsg)),
  search: (pattern, exclude) => pipe(search(pattern, { ignore: [...exclude] }), TE.mapLeft(toErrorMsg))
}
