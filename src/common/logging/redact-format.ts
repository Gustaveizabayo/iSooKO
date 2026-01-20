import * as winston from 'winston';

// Sensitive fields to redact from logs
const SENSITIVE_FIELDS = [
    'password',
    'token',
    'accessToken',
    'refreshToken',
    'access_token',
    'refresh_token',
    'authorization',
    'cookie',
    'secret',
    'apiKey',
    'api_key',
    'creditCard',
    'ssn',
    'otp',
    'otpCode',
];

// Redact sensitive data from objects
function redactSensitiveData(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => redactSensitiveData(item));
    }

    const redacted: any = {};
    for (const [key, value] of Object.entries(obj)) {
        const lowerKey = key.toLowerCase();
        const isSensitive = SENSITIVE_FIELDS.some(field =>
            lowerKey.includes(field.toLowerCase())
        );

        if (isSensitive) {
            redacted[key] = '[REDACTED]';
        } else if (typeof value === 'object' && value !== null) {
            redacted[key] = redactSensitiveData(value);
        } else {
            redacted[key] = value;
        }
    }

    return redacted;
}

// Custom format to redact sensitive data
export const redactFormat = winston.format((info) => {
    // Redact message if it's an object
    if (typeof info.message === 'object') {
        info.message = redactSensitiveData(info.message);
    }

    // Redact metadata
    if (info.metadata) {
        info.metadata = redactSensitiveData(info.metadata);
    }

    // Redact any other properties
    const redactedInfo = redactSensitiveData(info);

    return redactedInfo;
});
