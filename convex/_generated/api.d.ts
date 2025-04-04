/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as clerk from "../clerk.js";
import type * as files from "../files.js";
import type * as github from "../github.js";
import type * as http from "../http.js";
import type * as migration from "../migration.js";
import type * as projects from "../projects.js";
import type * as types from "../types.js";
import type * as users from "../users.js";
import type * as web from "../web.js";
import type * as webhooks from "../webhooks.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  clerk: typeof clerk;
  files: typeof files;
  github: typeof github;
  http: typeof http;
  migration: typeof migration;
  projects: typeof projects;
  types: typeof types;
  users: typeof users;
  web: typeof web;
  webhooks: typeof webhooks;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
