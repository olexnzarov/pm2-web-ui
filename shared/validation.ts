import v8n from 'v8n';

export const username = (name: string): boolean => v8n().string().minLength(1).test(name);

export const password = (password: string): boolean => v8n().string().minLength(1).test(password);

export const all = (...args: boolean[]) => args.find(b => b === false) !== false;
