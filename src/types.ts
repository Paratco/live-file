/**
 * Live Directory Options
 *
 * @interface LiveDirectoryOptions
 * @member {string} dir directory to traverse
 * @member {number?} maxLength maximum of file length (default: `infinite`)
 * @member {number?} maxCount maximum of file count (default: `infinite`)
 * @member {boolean?} watch watch all files for changes in directory (default: `true`)
 * @member {boolean?} onDemand read files on demand in directory (default: `true`)
 */
export interface LiveDirectoryOptions {
  dir: string;
  maxLength?: number;
  maxCount?: number;
  watch?: boolean;
  onDemand?: boolean;
}

/**
 * Live File Options
 *
 * @interface LiveFileOptions
 * @member {string} path path of file
 * @member {boolean} watch watch file for changes
 * @member {boolean} onDemand read file on demand
 */
export interface LiveFileOptions {
  path: string;
  watch: boolean;
  onDemand: boolean;
}
