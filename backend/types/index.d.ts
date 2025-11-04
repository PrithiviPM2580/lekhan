declare global {
  type ErrorDetail = {
    field?: string;
    message?: string;
  };
  type APIErrorType =
    | string
    | {
        type: string;
        details?: ErrorDetail[];
      };
}

export {};
