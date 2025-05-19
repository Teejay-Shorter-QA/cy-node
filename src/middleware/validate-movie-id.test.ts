import type { Request, Response, NextFunction } from 'express';
import { validateId } from './validate-movie-id';

describe('validateId Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      params: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
  });

  it('should validate a movieId and call next function', () => {
    const movieId = '123';
    mockRequest.params = { id: movieId };

    validateId(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockRequest.params.id).toBe(movieId);
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should return 400 on invalid movieId', () => {
    const movieId = 'abc';
    mockRequest.params = { id: movieId };

    validateId(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockRequest.params.id).toBe(movieId);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Invalid movie ID provided'
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should handle missing movieId', () => {
    validateId(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockRequest.params!.id).toBeUndefined();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Invalid movie ID provided'
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });
});
