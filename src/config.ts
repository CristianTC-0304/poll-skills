export interface Config {
    /**
     * @default builtin_single-polls
     */
    defaultContentElement: string
    /**
     *  @default #builtin_single-polls
     */
    defaultContentRenderer: string 
    /**
     *  @default 3
     */
    defaultMaxAttempts: number
    /**
     * @default true
     */
    disableIntegrityCheck: boolean
    /**
     * @default true
     */
    matchNumbers: boolean
    /**
     * @default true
     */
    matchNLU: boolean
   
}