
export const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    return 'Ocurrió un error desconocido.';
  };
  