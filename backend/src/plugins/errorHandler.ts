import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

export function errorHandler(
  error: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply
) {
  const statusCode = error.statusCode ?? 500;
  const message = statusCode >= 500 ? 'Internal Server Error' : error.message;

  if (statusCode >= 500) {
    console.error('[Error]', error);
  }

  return reply.status(statusCode).send({
    error: true,
    statusCode,
    message,
  });
}
