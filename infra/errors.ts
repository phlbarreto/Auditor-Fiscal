interface ErrorOptions {
  cause?: any;
  message: string;
  action: string;
}

export class UnauthorizedError extends Error {
  action: string;
  statusCode: number;
  constructor({ cause, message, action }: ErrorOptions) {
    super(message || "Usuário não autorizado.", {
      cause,
    });
    this.name = "UnauthorizedError";
    this.action = action || "Faça novamente o login para continuar.";
    this.statusCode = 401;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class NotFoundError extends Error {
  action: string;
  statusCode: number;
  constructor({ cause, message, action }: ErrorOptions) {
    super(message || "Não foi possivel encontrar este recurso no sistema.", {
      cause,
    });
    this.name = "NotFoundError";
    this.action =
      action ||
      "Verifique se os parametros enviados na consulta estão corretos.";
    this.statusCode = 404;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ValidationError extends Error {
  action: string;
  statusCode: number;
  constructor({ cause, message, action }: ErrorOptions) {
    super(message || "Um erro de validação ocorreu.", {
      cause,
    });
    this.name = "ValidationError";
    this.action = action || "Ajuste os dados e enviados e tente novamente.";
    this.statusCode = 400;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class InternalServerError extends Error {
  action: string;
  statusCode: number;
  constructor({ cause }: any) {
    super("Um erro interno inesperado aconteceu.", {
      cause,
    });
    this.name = "InternalServerError";
    this.action = "Entre em contato com o suporte.";
    this.statusCode = 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
