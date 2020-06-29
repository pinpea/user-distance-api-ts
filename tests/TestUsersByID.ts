
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import User from '../src/models/User';


declare module 'axios' {
    interface AxiosResponse<T = any> extends Promise<T> { }
}

class CityUsersByIdRequester {
    protected readonly reqInstance: AxiosInstance;
    private _request_url: string = '';
    protected _relevant_users: User[];
    private _root_url: string;
    private _users_in_city: User[];

    constructor( users_in_city: User[], baseURL: string = 'https://bpdts-test-app.herokuapp.com/' ) {
        this._root_url = baseURL;
        this.reqInstance = axios.create( {
            baseURL,
        } );
        this._initialiseResponseInterceptor();

        this._users_in_city = users_in_city;

    }

    private _initialiseResponseInterceptor = () => {
        this.reqInstance.interceptors.response.use(
            this._responseHandler,
            this._handleError,
        );
    };

    private _responseHandler = ( response ) => { return response; };
    protected _handleError = ( error: any ) => { throw new Error( error.response.data.message ); };


    private loopPromisedUsers = async () => {

        const user_ids = this._users_in_city.map( ( { id } ) => id ); // get ids from user array
        const promises = user_ids.map( async id => {
            let user_url = this._root_url.concat( "user/", id );
            let current_user = await this.reqInstance.get<User>( user_url ).then( response_body => {
                var users_by_id = response_body.data;
                return users_by_id;
            } );
            return current_user;
        } );

        let relevant_users = await Promise.all( promises );

        return relevant_users;

    };


    protected setRelevantUsers( relevant_users: User[] ) {
        this._relevant_users = relevant_users;
    };

    public getUsers = async () => {
        let filtered_users = await this.loopPromisedUsers();
        return filtered_users;

    };
    public getNumUsers = async () => {
        let filtered_users = await this.loopPromisedUsers();
        return filtered_users.length;

    };

}

export { CityUsersByIdRequester };