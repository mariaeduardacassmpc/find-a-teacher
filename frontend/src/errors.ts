export class ValidationError extends Error {
  messages: string[];
  constructor(messages: string[]) {
    super("Validação falhou");
    this.name = "ValidationError";
    this.messages = messages;
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NetworkError";
  }
}