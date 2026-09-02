export interface User {
            _id?: string,
            name: string,
            email: string,
            password: string,
            role?: string,
            isActive?: boolean,
            createdAt?: string,
            updatedAt?: string
        }



export interface ResponseUsers {
    msg: string,
    data: []
}
