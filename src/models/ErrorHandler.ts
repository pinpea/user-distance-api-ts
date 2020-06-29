import { NextFunction, Request, Response } from 'express';
import { HttpException } from './HttpError';

function errorHandler( error: HttpException, request: Request, response: Response, next: NextFunction ) {
    const status = error.status || 500;
    const message = error.message || 'Internal Error';
    response
        .status( status )
        .send( {
            status,
            message,
        } );
}

export default errorHandler;