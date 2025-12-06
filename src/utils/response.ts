
type FieldErrors = Record<string, string[] | undefined>;
type RequiredMessageMap = Record<string, string>;

export function mapRequiredErrors(
    errors: FieldErrors,
    messages: RequiredMessageMap
): FieldErrors {
    const result: FieldErrors = { ...errors };

    for (const key in result) {
        const msgs = result[key];
        if (!msgs || msgs.length === 0) continue;

        const message = msgs[0];

        const isMissing =
            message.includes("expected") ||
            message.includes("undefined") ||
            message.includes("Invalid input");

        if (isMissing && messages[key]) {
            result[key] = [messages[key]];
        }
    }

    return result;
}
