import axios, { AxiosInstance, AxiosResponse } from 'axios';
import calculateHaversineDistance from "./haversine";
import LatitudeLongitude from './Coordinates';
import City from "./City";
import User from "./User";

declare module 'axios' {
    interface AxiosResponse<T = any> extends Promise<T> { }
}

abstract class UserRequester {

    protected readonly reqInstance: AxiosInstance;
    private _request_url: string = '';
    protected _relevant_users: User[];

    constructor( baseURL: string ) {
        this.reqInstance = axios.create( {
            baseURL,
        } );
        this._initialiseResponseInterceptor();

    }


    private _initialiseResponseInterceptor = () => {
        this.reqInstance.interceptors.response.use(
            this._responseHandler,
            this._handleError,
        );
    };

    private _responseHandler = ( response ) => { return response; };
    protected _handleError = ( error: any ) => Promise.reject( error );

    setReqURL( url: string ) { this._request_url = url; }

    // Requests data from input URL. Returns data as an Array of Users
    getAllUsersFromAPI = () => this.reqInstance.get<User[]>( this._request_url );

    async getPromisedUsers() {
        // wait for User array to be returned, then apply some filter, such as distance from city
        const data = await this.getAllUsersFromAPI().then( response_body => {
            var all_users = response_body.data;
            let filtered_users: User[] = this.filterUsers( all_users );
            return filtered_users;

        } );

        return data;
    }

    protected setRelevantUsers( relevant_users: User[] ) {
        this._relevant_users = relevant_users;
    };

    public getRelevantUsers = async () => {
        if ( this._relevant_users ) {
            return this._relevant_users;
        }
        else {
            const filtered_users = await this.getPromisedUsers();
            return filtered_users;
        }
    };

    protected abstract filterUsers( all_users: User[] ): User[];

}

class CityUsersRequester extends UserRequester {
    // Calls the bpdts-test-app API /city/this._city/users to get users 

    private _city: string;

    constructor( rootURL: string, requested_city: City ) {
        super( rootURL );
        this._city = requested_city.cityName;
        let temp_str1: string = "city/";
        let temp_str2: string = "/users";
        let request_url = temp_str1.concat( this._city, temp_str2 );
        this.setReqURL( request_url );

    }
    //return array of users in city - no additional filtering required in this instance
    protected filterUsers( all_users ): User[] {
        let relevant_users: User[] = all_users;
        this.setRelevantUsers( relevant_users );
        return relevant_users;
    }

}

class UsersInRangeRequester extends UserRequester {
    // Calls the bpdts-test-app API /users to get all users, then filters users by distance 

    private _search_radius: number;
    private _lat_long_requested_city: LatitudeLongitude;

    constructor( rootURL: string, city: City ) {
        super( rootURL );
        this._search_radius = city.searchRadius;
        this._lat_long_requested_city = city.coordinates;
        let request_url = "users";
        this.setReqURL( request_url );
    }

    // Loop through users, calculate haversine distance and return users within the requested range
    protected filterUsers( all_users ): User[] {

        let relevant_users: User[] = [];

        for ( let current_user in all_users ) {
            let index: number = Number( current_user );
            let latitude_longitude_user: LatitudeLongitude = { latitude: all_users[ index ].latitude, longitude: all_users[ index ].longitude };
            //calculate distance between coordinates of a user and coordinates of the given city
            let haversine_distance = calculateHaversineDistance( this._lat_long_requested_city, latitude_longitude_user );
            if ( haversine_distance <= this._search_radius ) {
                relevant_users.push( all_users[ index ] );
                all_users[ index ].distance = haversine_distance;
            }
        }
        this.setRelevantUsers( relevant_users );
        return relevant_users;
    }

}

class CombinedUsers {
    private _users_in_city: any;
    private _users_near_city: any;
    private _relevant_users: User[];

    public constructor( city: City, url: string = 'https://bpdts-test-app.herokuapp.com/' ) {
        this._users_in_city = new CityUsersRequester( url, city );
        this._users_near_city = new UsersInRangeRequester( url, city );

    }

    private getPromisedUsers = async () => {
        // combine unique users listed in city and within a requested distance of the city
        const users_in_city = await this._users_in_city.getRelevantUsers();
        const users_near_city = await this._users_near_city.getRelevantUsers();
        let relevant_users: User[];
        if ( users_in_city === undefined || users_in_city.length == 0 ) {
            relevant_users = users_near_city;
        }
        else if ( users_near_city === undefined || users_near_city.length == 0 ) {
            relevant_users = users_in_city;
        }
        else {
            relevant_users = users_in_city.concat( users_near_city );
        }
        let unique_users = this.removeDuplicateUsers( relevant_users );

        this.setRelevantUsers( unique_users );

        return unique_users;
    };

    private removeDuplicateUsers( users: User[] ) {
        const user_ids = users.map( ( { id } ) => id ); // get ids from user array
        //run through array of ids and return values that are the first occurring instance
        let unique_ids = user_ids.filter( ( value, index, element ) => element.indexOf( value ) === index );
        let unique_users: User[] = [];

        // filter users by unique ids
        unique_ids.forEach( id => {
            let matched_user = users.find( current_user => current_user.id === id );
            unique_users.push( matched_user );
        } );

        return unique_users;
    }

    protected setRelevantUsers( relevant_users: User[] ) {
        this._relevant_users = relevant_users;
    };

    public getNumberOfUsers = async () => {
        if ( this._relevant_users ) {
            return this._relevant_users.length;
        }
        else {
            let users = await this.getPromisedUsers();
            return users.length;
        }

    };

    public getUsers = async () => {
        if ( this._relevant_users ) {
            return this._relevant_users;
        }
        else {
            let users = await this.getPromisedUsers();
            return users;
        }

    };

}

export { CombinedUsers };

