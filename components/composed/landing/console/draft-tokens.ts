/** Words and the whitespace between them, so a draft can stream word by word
 * and still keep its line breaks. */
export const draftTokens = (body: string): string[] => body.split(/(\s+)/);
