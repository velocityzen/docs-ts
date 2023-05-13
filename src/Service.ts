/**
 * @since 0.9.0
 */
import * as Context from '@effect/data/Context'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import * as ast from 'ts-morph'

import * as _ from './internal'

/**
 * @category service
 * @since 0.9.0
 */
export interface Config {
  readonly config: _.Config
}

/**
 * @category service
 * @since 0.9.0
 */
export const Config = Context.Tag<Config>()

/**
 * @category service
 * @since 0.9.0
 */
export interface Parser {
  readonly path: RNEA.ReadonlyNonEmptyArray<string>
  readonly sourceFile: ast.SourceFile
}

/**
 * @category service
 * @since 0.9.0
 */
export const Parser = Context.Tag<Parser>()