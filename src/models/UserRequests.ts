import  User from "./User"
// import {Type, plainToClass} from "class-transformer";
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import LatLong from './LatLong'
import City from "./City"

import haversine_distance from "./haversine"

declare module 'axios' {
    interface AxiosResponse<T = any> extends Promise<T> {}
}

abstract class UserRequest{

    protected readonly reqInstance: AxiosInstance;
    private _req_url:string = '';
    protected _relevant_users : User[];

    constructor(baseURL: string){
        this.reqInstance = axios.create({
            baseURL,
        });
        this._initializeResponseInterceptor();
        
    }

    setReqURL(url: string ){
        this._req_url = url;
    }
  
    private _initializeResponseInterceptor = () => {
      this.reqInstance.interceptors.response.use(
        this._responseHandler,
        this._handleError,
      );
    };

    private _responseHandler = (response) => { return response }; 
    protected _handleError = (error: any) => Promise.reject(error);



    getAllUsers = () => this.reqInstance.get<User[]>(this._req_url);
    protected async getPromisedUsers(){
        var promised_users = this.getAllUsers();
        promised_users.then(value =>{
            var all_users = value.data;
            let filtered_users: User[] = this.filterUsers(all_users);
            return filtered_users;
        
        });
    }

    protected setRelevantUsers(relevant_users: User[]){
        this._relevant_users = relevant_users;
    };

    public getUsers(){
        console.log("get users");
        if (this._relevant_users){
            return this._relevant_users;
        }
        else{
            const filtered_users = new Promise<>this.getPromisedUsers().then(returned_users => console.log(filtered_users));
            
            return filtered_users;
        }
    }


    protected abstract filterUsers(all_users: User[]): User[];
}

class CityUsersRequest extends UserRequest{
    private _city : string;

    public constructor(rootURL:string, city: City){
        super(rootURL);
        this._city = city.cityName;
        var temp_str1: string = "city/";
        var temp_str2: string = "/users";
        var req_url = temp_str1.concat(this._city,temp_str2)
        this.setReqURL(req_url);
        console.log(req_url);

    }
    //return array of users in city
    protected filterUsers(all_users): User[]{
        let relevant_users : User[] = all_users;
        console.log(relevant_users[0])
        this.setRelevantUsers (relevant_users);
        return relevant_users;
    }

}

class UsersInRangeRequest extends UserRequest{
    private _range : number;
    private _lat_long_ref_city: LatLong;

    public constructor(rootURL:string, city: City){
        super(rootURL);
        this._range = city.searchRadius;
        this._lat_long_ref_city = city.coordinates;
        var req_url = "users";
        this.setReqURL(req_url)
    }
 
    protected filterUsers(all_users): User[]{
        
        let relevant_users : User[] ;
        console.log(all_users[0])

        for (let current_user in all_users){
            var temp_lat_long : LatLong = {latitude: all_users[current_user].latitude, longitude: all_users[current_user].longitude};
            var dist = haversine_distance( this._lat_long_ref_city, temp_lat_long );                
            if (dist <= this._range){
                relevant_users.push(all_users[current_user])
                all_users[current_user].distance = dist;
            }
        }
        this.setRelevantUsers (relevant_users);
        return relevant_users;
    }
     
}

class CombinedUsers{
    private CityUsers : any;
    private UsersNearCity : any;


    public constructor(city: City, url: string = 'https://bpdts-test-app.herokuapp.com/'){
        this.CityUsers = new CityUsersRequest(url, city);
        this.UsersNearCity = new UsersInRangeRequest(url, city);
        
    }

    getUsers(){
        console.log("users in city ");
        var users_in_city = this.CityUsers.getUsers();
        
        var users_near_city = this.UsersNearCity.getUsers();
        console.log("users near city ");
        return users_in_city.length + users_near_city.length;
    }


}

export {CombinedUsers}

// class CityUsersRequest extends UserRequest{

//     private _city_name :string;
//     private _url: string; 

//     constructor(city: City){
//         super();
//         this._url = this.appendRootUrl(this._city_name)
//     }

//     requestUsers(): any {
        
//     }

// }

// class UsersInRangeRequest extends UserRequest{

// }

// export{
//     UserRequest,
//     CityUsersRequest
// }



    // getUsers(data: string[]){
    //     let root_url: string = "https://bpdts-test-app.herokuapp.com/";
    //     let req_in: string = root_url.concat("users");
    //     fetch(req_in).then((users: Object[]) =>{
    //         const realUsers = plainToClass(User, users);
    //         console.log("Got Users")
    //     })
    //     // let obj: AllUsers = JSON.parse(data.toString());
    //     // return obj;
    // }