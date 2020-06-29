class HttpException extends Error {
    status: number;
    message: string;
    constructor( status: number, message: string ) {
        super( message );
        this.status = status;
        this.message = message;
    }
}

class UsersNotFoundException extends HttpException {
    constructor( city_name: string ) {
        super( 404, `No users found in requested city ${ city_name }` );
    }
}

export { HttpException, UsersNotFoundException };